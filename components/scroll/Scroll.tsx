'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * THE FOUR SCROLL STYLES THE FOUNDER PICKED (2026-09-29, from the "Radlor Scroll Styles" preview): C pinned story,
 * E zoom, F circle reveal, G drawn path. One file so the four share one scroll loop and one reduced-motion rule.
 *
 * ⚠️ THE WORDS ARE ALWAYS IN THE HTML. Every heading and line here is server-rendered and stays in the DOM; motion only
 * changes transform, opacity and clip-path. A crawler, a screen reader and a browser without JS read the whole page.
 * The pictures are decorative (`alt=""`) because the heading beside each carries the meaning.
 *
 * ⚠️ THE RESTING STATE IS THE FINISHED STATE. Without JS (and with `prefers-reduced-motion`) each piece renders fully
 * drawn: the circle open, the picture full size, the path drawn. JS moves things back to their start only after mount.
 */

export type Pic = { src: string; w: number; h: number }

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))

/** Calls `frame` on mount and on every scroll/resize (one rAF per frame), unless the reader asked for less motion. */
function useScrollFrame(frame: () => void) {
  const cb = useRef(frame)
  useEffect(() => { cb.current = frame })
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // a frame queued just before the page is left must not run against an unmounted element
    let queued = 0
    const run = () => { queued = 0; cb.current() }
    const on = () => { if (!queued) queued = requestAnimationFrame(run) }
    run()
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on)
    return () => { cancelAnimationFrame(queued); removeEventListener('scroll', on); removeEventListener('resize', on) }
  }, [])
}

/** How far a pinned section has scrolled through its own extra height: 0 at its top, 1 when its sticky part leaves. */
function pinnedProgress(el: HTMLElement, sticky: HTMLElement) {
  const r = el.getBoundingClientRect()
  return clamp(-r.top / Math.max(1, r.height - sticky.offsetHeight))
}

// ── F · circle reveal ────────────────────────────────────────────────────────────────────────────────────────────────
/** The picture opens out of a small circle, like a light being turned up. Eases open on load when it starts on screen,
 *  and follows the scroll when it starts below the fold. */
export function CircleReveal({ pic, priority = false, className = '' }: { pic: Pic; priority?: boolean; className?: string }) {
  const box = useRef<HTMLDivElement>(null)
  const shown = useRef(8)
  const anim = useRef(0)
  useScrollFrame(() => {
    const el = box.current!
    const r = el.getBoundingClientRect(), vh = innerHeight
    const target = 8 + 67 * clamp((vh - r.top) / (vh * 0.55 + r.height * 0.3))
    cancelAnimationFrame(anim.current)
    const step = () => {
      shown.current += (target - shown.current) * 0.12
      el.style.setProperty('--r', `${shown.current.toFixed(2)}%`)
      if (Math.abs(target - shown.current) > 0.15) anim.current = requestAnimationFrame(step)
    }
    step()
  })
  useEffect(() => () => cancelAnimationFrame(anim.current), [])
  return (
    <div ref={box} className={`rl-circle ${className}`}>
      <Image src={pic.src} alt="" width={pic.w} height={pic.h} priority={priority} sizes="(max-width: 760px) 80vw, 460px" />
    </div>
  )
}

// ── E · zoom ─────────────────────────────────────────────────────────────────────────────────────────────────────────
/** One big moment: the picture grows from small to full as the reader scrolls, then its heading arrives. */
export function ZoomMoment({ pic, title, children }: { pic: Pic; title: string; children?: ReactNode }) {
  const root = useRef<HTMLElement>(null)
  const sticky = useRef<HTMLDivElement>(null)
  useScrollFrame(() => {
    const p = pinnedProgress(root.current!, sticky.current!)
    root.current!.style.setProperty('--z', (0.42 + 0.58 * clamp(p * 1.5)).toFixed(3))
    root.current!.style.setProperty('--cap', clamp((p - 0.5) * 4).toFixed(3))
  })
  return (
    <section ref={root} className="rl-zoom">
      <div ref={sticky} className="rl-zoom-sticky">
        <Image src={pic.src} alt="" width={pic.w} height={pic.h} className="rl-zoom-pic" sizes="(max-width: 760px) 90vw, 620px" />
        <div className="rl-zoom-cap">
          <h2 className="font-display text-4xl sm:text-5xl">{title}</h2>
          {children && <div className="mt-3 text-lg text-muted">{children}</div>}
        </div>
      </div>
    </section>
  )
}

