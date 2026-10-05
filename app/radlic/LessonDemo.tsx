'use client'
/**
 * The landing page's demo: two REAL topics, each played whole — the opening question, every chalkboard screen of the
 * explanation in order, beat by beat with the teacher's lines as captions, then the child's first question.
 *
 * ⚠️ Not a copy of a lesson — the page passes in the topics' real screens (`chalk` and `beats`), exported from the app
 * by its `scripts/landing-demo-snapshot.mts` into content/radlic-demo.json, and this
 * draws them with a copy of the app's `Chalkboard`. Reword a screen in the app and re-run that script.
 * No sound here on purpose: a front page that talks on load is worse than a silent one.
 */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Chalkboard } from './Chalkboard'
import { beatMs, type ChalkMark } from './chalk'
import s from './radlic.module.css'

interface Screen { title: string; label: string; marks: ChalkMark[]; says: string[] }
export interface Demo { id: string; tag: string; title: string; hook: string; turn?: string; screens: Screen[] }

const NEXT = 1600   // a finished board stays up this long before the next screen
const HOLD = 4200   // the last board, with the child's question under it, stays up this long before the next topic
const CALM = '(prefers-reduced-motion: reduce)'
const onCalm = (cb: () => void) => { const m = window.matchMedia?.(CALM); m?.addEventListener('change', cb); return () => m?.removeEventListener('change', cb) }

export default function LessonDemo({ demos }: { demos: Demo[] }) {
  const [i, setI] = useState(0)
  const [sc, setSc] = useState(0)
  const [shown, setShown] = useState(1)
  const [run, setRun] = useState(0)          // bumps to replay from the first line
  const [live, setLive] = useState(() => typeof IntersectionObserver === 'undefined')   // on screen
  const still = useSyncExternalStore(onCalm, () => !!window.matchMedia?.(CALM).matches, () => false)
  const box = useRef<HTMLDivElement>(null)
  const d = demos[i], b = d.screens[sc], last = sc === d.screens.length - 1

  useEffect(() => {
    const el = box.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const all = still ? b.says.length : shown
  const go = (k: number, n: number) => { setI(k); setSc(n); setShown(1); setRun(r => r + 1) }
  useEffect(() => {
    if (!live || still) return
    const done = shown >= b.says.length
    const t = setTimeout(() => {
      if (!done) setShown(n => n + 1)
      else if (!last) go(i, sc + 1)
      else go((i + 1) % demos.length, 0)
    }, beatMs(b.says[shown - 1]) + (!done ? 500 : last ? HOLD : NEXT))
    return () => clearTimeout(t)
  }, [live, still, shown, b, last, i, sc, demos.length])

  return (
    <div ref={box} className={s.demo}>
      <div className={s.tabs} role="tablist" aria-label="Sample lessons">
        {demos.map((x, k) => (
          <button key={x.id} role="tab" aria-selected={k === i} className={s.tab} onClick={() => go(k, 0)}>
            {x.tag}
          </button>
        ))}
      </div>
      <p className={s.demoTitle}>{d.title}</p>
      {/* Every topic's question and every screen's lines sit stacked in one grid cell, only the current one visible, so
          the card is as tall as the longest of them and does not jump when the screen or the tab changes. */}
      <div className={s.stack}>
        {demos.map((x, k) => (
          <p key={x.id} className={s.hook} data-off={k !== i || undefined} aria-hidden={k !== i}>
            <b>It starts with a question:</b> {x.hook}
          </p>
        ))}
      </div>
      <div className={s.steps} aria-label="Screens of this lesson">
        {d.screens.map((x, n) => (
          <button key={n} className={s.step} aria-current={n === sc ? 'step' : undefined} aria-label={`Screen ${n + 1}: ${x.title}`}
            data-done={n < sc || undefined} onClick={() => go(i, n)} />
        ))}
        <span className={s.stepName}>{sc + 1}/{d.screens.length} · {b.title}</span>
      </div>
      <Chalkboard key={`${d.id}-${sc}-${run}`} marks={b.marks} says={b.says} shown={all} label={b.label} still={still} />
      <div className={s.stack}>
        {demos.flatMap((x, k) => x.screens.map((y, n) => {
          const on = k === i && n === sc, end = n === x.screens.length - 1
          return (
            <div key={`${x.id}-${n}`} data-off={!on || undefined} aria-hidden={!on}>
              <ol className={s.captions} aria-label={on ? 'What the teacher says' : undefined}>
                {y.says.map((line, j) => (
                  <li key={j} className={!on ? undefined : j < all - 1 ? s.said : j === all - 1 ? s.saying : s.later}>{line}</li>
                ))}
              </ol>
              {end && x.turn && (
                <p className={s.turn} data-off={!(on && (still || shown >= y.says.length)) || undefined}>
                  <b>Then it&apos;s their turn:</b> {x.turn}
                </p>
              )}
            </div>
          )
        }))}
      </div>
      {!still && (
        <button className={s.replay} onClick={() => go(i, 0)}>↻ Watch from the start</button>
      )}
    </div>
  )
}
