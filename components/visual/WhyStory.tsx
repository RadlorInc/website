'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'
import { MANUAL, frame } from '@/content/manual-demo'
import { FINDINGS, SOURCES } from '@/content/evidence'
import { Scene, on } from './Scene'

/**
 * The research page as one story on a paper table (founder, 2026-11-24): six scenes, one idea each, and the scroll moves
 * the paper in hops, like stop motion.
 *
 * ⚠️ NO CLAIM LIVES HERE. Each scene restates one finding of `content/evidence.ts`, and every number drawn is read from that
 * finding's own chart data, so `check:evidence` still covers it. The limits sit in the list under the story.
 * ⚠️ THE RESTING STATE IS THE FINISHED STATE: without JS, or with reduced motion, every scene shows its last beat.
 */
function Claim({ id, note, ...rest }: { id: string; note?: string; beats: number; title: string; line: string; children: (beat: number) => ReactNode }) {
  const src = SOURCES[FINDINGS[id].refs[0]]
  return <Scene {...rest} small={<>{FINDINGS[id].evidence}: <a href={src.url} rel="noopener">{src.short}</a>.{note && <> {note}</>}</>} />
}

const rowsOf = (id: string) => { const v = FINDINGS[id].viz!; return 'rows' in v ? v.rows as { label: string; value: number; shown: string }[] : [] }

const THINGS = ['The valve', 'The faucet', 'The wrench', 'The canister', 'The cartridge', 'The O-ring', 'The tray']
const HANDS = ['Any topic', 'Looks real, like video', 'Work with your hands']

function Dots({ label, value, shown, go }: { label: string; value: number; shown: string; go: boolean }) {
  return (
    <div className="sc-dots" {...on(go)}>
      <div role="img" aria-label={`${label}: ${shown}`}>{Array.from({ length: 100 }, (_, i) => <i key={i} data-hit={i < value || undefined} style={{ transitionDelay: `${i * 12}ms` }} />)}</div>
      <p><strong>{shown}</strong> {label}</p>
    </div>
  )
}

/** Also the "why video" scene of /3dlor. */
export function HandsScene() {
  return (
    <Claim id="animation" beats={4} title="Moving pictures help most with hand work." note="A later, larger study found a smaller gain overall."
      line="Animation beats still pictures a little for any topic. For things you do with your hands, it helps a lot.">
      {b => (
        <div>
          <div className="sc-bars">
            {rowsOf('animation').map((r, i) => (
              <div key={r.label}><strong>{b > i ? r.shown : ''}</strong><span style={{ height: b > i ? `calc((100% - 6.5rem) * ${r.value / Math.max(...rowsOf('animation').map(x => x.value))})` : 0 }} data-hot={i === 2 || undefined} /><p>{HANDS[i]}</p></div>
            ))}
          </div>
          <p className="sc-src">The scale is effect size (d): the gain over still pictures, counted in standard deviations. 0 is no gain. Cohen’s guide: 0.2 is small, 0.5 is medium, 0.8 is large.</p>
        </div>
      )}
    </Claim>
  )
}

export function WhyStory() {
  const wound = FINDINGS['wound-care'].viz
  const quiz = wound?.kind === 'waffles' ? wound.options[1].rows : []
  return (
    <>
      <Claim id="multimedia" beats={5} title="Words and pictures beat words alone."
        line="Put a picture next to each step. In 13 comparisons, people who got words and pictures did much better on a new problem than people who got words alone.">
        {b => (
          <div className="sc-page">
            {MANUAL.steps.slice(0, 5).map((s, i) => (
              <div key={s.from}>
                <p>{i + 1}. {s.text}</p>
                <span className="drop" {...on(b > i)}><Image src={frame(s.still)} alt="" width={MANUAL.w} height={MANUAL.h} sizes="160px" /></span>
              </div>
            ))}
          </div>
        )}
      </Claim>

      <Claim id="working-memory" beats={8} title="The mind holds about four new things."
        line="Give people more at once, and the rest falls off. So show one step, then the next.">
        {b => (
          <div className="sc-tray">
            {THINGS.map((t, i) => (
              <span key={t} className="drop sc-note" data-fall={(i > 3 && b > 7) || undefined} {...on(b > i)}
                style={{ rotate: `${[-2, 1.5, -1, 2.5, -3, 1, -1.5][i]}deg` }}>{t}</span>
            ))}
            <p className="sc-hand">{b > 7 ? 'About four stay.' : ' '}</p>
          </div>
        )}
      </Claim>

      <Claim id="assembly" beats={3} title="One clear action per step." note="This study used still drawings, not video."
        line="In a furniture study, instructions with one clear action per step cut the work down.">
        {b => (
          <div className="sc-strips">
            {rowsOf('assembly').map(r => (
              <div key={r.label}>
                <p>{r.label}</p>
                <div className="sc-strip">
                  <span className="sc-cut" {...on(b > 1)} style={{ width: `${r.value}%` }}>{r.value}% Less</span>
                </div>
              </div>
            ))}
            <p className="sc-src">Average cut, compared with factory and hand-designed instructions.</p>
          </div>
        )}
      </Claim>

      <HandsScene />

      <Claim id="wound-care" beats={3} title="Pictures help people understand." note="One hospital, cuts only."
        line="Emergency patients got a page about wound care. Some pages had only text. Some had text and cartoons. This many answered every question correctly.">
        {b => (
          <div className="sc-two">
            {quiz.map((r, i) => <Dots key={r.label} label={r.label.toLowerCase()} value={r.value} shown={r.shown} go={b > i} />)}
          </div>
        )}
      </Claim>

      <Claim id="short-videos" beats={3} title="Short parts beat one long video."
        line="People learn better when a lesson comes in parts. So each 3Dlor video shows one task.">
        {b => (
          <div className="sc-film" {...on(b > 1)}>
            {MANUAL.steps.slice(0, 5).map((s, i) => (
              <span key={s.from} style={{ ['--k' as string]: i - 2 }}><Image src={frame(s.still)} alt="" width={MANUAL.w} height={MANUAL.h} sizes="200px" /><em>{i + 1}</em></span>
            ))}
          </div>
        )}
      </Claim>
    </>
  )
}
