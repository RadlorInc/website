import type { Metadata } from 'next'
import { APP_NAME, COMPANY, FOUNDED_YEAR, SUPPORT_EMAIL, VISION } from '@/site'

export const metadata: Metadata = {
  title: 'About',
  description: `${COMPANY} is a small software company building learning tools that adapt to the child using them. Our first product is ${APP_NAME}, adaptive math for ages 3 to 18.`,
  alternates: { canonical: '/about' },
}

export default function About() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Decorative, `aria-hidden`, behind the text — a screen reader gets the copy alone. */}
      <div className="rl-lightfield" aria-hidden="true">
        <div className="rl-glow rl-parallax" style={{ '--p': '30px' } as React.CSSProperties} />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-20">
      <h1 className="rl-focus font-display text-5xl">
        About <span className="rl-lit" style={{ '--lit': 0.55 } as React.CSSProperties}>{COMPANY}</span>
      </h1>

      {/* ⚠️ THIS PAGE IS SHORT ON PURPOSE AND IT USED TO BE THREE TIMES LONGER.
          Malaika, reading the draft: "I think that this section had to be shortened by a lot.
          There were a lot of different styles of expressing the point. for the about it should
          have a question the parent might ask like what is this company with a quick and easy
          answer." So it opens with the question and answers it in two sentences, and each heading
          below gets one short paragraph. The second blockquote and the "We believe the potential
          is already there" heading were cut as the same point said a third way. If you add to this
          page, take something out. */}
      <div className="rl-prose prose mt-10">
        <h2>What is {COMPANY}?</h2>
        <p>
          {COMPANY} is a software company building learning tools that adapt to the person using them —
          starting with math. Our first product is {APP_NAME}: adaptive math for ages 3&ndash;18.
        </p>
        <blockquote>{VISION}</blockquote>

        <h2>Why we started</h2>
        <p>
          Every child learns differently, but traditional learning asks every student the same question at
          the same time. Software doesn&rsquo;t have to work that way — it can find where a child is and
          change what comes next. That&rsquo;s why we built {APP_NAME}.
        </p>

        <h2>How we work</h2>
        <p>
          We build closely with the families and educators using our products, and we would rather make one
          chapter that genuinely helps a child than ten that look impressive. The question we keep coming
          back to is: <strong>could a child get this right without actually understanding what we&rsquo;re
          trying to teach?</strong> If the answer is yes, we go back and fix it.
        </p>

        <h2>Where we are</h2>
        <p>
          {COMPANY} was founded in {FOUNDED_YEAR}, and {APP_NAME} is in early access with a small group of
          families. If you&rsquo;d like to try it with your family or bring it to your classroom, write to{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
      </div>
      </div>
    </section>
  )
}
