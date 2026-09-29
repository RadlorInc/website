import type { Metadata } from 'next'
import { PathRows, type PathRow } from '@/components/scroll/Scroll'
import { PageHero } from '@/components/scroll/PageHero'
import { ART } from '@/components/scroll/art'
import { APP_NAME, COMPANY, FOUNDED_YEAR, SUPPORT_EMAIL, VISION } from '@/site'

export const metadata: Metadata = {
  title: 'About',
  description: `${COMPANY} is a small software company building learning tools that adapt to the child using them. Our first product is ${APP_NAME}, adaptive math for kindergarten through grade 8.`,
  alternates: { canonical: '/about' },
}

// One picture and one line per section (founder, 2026-09-29: "least text on the whole website"), joined by a drawn path
// (scroll style G) under a circle-reveal top (F). Each line restates the page as it was and adds no claim.
const ROWS: PathRow[] = [
  { ...ART.aboutWhat, title: `What is ${COMPANY}?`, body: <>Learning software that adapts to the child, starting with math. {APP_NAME}: kindergarten to grade 8.</> },
  { ...ART.aboutWhy, title: 'Why we started', body: <>Every child learns differently. Software can find where a child is and change what comes next.</> },
  { ...ART.aboutHow, title: 'How we work', body: <>Could a child get it right without understanding it? Then we fix the lesson.</> },
  {
    ...ART.aboutWhere, title: 'Where we are',
    body: <>Founded {FOUNDED_YEAR}, in early access with a small group of families. <a className="rl-link text-accent" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></>,
  },
]

export default function About() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-20">
        <PageHero
          title={<>About <span className="rl-lit" style={{ '--lit': 0.55 } as React.CSSProperties}>{COMPANY}</span></>}
          line={VISION}
          pic={ART.journeyTreasure}
        />
        <PathRows rows={ROWS} />
      </div>
    </section>
  )
}
