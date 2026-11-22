'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { clock, index, partText, search, stepAt, timeline, type Hit, type Part, type Product, type TimedStep, type Video } from '@/app/help/_lib/help.ts'

/**
 * The live player of a help page. A video is a 3D model moved by a script of steps; the voice file (when there is
 * one) is the clock, so the picture, the captions and the words stay together. A part plays from its start and stops
 * at its end. Phones that save data, have 2 GB of memory or less, or have no 3D (WebGL) get still pictures with the
 * same voice and captions; the 3D player itself also draws fewer pixels when frames come too slowly.
 */
type M3Api = { make(id: string, parent: Element): { iso: { set(kv: Record<string, string>): void } }; dispose(): void }
declare global {
  interface Window { M3?: M3Api; M3M?: Record<string, unknown>; PAUSED: boolean; FAST: boolean; ENDED: boolean; mk: (tag: string, attrs: object, parent: Element) => Element }
}

// the player files read these as page globals; only event handlers call these two
const globals = (p: Partial<Pick<Window, 'PAUSED' | 'FAST' | 'ENDED'>>) => { Object.assign(window, p) }
const ms = () => performance.now()

const loaded = new Map<string, Promise<void>>()
function load(name: string): Promise<void> {
  if (!loaded.has(name)) loaded.set(name, new Promise((ok, fail) => {
    const s = document.createElement('script')
    s.src = `/api/help/engine/${name}`; s.async = false; s.onload = () => ok(); s.onerror = () => { loaded.delete(name); fail(new Error(name)) }
    document.head.append(s)
  }))
  return loaded.get(name)!
}

function svgEl(tag: string, attrs: object, parent: Element): Element {
  const n = document.createElementNS('http://www.w3.org/2000/svg', tag)
  for (const [k, val] of Object.entries(attrs)) n.setAttribute(k, String(val))
  return parent.appendChild(n)
}

function weakPhone(): boolean {
  const n = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string }; deviceMemory?: number }
  if (n.connection?.saveData || /2g/.test(n.connection?.effectiveType ?? '') || (n.deviceMemory ?? 8) <= 2) return true
  try { const c = document.createElement('canvas'); return !(c.getContext('webgl2') || c.getContext('webgl')) } catch { return true }
}

type Props = { product: Product; initialQuery: string; initialHits: Hit[]; initialPart: string }

