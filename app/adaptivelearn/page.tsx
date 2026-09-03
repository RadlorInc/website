import type { Metadata } from 'next'
import Link from 'next/link'
import { AGE_BANDS, APP_ID, APP_NAME, APP_URL, COMPANY, PLANS, PRICING, SITE_URL, usd } from '@/site'

export const metadata: Metadata = {
  title: `${APP_NAME} — adaptive math for ages 3 to 18`,
  description:
    'AdaptiveLearn places a child with a short check, then teaches math through story chapters whose difficulty moves question by question. Younger bands answer by holding fingers up to the camera; hand tracking runs entirely on the device.',
  alternates: { canonical: '/adaptivelearn' },
}

// Ages come from AGE_BANDS in site.ts — the same list the waitlist form offers — so a band
// cannot exist on one page and be missing from the other. Only the world and syllabus live here.
const BANDS = AGE_BANDS.map((b, i) => ({
  age: b.label,
  ...[
    { world: 'Story worlds', what: 'Counting, number recognition, number order, comparing quantities, early addition and subtraction, and measurement.' },
    { world: 'Story worlds', what: 'Addition and subtraction to 100, place value, telling time, shapes, patterns, and fractions through sharing.' },
    { world: 'Interactive math', what: 'Decimals, factors and multiples, fractions, unit conversion, angles, symmetry, area and perimeter, data, and graphs.' },
    { world: 'Field lab', what: 'Ratios and proportions, negative numbers, linear equations, coordinate geometry, probability, and statistics.' },
    { world: 'Design studio', what: 'Algebra, geometry, functions, quadratics, similarity, trigonometry, and proof.' },
    { world: 'Math studio', what: 'Algebra II, pre-calculus, statistics, and an introduction to calculus.' },
  ][i],
}))

const FAQ: { q: string; a: string; href?: string; hrefLabel?: string }[] = [
  {
    q: 'What age is AdaptiveLearn for?',
    a: `${APP_NAME} is designed for children ages 3–18, with different learning experiences built around each age group.`,
  },
  {
    q: 'How does AdaptiveLearn know what to teach my child?',
    a: `${APP_NAME} starts with a short placement check to understand what your child already knows. From there, the learning experience adapts as they answer and learn.`,
  },
  {
    q: 'Does my child need to use the camera?',
    a: 'No. Camera-based interactions are optional. Chapters that use hand gestures can also be completed using taps.',
  },
  {
    q: 'Does the camera record my child?',
    a: 'No. Hand tracking is designed to run directly on the child’s device. Camera images and hand-position data are not uploaded or stored.',
  },
  {
    q: 'How is AdaptiveLearn different from other math apps?',
    a: `Instead of giving every child the same questions in the same order, ${APP_NAME} adjusts the learning experience based on what each child actually knows and how they respond.`,
  },
  {
    // ⚠️ NOT ONE PRICE IS TYPED HERE. Every figure comes from PRICING in site.ts, so this answer,
    // the /pricing table and the JSON-LD offers cannot disagree.
    q: 'How much does AdaptiveLearn cost?',
    a: `${APP_NAME} is ${usd(PRICING.monthly.first)}/month for the first child and ${usd(PRICING.monthly.additional)}/month for each additional child, with up to ${PRICING.maxChildren} children on one family plan.`,
    href: '/pricing',
    hrefLabel: 'See pricing →',
  },
  {
    q: 'When can I try AdaptiveLearn?',
    a: `${APP_NAME} is currently being tested with a small group of families. Join the waitlist to be notified when more families are invited.`,
    href: '/waitlist',
    hrefLabel: 'Join the waitlist →',
  },
  // ⚠️ THE TWO BELOW ARE NOT IN MALAIKA'S LIST AND ARE KEPT ON PURPOSE. The rename answer is the
  // only place on the site that connects "Milo" to AdaptiveLearn, and families who used Milo still
  // search for it; the offline answer is a real question from a parent on a train. Delete them
  // only as a deliberate decision, not as tidying.
  {
    q: 'Does it work offline?',
    a: 'Yes, once it has loaded. The app installs to the home screen and caches itself, so a chapter already opened will play without a connection. Progress syncs when the device is back online.',
  },
  {
    q: 'Was AdaptiveLearn called something else before?',
    a: `Yes — it was called Milo until August 2026. Milo is still there: he is the pony who walks through the story chapters and does the explaining. The app around him is ${APP_NAME}, made by ${COMPANY}.`,
  },
]

