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

      <div className="rl-prose prose mt-10">
        <p>
          {COMPANY} is a software company building learning tools that adapt to the person using them —
          starting with math.
        </p>
        <blockquote>{VISION}</blockquote>

        <h2>Why we started</h2>
        <p>
          Every child learns differently, but traditional learning often asks every student the same question
          at the same time. Software doesn&rsquo;t have to work that way. It can understand where a child is,
          respond to how they learn, and change what comes next.
        </p>
        <p>
          That&rsquo;s why we built {APP_NAME}. It starts by finding what a child already knows, then adapts
          the learning experience from there.
        </p>

        <h2>We believe the potential is already there</h2>
        <p>
          Our job isn&rsquo;t to fill an empty container. It&rsquo;s to help children discover what they
          already have, build on it, and keep moving forward.
        </p>

        <h2>How we work</h2>
        <p>
          We build closely with the families and educators using our products. We would rather create one
          chapter that genuinely helps a child learn than ten that simply look impressive. That means
          questioning everything, even the things that seem to work.
        </p>
        <p>One question we come back to often is:</p>
        <blockquote>
          Could a child get this right without actually understanding what we&rsquo;re trying to teach?
        </blockquote>
        <p>If the answer is yes, we go back and fix it.</p>

        <h2>Where we are</h2>
        <p>
          {COMPANY} was founded in {FOUNDED_YEAR}, and {APP_NAME} is currently in early access with a small
          group of families. We&rsquo;re still building, testing, and learning. If you&rsquo;d like to try{' '}
          {APP_NAME} with your family or bring it to your classroom, we&rsquo;d love to hear from you — write
          to <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
      </div>
      </div>
    </section>
  )
}
