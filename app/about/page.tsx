import type { Metadata } from 'next'
import { APP_NAME, COMPANY, FOUNDED_YEAR, SUPPORT_EMAIL } from '@/site'

export const metadata: Metadata = {
  title: 'About',
  description: `${COMPANY} is a small software company building learning tools that adapt to the child using them. Our first product is ${APP_NAME}, adaptive maths for ages 3 to 18.`,
  alternates: { canonical: '/about' },
}

export default function About() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-20">
      <h1 className="font-display text-5xl">About {COMPANY}</h1>

      <div className="prose mt-10">
        <p>
          {COMPANY} is a small software company. We build learning tools that change according to the person
          using them, starting with maths.
        </p>

        <h2>Why we started</h2>
        <p>
          Every child in a classroom of thirty gets the same question at the same moment, and about four of them
          are being asked the right one. Software does not have that constraint — it can ask a different question
          of every child, and change it again on the next answer. Almost none of it does.
        </p>
        <p>
          So we built {APP_NAME}: a short placement check that finds where a child actually is, and then chapters
          that teach from there, with the difficulty moving question by question and never shown on screen.
        </p>

        <h2>How we work</h2>
        <p>
          We work in the open with the families using the product, and we would rather ship one chapter that
          teaches something honestly than ten that look busy. A lot of our engineering time goes into a boring
          question: <strong>could a child get this right without knowing the thing we are testing?</strong> If the
          answer is yes, the chapter goes back, however good it looks.
        </p>

        <h2>Where we are</h2>
        <p>
          {COMPANY} was founded in {FOUNDED_YEAR}. {APP_NAME} is in early access with our first families. If you
          would like an account, or you are a school that wants to try it with a class, write to{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
      </div>
    </section>
  )
}
