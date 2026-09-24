/**
 * radlor.com/radlic — the Radlic landing page (founder's decision 2026-09-25: the landing lives here, the app stays on
 * radlic.com, and a signed-out visitor to radlic.com/ is sent here). Static; the only script is the demo player,
 * and it is this site's own. Every button leads to the app on radlic.com.
 *
 * ⚠️ PORTED FROM THE APP'S LANDING REDESIGN (RadlorInc/learn #223) — keep the claims TRUE to the app: the grades line
 * is the founder's wording ("Grade KG to 8"; lessons exist for 3 to 8 as of 2026-09-25, KG to 2 to follow), the rest
 * is the app's /help in short. The two chalkboards are real lesson screens: content/radlic-demo.json.
 */
import type { Metadata } from 'next'
import { COMPANY, SITE_URL } from '@/site'
import demos from '@/content/radlic-demo.json'
import LessonDemo, { type Demo } from './LessonDemo'
import s from './radlic.module.css'

/** The app. It keeps its own origin; nothing of it is served from radlor.com. */
const RADLIC = 'https://radlic.com'
/**
 * The app's entity id — the SAME string the app's own site.ts declares as APP_ID. ⚠️ `APP_ID` in this repo's site.ts
 * still names the pre-rename domain (RENAME-MANUAL §D, a founder step); until it is updated the two ids disagree and
 * /adaptivelearn and this page describe the product under two ids.
 */
const RADLIC_APP_ID = `${RADLIC}/#app`

export const metadata: Metadata = {
  title: { absolute: 'Radlic — math lessons that adapt to your child, grade KG to 8' },
  description:
    'Math for grade KG to 8. Each lesson explains one idea step by step, the way a teacher would at the board, then practice adapts to what your child gets right and wrong. For parents and teachers.',
  alternates: { canonical: '/radlic' },
  openGraph: { url: `${SITE_URL}/radlic`, title: 'Radlic — math lessons that adapt to your child' },
}

function AppJsonLd() {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': RADLIC_APP_ID,
    name: 'Radlic',
    alternateName: `Radlic by ${COMPANY}`,
    url: `${SITE_URL}/radlic`,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web browser',
    description: metadata.description,
    publisher: { '@id': `${SITE_URL}/#organization` },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }
  return <script type="application/ld+json">{JSON.stringify(json)}</script>
}

const STEPS: { h: string; p: string }[] = [
  { h: 'Watch', p: 'Each lesson explains one idea step by step, the way a good teacher would at the board. A voice reads every line as the chalk goes up.' },
  { h: 'Practice', p: 'Two right answers in a row bring a different, harder kind of question — from a picture to bare numbers to a word problem. A miss brings the worked steps and an easier kind.' },
  { h: 'Review', p: 'Topics they found hard come back later for review, so nothing slips away quietly.' },
]

const AUDIENCE: { h: string; items: string[] }[] = [
  {
    h: 'For parents',
    items: [
      'Pick whole modules or single topics, from any grade from KG to 8',
      'Add a due date if you like',
      'See which lessons they finished and what they find hard',
      'Children earn points by practicing and spend them on game time, up to a daily limit you set',
    ],
  },
  {
    h: 'For teachers',
    items: [
      'Set up a class with usernames and temporary passwords',
      'Choose the modules for the whole class',
      'Give class exercises, and see results per student and per question',
    ],
  },
]

const Check = () => (
  <svg className={s.check} viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function RadlicPage() {
  return (
    <main className={s.page}>
      <nav className={s.nav} aria-label="Radlic">
        <span className={s.brand}>Radlic</span>
        <a href={`${RADLIC}/help`} className={s.navLink}>Help</a>
        <a href={`${RADLIC}/auth`} className={s.navLink}>Log in</a>
      </nav>

      <section className={s.hero}>
        <div className={s.heroText}>
          <p className={s.eyebrow}>Math · Grade KG to 8</p>
          <h1 className={s.h1}>Math lessons that adapt to your child</h1>
          <p className={s.lead}>
            A teacher at the board, one idea at a time. Then practice that follows what your child gets right
            and wrong, and brings back what they found hard. For parents and teachers.
          </p>
          <div className={s.ctaRow}>
            <a href={`${RADLIC}/auth`} className={s.cta}>Sign up free</a>
            <a href="#how" className={s.ctaGhost}>How it works</a>
          </div>
        </div>
        <div className={s.heroDemo}>
          <LessonDemo demos={demos as Demo[]} />
          <p className={s.demoNote}>Two real lesson screens, exactly as a child sees them.</p>
        </div>
      </section>

      <section id="how" className={s.section}>
        <h2 className={s.h2}>How a lesson works</h2>
        <ol className={s.steps}>
          {STEPS.map(({ h, p }, k) => (
            <li key={h} className={s.step}>
              <span className={s.stepN}>{k + 1}</span>
              <h3 className={s.h3}>{h}</h3>
              <p>{p}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.calm}>
        <h2 className={s.h2}>Nothing to be scared of</h2>
        <p>
          No timer, and no red cross anywhere. Your child never sees a level. A wrong answer gets another go,
          then the worked steps — never a mark.
        </p>
      </section>

      <section className={s.section}>
        <h2 className={s.h2}>You choose what they learn</h2>
        <div className={s.cards}>
          {AUDIENCE.map(({ h, items }) => (
            <div key={h} className={s.card}>
              <h3 className={s.h3}>{h}</h3>
              <ul className={s.list}>
                {items.map(t => <li key={t}><Check />{t}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className={s.small}>
          If the connection drops during a lesson, their answers are kept on the device and sent when it is back.
        </p>
      </section>

      <section className={s.final}>
        <h2 className={s.h2}>Start with one lesson tonight</h2>
        <a href={`${RADLIC}/auth`} className={s.cta}>Sign up free</a>
      </section>

      {/* The APP's legal pages — they govern an account and a child's data. This site's own /privacy and /terms are
          in the footer below and cover only these pages. */}
      <footer className={s.foot} aria-label="Radlic legal">
        <a href={`${RADLIC}/legal/privacy`}>Radlic Privacy Policy</a>
        <a href={`${RADLIC}/legal/terms`}>Radlic Terms</a>
        <a href={`${RADLIC}/legal/parent-rights`}>Parent rights</a>
      </footer>
      <AppJsonLd />
    </main>
  )
}
