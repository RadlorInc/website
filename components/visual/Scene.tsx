'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Stops } from './Stops'

/**
 * One idea on a paper table: the words stay, and the scroll moves the paper beside them in long, soft moves
 * (founder, 2026-11-24). `children` gets the beat, 0 to `beats`.
 * One swipe moves one step: `stops` are the beats where a step is finished (every beat, when not given).
 * ⚠️ THE RESTING STATE IS THE FINISHED STATE: without JS, or with reduced motion, the scene shows its last beat.
 */
export function Scene({ beats, stops, title, line, words, small, id, children }: {
  beats: number; stops?: number[]; title: string; line?: string; words?: (beat: number) => ReactNode; small?: ReactNode; id?: string; children: (beat: number) => ReactNode
}) {
  const ends = stops ?? Array.from({ length: beats }, (_, i) => i + 1)
  const list = ends.join()
  const root = useRef<HTMLElement>(null)
  const [beat, setBeat] = useState(beats)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ends = list.split(',').map(Number)
    let queued = 0
    const run = () => {
      queued = 0
      const r = root.current!.getBoundingClientRect()
      const p = -r.top / Math.max(1, r.height - innerHeight)
      const t = Math.max(0, p * (ends.length + 1)), k = Math.min(Math.floor(t), ends.length) // k steps are finished
      const a = k ? ends[k - 1] : 0, b = ends[k] ?? a
      setBeat(a + Math.ceil(Math.max(0, Math.min(1, (t - k - 0.1) / 0.8)) * (b - a)))
    }
    const on = () => { if (!queued) queued = requestAnimationFrame(run) }
    run()
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on)
    return () => { cancelAnimationFrame(queued); removeEventListener('scroll', on); removeEventListener('resize', on) }
  }, [list])
  return (
    <section ref={root} id={id} className="sc" style={{ ['--stops' as string]: ends.length }}>
      <Stops at={ends.map((_, i) => (i + 1) / (ends.length + 1))} />
      <div className="sc-stage">
        <div className="sc-words">
          <h2>{title}</h2>
          {line && <p>{line}</p>}
          {words?.(beat)}
          {small && <p className="sc-src">{small}</p>}
        </div>
        <div className="sc-table">{children(beat)}</div>
      </div>
    </section>
  )
}

/** `data-on` when true: the CSS hop class `.drop` and friends read it. */
export const on = (yes: boolean) => ({ 'data-on': yes || undefined })
