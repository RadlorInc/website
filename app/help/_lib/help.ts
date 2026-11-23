/**
 * The pure half of the 3Dlor help page: the step timeline of a video, the text of each part, and the search.
 * No I/O here, so the page (server), the player (browser) and the tests all use the same code.
 */

export type Step = {
  dur: number
  view?: string
  cut?: number
  xray?: number
  explode?: number
  mt?: number
  speed?: number
  hi?: string[]
  labels?: string[]
  caption?: { title?: string; body?: string }
}
export type Part = { id: string; position: number; title: string; start_s: number; end_s: number; keywords: string[]; still_path: string | null }
export type Video = {
  id: string; position: number; title: string; model_id: string; duration_s: number; audio_path: string | null
  script: { steps: Step[] }; parts: Part[]
}
export type Product = { id: string; brand_slug: string; product_slug: string; brand_name: string; product_name: string; videos: Video[] }

/** Each step with its start time (s) and model time at its start, every field carried over from the step before. */
export type TimedStep = Required<Omit<Step, 'mt' | 'caption'>> & { caption: Step['caption'] | null; t0: number; mt0: number }
export function timeline(steps: Step[]): TimedStep[] {
  let prev: Omit<TimedStep, 't0' | 'mt0' | 'dur'> = { view: '', cut: 0, xray: 0, explode: 0, speed: 1, hi: [], labels: [], caption: null }
  let t0 = 0, mt = 0
  return steps.map(s => {
    const full = { ...prev, ...s, caption: s.caption ?? null, dur: s.dur, t0, mt0: s.mt ?? mt }
    delete (full as Step).mt
    t0 += s.dur
    mt = full.mt0 + full.speed * s.dur
    prev = full
    return full as TimedStep
  })
}

/** The step playing at time t (the last one if t is past the end). */
export function stepAt(tl: TimedStep[], t: number): number {
  let i = 0
  while (i + 1 < tl.length && tl[i + 1].t0 <= t) i++
  return i
}

/** The words spoken in [start, end): the captions of every step that overlaps it. */
export function partText(tl: TimedStep[], start: number, end: number): string {
  return tl.filter(s => s.t0 < end && s.t0 + s.dur > start && s.caption)
    .map(s => [s.caption!.title, s.caption!.body].filter(Boolean).join('. ')).join(' ')
}

// ---------- search ----------

const STOP = new Set(('a an and are as at be by can do does for from get got how i if in is it its me my of on or our so ' +
  'that the then there this to up was we what when where which who why will with you your should would could please ' +
  'help video show tell need want').split(' '))

/** A few words customers use for the same thing. Brand words go in a part's keywords instead. */
const SAME: Record<string, string> = {
  wash: 'clean', rinse: 'clean', wipe: 'clean', dirty: 'clean', descale: 'clean',
  restart: 'reset', reboot: 'reset', 'switch': 'turn', power: 'turn', battery: 'charge', charger: 'charge',
  fix: 'repair', broken: 'repair', mend: 'repair', replace: 'change', swap: 'change',
  install: 'setup', assemble: 'setup', mount: 'setup', start: 'setup', begin: 'setup',
  noise: 'noisy', loud: 'noisy', rattle: 'noisy', shake: 'vibrate', wobble: 'vibrate', drip: 'leak',
  remove: 'take', detach: 'take', unlock: 'open',
}

/** Lower case, split on anything not a letter or digit, drop small common words, cut common English endings. */
export function words(text: string): string[] {
  const out: string[] = []
  for (const raw of text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/)) {
    if (!raw || STOP.has(raw) || raw.length > 30) continue
    const w = stem(raw)
    out.push(SAME[w] ?? SAME[raw] ?? w)
  }
  return out
}

function stem(w: string): string {
  if (w.length <= 3) return w
  for (const [end, add] of [['ies', 'y'], ['ing', ''], ['ed', ''], ['es', ''], ['s', '']] as const) {
    if (w.endsWith(end) && w.length - end.length >= 3 && !(end === 's' && w.endsWith('ss'))) {
      let b = w.slice(0, -end.length) + add
      if ((end === 'ing' || end === 'ed') && /([b-df-hj-np-tv-z])\1$/.test(b)) b = b.slice(0, -1)   // stopped -> stop
      return b
    }
  }
  return w
}

export type Doc = { videoId: string; partId: string; kw: Set<string>; title: Set<string>; text: Set<string> }
export type Hit = { videoId: string; partId: string; score: number }

export function index(product: Pick<Product, 'videos'>): Doc[] {
  const docs: Doc[] = []
  for (const v of product.videos) {
    const tl = timeline(v.script.steps)
    for (const p of v.parts) docs.push({
      videoId: v.id, partId: p.id,
      kw: new Set(words(p.keywords.join(' '))),
      title: new Set(words(`${p.title} ${v.title}`)),
      text: new Set(words(partText(tl, p.start_s, p.end_s))),
    })
  }
  return docs
}

export const MAX_QUERY = 200

/** Keyword match 3, title match 2, spoken-text match 1, per question word; best first, at most `limit`. */
export function search(docs: Doc[], query: string, limit = 5): Hit[] {
  const q = [...new Set(words(query.slice(0, MAX_QUERY)))].slice(0, 20)
  if (!q.length) return []
  return docs
    .map(d => ({ videoId: d.videoId, partId: d.partId, score: q.reduce((n, w) => n + (d.kw.has(w) ? 3 : d.title.has(w) ? 2 : d.text.has(w) ? 1 : 0), 0) }))
    .filter(h => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/** m:ss for a part's start and end. */
export const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
