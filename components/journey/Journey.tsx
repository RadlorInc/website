'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Gaegu } from 'next/font/google'
import { APP_NAME, APP_URL } from '@/site'
import { ChalkScenes } from './ChalkScenes'

// the chalk writing on the drawings, self-hosted by next/font (radlor.com loads nothing off-origin)
const gaegu = Gaegu({ subsets: ['latin'], weight: ['700'], variable: '--rl-gaegu' })

/**
 * THE HOME PAGE'S FIRST SCREEN IS A JOURNEY (founder's call, 2026-09-25): six stops, each with a chalk drawing that
 * draws itself when the reader arrives, and each flick of the scroll carries the reader to the next stop.
 * (It was a low-poly 3D world the same morning; the founder: "looking like AI generated", so ChalkScenes replaced it.)
 *
 * ⚠️ THE WORDS ARE THE PAGE, THE DRAWINGS ARE DECORATION. Every stop below is ordinary HTML that this client component
 * still server-renders, so a crawler, an answer engine and a screen reader all get the full copy on the first byte.
 *
 * ⚠️ THE SCROLL POSITION IS THE ONE SOURCE OF TRUTH. Each stop is one screen tall; the drawing follows the stop the page is on.
 * A gesture does not move the drawing, it animates the PAGE to the next stop — so the scrollbar, keys, Back and
 * "find in page" all keep working, and nothing can disagree with what the reader sees.
 *
 * Why one flick = one stop: on a free scroll the reader had to land precisely on each topic (founder, 2026-09-25:
 * "they scroll, they reach the next thing"). A trackpad keeps firing wheel events for a second after the finger
 * lifts; a gesture only counts after a 180 ms pause in that stream. (The pause used to scale with frame time,
 * because the 3D world slowed a weak device to ~5 fps; the drawings cost nothing per frame, so the constant is back.)
 *
 * The previous scroll-linked hero (a 180-frame flip-book, deleted in 1d4cfae) failed on smoothness and on phone
 * contrast. The copy sits on its own shade, and the drawing keeps to the other side of the screen.
 */

const STOPS = [
  { eyebrow: '01 · Mission', title: 'Every child already has the treasure.', body: 'We build learning that finds it, and lights it up.' },
  {
    eyebrow: '02 · How we build',
    title: 'Four rules in everything we make.',
    chips: ['One idea at a time', 'No levels, no red crosses', 'Harder means different', 'Children’s data stays small'],
  },
  {
    eyebrow: '03 · Our first product',
    title: `${APP_NAME}: math that adapts.`,
    body: 'Grades 3–8. Every answer shapes the next question.',
    cta: [{ label: `Try ${APP_NAME}`, href: `${APP_URL}/auth` }],
  },
  {
    eyebrow: '04 · Who it’s for',
    title: 'Families, schools and partners.',
    links: [
      { label: 'Parents', href: '/radlic' },
      { label: 'Schools', href: '/for-schools' },
      { label: 'Partners', href: '/contact' },
    ],
  },
  {
    eyebrow: '05 · What comes next',
    title: 'More is coming.',
    body: 'New learning products are in research.',
    cta: [{ label: `Try ${APP_NAME}`, href: `${APP_URL}/auth` }, { label: 'Talk to us', href: '/contact', quiet: true }],
  },
] as const
const LAST = STOPS.length  // stop 0 is the opening screen, then one per entry above
const RAIL = ['Start', 'Mission', 'How we build', APP_NAME, 'Who it’s for', 'What comes next']

