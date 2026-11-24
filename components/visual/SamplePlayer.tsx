'use client'

import { useRef, useState } from 'react'
import type { Sample } from '@/content/samples'

/** The narrated sample beside its manual page. The step that plays is marked on the page, and a tap on a step plays it.
 *  Nothing plays by itself, and nothing but the poster loads before a tap. Phones get the tall film. */
export function SamplePlayer({ s }: { s: Sample }) {
  const video = useRef<HTMLVideoElement>(null)
  const [at, setAt] = useState(-1)
  const go = (t: number) => {
    const v = video.current!
    const play = () => { v.currentTime = t + 0.05; v.play().catch(() => {}) }
    if (v.readyState > 0) play()
    else { v.addEventListener('loadedmetadata', play, { once: true }); v.load() }
  }
  return (
    <div className="sp">
      <div className="sp-film">
        <video ref={video} controls playsInline preload="none" poster={`/samples/${s.id}/poster.webp`} aria-label={`${s.product}: ${s.task}. ${s.seconds} seconds, with voice.`}
          onTimeUpdate={e => { const t = e.currentTarget.currentTime; setAt(s.steps.findLastIndex(x => t >= x.at)) }} onEnded={() => setAt(-1)}>
          <source src={`/samples/${s.id}/tall.mp4`} type="video/mp4" media="(max-width: 640px)" />
          <source src={`/samples/${s.id}/wide.mp4`} type="video/mp4" />
        </video>
      </div>
      <div className="ms-sheet sp-page">
        <p className="ms-run"><span>{s.product}</span><span>Manual</span></p>
        <h2>{s.manual.split(': ').at(-1)}</h2>
        <ol>
          {s.steps.map((x, i) => (
            <li key={x.at} aria-current={i === at ? 'step' : undefined}><button type="button" onClick={() => go(x.at)}><span>{x.text}</span></button></li>
          ))}
        </ol>
        <p className="ms-note">Tap a step to see it. Sample page, written by us. Not a maker’s official instructions.</p>
      </div>
    </div>
  )
}
