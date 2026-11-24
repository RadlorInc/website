'use client'

import Image from 'next/image'
import { MANUAL, WHOLE, frame } from '@/content/manual-demo'
import { SAMPLES } from '@/content/samples'
import { Scene, on } from './Scene'

/** The home page's selling lines as paper scenes (founder, 2026-11-24). The sentences are the outside feedback's own words,
 *  kept exactly on the founder's word: do not reword one without asking. */
const LINES = [
  'One clear action per video. No more walls of text.',
  'Customers watch the step, then do the step.',
  'Show them the inside, the exploded view, the exact step — so they get it right the first time.',
  'Update a single step in minutes — no reshoot required.',
]

const pic = (id: string) => SAMPLES.find(s => s.id === id)!.whole
const FOR = [['Furniture', 'furniture'], ['Fitness gear', 'fitness'], ['Appliances', 'kitchen'], ['Smart-home devices', 'smarthome'], ['Outdoor equipment', 'outdoor']]

const shot = (n: number) => <Image src={frame(n)} alt="" width={MANUAL.w} height={MANUAL.h} sizes="480px" />

export function HomeStory() {
  return (
    <>
      <Scene beats={LINES.length * 2} title="From static PDF to step‑by‑step 3D."
        small="Exploded views, internal mechanisms, parts that come apart — things a camera often can’t show cleanly or repeatedly."
        words={b => (
          <ol className="get">
            {LINES.map((l, i) => <li key={l} {...on(Math.ceil(b / 2) === i + 1)}><strong>{l}</strong></li>)}
          </ol>
        )}>
        {b => {
          const at = Math.max(0, Math.ceil(b / 2) - 1)
          const prop = (i: number) => ({ className: `prop${i < at ? ' prop-gone' : ''}`, ...on(i === at && b > 0), 'data-act': (i < at || (i === at && b % 2 === 0)) || undefined })
          return (
            <div className="props" aria-hidden="true">
              <div {...prop(0)}><div className="p-page"><b>{MANUAL.title}</b>{MANUAL.steps.slice(0, 1).map(s => <p key={s.from}><span>1. {s.text}</span></p>)}{shot(MANUAL.steps[0].still)}</div></div>
              <div {...prop(1)}><div className="p-page p-do"><b>Step 2</b><div className="p-swap2">{shot(WHOLE)}{shot(MANUAL.steps[1].still)}</div><p><span>{MANUAL.steps[1].text}</span></p></div></div>
              <div {...prop(2)}><div className="p-swap">{shot(WHOLE)}{shot(MANUAL.steps[5].still)}</div></div>
              <div {...prop(3)}><div className="p-page p-edit"><b>Step 6</b><p>Turn each canister by hand.</p>{shot(MANUAL.steps[5].still)}<em>Turn each canister by hand. Then use the wrench for a quarter turn.</em></div></div>
            </div>
          )
        }}
      </Scene>

      <Scene beats={6} title="Turn frustrating manuals into videos customers actually finish — and succeed with."
        line="For brands whose products involve assembly, installation, cleaning, or troubleshooting."
        words={b => <ul className="get"><li {...on(b > 5)}><strong>Fewer ‘how does this work?’ tickets. Happier customers. Better reviews.</strong></li></ul>}>
        {b => (
          <ul className="five">
            {FOR.map(([t, id], i) => (
              <li key={t} className="drop" {...on(b > i)} style={{ rotate: `${[-2.5, 1.5, 2.5, 2, -1.5][i]}deg` }}><Image src={pic(id)} alt="" width={1200} height={900} sizes="240px" /><strong>{t}</strong></li>
            ))}
          </ul>
        )}
      </Scene>
    </>
  )
}
