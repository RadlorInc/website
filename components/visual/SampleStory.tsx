'use client'

import Image from 'next/image'
import Link from 'next/link'
import { SAMPLES, samplePath } from '@/content/samples'
import { SAMPLES_PATH } from '@/site'
import { Scene, on } from './Scene'

/** Seven products, one written step each: the product lands on the table, then the step of its manual happens (founder,
 *  2026-11-24). Each one links to its narrated video. */
export function SampleStory() {
  return (
    <Scene beats={SAMPLES.length * 2} title="Seven manuals, made visible."
      small={<>Our own samples. Generic products, and manual pages written by us; not a maker’s official instructions. <Link href={SAMPLES_PATH}>All samples</Link></>}
      words={b => (
        <ol className="get">
          {SAMPLES.map((s, i) => (
            <li key={s.id} {...on(Math.ceil(b / 2) === i + 1)}><Link href={samplePath(s.id)}><strong>{s.product}</strong><span>{s.task}</span></Link></li>
          ))}
        </ol>
      )}>
      {b => {
        const at = Math.max(0, Math.ceil(b / 2) - 1)
        return (
          <div className="props">
            {SAMPLES.map((s, i) => (
              <div key={s.id} className={`prop smp${i < at ? ' prop-gone' : ''}`} {...on(i === at && b > 0)} data-act={(i === at && b % 2 === 0) || undefined}>
                <div>
                  <div className="p-swap2"><Image src={s.whole} alt="" width={1200} height={900} sizes="560px" /><Image src={s.detail} alt={`${s.product}: ${s.text}`} width={1200} height={900} sizes="560px" /></div>
                  <p><span>{s.step}. {s.text}</span></p>
                  <Link href={samplePath(s.id)} className="smp-go" tabIndex={i === at && b > 0 ? 0 : -1}>Watch the video</Link>
                </div>
              </div>
            ))}
          </div>
        )
      }}
    </Scene>
  )
}
