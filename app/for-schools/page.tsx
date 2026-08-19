import type { Metadata } from 'next'
import Link from 'next/link'
import { APP_NAME, SITE_URL, SUPPORT_EMAIL } from '@/site'

export const metadata: Metadata = {
  title: `${APP_NAME} for schools`,
  description:
    'Run AdaptiveLearn with a class: create a group, choose which chapters it sees, add children, and watch where each one actually is. Runs in a browser, needs no install, and the camera is always optional.',
  alternates: { canonical: '/for-schools' },
}

const FAQ = [
  {
    q: 'What do we need to install?',
    a: 'Nothing. It runs in any modern browser — Chrome, Safari or Edge — on a laptop, a Chromebook or a tablet. It can also be added to a tablet home screen, after which a chapter already opened will play without a connection.',
  },
  {
    q: 'Do the children need email addresses?',
    a: 'No. A teacher account holds the class, and each child is a learner inside it with a name. Children do not sign in with their own email and we do not ask them for one.',
  },
  {
    q: 'Does every child have to use the camera?',
    a: 'No. The camera chapters sit in the 9–11 band and every one of them can be answered by tapping instead. A child who declines the camera loses nothing — same chapter, same questions, same scoring. The hand tracking, when it is used, runs entirely on the device and nothing from the camera is uploaded.',
  },
  {
    q: 'Can we choose what the class works on?',
    a: 'Yes. When you create a group you pick the age band and the specific chapters it contains, so it can follow your scheme of work rather than ours.',
  },
  {
    q: 'How many children can we add?',
    a: 'There is no cap, and it is free during early access. We are small enough that we will set the first class up with you personally — which at this stage is faster than any form we could build.',
  },
]

export default function ForSchools() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-14">
        <p className="text-sm uppercase tracking-[0.18em] text-accent font-medium">For schools</p>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] mt-4 max-w-3xl">
          Thirty children, thirty different questions.
        </h1>
        <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">
          The hard part of teaching maths to a class is that they are not in the same place, and one
          worksheet cannot be in two places at once. {APP_NAME} gives each child the question they are
          actually ready for, and gives you one screen that says where each of them is.
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=AdaptiveLearn%20for%20our%20school`}
          className="mt-9 inline-block rounded-full bg-accent px-6 py-3 text-white font-medium hover:opacity-90 transition-opacity"
        >
          Talk to us about a class
        </a>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 border-t border-line">
        <h2 className="font-display text-3xl">Setting up a class</h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-4">
          {[
            ['Make a group', 'Pick the age band and tick the chapters it should contain — your sequence, not ours.'],
            ['Add the children', 'By name. No email address, no password for them to lose.'],
            ['They place themselves', 'A short check finds where each child actually is, rather than assuming the year group.'],
            ['You watch it move', 'One list: who is on what, who has stalled, who has run ahead.'],
          ].map(([h, p], i) => (
            <li key={h}>
              <span className="font-display text-3xl text-accent">{i + 1}</span>
              <h3 className="font-medium mt-2">{h}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{p}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 border-t border-line">
        <h2 className="font-display text-3xl">What it is good at, and what it is not</h2>
        <div className="mt-8 grid gap-10 sm:grid-cols-2 max-w-4xl">
          <div>
            <h3 className="font-medium text-lg">Good at</h3>
            <ul className="mt-4 space-y-3 text-muted leading-relaxed">
              <li>— Independent practice where every child is on the right question.</li>
              <li>— Finding the child who is quietly two years behind and has learned to hide it.</li>
              <li>— The bit before the maths: what a fraction, an angle or a decimal actually is.</li>
              <li>— Children who have decided they are bad at maths. Nothing on screen ever tells them so.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-lg">Not built for</h3>
            <ul className="mt-4 space-y-3 text-muted leading-relaxed">
              <li>— Replacing you. It is practice and teaching, not a curriculum you can hand over.</li>
              <li>— Exam drilling against a specific board's paper. It teaches the idea, not the format.</li>
              <li>— Homework you need marked and returned. Progress is visible; it does not generate reports.</li>
              <li>— Whole-class projection. Every screen is written for one child, close up.</li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-sm text-muted max-w-2xl">
          We would rather you knew that before a term starts than after. If the second column is what you
          need, say so and we will tell you honestly whether we are close.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 border-t border-line">
        <h2 className="font-display text-3xl">Questions schools ask</h2>
        <div className="mt-8">
          {FAQ.map(f => (
            <div key={f.q} className="border-t border-line py-6">
              <h3 className="font-medium text-lg">{f.q}</h3>
              <p className="mt-2 text-muted leading-relaxed max-w-2xl">{f.a}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-muted">
          Anything about children&rsquo;s data is answered on{' '}
          <Link href="/data-and-safety" className="text-accent hover:underline">
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