export function HelpPlayer({ product, initialQuery, initialHits, initialPart }: Props) {
  const docs = useMemo(() => index(product), [product])
  const lines = useMemo(() => Object.fromEntries(product.videos.map(v => [v.id, timeline(v.script.steps)])), [product])
  const partOf = useMemo(() => new Map(product.videos.flatMap(v => v.parts.map(p => [p.id, { v, p }] as const))), [product])

  const [query, setQuery] = useState(initialQuery)
  const [hits, setHits] = useState(initialHits)
  const [searched, setSearched] = useState(Boolean(initialQuery))
  const [video, setVideo] = useState<Video>(() => partOf.get(initialPart)?.v ?? product.videos[0])
  const [part, setPart] = useState<Part | null>(() => partOf.get(initialPart)?.p ?? null)
  const [t, setT] = useState(() => partOf.get(initialPart)?.p.start_s ?? 0)
  const [playing, setPlaying] = useState(false)
  const [mode, setMode] = useState<'3d' | 'still' | 'idle'>('idle')
  const [loading, setLoading] = useState(false)
  const [cc, setCc] = useState(true)

  const wrap = useRef<HTMLDivElement>(null), svg = useRef<SVGSVGElement>(null), audio = useRef<HTMLAudioElement>(null)
  const eng = useRef<{ el: { iso: { set(kv: Record<string, string>): void } } | null; videoId: string; step: number }>({ el: null, videoId: '', step: -1 })
  const clk = useRef({ base: 0, at: 0, running: false, audioOk: false })
  const stopAt = useRef(Infinity), dur = useRef(0)
  const raf = useRef(0)

  const tl: TimedStep[] = lines[video.id]
  const step = tl[stepAt(tl, t)]

  // ---------- the clock: the voice file when it plays, else the page's own timer ----------
  const now = () => {
    const c = clk.current, a = audio.current
    if (c.audioOk && a && !a.paused) return a.currentTime
    return c.running ? c.base + (ms() - c.at) / 1000 : c.base
  }
  const hold = (time: number) => { clk.current.base = time; clk.current.at = ms() }

  // ---------- the 3D model ----------
  function apply(time: number, snap: boolean) {
    const e = eng.current, lt = lines[e.videoId]
    if (!e.el || !lt) return
    const i = stepAt(lt, time), s = lt[i]
    if (i === e.step && !snap) return
    e.step = i
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    globals({ FAST: snap || reduce })
    e.el.iso.set({
      ...(s.view ? { view: s.view } : {}), cut: String(s.cut), xray: String(s.xray), explode: String(s.explode),
      hi: s.hi.join(','), labels: s.labels.join(','), speed: String(s.speed), mt: String(s.mt0 + (time - s.t0) * s.speed),
    })
    globals({ FAST: false })
  }

  async function setup(v: Video): Promise<'3d' | 'still'> {
    if (eng.current.videoId === v.id && eng.current.el) return '3d'
    if (mode === 'still' || weakPhone()) return 'still'
    setLoading(true)
    try {
      globals({ PAUSED: true, FAST: false, ENDED: false })
      Object.assign(window, { mk: window.mk ?? svgEl })
      await Promise.race([
        Promise.all([load('core'), load('run'), load(v.model_id)]),
        new Promise((_, no) => setTimeout(() => no(new Error('slow')), 20000)),
      ])
      window.M3!.dispose()
      eng.current = { el: window.M3!.make(v.model_id, svg.current!), videoId: v.id, step: -1 }
      return '3d'
    } catch {
      eng.current = { el: null, videoId: '', step: -1 }
      return 'still'
    } finally { setLoading(false) }
  }

  // ---------- play, pause, seek ----------
  function tick() {
    let time = now()
    const end = Math.min(stopAt.current, dur.current)
    if (time >= end) { time = Math.max(0, end - 0.05); pause(time) }   // stop on the part's last step, not the next one's caption
    apply(time, false)
    setT(time)
    if (clk.current.running) raf.current = requestAnimationFrame(tick)
  }

  async function play(v = video, from = t, until = stopAt.current) {
    if (from >= Math.min(until, v.duration_s) - 0.05) { from = part && v.id === video.id ? part.start_s : 0; until = part && v.id === video.id ? part.end_s : Infinity }
    stopAt.current = until; dur.current = v.duration_s
    const m = await setup(v)
    setMode(m)
    if (m === '3d') apply(from, true)
    hold(from); clk.current.running = true; globals({ PAUSED: false })
    const a = audio.current
    clk.current.audioOk = false
    if (a && v.audio_path) {
      const src = `/api/help/audio/${v.id}`
      if (!a.src.endsWith(src)) a.src = src
      a.currentTime = from
      try { await a.play(); clk.current.audioOk = true } catch { /* no voice: the timer runs the video */ }
    }
    setPlaying(true)
    cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(tick)
  }

  // the voice stopped early (missing file, or shorter than the script): the page's timer runs on from there
  function toTimer() {
    if (!clk.current.audioOk) return
    const at = audio.current?.currentTime ?? 0
    clk.current.audioOk = false; hold(at)
  }

  function pause(at = now()) {
    hold(at); clk.current.running = false; globals({ PAUSED: true })
    audio.current?.pause()
    cancelAnimationFrame(raf.current)
    setPlaying(false); setT(at)
  }

  function seek(time: number) {
    if (audio.current && clk.current.audioOk) audio.current.currentTime = time
    hold(time); setT(time); apply(time, true)
  }

  function choose(v: Video, p: Part | null) {
    pause(p?.start_s ?? 0)
    setVideo(v); setPart(p); setT(p?.start_s ?? 0)
    void play(v, p?.start_s ?? 0, p?.end_s ?? Infinity)
    document.getElementById('player')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  }

  useEffect(() => () => { cancelAnimationFrame(raf.current); window.M3?.dispose() }, [])

  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = query.trim()
    setHits(q ? search(docs, q) : []); setSearched(Boolean(q))
    const u = new URL(location.href); if (q) u.searchParams.set('q', q); else u.searchParams.delete('q'); u.searchParams.delete('part')
    history.replaceState(null, '', u)
  }

  const partLink = (p: Part) => `?part=${p.id}#player`
  const click = (v: Video, p: Part) => (e: React.MouseEvent) => { e.preventDefault(); choose(v, p) }
  const stillPart = video.parts.find(p => p.still_path && p.start_s <= t && t < p.end_s)   // never another part's picture

  return (
    <>
      <form role="search" onSubmit={onSearch} action="" method="get" className="mt-6 flex gap-2">
        <label htmlFor="help-q" className="sr-only">Ask a question about the {product.product_name}</label>
        <input id="help-q" name="q" type="search" value={query} onChange={e => setQuery(e.target.value)} maxLength={200}
          placeholder="Ask a question, like “how do I clean the filter”" autoComplete="off" enterKeyHint="search"
          className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-3 text-base text-foreground placeholder:text-muted" />
        <button type="submit" className="rounded-lg bg-accent px-4 py-3 font-semibold text-on-accent">Search</button>
      </form>

      <div aria-live="polite" className="mt-4">
        {searched && (hits.length ? (
          <section aria-label="Search results">
            <h2 className="text-sm text-muted">Best matches</h2>
            <ol className="mt-2 space-y-2">
              {hits.map(h => {
                const { v, p } = partOf.get(h.partId)!
                return (
                  <li key={h.partId}>
                    <a href={partLink(p)} onClick={click(v, p)} className="block rounded-lg border border-line bg-surface p-3 hover:border-accent">
                      <span className="font-semibold">{p.title}</span>
                      <span className="block text-sm text-muted">{v.title} · {clock(p.start_s)}–{clock(p.end_s)}</span>
                    </a>
                  </li>
                )
              })}
            </ol>
          </section>
        ) : <p className="text-muted">No exact match. Here are all the videos.</p>)}
      </div>

      <section id="player" aria-label="Video player" className="mt-6 scroll-mt-4">
        <h2 className="text-lg font-semibold">{video.title}{part && <span className="text-muted"> · {part.title}</span>}</h2>
        <div ref={wrap} className="wrap relative mt-2 aspect-video w-full overflow-hidden rounded-xl bg-[#f4ede4] text-[#2a2521]">
          <svg ref={svg} aria-hidden="true" className="absolute h-0 w-0" />
          {mode === 'still' && (stillPart
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={`/api/help/still/${stillPart.id}`} alt={stillPart.title} className="absolute inset-0 h-full w-full object-contain" />
            : <p className="absolute inset-0 grid place-items-center p-6 text-center text-xl font-semibold">{step?.caption?.title ?? video.title}</p>)}
          {mode === 'idle' && (
            <button type="button" onClick={() => play()} className="absolute inset-0 grid place-items-center text-lg font-semibold">
              <span className="rounded-full bg-[#2a2521] px-5 py-3 text-white">▶ Play{part ? ` “${part.title}”` : ''}</span>
            </button>
          )}
          {loading && <p className="absolute inset-x-0 bottom-2 text-center text-sm">Loading…</p>}
          <noscript><p className="absolute inset-0 grid place-items-center p-6 text-center">Turn on JavaScript to play the videos. The steps are written below each video.</p></noscript>
        </div>
        {cc && step?.caption && mode !== 'idle' && (
          <div className="mt-2 rounded-lg bg-surface p-3" aria-live={video.audio_path ? 'off' : 'polite'}>
            {step.caption.title && <p className="font-semibold">{step.caption.title}</p>}
            {step.caption.body && <p className="text-muted">{step.caption.body}</p>}
          </div>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => (playing ? pause() : play())} className="rounded-lg border border-line px-4 py-2 font-semibold">
            {playing ? 'Pause' : 'Play'}
          </button>
          <input type="range" min={0} max={video.duration_s} step={0.1} value={t} aria-label="Position in the video"
            aria-valuetext={`${clock(t)} of ${clock(video.duration_s)}`}
            onChange={e => { stopAt.current = Infinity; setPart(null); seek(Number(e.target.value)) }} className="min-w-32 flex-1 accent-[var(--accent)]" />
          <span className="text-sm tabular-nums text-muted">{clock(t)} / {clock(video.duration_s)}</span>
          <button type="button" aria-pressed={cc} onClick={() => setCc(!cc)} className="rounded-lg border border-line px-3 py-2 text-sm">Captions</button>
          {mode === '3d' && (
            <button type="button" onClick={() => { window.M3?.dispose(); eng.current = { el: null, videoId: '', step: -1 }; setMode('still') }}
              className="rounded-lg border border-line px-3 py-2 text-sm">Pictures only</button>
          )}
        </div>
        <audio ref={audio} preload="none" onError={() => { if (audio.current?.error) toTimer() }} onEnded={toTimer}
          // a hidden tab or a locked phone runs no animation frames, but the voice goes on: stop the part here too
          onTimeUpdate={() => {
            const end = Math.min(stopAt.current, dur.current)
            if (clk.current.audioOk && clk.current.running && audio.current!.currentTime >= end) pause(Math.max(0, end - 0.05))
          }} />
      </section>

      <section aria-label="All videos" className="mt-10 space-y-8">
        {product.videos.map(v => (
          <article key={v.id}>
            <h2 className="text-xl font-semibold">{v.title}</h2>
            <p className="text-sm text-muted">{clock(v.duration_s)}</p>
            <ol className="mt-2 divide-y divide-line rounded-xl border border-line">
              {v.parts.map(p => (
                <li key={p.id} className="p-3">
                  <a href={partLink(p)} onClick={click(v, p)} aria-current={part?.id === p.id ? 'true' : undefined}
                    className="flex justify-between gap-3 font-semibold hover:text-accent">
                    <span>{p.title}</span><span className="shrink-0 text-sm tabular-nums text-muted">{clock(p.start_s)}</span>
                  </a>
                  <details className="mt-1 text-sm text-muted">
                    <summary className="cursor-pointer">Read the steps</summary>
                    <p className="mt-1">{partText(lines[v.id], p.start_s, p.end_s)}</p>
                  </details>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </section>
    </>
  )
}
