import type { Metadata } from 'next'
import { SectionIcon } from '@/components/SectionIcon'
import { MiloPanel } from '@/components/MiloPanel'
import Link from 'next/link'
import { APP_NAME, SITE_URL, SUPPORT_EMAIL } from '@/site'

export const metadata: Metadata = {
  title: `${APP_NAME} for schools`,
  description:
    'Run AdaptiveLearn with a class: pick a grade and its modules, give each student a username, and set class exercises you unlock when you are ready. Runs in a browser and needs no install.',
  alternates: { canonical: '/for-schools' },
}

// ⚠️ REWRITTEN 2026-09-19 FROM THE APP'S `release` BRANCH (sw v205) — teacher classes shipped
// 2026-09-18 in RadlorInc/learn PRs #123–#128 (`src/features/classes/`, `src/core/classRoster.ts`).
// The old page described groups by age band, children added by name with no password, and a
// placement check — none of which the app does now. It deliberately says nothing about which
// teacher features are free and which are paid: every price is off this site (founder's call).
const FAQ = [
  {
    q: 'What do we need to install?',
    a: 'Nothing. It runs in any modern browser — Chrome, Safari or Edge — on a laptop, a Chromebook or a tablet.',
  },
  {
    q: 'Do the students need email addresses?',
    a: 'No. Each student signs in with a username and a password. Add them one at a time or upload a list of usernames; each gets a temporary password, shown once for you to print or hand out, and they choose their own the first time they sign in.',
  },
  {
    q: 'Can we choose what the class works on?',
    a: 'Yes. A class has a grade, from 3 to 8, and you choose which of that grade’s modules it contains, so it can follow your scheme of work rather than ours.',
  },
  {
    q: 'How do class exercises work?',
    a: 'You set the level and the number of questions, and every student gets the same questions. An exercise stays locked until you open it for the class. Results show each student’s first attempt, and how each question went across the class.',
  },
  {
    q: 'How do we get started?',
    a: 'Write to us. We set the first class up with you personally.',
  },
]

