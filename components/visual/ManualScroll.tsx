'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { FILM, MANUAL, frame } from '@/content/manual-demo'

/**
 * The first screen of /3dlor, and the story under home's first screen (no children: the page starts in its place; founder, 2026-11-24): a written manual page that the scroll turns into the product. The
 * visitor's scroll is the only clock, and the picture glides after it: each frame moves a part of the way that is left, so a
 * mouse wheel's jumps become one smooth move. Nothing plays by itself.
 *
 * ⚠️ THE WORDS ARE ALWAYS IN THE HTML. The pinned layout is CSS under `prefers-reduced-motion: no-preference`; with
 * reduced motion, or without JS (see the noscript), the section is the heading, the page and a still per step.
 */
const HEAD = 0.08 // the share of the scroll in which the page travels to its place
const LENGTH = 0.96 // where the film ends; what is left holds the finished product
const clamp = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (x: number) => x * x * (3 - 2 * x)

export function ManualScroll({ children }: { children?: ReactNode }) {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const head = children ? HEAD : 0
  const [step, setStep] = useState(-1) // -1: the heading; 0: the product comes together; then the manual's steps

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = root.current!, ctx = canvas.current!.getContext('2d', { alpha: false })!
    const { packs, count, from } = FILM
    const last = count - 1
    const blobs: (Blob | undefined)[] = []
    const bitmaps = new Map<number, ImageBitmap | null>() // null: being decoded
    let goal = 0, now = -1, at = 0, queued = 0, then = 0, dead = false, dir = 1, e = -1, speed = 0, moving = false

    /** The nearest loaded frame from `n` in direction `d`, or -1. */
    const near = (n: number, d: 1 | -1) => { while (n >= 0 && n <= last && !blobs[n]) n += d; return n >= 0 && n <= last ? n : -1 }
    const decode = (n: number) => {
      if (n < 0 || bitmaps.has(n)) return
      bitmaps.set(n, null)
      createImageBitmap(blobs[n]!).then(b => {
        if (dead) { b.close(); return }
        bitmaps.set(n, b)
        if (!queued) draw()
      }, () => bitmaps.delete(n))
    }
    /**
     * Two neighbouring frames, mixed by how far the scroll is between them, so a slow scroll moves inside one frame too. At
     * rest it shows one clean frame. A fast scroll uses every 2nd, 4th or 8th frame: nobody sees the rest, and decoding them
     * would make the scroll stutter.
     */
    const draw = () => {
      const stride = speed < 1.5 ? 1 : speed < 4 ? 2 : speed < 10 ? 4 : 8
      const base = Math.floor(at / stride) * stride
      const lo = near(base, -1), hi = near(Math.min(last, base + stride), 1)
      for (const n of [lo, hi]) decode(n)
      const A = bitmaps.get(lo), B = bitmaps.get(hi)
      const w = ctx.canvas.width, h = ctx.canvas.height
      const t = hi > lo && lo >= 0 ? clamp((at - lo) / (hi - lo)) : lo < 0 ? 1 : 0
      const mix = smooth(clamp((t - 0.15) / 0.7))
      ctx.globalAlpha = 1
      if (A && B && moving && hi - lo <= 2 && mix > 0.02 && mix < 0.98) {
        ctx.drawImage(A, 0, 0, w, h)
        ctx.globalAlpha = mix
        ctx.drawImage(B, 0, 0, w, h)
      } else {
        const one = t > 0.5 ? B ?? A : A ?? B
        if (one) ctx.drawImage(one, 0, 0, w, h)
      }
      // Decode a little ahead in the direction of the scroll, and let far frames go.
      for (let i = 1; i <= 6; i++) { const n = near(base + dir * stride * i, dir > 0 ? 1 : -1); if (n >= 0 && Math.abs(n - at) < 9 * stride) decode(n) }
      for (const [n, b] of bitmaps) if (b && Math.abs(n - at) > 64) { b.close(); bitmaps.delete(n) }
    }
    const tick = (time: number) => {
      const dt = Math.min(50, time - then || 16)
      then = time
      now = now < 0 ? goal : now + (goal - now) * (1 - Math.exp(-dt / 85))
      if (Math.abs(goal - now) < 0.00002) now = goal
      const nextE = Math.round((head ? smooth(clamp(now / head)) : 1) * 2000) / 2000
      if (nextE !== e) { e = nextE; el.style.setProperty('--e', String(e)) }
      const to = clamp((now - head) / (LENGTH - head)) * last
      if (to !== at) dir = to > at ? 1 : -1
      speed += (Math.abs(to - at) - speed) * 0.4
      at = to
      moving = now !== goal
      if (!moving) speed = 0
      setStep(now < head * 0.96 ? -1 : from.filter(f => at >= f).length)
      draw()
      queued = now === goal || dead ? 0 : requestAnimationFrame(tick)
    }
    const on = () => {
      const r = el.getBoundingClientRect()
      goal = clamp(-r.top / Math.max(1, r.height - innerHeight))
      if (!queued) { then = 0; queued = requestAnimationFrame(tick) }
    }

    // Pack k holds frames k, k+packs, k+2·packs …, and packs load in the order that fills the gaps evenly (0, 16, 8, 24 …), so
    // the whole film moves after the first files and only gets finer. A phone stops at half of them.
    const bits = Math.log2(packs)
    const order = Array.from({ length: packs }, (_, i) => Number.parseInt(i.toString(2).padStart(bits, '0').split('').reverse().join(''), 2))
    if (innerWidth < 900) order.length = packs / 2
    const load = async () => {
      for (let k = order.shift(); k !== undefined && !dead; k = order.shift()) {
        const buf = await fetch(`${FILM.dir}/${k}.bin`).then(r => (r.ok ? r.arrayBuffer() : null)).catch(() => null)
        if (!buf) continue
        const v = new DataView(buf), n = v.getUint32(0, true)
        for (let i = 0, o = 4 + 4 * n; i < n; i++) {
          const size = v.getUint32(4 + 4 * i, true)
          blobs[k + i * packs] = new Blob([buf.slice(o, o + size)], { type: 'image/webp' })
          o += size
        }
        if (!queued) draw()
      }
    }
    ctx.fillStyle = '#e8e4dc'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    for (let i = 0; i < 3; i++) load()

    on()
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on)
    return () => {
      dead = true
      cancelAnimationFrame(queued)
      for (const b of bitmaps.values()) b?.close()
      removeEventListener('scroll', on)
      removeEventListener('resize', on)
    }
  }, [head])

  return (
    <section ref={root} className="ms" style={head ? undefined : { ['--e' as string]: 1 }} data-step={step} aria-label="A manual page, shown step by step">
      <noscript><style>{'.ms{height:auto!important}.ms-stage{position:static!important;height:auto!important}.ms-stage>*{position:static!important;transform:none!important;translate:none!important;width:auto!important}.ms-film{display:none!important}.ms-stills{display:grid!important}'}</style></noscript>
      <div className="ms-stage">
        {children && <div className="ms-words">{children}</div>}
        <canvas ref={canvas} width={FILM.w} height={FILM.h} className="ms-film" role="img"
          aria-label={`${MANUAL.product}: the parts come together, then each step of the manual page happens.`} />
        <div className="ms-sheet">
          <p className="ms-run"><span>{MANUAL.product}</span><span>Page 14</span></p>
          <h2>{MANUAL.title}</h2>
          <p className="ms-warn"><strong>Warning.</strong> {MANUAL.warning}</p>
          <ol>
            {MANUAL.steps.map((s, i) => (
              <li key={s.from} value={i + 1} aria-current={step === i + 1 ? 'step' : undefined}><span>{s.text}</span></li>
            ))}
          </ol>
          <p className="ms-note">Sample page, written by us. Not the maker’s official instructions.</p>
        </div>
      </div>
      <ol className="ms-stills">
        {MANUAL.steps.map((s, i) => (
          <li key={s.from}><Image src={frame(s.still)} alt="" width={MANUAL.w} height={MANUAL.h} sizes="320px" /><p>{i + 1}. {s.text}</p></li>
        ))}
      </ol>
    </section>
  )
}
