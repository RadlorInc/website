import type { Metadata } from 'next'
import { PathRows, type PathRow } from '@/components/scroll/Scroll'
import { PageHero } from '@/components/scroll/PageHero'
import { ART } from '@/components/scroll/art'
import Link from 'next/link'
import { APP_NAME, SITE_URL, SUPPORT_EMAIL } from '@/site'

export const metadata: Metadata = {
  title: `${APP_NAME} for schools`,
  description:
    'Radlic for schools: classroom accounts are paused while we build a way for a school to give consent for its students. Write to us and we will tell you when they open.',
  alternates: { canonical: '/for-schools' },
}

// ⚠️ 2026-09-26 (founder, N21): teachers adding students is PAUSED until a school-consent route exists, so this page
// no longer describes setting up a class, student logins or class exercises. The 2026-09-19 version (written from
// the app's `release` branch, PRs #123–#128) is in git history — restore it when classroom accounts reopen.
// `npm run check:site-claims` fails if a teacher-roster claim comes back while it is paused.
const FAQ = [
  {
    q: 'What do we need to install?',
    a: 'Nothing. It runs in any modern browser — Chrome, Safari or Edge — on a laptop, a Chromebook or a tablet.',
  },
  {
    q: 'How do we get started?',
    a: 'Write to us. Classroom accounts are paused while we build a way for a school to give consent for its students; we will tell you when they open.',
  },
]

// One picture and one short line per point, joined by a drawn path (scroll style G) under a circle-reveal top (F)
// (founder, 2026-09-29). The page's full wording for "not built for" stays under "Read the details", so nothing it
// promised a school is lost; FAQ above still feeds the FAQPage JSON-LD word for word.
const ROWS: PathRow[] = [
  { ...ART.schoolsPractice, title: 'Every child on the right question', body: 'Independent practice that moves with how each child answers.' },
  { ...ART.schoolsIdeas, title: 'The idea before the math', body: 'What a fraction, an angle or a decimal actually is.' },
  { ...ART.schoolsConfidence, title: 'For children who think they are bad at math', body: 'Nothing on screen ever tells them so.' },
  {
    ...ART.schoolsTeacher, title: 'Not built to replace you',
    body: 'Practice and teaching, not a curriculum. Not for exam drilling, proctored tests or whole-class projection.',
    more: (
      <>
        <ul>
          <li>Replacing you. It is practice and teaching, not a curriculum you can hand over.</li>
          <li>Exam drilling against a specific board&rsquo;s paper. It teaches the idea, not the format.</li>
          <li>Proctored tests. An exercise result is what the student&rsquo;s own device reports.</li>
          <li>Whole-class projection. Every screen is written for one child, close up.</li>
        </ul>
        <p>If that is what you need, say so and we will tell you honestly whether we are close.</p>
      </>
    ),
  },
  { ...ART.schoolsDevices, title: FAQ[0].q, body: FAQ[0].a },
  {
    ...ART.schoolsWrite, title: FAQ[1].q,
    body: <>{FAQ[1].a} Anything about children&rsquo;s data: <Link href="/data-and-safety" className="rl-link text-accent">data and safety</Link>.</>,
  },
]

export default function ForSchools() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="relative z-10 mx-auto max-w-5xl px-6 pb-20">
          <PageHero
            eyebrow="For schools"
            title={<>A classroom doesn&rsquo;t have to mean the <span className="rl-lit" style={{ '--lit': 0.62 } as React.CSSProperties}>same</span> questions.</>}
            line={`${APP_NAME} meets each student where they are. Classroom accounts are paused while we build a way for a school to give consent.`}
            pic={ART.schoolsHero}
          >
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=Radlic%20for%20our%20school`}
              className="rl-cta mt-8 inline-block rounded-full bg-accent px-6 py-3 text-on-accent font-medium hover:opacity-90"
            >
              Talk to us
            </a>
          </PageHero>
          <PathRows rows={ROWS} />
        </div>
      </section>

      <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            '@id': `${SITE_URL}/for-schools#faq`,
            mainEntity: FAQ.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          })}</script>
    </>
  )
}
