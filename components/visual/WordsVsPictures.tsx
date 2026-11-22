'use client'

import Image from 'next/image'
import { useState } from 'react'

/**
 * The research page's first screen, as something to try rather than read (founder, 2026-11-22): the same five
 * cleaning steps, as words only or as words with pictures. The visitor switches and feels the difference.
 *
 * ⚠️ It makes no claim and shows no number. The steps are our own French-press demo, so the pictures need no
 * licence and show no people. Both versions are in the HTML; the switch is two buttons with `aria-pressed`.
 */
const STEPS = [
  { text: 'Pull the plunger all the way out.', img: '/3d-steps/step-2.jpg' },
  { text: 'Tip the used grounds into the bin.', img: '/3d-steps/step-3.jpg' },
  { text: 'Unscrew the filter. It comes apart in 3 parts.', img: '/3d-steps/step-4.jpg' },
  { text: 'Wash every part in warm, soapy water.', img: '/3d-steps/step-5.jpg' },
  { text: 'Let it dry, then put it back together.', img: '/3d-steps/step-6.jpg' },
]

export function WordsVsPictures() {
  const [pics, setPics] = useState(false)
  const btn = (on: boolean) => `min-h-11 cursor-pointer rounded-full px-5 text-sm font-medium transition-colors duration-200 ${
    on ? 'bg-accent text-on-accent' : 'text-muted hover:text-foreground'}`
  return (
    <div className="rounded-3xl border border-line bg-surface p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-medium">Try it: how do you clean a French press?</p>
        <div className="inline-flex rounded-full border border-line bg-background p-1" role="group" aria-label="Show the steps as">
          <button type="button" aria-pressed={!pics} onClick={() => setPics(false)} className={btn(!pics)}>Words only</button>
          <button type="button" aria-pressed={pics} onClick={() => setPics(true)} className={btn(pics)}>Words + pictures</button>
        </div>
      </div>

      {!pics ? (
        <p className="mt-6 max-w-[60ch] leading-relaxed text-muted">
          {STEPS.map(s => s.text).join(' ')} Make sure the mesh sits between the top plate and the bottom plate when
          you screw the filter back on, and that the plunger goes in through the lid.
        </p>
      ) : (
        <ol className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {STEPS.map((s, i) => (
            <li key={s.text} className="overflow-hidden rounded-2xl border border-line bg-background">
              <Image src={s.img} alt="" width={360} height={640} className="aspect-[3/4] w-full object-cover" />
              <p className="flex gap-2 p-3 text-sm leading-snug"><span className="font-semibold text-accent">{i + 1}</span>{s.text}</p>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-5 text-sm text-muted">Same five steps. Which one could you follow faster? The research below explains why.</p>
    </div>
  )
}
