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
    { world: 'Story worlds', what: 'Counting, number order and recognition, matching and comparing quantities, first addition and subtraction, measurement.' },
    { world: 'Story worlds', what: 'Adding and subtracting to 100, place value, telling the time, shapes, patterns, fractions as sharing.' },
    { world: 'Camera chapters', what: 'Decimals, factors and multiples, comparing fractions, unit conversion, angles and symmetry, area and perimeter, data and graphs.' },
    { world: 'Field lab', what: 'Ratio and proportion, negative numbers, linear equations, coordinate geometry, probability, statistics.' },
    { world: 'Design studio', what: 'Algebra I and geometry — quadratics, functions, similarity, trigonometry, proof.' },
    { world: 'Math studio', what: 'Algebra II, pre-calculus, statistics and an introduction to calculus.' },
  ][i],
}))

const FAQ = [
  {
    q: 'What age is AdaptiveLearn for?',
    a: 'Ages 3 to 18. The content is organized into six bands, and each band looks and works differently — a five-year-old gets a narrated story world with drawn animation, while a sixteen-year-old gets a design studio with a working chalkboard.',
  },
  {
    q: 'How does it know what to teach my child?',
    a: 'A short placement check at the start finds where the child actually is, rather than assuming their school year. After that the difficulty moves inside every chapter: three correct in a row raises it, three wrong stops the scoring and teaches the idea again.',
  },
  {
    q: 'Does the camera record my child?',
    a: 'No. In the camera chapters the hand tracking runs entirely inside the browser on your own device. No video frame and no hand position is ever sent to us or to anyone else, and the app has no upload path for either. The camera is optional — every camera chapter can be answered by tapping instead.',
  },
  {
    q: 'Do we need the camera to use it?',
    a: 'No. Every chapter that accepts a hand gesture also accepts taps, and a child who declines the camera prompt lands straight on the tap version with nothing withheld.',
  },
  {
    q: 'Does it work offline?',
    a: 'Yes, once it has loaded. The app installs to the home screen and caches itself, so a chapter already opened will play without a connection. Progress syncs when the device is back online.',
  },
  {
    q: 'Was AdaptiveLearn called something else before?',
    a: 'Yes — it was called Milo until August 2026. Milo is still there: he is the pony who walks through the story chapters and does the explaining. The app around him is AdaptiveLearn, made by Radlor.',
  },
  {
    q: 'How much does it cost?',
    a: `${usd(PRICING.monthly.first)} a month for the first child and ${usd(PRICING.monthly.additional)} for each additional child, up to ${PRICING.maxChildren} on one family plan. Annual billing saves over 20%. Every age band and every chapter is on every plan — nothing is held back for a higher tier. The way in is the waitlist.`,
  },
]

function Q({ q, a, i }: { q: string; a: string; i: number }) {
  return (
    <div className="rl-block rl-reveal border-t border-line py-6" style={{ '--i': i } as React.CSSProperties}>
      <h3 className="font-medium text-lg">{q}</h3>
      <p className="mt-2 text-muted leading-relaxed max-w-2xl">{a}</p>
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
          A short check finds where your child actually is. From there, every chapter is a small world with
          characters, a job to do, and a question that can only be answered by doing the math — not by
          picking the likelier of two buttons.
        </p>
        <p className="rl-rise mt-6 text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.22s' } as React.CSSProperties}>
          <strong className="text-foreground font-medium">
            {APP_NAME} is being tested with a small group of families.
          </strong>{' '}
          The waitlist is how you get in when we open it up.
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
            ['Intro', 'One card. Who is here, and what they need.'],
            ['Demo', 'A worked example, narrated, with the working animated rather than asserted.'],
            ['Your turn', 'One unscored go, with the help still on.'],
            ['Practice', 'Ten scored rounds — with the difficulty moving, and the help fading.'],
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
        <h2 className="rl-reveal-focus font-display text-3xl">Answering with your hands</h2>
        <p className="mt-5 text-muted max-w-2xl leading-relaxed">
          In the 9–11 band a question is often answered by showing rather than tapping: hold up a number of
          fingers, tilt a hand to set an angle, hold two hands apart to say how wide something is. It puts the
          math back into the body, which is where a nine-year-old still does most of it.
        </p>
        <p className="mt-4 text-muted max-w-2xl leading-relaxed">
          <strong className="text-foreground font-medium">The tracking runs on your device.</strong> Frames from
          the camera and the hand positions read from them never leave the browser — there is no upload path in
          the software for either. Every one of those chapters also accepts taps, so the camera is never the only
          way through.
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
