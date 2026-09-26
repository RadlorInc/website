import type { Metadata } from 'next'
import { SectionIcon } from '@/components/SectionIcon'
import { MiloPanel } from '@/components/MiloPanel'
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
          classroom. Classroom accounts are paused while we build a way for a school to give consent for
          its students, so for now the best step is to write to us: we&rsquo;ll listen to what you need
          and tell you when they open.
        </p>
        <p className="rl-rise mt-6 text-lg max-w-2xl" style={{ '--d': '0.25s' } as React.CSSProperties}>
          Interested in bringing {APP_NAME} to your school?
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=Radlic%20for%20our%20school`}
          className="rl-rise rl-cta mt-9 inline-block rounded-full bg-accent px-6 py-3 text-on-accent font-medium hover:opacity-90"
          style={{ '--d': '0.27s' } as React.CSSProperties}
        >
          Talk to us
        </a>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-2">
        {/* Copy restates this page's own h1 — "a classroom doesn't have to mean every student gets
            the same questions". A decorative band must not be where a claim first appears. */}
        <MiloPanel src="/milo-schools.webp" width={760} height={522}>
          <p className="text-lg">
            Each child&rsquo;s practice moves with how they answer.
          </p>
        </MiloPanel>
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