function Q({ q, a, href, hrefLabel, i }: { q: string; a: string; href?: string; hrefLabel?: string; i: number }) {
  return (
    <div className="rl-block rl-reveal border-t border-line py-6" style={{ '--i': i } as React.CSSProperties}>
      <h3 className="font-medium text-lg">{q}</h3>
      <p className="mt-2 text-muted leading-relaxed max-w-2xl">{a}</p>
      {href && hrefLabel && (
        <Link href={href} className="rl-link mt-3 inline-block text-sm text-accent">
          {hrefLabel}
        </Link>
      )}
    </div>
  )
}

export default function AdaptiveLearn() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        {/* Decorative, `aria-hidden`, behind the text — a screen reader gets the copy alone. */}
        <div className="rl-lightfield" aria-hidden="true">
          <div className="rl-glow rl-parallax" style={{ '--p': '32px' } as React.CSSProperties} />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-14">
        <p className="rl-rise text-sm uppercase tracking-[0.18em] text-accent font-medium">A {COMPANY} product</p>
        <h1 className="rl-focus font-display text-5xl sm:text-6xl leading-[1.05] mt-4 max-w-3xl" style={{ '--d': '0.09s' } as React.CSSProperties}>
          {APP_NAME}: math that <span className="rl-lit" style={{ '--lit': 0.62 } as React.CSSProperties}>changes</span> as your child answers.
        </h1>
        <p className="rl-rise mt-6 text-lg text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.18s' } as React.CSSProperties}>
          Every child starts somewhere different. {APP_NAME} finds where your child is, then adjusts each
          question as they learn.
        </p>
        <p className="rl-rise mt-5 font-display text-2xl max-w-2xl" style={{ '--d': '0.22s' } as React.CSSProperties}>
          Real math. Real thinking. No guessing.
        </p>
        <p className="rl-rise mt-6 text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.26s' } as React.CSSProperties}>
          <strong className="text-foreground font-medium">
            {APP_NAME} is currently being tested with a small group of families.
          </strong>{' '}
          Join the waitlist to be among the first to try it.
        </p>
        <Link
          href="/waitlist"
          className="rl-rise rl-cta mt-9 inline-block rounded-full bg-accent px-6 py-3 text-on-accent font-medium hover:opacity-90"
          style={{ '--d': '0.27s' } as React.CSSProperties}
        >
          Join the waitlist
        </Link>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6"><div className="rl-rule" /></div>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="rl-reveal-focus font-display text-3xl">How a chapter works</h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-4">
          {[
            ['Intro', 'Meet the characters, the world, and the problem to solve.'],
            ['Demo', 'See the math worked out step by step, with each part brought to life.'],
            ['Your turn', 'Try one yourself, with guidance still available.'],
            ['Practice', 'Ten scored rounds. As your child improves, the questions adjust and the help gradually fades.'],
          ].map(([h, p], i) => (
            <li key={h} className="rl-reveal" style={{ '--i': i + 1 } as React.CSSProperties}>
              <span className="rl-num font-display text-3xl text-accent" style={{ '--i': i + 1 } as React.CSSProperties}>{i + 1}</span>
              <div className="rl-tick mt-2 mb-3" style={{ '--i': i + 1 } as React.CSSProperties} aria-hidden="true" />
              <h3 className="font-medium">{h}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{p}</p>
            </li>
          ))}
        </ol>

        {/*
          The claim this page is built on, drawn instead of asserted: difficulty
          moving question by question, three right raising it and a wrong one
          stepping it back. Decorative and `aria-hidden` — the sentence under it
          carries the same information in text, which is what a crawler and an
          answer engine read.
        */}
        <figure className="mt-14">
          <svg viewBox="0 0 640 160" className="w-full h-auto max-w-3xl" role="presentation" aria-hidden="true">
            <line x1="40" y1="140" x2="600" y2="140" stroke="var(--line)" strokeWidth="1" />
            <line x1="40" y1="16" x2="40" y2="140" stroke="var(--line)" strokeWidth="1" />
            <polyline
              className="rl-trace"
              style={{ '--len': 748 } as React.CSSProperties}
              points="40,120 96,120 96,96 152,96 152,72 208,72 208,48 264,48 264,72 320,72 320,56 376,56 376,40 432,40 432,64 488,64 488,44 544,44 544,28 600,28"
              fill="none"
              stroke="var(--glow)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <figcaption className="mt-3 text-sm text-muted max-w-2xl">
            Difficulty across one set of practice rounds. Three correct in a row raises it; three
            wrong stops the scoring and teaches the idea again. The child is never shown this line.
          </figcaption>
        </figure>
      </section>

      <div className="mx-auto max-w-5xl px-6"><div className="rl-rule" /></div>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="rl-reveal-focus font-display text-3xl">Math you can show, not just tap</h2>
        <p className="rl-reveal mt-5 text-lg text-muted max-w-2xl leading-relaxed" style={{ '--i': 1 } as React.CSSProperties}>
          Sometimes the best way to answer a math question is to show it.
        </p>
        <p className="rl-reveal mt-4 text-muted max-w-2xl leading-relaxed" style={{ '--i': 2 } as React.CSSProperties}>
          In some chapters, children can use their hands to answer instead of tapping a button — holding up
          fingers to show a number, tilting a hand to show an angle, or using both hands to show distance. It
          makes learning more interactive, and gives children another way to express what they know.
        </p>
        <p className="rl-reveal mt-8 font-display text-2xl max-w-2xl" style={{ '--i': 3 } as React.CSSProperties}>
          Your child&rsquo;s camera stays private.
        </p>
        <p className="rl-reveal mt-4 text-muted max-w-2xl leading-relaxed" style={{ '--i': 4 } as React.CSSProperties}>
          Hand tracking happens right on your child&rsquo;s device. Camera images and hand movements are
          processed there and are never uploaded or stored.
        </p>
        <p className="rl-reveal mt-4 text-muted max-w-2xl leading-relaxed" style={{ '--i': 5 } as React.CSSProperties}>
          And because the camera is optional, every chapter that uses hand tracking can also be completed by
          tapping on the screen.
        </p>
      </section>

      <div className="mx-auto max-w-5xl px-6"><div className="rl-rule" /></div>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="rl-reveal-focus font-display text-3xl">What is covered, by age</h2>
        <div className="mt-10 grid gap-px bg-line border border-line rounded-2xl overflow-hidden">
          {BANDS.map((b, i) => (
            <div key={b.age} className="rl-reveal-left bg-surface p-6 flex flex-wrap gap-x-8 gap-y-2" style={{ '--i': i + 1 } as React.CSSProperties}>
              <div className="w-28 shrink-0">
                <p className="font-display text-2xl">{b.age}</p>
                <p className="text-xs uppercase tracking-widest text-muted mt-1">{b.world}</p>
              </div>
              <p className="flex-1 min-w-64 text-muted leading-relaxed">{b.what}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6"><div className="rl-rule" /></div>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="rl-reveal-focus font-display text-3xl">Questions parents ask</h2>
        <div className="mt-8">
          {FAQ.map((f, i) => (
            <Q key={f.q} {...f} i={i + 1} />
          ))}
        </div>
      </section>

      <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                // The SAME id the app itself declares, so the two pages describe one node.
                '@id': APP_ID,
                name: APP_NAME,
                alternateName: [`${APP_NAME} by ${COMPANY}`, 'Milo'],
                url: APP_URL,
                applicationCategory: 'EducationalApplication',
                operatingSystem: 'Web browser',
                description: metadata.description,
                publisher: { '@id': `${SITE_URL}/#organization` },
                audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
                // ⚠️ ONE NODE, ONE PRICE. This shares `@id` with /pricing, so the two Offer
                // sets must agree — both are generated from PLANS in site.ts. Do not type a
                // number here.
                offers: PLANS.flatMap(p => [
                  {
                    '@type': 'Offer',
                    name: `${p.children} ${p.children === 1 ? 'child' : 'children'}, billed monthly`,
                    price: (p.monthly / 100).toFixed(2),
                    priceCurrency: PRICING.currency,
                    availability: 'https://schema.org/LimitedAvailability',
                    url: `${SITE_URL}/waitlist`,
                  },
                  {
                    '@type': 'Offer',
                    name: `${p.children} ${p.children === 1 ? 'child' : 'children'}, billed annually`,
                    price: (p.annual / 100).toFixed(2),
                    priceCurrency: PRICING.currency,
                    availability: 'https://schema.org/LimitedAvailability',
                    url: `${SITE_URL}/waitlist`,
                  },
                ]),
              },
              {
                '@type': 'FAQPage',
                mainEntity: FAQ.map(f => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
              },
            ],
          })}</script>
    </>
  )
}