export default function ForSchools() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        {/* Decorative, `aria-hidden`, behind the text — a screen reader gets the copy alone. */}
        <div className="rl-lightfield" aria-hidden="true">
          <div className="rl-glow rl-parallax" style={{ '--p': '32px' } as React.CSSProperties} />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-14">
        <p className="rl-rise text-sm uppercase tracking-[0.18em] text-accent font-medium">For schools</p>
        <h1 className="rl-focus font-display text-5xl sm:text-6xl leading-[1.05] mt-4 max-w-3xl" style={{ '--d': '0.09s' } as React.CSSProperties}>
          A classroom doesn&rsquo;t have to mean every student gets the{' '}
          <span className="rl-lit" style={{ '--lit': 0.62 } as React.CSSProperties}>same</span> questions.
        </h1>
        <p className="rl-rise mt-6 text-lg text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.18s' } as React.CSSProperties}>
          {APP_NAME} is designed to meet students where they are, adjusting the learning experience as
          they work.
        </p>
        <p className="rl-rise mt-5 text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.22s' } as React.CSSProperties}>
          We&rsquo;re currently working with schools to shape the best way to bring {APP_NAME} into the
          classroom. Because every school and classroom is different, for our first schools we&rsquo;ll
          work with you directly to set up your class,
          understand your needs, and make sure {APP_NAME} is working for your students.
        </p>
        <p className="rl-rise mt-6 text-lg max-w-2xl" style={{ '--d': '0.25s' } as React.CSSProperties}>
          Interested in bringing {APP_NAME} to your school?
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=AdaptiveLearn%20for%20our%20school`}
          className="rl-rise rl-cta mt-9 inline-block rounded-full bg-accent px-6 py-3 text-on-accent font-medium hover:opacity-90"
          style={{ '--d': '0.27s' } as React.CSSProperties}
        >
          Talk to us about a class
        </a>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-2">
        {/* Copy restates this page's own h1 — "a classroom doesn't have to mean every student gets
            the same questions". A decorative band must not be where a claim first appears. */}
        <MiloPanel src="/milo-schools.webp" width={760} height={522}>
          <p className="text-lg">
            The class works on the same modules, and each student&rsquo;s practice moves with how they
            answer.
          </p>
        </MiloPanel>
      </section>

      <div className="mx-auto max-w-5xl px-6"><div className="rl-rule" /></div>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <SectionIcon src="/ico-grid.webp" />
        <h2 className="rl-reveal-focus font-display text-3xl">Setting up a class</h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-4">
          {[
            ['Make a class', 'Pick its grade, 3 to 8, and choose the modules it should contain — your sequence, not ours.'],
            ['Add the students', 'One at a time, or upload a list of usernames. Each gets a temporary password; no email address.'],
            ['Set an exercise', 'The same questions for everyone, locked until you open it in class.'],
            ['See the results', 'Each student’s first attempt, and which questions the class found hard.'],
          ].map(([h, p], i) => (
            <li key={h} className="rl-reveal" style={{ '--i': i + 1 } as React.CSSProperties}>
              <span className="rl-num font-display text-3xl text-accent" style={{ '--i': i + 1 } as React.CSSProperties}>{i + 1}</span>
              <div className="rl-tick mt-2 mb-3" style={{ '--i': i + 1 } as React.CSSProperties} aria-hidden="true" />
              <h3 className="font-medium">{h}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{p}</p>
            </li>
          ))}
        </ol>

      </section>

      <div className="mx-auto max-w-5xl px-6"><div className="rl-rule" /></div>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <SectionIcon src="/ico-scale.webp" />
        <h2 className="rl-reveal-focus font-display text-3xl">What it is good at, and what it is not</h2>
        <div className="mt-8 grid gap-10 sm:grid-cols-2 max-w-4xl">
          <div className="rl-reveal" style={{ '--i': 1 } as React.CSSProperties}>
            <h3 className="font-medium text-lg">Good at</h3>
            <ul className="mt-4 space-y-3 text-muted leading-relaxed">
              <li>— Independent practice where every child is on the right question.</li>
              <li>— The bit before the math: what a fraction, an angle or a decimal actually is.</li>
              <li>— Children who have decided they are bad at math. Nothing on screen ever tells them so.</li>
            </ul>
          </div>
          <div className="rl-reveal" style={{ '--i': 2 } as React.CSSProperties}>
            <h3 className="font-medium text-lg">Not built for</h3>
            <ul className="mt-4 space-y-3 text-muted leading-relaxed">
              <li>— Replacing you. It is practice and teaching, not a curriculum you can hand over.</li>
              <li>— Exam drilling against a specific board&rsquo;s paper. It teaches the idea, not the format.</li>
              <li>— Proctored tests. An exercise result is what the student&rsquo;s own device reports.</li>
              <li>— Whole-class projection. Every screen is written for one child, close up.</li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-sm text-muted max-w-2xl">
          We would rather you knew that before a term starts than after. If the second column is what you
          need, say so and we will tell you honestly whether we are close.
        </p>
      </section>

      <div className="mx-auto max-w-5xl px-6"><div className="rl-rule" /></div>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <SectionIcon src="/ico-bubble.webp" />
        <h2 className="rl-reveal-focus font-display text-3xl">Questions schools ask</h2>
        <div className="mt-8">
          {FAQ.map((f, i) => (
            <div key={f.q} className="rl-block rl-reveal border-t border-line py-6" style={{ '--i': i + 1 } as React.CSSProperties}>
              <h3 className="font-medium text-lg">{f.q}</h3>
              <p className="mt-2 text-muted leading-relaxed max-w-2xl">{f.a}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-muted">
          Anything about children&rsquo;s data is answered on{' '}
          <Link href="/data-and-safety" className="rl-link text-accent">
            data and safety
          </Link>
          .
        </p>
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
