'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'

export type Step = { label: string; at: number; thumb: string }

/**
 * "Take it apart": the demo video under the visitor's hand. A slider moves through the video, and each step button
 * plays that one step and stops at the next. Built for /3dlor (founder, 2026-11-22: "make it interactive").
 *
 * ⚠️ The video is SILENT and never plays by itself: it moves only when the visitor asks. The slider is a native
 * `<input type="range">` (keyboard and screen reader work by default); its `aria-valuetext` names the step.
 * Without JS the video still has its own controls.
 */
export function StepScrubber({ video, poster, duration, steps, label }: {
  video: string; poster: string; duration: number; steps: Step[]; label: string
}) {
  const v = useRef<HTMLVideoElement>(null)
  const stopAt = useRef<number | null>(null)
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(false)
  const current = steps.reduce((a, s, i) => (t >= s.at - 0.05 ? i : a), 0)

  useEffect(() => {
    const el = v.current!
    const tick = () => {
      setT(el.currentTime)
      if (stopAt.current !== null && el.currentTime >= stopAt.current) { el.pause(); stopAt.current = null }
    }
    const on = () => setPlaying(true), off = () => setPlaying(false)
    el.addEventListener('timeupdate', tick); el.addEventListener('play', on); el.addEventListener('pause', off)
    return () => { el.removeEventListener('timeupdate', tick); el.removeEventListener('play', on); el.removeEventListener('pause', off) }
  }, [])

  const seek = (to: number) => { const el = v.current!; stopAt.current = null; el.pause(); el.currentTime = to; setT(to) }
  const playStep = (i: number) => {
    const el = v.current!
    el.currentTime = steps[i].at; setT(steps[i].at)
    // Stop a little before the next step: `timeupdate` fires only every ~250 ms, so stopping AT the next step's start
    // ran into it and lit the wrong step button.
    stopAt.current = steps[i + 1] ? steps[i + 1].at - 0.3 : null
    el.play().catch(() => {})
  }
  const toggle = () => { const el = v.current!; if (el.paused) { stopAt.current = null; el.play().catch(() => {}) } else el.pause() }

  return (
    <div className="grid items-start gap-8 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
      <div className="mx-auto w-full max-w-[300px]">
        <video ref={v} src={video} poster={poster} width={720} height={1280} muted playsInline preload="metadata"
          aria-label={label} className="aspect-[9/16] w-full rounded-3xl border border-line bg-surface" />
        <div className="mt-4 flex items-center gap-3">
          <button type="button" onClick={toggle} aria-label={playing ? 'Pause the video' : 'Play the video'}
            className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full bg-accent text-on-accent hover:opacity-90">
            <Icon name={playing ? 'pause' : 'play'} className="h-4 w-4" />
          </button>
          <label className="sr-only" htmlFor="scrub">Move through the video</label>
          <input id="scrub" type="range" min={0} max={duration} step={0.1} value={t}
            onChange={e => seek(Number(e.target.value))}
            aria-valuetext={`${steps[current].label}, ${Math.round(t)} of ${duration} seconds`}
            className="h-11 w-full cursor-pointer accent-[var(--accent)]" />
        </div>
      </div>

      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.label}>
            <button type="button" onClick={() => playStep(i)} aria-current={i === current ? 'step' : undefined}
              className={`group w-full cursor-pointer overflow-hidden rounded-2xl border text-left transition-colors duration-200 ${
                i === current ? 'border-accent bg-accent-soft' : 'border-line bg-surface hover:border-foreground/40'}`}>
              <Image src={s.thumb} alt="" width={360} height={640} className="aspect-[4/3] w-full object-cover object-center" />
              <span className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium leading-snug">
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs ${i === current ? 'bg-accent text-on-accent' : 'bg-line text-foreground'}`}>{i}</span>
                {s.label}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
