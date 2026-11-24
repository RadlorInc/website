'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * One idea on a paper table: the words stay, and the scroll moves the paper beside them in long, soft moves
 * (founder, 2026-11-24). `children` gets the beat, 0 to `beats`.
 * ⚠️ THE RESTING STATE IS THE FINISHED STATE: without JS, or with reduced motion, the scene shows its last beat.
 */
export function Scene({ beats, title, line, words, small, id, children }: {
  beats: number; title: string; line?: string; words?: (beat: number) => ReactNode; small?: ReactNode; id?: string; children: (beat: number) => ReactNode
}) {
  const root = useRef<HTMLElement>(null)
  const [beat, setBeat] = useState(beats)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let queued = 0
    const run = () => {
      queued = 0
      const r = root.current!.getBoundingClientRect()
      const p = -r.top / Math.max(1, r.height - innerHeight)
      setBeat(Math.max(0, Math.min(beats, Math.ceil((p - 0.04) / 0.84 * beats))))
    }
    const on = () => { if (!queued) queued = requestAnimationFrame(run) }
    run()
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on)
    return () => { cancelAnimationFrame(queued); removeEventListener('scroll', on); removeEventListener('resize', on) }
  }, [beats])
  return (
    <section ref={root} id={id} className="sc" style={{ ['--beats' as string]: beats }}>
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