export function Journey() {
  const root = useRef<HTMLElement>(null)
  const [here, setHere] = useState(0)
  const [playing, setPlaying] = useState(false)
  const api = useRef<{ go(i: number): void; play(on: boolean): void } | null>(null)

  useEffect(() => {
    const section = root.current!
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let top = 0, vh = 1
    const measure = () => { top = section.getBoundingClientRect().top + scrollY; vh = section.querySelector<HTMLElement>('.rl-stop')!.offsetHeight }
    measure()
    const getX = () => (scrollY - top) / vh
    // above the journey counts as in it: the header sits over the first screen, and a flick from the very top
    // of the page must walk to the first stop, not spend itself scrolling past the header
    const inJourney = () => scrollY <= top + LAST * vh + 2

    // ── moving the page between stops: eased, time-based, never the browser's own smooth-scroll ──
    let anim = 0, animating = false, lastWheel = 0, playTimer = 0, isPlaying = false
    const easeIO = (k: number) => -(Math.cos(Math.PI * k) - 1) / 2
    function go(i: number) {
      i = Math.max(0, Math.min(LAST, i))
      const from = scrollY, to = top + i * vh
      cancelAnimationFrame(anim)
      if (reduce || Math.abs(to - from) < 1) { scrollTo({ top: to, behavior: 'instant' }); animating = false; return }
      const dur = 1400 + 900 * Math.min(3, Math.abs(to - from) / vh), t0 = performance.now()
      animating = true
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / dur)
        scrollTo({ top: from + (to - from) * easeIO(k), behavior: 'instant' })
        if (k < 1) anim = requestAnimationFrame(tick)
        else { animating = false; if (isPlaying) playTimer = window.setTimeout(() => (i < LAST ? go(i + 1) : play(false)), 4200) }
      }
      anim = requestAnimationFrame(tick)
    }
    function step(dir: number) {
      const x = getX()
      go(dir > 0 ? Math.max(1, Math.floor(x + .02) + 1) : Math.ceil(x - .02) - 1)
    }
    function play(on: boolean) {
      isPlaying = on; setPlaying(on); clearTimeout(playTimer)
      if (on) { const x = Math.round(getX()); go(x >= LAST ? 0 : x + 1) }
    }
    const stopPlaying = () => { if (isPlaying) play(false) }
    api.current = { go: i => { stopPlaying(); go(i) }, play }
    // leaving the journey: past the last stop going down, or before the first going up, the page scrolls normally
    const passes = (dir: number) => { const x = getX(); return (dir > 0 && x >= LAST - .02) || (dir < 0 && x <= .02) }

    const onWheel = (e: WheelEvent) => {
      const now = performance.now(), fresh = now - lastWheel > 180; lastWheel = now
      if (!inJourney() || e.ctrlKey) return  // ctrl+wheel is a pinch-zoom
      const dir = Math.sign(e.deltaY); if (!dir || (!animating && passes(dir))) return
      e.preventDefault(); stopPlaying()
      // while it moves, the wheel is ignored outright: a swipe's inertia ends inside the move and can never chain
      if (fresh && !animating) step(dir)
    }
    let ty: number | null = null
    const onTouchStart = (e: TouchEvent) => { ty = inJourney() ? e.touches[0].clientY : null }
    const onTouchMove = (e: TouchEvent) => {
      if (ty === null) return
      const dir = Math.sign(ty - e.touches[0].clientY)
      if (animating || !passes(dir)) e.preventDefault()
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (ty === null) return
      const dy = ty - e.changedTouches[0].clientY; ty = null
      if (Math.abs(dy) > 40 && !animating && !passes(Math.sign(dy))) { stopPlaying(); step(Math.sign(dy)) }
    }
    const onKey = (e: KeyboardEvent) => {
      if (!inJourney() || e.altKey || e.metaKey || e.ctrlKey) return
      const el = e.target as HTMLElement
      if (el.closest('input, textarea, select, [contenteditable]')) return
      if (e.key === ' ' && el.closest('button, a')) return  // Space presses a focused button; it must not also move the page
      const dir = ['ArrowDown', 'PageDown', ' '].includes(e.key) ? (e.shiftKey && e.key === ' ' ? -1 : 1) : ['ArrowUp', 'PageUp'].includes(e.key) ? -1 : 0
      if (!dir || (!animating && passes(dir))) return
      e.preventDefault(); stopPlaying(); if (!animating) step(dir)
    }
    const onScroll = () => { const i = Math.round(Math.max(0, Math.min(LAST, getX()))); setHere(i) }
    addEventListener('wheel', onWheel, { passive: false })
    addEventListener('touchstart', onTouchStart, { passive: true })
    addEventListener('touchmove', onTouchMove, { passive: false })
    addEventListener('touchend', onTouchEnd, { passive: true })
    addEventListener('keydown', onKey)
    addEventListener('scroll', onScroll, { passive: true })
    const onResize = () => measure(); addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(anim); clearTimeout(playTimer)
      removeEventListener('wheel', onWheel); removeEventListener('touchstart', onTouchStart); removeEventListener('touchmove', onTouchMove)
      removeEventListener('touchend', onTouchEnd); removeEventListener('keydown', onKey); removeEventListener('scroll', onScroll); removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section ref={root} className={`rl-journey rl-dark ${gaegu.variable}`} aria-label="The Radlor journey">
      <div className="rl-journey-track" aria-hidden="true">
        <div className="rl-journey-stage">
          <ChalkScenes here={here} />
          <div className="rl-journey-shade" />
        </div>
      </div>

      <nav className="rl-journey-rail" aria-label="Stops on the journey">
        {RAIL.map((name, i) => (
          <button key={name} type="button" aria-current={here === i ? 'step' : undefined} aria-label={`Go to: ${name}`} onClick={() => api.current?.go(i)}>
            <span>{name}</span>
          </button>
        ))}
      </nav>

      <div className="rl-stop rl-stop-open">
        <div className="rl-stop-copy">
          <p className="text-sm uppercase tracking-[0.18em] text-accent font-medium">Radlor</p>
          <h1 className="font-display text-[2.6rem] sm:text-6xl leading-[1.05] mt-4 max-w-[30rem]">
            Learning software that adapts to the <span className="rl-lit">child</span> in front of it.
          </h1>
          <p className="mt-5 sm:mt-6 text-base sm:text-lg text-muted max-w-[30rem] leading-relaxed">
            Most educational apps give every child the same questions in the same order. We build the other kind:
            software that watches how a child answers and changes the next question because of it. Our first
            product, <strong className="text-foreground font-medium">{APP_NAME}</strong>, teaches math for grades 3 to 8.
          </p>
          <div className="mt-7 sm:mt-9 flex flex-wrap gap-3">
            <a href={`${APP_URL}/auth`} className="rl-cta rounded-full bg-accent px-6 py-3 text-on-accent font-medium hover:opacity-90">
              Try {APP_NAME}
            </a>
            <button type="button" onClick={() => api.current?.play(!playing)} className="rl-cta rl-cta-quiet rounded-full border border-line px-6 py-3 font-medium hover:border-foreground transition-colors">
              {playing ? 'Pause the journey' : '▶ Play the journey'}
            </button>
          </div>
          <Link href="/radlic" className="rl-link mt-5 inline-block text-sm text-accent">How it works →</Link>
          <p className="rl-journey-hint mt-8 text-xs uppercase tracking-[0.18em] text-muted">Scroll to begin</p>
        </div>
      </div>

      {STOPS.map(s => (
        <div key={s.eyebrow} className="rl-stop">
          <div className="rl-stop-copy">
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">{s.eyebrow}</p>
            <h2 className="font-display text-4xl sm:text-5xl leading-[1.06] mt-3 max-w-[34rem]">{s.title}</h2>
            {'body' in s && <p className="mt-3 text-base sm:text-lg text-muted max-w-[32rem]">{s.body}</p>}
            {'chips' in s && (
              <ul className="mt-4 flex flex-wrap gap-2 max-w-[34rem]">
                {s.chips.map(c => <li key={c} className="rl-journey-chip">{c}</li>)}
              </ul>
            )}
            {'links' in s && (
              <div className="mt-4 flex flex-wrap gap-5">
                {s.links.map(l => <Link key={l.href} href={l.href} className="rl-link text-accent font-medium">{l.label} →</Link>)}
              </div>
            )}
            {'cta' in s && (
              <div className="mt-5 flex flex-wrap gap-3">
                {s.cta.map(c => (
                  <a key={c.label} href={c.href} className={'quiet' in c
                    ? 'rl-cta rl-cta-quiet rounded-full border border-line px-6 py-3 font-medium hover:border-foreground transition-colors'
                    : 'rl-cta rounded-full bg-accent px-6 py-3 text-on-accent font-medium hover:opacity-90'}>
                    {c.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  )
}
