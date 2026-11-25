'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MANUAL, WHOLE, frame } from '@/content/manual-demo'
import { SAMPLES, samplePath } from '@/content/samples'
import { Scene, on } from './Scene'
import { HandsScene } from './WhyStory'

/** /3dlor told as scenes (founder, 2026-11-24). Every line is the page's own earlier text; the claims rules at the top of
 *  app/(site)/3dlor/page.tsx apply here too. */
const GET = [
  { title: 'A library for one product', line: 'Setup, daily use, cleaning, fixes and top problems. One video per question.' },
  { title: 'What a camera cannot show', line: 'Exploded views, parts that come apart, the inside at work.' },
  { title: 'From your manuals', line: 'Topics come from your instruction manuals. A CAD file helps. You do not need one.' },
  { title: 'Easy to update', line: 'A step changes? We change that step. Nobody films again.' },
  { title: 'Every format', line: 'Tall for phones, wide for websites, square for marketplaces.' },
  { title: 'More than one language', line: 'Captions and voice can change language. Every video of a brand has the same style.' },
]

const pic = (id: string) => SAMPLES.find(s => s.id === id)!

const FAN = [['Setup', pic('smarthome').whole], ['Daily use', pic('baby-pet').whole], ['Cleaning', pic('kitchen').detail], ['Fixes', pic('home-diy').detail], ['Top problems', pic('fitness').detail]]

const FOR = [
  { title: 'Assembly', line: 'Furniture and fitness equipment', id: 'furniture' },
  { title: 'Installation', line: 'Devices and fittings', id: 'smarthome' },
  { title: 'Care and cleaning', line: 'Kitchen and home products', id: 'kitchen' },
]

const LIMITS = [
  'Clean 3D, not a photoreal advert',
  'You approve every step and its accuracy',
]

const shot = (n: number) => <Image src={frame(n)} alt="" width={MANUAL.w} height={MANUAL.h} sizes="240px" />

export function V3dStory() {
  return (
    <>
      {/* Two beats per line: the prop lands on the table, then it does what the line says. */}
      <Scene beats={12} stops={GET.map((_, i) => (i + 1) * 2)} title="What you get."
        words={b => (
          <ol className="get">
            {GET.map((g, i) => (
              <li key={g.title} {...on(Math.ceil(b / 2) === i + 1)}><strong>{g.title}</strong><span>{g.line}</span></li>
            ))}
          </ol>
        )}>
        {b => {
          const at = Math.max(0, Math.ceil(b / 2) - 1)
          const prop = (i: number) => ({ className: `prop${i < at ? ' prop-gone' : ''}`, ...on(i === at && b > 0), 'data-act': (i < at || (i === at && b % 2 === 0)) || undefined })
          return (
            <div className="props" aria-hidden="true">
              <div {...prop(0)}><div className="p-fan">{FAN.map(([t, src], i) => <figure key={t} style={{ ['--k' as string]: i - 2 }}><Image src={src} alt="" width={1200} height={900} sizes="240px" /><figcaption>{t}</figcaption></figure>)}</div></div>
              <div {...prop(1)}><div className="p-swap">{shot(WHOLE)}{shot(MANUAL.steps[5].still)}</div></div>
              <div {...prop(2)}><div className="p-page"><b>{MANUAL.title}</b>{MANUAL.steps.slice(0, 5).map((s, i) => <p key={s.from}><span style={{ transitionDelay: `${i * 160}ms` }}>{i + 1}. {s.text}</span></p>)}</div></div>
              <div {...prop(3)}><div className="p-page p-edit"><b>Step 6</b><p>Turn each canister by hand.</p>{shot(MANUAL.steps[5].still)}<em>Turn each canister by hand. Then use the wrench for a quarter turn.</em></div></div>
              <div {...prop(4)}><div className="p-sizes"><i>{shot(WHOLE)}</i><i>{shot(WHOLE)}</i><i>{shot(WHOLE)}</i></div></div>
              <div {...prop(5)}><div className="p-lang">{shot(MANUAL.steps[0].still)}<p>Open the filter faucet.</p><p lang="es">Abra el grifo del filtro.</p></div></div>
            </div>
          )
        }}
      </Scene>

      <Scene beats={3} title="Who it is for." line="Brands whose manuals ask people to do something."
        small="The goal: fewer support tickets, fewer returns, better reviews. We do not promise a number.">
        {b => (
          <ul className="books">
            {FOR.map((f, i) => (
              <li key={f.title} className="drop" {...on(b > i)} style={{ rotate: `${[-4, 1.5, 5][i]}deg` }}>
                <Link href={samplePath(f.id)}><em>Instruction manual</em><Image src={pic(f.id).whole} alt="" width={1200} height={900} sizes="200px" /><strong>{f.title}</strong><span>{f.line}</span></Link>
              </li>
            ))}
          </ul>
        )}
      </Scene>

      <Scene id="how" beats={4} title="How it works."
        small="A video that does not match the approved script or the real product is our mistake. We fix it free.">
        {b => (
          <ol className="works">
            <li className="drop" {...on(b > 0)}>
              <div className="w-paper">{MANUAL.steps.map((s, i) => <p key={s.from}>{i + 1}. {s.text}</p>)}</div>
              <strong>1. Send manuals and photos</strong><span>A CAD file is optional.</span>
            </li>
            <li className="drop" {...on(b > 1)}>
              <div className="w-paper w-list">{['Set it up', 'Use it', 'Clean it', 'Fix it'].map(t => <p key={t}>{t}</p>)}</div>
              <strong>2. We plan the library</strong><span>Topics from your instruction manuals.</span>
            </li>
            <li className="drop" {...on(b > 2)}>
              <div className="w-paper w-script">{[2, 5].map(i => <div key={i}>{shot(MANUAL.steps[i].still)}<p>{MANUAL.steps[i].text}</p></div>)}<b {...on(b > 2)}>Approved</b></div>
              <strong>3. You approve each script</strong><span>Two rounds of changes included.</span>
            </li>
            <li className="drop" {...on(b > 3)}>
              <div className="w-out"><i>{shot(WHOLE)}</i><i>{shot(WHOLE)}</i><i>{shot(WHOLE)}</i></div>
              <strong>4. You get the videos</strong><span>Tall, wide and square.</span>
            </li>
          </ol>
        )}
      </Scene>

      <HandsScene />

      <Scene beats={LIMITS.length} title="What this is not." line="Our limits, before you ask.">
        {b => (
          <ul className="slips">
            {LIMITS.map((l, i) => <li key={l} className="drop" {...on(b > i)} style={{ rotate: `${[-1.5, 1, -0.6, 1.6][i]}deg`, marginLeft: `${[0, 12, 4, 16][i]}%` }}>{l}</li>)}
          </ul>
        )}
      </Scene>
    </>
  )
}
