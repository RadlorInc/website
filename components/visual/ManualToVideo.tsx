'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { MANUAL, WHOLE, frame } from '@/content/manual-demo'
import { SAMPLES } from '@/content/samples'

/** The first screen (founder, 2026-11-25): the filter's user manual, an arrow, and the filter's video with a play button.
 *  Nothing plays by itself, and nothing but the poster loads before a tap. The manual is our own; the filter is generic. */
const S = SAMPLES.find(s => s.id === 'home-diy')!

export function ManualToVideo() {
  const video = useRef<HTMLVideoElement>(null)
  const [played, setPlayed] = useState(false)
  return (
    <div className="mv">
      <figure className="mv-book" role="img" aria-label={`The user manual of a ${MANUAL.product.toLowerCase()}`}>
        <div className="mv-inner" aria-hidden="true"><b>{MANUAL.title}</b>{MANUAL.steps.map((s, i) => <p key={s.from}>{i + 1}. {s.text}</p>)}</div>
        <div className="mv-cover" aria-hidden="true">
          <p className="mv-kind">User manual</p>
          <p className="mv-name">{MANUAL.product}</p>
          <Image src={frame(WHOLE)} alt="" width={MANUAL.w} height={MANUAL.h} sizes="280px" priority decoding="sync" />
          <p className="mv-task">{MANUAL.title}</p>
        </div>
      </figure>
      <svg className="mv-arrow" viewBox="0 0 64 40" role="img" aria-label="becomes a video"><path d="M2 20h56M42 4l18 16-18 16" fill="none" stroke="currentColor" strokeWidth="5" /></svg>
      <div className="mv-film">
        <video ref={video} controls={played} playsInline preload="none" poster={`/samples/${S.id}/poster.webp`} src={`/samples/${S.id}/wide.mp4`}
          aria-label={`${S.product}: ${S.task}. ${S.seconds} seconds, with voice.`} onPlay={() => setPlayed(true)} />
        {!played && (
          <button type="button" onClick={() => { setPlayed(true); video.current!.play().catch(() => {}); video.current!.focus() }} aria-label={`Play the ${S.product.toLowerCase()} video, ${S.seconds} seconds, with voice`}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l14-8z" fill="currentColor" /></svg>
          </button>
        )}
      </div>
      <p className="mv-note">Our own sample. The manual is written by us, not a maker’s official instructions.</p>
    </div>
  )
}
