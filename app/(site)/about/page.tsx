import type { Metadata } from 'next'
import { Pile } from '@/components/scroll/Pile'
import type { PathRow } from '@/components/scroll/Scroll'
import { PageHero } from '@/components/scroll/PageHero'
import { ART } from '@/components/scroll/art'
import { APP_NAME, ASK_NAME, COMPANY, FOUNDED_YEAR, SUPPORT_EMAIL, V3D_NAME, VISION } from '@/site'

export const metadata: Metadata = {
  title: 'About',
  description: `${COMPANY} makes ${V3D_NAME}: short 3D videos that show customers how a product works. Its other products are ${ASK_NAME} and ${APP_NAME}.`,
  alternates: { canonical: '/about' },
}

// One picture and one line per section (founder, 2026-09-29: "least text on the whole website"), on paper sheets that pile up (2026-11-24), under a circle-reveal top (F). Each line restates the page as it was and adds no claim.
const ROWS: PathRow[] = [
  { ...ART.homeExploded, title: `What is ${COMPANY}?`, body: <>We make {V3D_NAME}: short 3D videos that show how a product works. <span className="mt-3 block">Other products: {ASK_NAME} and {APP_NAME}.</span></> },
  { ...ART.washerOpen, title: 'Why we started', body: <>Most things hide how they work. A manual tells you. A picture that opens shows you.</> },
  { ...ART.sewingOpen, title: 'How we work', body: <>One step at a time. The product’s maker approves every step.</> },
  {
    ...ART.lockOpen, title: 'Where we are',
    body: <>Founded {FOUNDED_YEAR}. {V3D_NAME} is new and has no case studies yet. <a className="rl-link text-accent" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></>,
  },
]

export default function About() {
  return (
    <section className="relative isolate overflow-x-clip">
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-20">
        <PageHero
          title={<>About <span className="rl-lit" style={{ '--lit': 0.55 } as React.CSSProperties}>{COMPANY}</span></>}
          line={VISION}
          pic={ART.fanOpen}
        />
        <Pile rows={ROWS} />
      </div>
    </section>
  )
}
