'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { APP_NAME, APP_URL } from '@/site'

/**
 * THE HOME PAGE'S FIRST SCREEN IS A JOURNEY (founder's call, 2026-09-25): six stops, each with one picture that
 * draws what its words say, and each flick of the scroll carries the reader to the next one and stops there.
 *
 * ⚠️ THE WORDS ARE THE PAGE, THE PICTURES ARE DECORATION (`alt=""`, inside an `aria-hidden` stage). Every stop is
 * ordinary server-rendered HTML, so a crawler, an answer engine and a screen reader get the full copy on the first byte.
 * The pictures are flat 2D illustrations, one per stop (see `ART`). They replaced a three.js low-poly world on
 * 2026-09-29 (founder).
 *
 * ⚠️ THE SCROLL POSITION IS THE ONE SOURCE OF TRUTH. Each stop is one screen tall; the picture shown follows where the page is.
 * A gesture does not move the picture, it animates the PAGE to the next stop — so the scrollbar, keys, Back and
 * "find in page" all keep working, and nothing can disagree with what the reader sees.
 *
 * Why one flick = one stop: on a free scroll the reader had to land precisely on each topic (founder, 2026-09-25:
 * "they scroll, they reach the next thing"). A trackpad keeps firing wheel events for a second after the finger
 * lifts; a new gesture is told from that tail because it speeds up (see onWheel).
 *
 * The previous scroll-linked hero (a 180-frame flip-book, deleted in 1d4cfae) failed on smoothness and on phone
 * contrast. The copy sits on its own shade, never over a picture.
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
    body: 'Grades K–8. Every answer shapes the next question.',
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
// One picture per rail stop, each drawing its own words: a boy whose lesson shapes itself around him; a treasure
// that lights up; four rules being built; steps of maths that fit the child; families, schools and partners
// together; an idea still growing. Flat 2D illustrations on transparent ground (generated 2026-09-29, founder's
// brief: no metallic renders, no women or girls, full-length trousers).
const ART = [
  { src: '/journey-adapts.webp', w: 576, h: 789 },
  { src: '/journey-treasure.webp', w: 835, h: 701 },
  { src: '/journey-rules.webp', w: 829, h: 802 },
  { src: '/journey-steps.webp', w: 850, h: 806 },
  { src: '/journey-together.webp', w: 868, h: 850 },
  { src: '/journey-next.webp', w: 638, h: 538 },
]

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
    let anim = 0, animating = false, lastWheel = 0, peak = 0, low = 0, slowing = false, playTimer = 0, isPlaying = false
    const easeIO = (k: number) => -(Math.cos(Math.PI * k) - 1) / 2
    function go(i: number) {
      i = Math.max(0, Math.min(LAST, i))
      const from = scrollY, to = top + i * vh
      cancelAnimationFrame(anim)
      if (reduce || Math.abs(to - from) < 1) { scrollTo({ top: to, behavior: 'instant' }); animating = false; return }
      const dur = 1000 + 600 * Math.min(3, Math.abs(to - from) / vh), t0 = performance.now()
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

    // A NEW SWIPE IS ONE THAT CLEARLY SPEEDS UP AGAIN. A trackpad keeps sending a decaying tail of wheel events for a
    // second or two after the fingers lift. Waiting for a silent gap alone dropped light swipes made inside that tail
    // ("it only changes with a hard swipe"); reacting to any small rise made one swipe skip stops ("too loose", both
    // founder, 2026-09-29). So: once the stream has fallen well below its peak, a swipe is new only when it climbs to
    // three times the lowest point of that tail (and at least 6 more). Swipes during a move are ignored, never queued.
    const onWheel = (e: WheelEvent) => {
      const now = performance.now(), abs = Math.abs(e.deltaY)
      const fresh = now - lastWheel > 180 || (slowing && abs >= Math.max(low * 3, low + 6))
      if (fresh) { peak = low = abs; slowing = false }
      else { peak = Math.max(peak, abs); low = Math.min(low, abs); if (abs < peak * 0.7) slowing = true }
      lastWheel = now
      if (!inJourney() || e.ctrlKey) return  // ctrl+wheel is a pinch-zoom
      const dir = Math.sign(e.deltaY); if (!dir || (!animating && passes(dir))) return
      e.preventDefault(); stopPlaying()
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
      if (Math.abs(dy) > 32 && !animating && !passes(Math.sign(dy))) { stopPlaying(); step(Math.sign(dy)) }
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
    <section ref={root} className="rl-journey rl-dark" aria-label="The Radlor journey">
      <div className="rl-journey-track" aria-hidden="true">
        <div className="rl-journey-stage">
          {ART.map((p, i) => (
            <div key={p.src} className="rl-journey-art" data-on={here === i || undefined}>
              <Image src={p.src} alt="" width={p.w} height={p.h} priority={i === 0} sizes="(max-width: 760px) 82vw, 44vw" />
            </div>
          ))}
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
            product, <strong className="text-foreground font-medium">{APP_NAME}</strong>, teaches math for kindergarten through grade 8.
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
