import type { Metadata } from 'next'
import { APP_NAME, APP_URL, COMPANY, SITE_URL } from '@/site'

export const metadata: Metadata = {
  title: `${APP_NAME} — adaptive maths for ages 3 to 18`,
  description:
    'AdaptiveLearn places a child with a short check, then teaches maths through story chapters whose difficulty moves question by question. Younger bands answer by holding fingers up to the camera; hand tracking runs entirely on the device.',
  alternates: { canonical: '/adaptivelearn' },
}

const BANDS = [
  { age: '3–5', world: 'Story worlds', what: 'Counting, number order and recognition, matching and comparing quantities, first addition and subtraction, measurement.' },
  { age: '6–8', world: 'Story worlds', what: 'Adding and subtracting to 100, place value, telling the time, shapes, patterns, fractions as sharing.' },
  { age: '9–11', world: 'Camera chapters', what: 'Decimals, factors and multiples, comparing fractions, unit conversion, angles and symmetry, area and perimeter, data and graphs.' },
  { age: '12–14', world: 'Field lab', what: 'Ratio and proportion, negative numbers, linear equations, coordinate geometry, probability, statistics.' },
  { age: '15–16', world: 'Design studio', what: 'Algebra I and geometry — quadratics, functions, similarity, trigonometry, proof.' },
  { age: '17–18', world: 'Maths studio', what: 'Algebra II, pre-calculus, statistics and an introduction to calculus.' },
]

const FAQ = [
  {
    q: 'What age is AdaptiveLearn for?',
    a: 'Ages 3 to 18. The content is organised into six bands, and each band looks and works differently — a five-year-old gets a narrated story world with drawn animation, while a sixteen-year-old gets a design studio with a working chalkboard.',
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
    q: 'How much does it cost?',
    a: 'AdaptiveLearn is in early access and free to use while we work with our first families. Write to us if you would like an account.',
  },
]

function Q({ q, a }: { q: string; a: string }) {
  return (
    <div className="border-t border-line py-6">
      <h3 className="font-medium text-lg">{q}</h3>
      <p className="mt-2 text-muted leading-relaxed max-w-2xl">{a}</p>
    </div>
  )
}

export default function AdaptiveLearn() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-14">
        <p className="text-sm uppercase tracking-[0.18em] text-accent font-medium">A {COMPANY} product</p>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] mt-4 max-w-3xl">
          {APP_NAME}: maths that changes as your child answers.
        </h1>
        <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">
          A short check finds where your child actually is. From there, every chapter is a small world with
          characters, a job to do, and a question that can only be answered by doing the maths — not by
          picking the likelier of two buttons.
        </p>
        <a
          href={APP_URL}
          className="mt-9 inline-block rounded-full bg-accent px-6 py-3 text-white font-medium hover:opacity-90 transition-opacity"
        >
          Open {APP_NAME}
        </a>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 border-t border-line">
        <h2 className="font-display text-3xl">How a chapter works</h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-4">
          {[
            ['Intro', 'One card. Who is here, and what they need.'],
            ['Demo', 'A worked example, narrated, with the working animated rather than asserted.'],
            ['Your turn', 'One unscored go, with the help still on.'],
            ['Practice', 'Ten scored rounds — with the difficulty moving, and the help fading.'],
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
        <h2 className="font-display text-3xl">Answering with your hands</h2>
        <p className="mt-5 text-muted max-w-2xl leading-relaxed">
          In the 9–11 band a question is often answered by showing rather than tapping: hold up a number of
          fingers, tilt a hand to set an angle, hold two hands apart to say how wide something is. It puts the
          maths back into the body, which is where a nine-year-old still does most of it.
        </p>
        <p className="mt-4 text-muted max-w-2xl leading-relaxed">
          <strong className="text-foreground font-medium">The tracking runs on your device.</strong> Frames from
          the camera and the hand positions read from them never leave the browser — there is no upload path in
          the software for either. Every one of those chapters also accepts taps, so the camera is never the only
          way through.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 border-t border-line">
        <h2 className="font-display text-3xl">What is covered, by age</h2>
        <div className="mt-10 grid gap-px bg-line border border-line rounded-2xl overflow-hidden">
          {BANDS.map(b => (
            <div key={b.age} className="bg-surface p-6 flex flex-wrap gap-x-8 gap-y-2">
              <div className="w-28 shrink-0">
                <p className="font-display text-2xl">{b.age}</p>
                <p className="text-xs uppercase tracking-widest text-muted mt-1">{b.world}</p>
              </div>
              <p className="flex-1 min-w-64 text-muted leading-relaxed">{b.what}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 border-t border-line">
        <h2 className="font-display text-3xl">Questions parents ask</h2>
        <div className="mt-8">
          {FAQ.map(f => (
            <Q key={f.q} {...f} />
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                name: APP_NAME,
                url: APP_URL,
                applicationCategory: 'EducationalApplication',
                operatingSystem: 'Web browser',
                description: metadata.description,
                publisher: { '@id': `${SITE_URL}/#organization` },
                audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', availability: 'https://schema.org/LimitedAvailability' },
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
          }),
        }}
      />
    </>
  )
}
