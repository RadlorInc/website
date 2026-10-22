/**
 * radlor.com/askradlor — the askRadlor landing page (founder, 2026-10-22: "same as /radlic"). The app stays on
 * askradlor.com; every button leads there. Static, no script of its own.
 *
 * ⚠️ EVERY CLAIM IS THE APP'S OWN LANDING PAGE, re-read from RadlorInc/whiteboard-ai `main` (src/app/page.tsx) on
 * 2026-10-22: the subjects, "ages 13 and over", "answers are written by AI and can be wrong", replays are free. When
 * that page changes, this one is stale until re-read. No price (no page on this site states one) and no free-video
 * count (it is a setting in the app's database). ⚠️ NOT the Radlic "Ask maths" add-on: it is off pending legal
 * sign-off, and no page here may mention it until it is live.
 *
 * The demo is a real askRadlor answer recorded from the app (whiteboard-ai reports/bio-demos/
 * realistic-what-is-a-food-chain.mp4), served from this site so /privacy's "nothing from a third party" holds.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ASK_EXPLORE_URL, ASK_ID, ASK_NAME, ASK_URL, COMPANY, SITE_URL } from '@/site'
import s from './askradlor.module.css'

export const metadata: Metadata = {
  title: { absolute: 'askRadlor — ask anything, watch the answer drawn' },
  description:
    'Type a question and get a short voiced video that draws the answer step by step on a whiteboard. Biology, physics, chemistry, and home or car fixes. For ages 13 and over.',
  alternates: { canonical: '/askradlor' },
  openGraph: { url: `${SITE_URL}/askradlor`, title: 'askRadlor — ask anything, watch the answer drawn' },
}

function AppJsonLd() {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': ASK_ID,
    name: ASK_NAME,
    alternateName: [`${ASK_NAME} by ${COMPANY}`, 'Whiteboard AI'],
    url: `${SITE_URL}/askradlor`,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web browser',
    description: metadata.description,
    publisher: { '@id': `${SITE_URL}/#organization` },
  }
  return <script type="application/ld+json">{JSON.stringify(json)}</script>
}

const STEPS = [
  { title: 'Type a question', body: 'Biology, physics, chemistry, or a home or car fix. One question per video works best.' },
  { title: 'Watch it drawn', body: 'A whiteboard lesson, voiced, step by step. Ask a follow-up in the same chat.' },
  { title: 'Replay any time', body: 'Your videos stay in your library. Watching again is free.' },
]

const FACTS = [
  'Free videos every month. A video that fails is never counted.',
  'Replaying your own videos is free.',
  'For ages 13 and over.',
  'Answers are written by AI and can be wrong.',
]

const Check = () => (
  <svg className={s.check} viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function AskRadlorPage() {
  return (
    <main className={s.page}>
      <nav className={s.nav} aria-label={ASK_NAME}>
        <span className={s.brand}>{ASK_NAME}</span>
        <a href={ASK_EXPLORE_URL} className={s.navLink}>Explore</a>
        <a href={`${ASK_URL}/signin`} className={s.navLink}>Sign in</a>
      </nav>

      <section className={s.hero}>
        <div className={s.heroText}>
          <Image src="/askradlor-logo.png" alt="" width={170} height={115} className={s.logo} priority />
          <p className={s.eyebrow}>Any question · Ages 13+</p>
          <h1 className={s.h1}>Ask anything. Watch it drawn.</h1>
          <p className={s.lead}>
            Type a question and get a short voiced video that draws the answer step by step, like a teacher at a
            whiteboard.
          </p>
          <div className={s.ctaRow}>
            <a href={`${ASK_URL}/signup`} className={s.cta}>Get started</a>
            <a href={ASK_EXPLORE_URL} className={s.ctaGhost}>See videos people made</a>
          </div>
          <p className={s.note}>Explore needs no account.</p>
        </div>
        <div className={s.heroDemo}>
          <video className={s.video} src="/askradlor-demo.mp4" poster="/askradlor-demo-poster.jpg" width={960} height={640}
            autoPlay muted loop playsInline controls preload="metadata"
            aria-label="An askRadlor answer to “What is a food chain?”: grass, grasshopper, lizard and crow are drawn and joined by arrows while a voice explains each step" />
          <p className={s.demoNote}>A real answer: “What is a food chain?” Unmute for the voice.</p>
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.h2}>How it works</h2>
        <ol className={s.steps}>
          {STEPS.map((t, i) => (
            <li key={t.title} className={s.card}>
              <span className={s.num}>{i + 1}</span>
              <h3 className={s.h3}>{t.title}</h3>
              <p>{t.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.section}>
        <h2 className={s.h2}>Good to know</h2>
        <ul className={s.list}>
          {FACTS.map(t => <li key={t}><Check />{t}</li>)}
        </ul>
      </section>

      <section className={s.final}>
        <h2 className={s.h2}>What do you want to understand today?</h2>
        <div className={s.ctaRow}>
          <a href={`${ASK_URL}/signup`} className={s.cta}>Get started</a>
          <a href={ASK_EXPLORE_URL} className={s.ctaGhost}>Explore videos</a>
        </div>
      </section>

      {/* The APP's legal pages — they govern an account. This site's own /privacy and /terms cover only these pages. */}
      <footer className={s.foot} aria-label={`${ASK_NAME} legal`}>
        <a href={`${ASK_URL}/legal/privacy`}>{ASK_NAME} Privacy Policy</a>
        <a href={`${ASK_URL}/legal/terms`}>{ASK_NAME} Terms</a>
        <a href={`${ASK_URL}/help`}>Help</a>
        <Link href="/" className={s.maker}>{ASK_NAME} is made by {COMPANY}</Link>
      </footer>
      <AppJsonLd />
    </main>
  )
}
