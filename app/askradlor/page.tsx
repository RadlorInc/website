/**
 * radlor.com/askradlor — the askRadlor landing page (founder, 2026-10-22: "same as /radlic"). The app stays on
 * askradlor.com; every button leads there. Static, no script of its own.
 *
 * ⚠️ EVERY CLAIM IS THE APP'S OWN LANDING PAGE, re-read from RadlorInc/whiteboard-ai `main` (src/app/page.tsx) on
 * 2026-10-22: the subjects, "ages 13 and over", "answers are written by AI and can be wrong", replays are free. When
 * that page changes, this one is stale until re-read. Price: "around 20¢ a video" (founder, 23 Oct 2026, see metadata). "First 20 videos free" is the
 * founder's statement (2026-10-22), not read from the app; the app's own landing page words its free allowance differently. ⚠️ NOT the Radlic "Ask maths" add-on: it is off pending legal
 * sign-off, and no page here may mention it until it is live.
 *
 * The demo is a real public askRadlor answer, screen-recorded on 2026-10-22 from Explore
 * (www.askradlor.com/v/Y_wDTn3Dg_55yToSwnH3_w, "what are the things present in the conducting system in the heart?",
 * founder's pick). Silent: the voice is made in the viewer's browser and a headless recording cannot carry it. Served
 * from this site so /privacy's "nothing from a third party" holds.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ASK_EXPLORE_URL, ASK_ID, ASK_NAME, ASK_URL, COMPANY, SITE_URL } from '@/site'
import s from './askradlor.module.css'

export const metadata: Metadata = {
  title: { absolute: `${ASK_NAME}: ask anything, watch the answer drawn` },
  // Price first (founder, 23 Oct 2026). "Around 20¢" on purpose, read off askradlor.com/pricing that day: Pro 17¢,
  // Plus 20¢, packs 20-25¢. If those prices move far from 20¢, this sentence and FACTS below change with them.
  description:
    'Your first 20 videos are free, then around 20¢ a video. Type a question and watch a short voiced video draw the answer step by step: biology, physics, chemistry, home and car fixes. Ages 13+.',
  alternates: { canonical: '/askradlor' },
  openGraph: { url: `${SITE_URL}/askradlor`, title: `${ASK_NAME}: ask anything, watch the answer drawn` },
}

function AppJsonLd() {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': ASK_ID,
    name: ASK_NAME,
    alternateName: [`${ASK_NAME} by ${COMPANY}`, 'askRadlor', 'Whiteboard AI'],
    // The app's own address: askradlor.com publishes the same @id with the same url (whiteboard-ai#53).
    url: ASK_URL,
    sameAs: [`${SITE_URL}/askradlor`],
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web browser',
    description: metadata.description,
    publisher: { '@id': `${SITE_URL}/#organization` },
  }
  return <script type="application/ld+json">{JSON.stringify(json)}</script>
}

const STEPS = [
  { title: 'Type a question', body: 'Biology, physics, chemistry, home improvements or auto repairs. One question per video works best.' },
  { title: 'Watch it drawn', body: 'A whiteboard lesson, voiced, step by step. Ask a follow-up in the same chat.' },
  { title: 'Replay any time', body: 'Your videos stay in your library. Watching again is free.' },
]

const FACTS = [
  'Your first 20 videos are free, then around 20¢ a video.',  // founder's wording, 2026-10-22 / 23 (price first)
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
          <video className={s.video} src="/askradlor-demo.mp4" poster="/askradlor-demo-poster.jpg" width={814} height={512}
            autoPlay muted loop playsInline controls preload="metadata"
            aria-label="An askRadlor answer about the heart's conducting system: a heart is drawn and the SA node, AV node, bundle of His, bundle branches and Purkinje fibres are labelled step by step" />
          <p className={s.demoNote}>A real answer from Explore: “What is in the heart’s conducting system?”</p>
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