// ── G · drawn path ───────────────────────────────────────────────────────────────────────────────────────────────────
export type PathRow = Pic & { title: string; href?: string; body?: ReactNode; more?: ReactNode }
/** A line draws itself down the page as the reader scrolls, joining each picture to the next; each row lights up as
 *  the line reaches it. `more` is optional detail, folded under a "Read the details" toggle. */
export function PathRows({ rows }: { rows: PathRow[] }) {
  const root = useRef<HTMLDivElement>(null)
  const line = useRef<SVGPathElement>(null)
  const [lit, setLit] = useState(rows.length)
  // the line runs through the centre of each picture, measured in real pixels (a stretched viewBox breaks the dashes)
  const [geo, setGeo] = useState({ w: 100, h: 100, d: '' })
  useEffect(() => {
    const measure = () => {
      const el = root.current
      if (!el) return  // a resize reported after the page was left
      const box = el.getBoundingClientRect()
      const pts = [...el.querySelectorAll<HTMLElement>('.rl-path-pic')].map(el => {
        const r = el.getBoundingClientRect()
        return [r.left - box.left + r.width / 2, r.top - box.top + r.height / 2]
      })
      if (!pts.length) return
      let d = `M ${pts[0][0]} 0 L ${pts[0][0]} ${pts[0][1]}`
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], my = (y0 + y1) / 2
        d += ` C ${x0} ${my}, ${x1} ${my}, ${x1} ${y1}`
      }
      d += ` L ${pts[pts.length - 1][0]} ${box.height}`
      setGeo({ w: box.width, h: box.height, d })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root.current!)
    return () => ro.disconnect()
  }, [])
  useScrollFrame(() => {
    const r = root.current!.getBoundingClientRect(), vh = innerHeight
    const p = clamp((vh * 0.7 - r.top) / r.height)
    line.current!.style.strokeDashoffset = String(1 - p)
    setLit(Math.ceil(p * rows.length + 0.35))
  })
  return (
    <div ref={root} className="rl-path">
      <svg className="rl-path-line" viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
        <path ref={line} d={geo.d} pathLength={1} />
      </svg>
      {rows.map((row, i) => (
        <div key={row.title} className="rl-path-row" data-lit={i < lit || undefined}>
          <Image src={row.src} alt="" width={row.w} height={row.h} className="rl-path-pic" sizes="(max-width: 760px) 70vw, 320px" />
          <div className="rl-path-text">
            <h2 className="font-display text-3xl leading-tight">
              {row.href ? <Link href={row.href} className="hover:text-accent transition-colors">{row.title}</Link> : row.title}
            </h2>
            {row.body && <div className="mt-2 text-muted leading-relaxed">{row.body}</div>}
            {row.more && (
              <details className="rl-more mt-3">
                <summary>Read the details</summary>
                <div className="rl-prose prose mt-3">{row.more}</div>
              </details>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── C · pinned story ─────────────────────────────────────────────────────────────────────────────────────────────────
export type Step = Pic & { title: string; body?: ReactNode }
/** The picture stays put while the steps scroll past it; each step swaps the picture. The steps are ordinary blocks in
 *  the page flow, so every one of them is readable without the effect. */
export function PinnedStory({ steps }: { steps: Step[] }) {
  const list = useRef<HTMLOListElement>(null)
  const [on, setOn] = useState(0)
  useScrollFrame(() => {
    const mid = innerHeight * 0.55
    let best = 0, dist = Infinity
    list.current!.querySelectorAll<HTMLElement>(':scope > li').forEach((li, i) => {
      const r = li.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - mid)
      if (d < dist) { dist = d; best = i }
    })
    setOn(best)
  })
  return (
    <div className="rl-story">
      <div className="rl-story-pics" aria-hidden="true">
        {steps.map((s, i) => (
          <Image key={s.src} src={s.src} alt="" width={s.w} height={s.h} data-on={i === on || undefined} sizes="(max-width: 760px) 70vw, 440px" />
        ))}
      </div>
      <ol ref={list} className="rl-story-steps">
        {steps.map((s, i) => (
          <li key={s.title} data-on={i === on || undefined}>
            <span className="rl-story-n">{i + 1}</span>
            <h3 className="font-display text-3xl sm:text-4xl leading-tight">{s.title}</h3>
            {s.body && <div className="mt-2 text-lg text-muted leading-relaxed">{s.body}</div>}
          </li>
        ))}
      </ol>
    </div>
  )
}
