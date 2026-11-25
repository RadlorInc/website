import Link from 'next/link'
import Image from 'next/image'
import type { CSSProperties, ReactNode } from 'react'
import { APP_NAME, ASK_NAME, COMPANY, SITE_URL, TAGLINE, V3D_CTA, V3D_LINE, V3D_NAME, V3D_PATH, V3D_SIGNUP_PATH, WHY_PATH } from '@/site'
import { FINDINGS, HOME_EVIDENCE, SOURCES } from '@/content/evidence'
import { MANUAL, WHOLE, frame } from '@/content/manual-demo'
import { HomeStory } from '@/components/visual/HomeStory'
import { SampleStory } from '@/components/visual/SampleStory'
import { ManualToVideo } from '@/components/visual/ManualToVideo'
import { ManualScroll } from '@/components/visual/ManualScroll'

/**
 * The home page is 3Dlor's, and it shows one thing: a WRITTEN manual becomes something you can see (founder, 2026-11-24).
 * Paper, stepped stop-motion movement, real frames. No drawn icons, no card grids, no glow: the founder read those as
 * "AI generated". It must not look or read like school. The other two products are two lines at the bottom.
 *
 * ⚠️ Every 3Dlor line restates /3dlor, except V3D_LINE and HomeStory (founder-approved, 2026-11-24); add no other claim. Standing rules: no price, no
 * delivery time (only the founder-approved "a single step in minutes"), never say how any video is made, no people or animals in the pictures. The water filter is our own generic sample.
 */
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
const primary = `inline-flex min-h-12 items-center bg-foreground px-6 font-semibold text-background transition-colors hover:bg-accent hover:text-on-accent ${focus}`
const link = `font-medium underline decoration-1 underline-offset-4 hover:text-accent ${focus}`
const h2 = 'text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl'
const wrap = 'mx-auto max-w-[76rem] px-6'

const pic = (n: number, cls: string, alt = '') => <Image src={frame(n)} alt={alt} width={MANUAL.w} height={MANUAL.h} sizes="480px" className={cls} />

const SHEETS: { title: string; line: string; show: ReactNode }[] = [
  {
    title: 'You send the manual.', line: 'And photos of the product. A CAD file is optional.',
    show: (
      <div aria-hidden="true" className="text-sm leading-relaxed text-[#54524c] sm:text-base">
        <p className="border-b border-current pb-1 font-bold text-[#23211d]">{MANUAL.title}</p>
        {MANUAL.steps.map((s, i) => <p key={s.from} className="mt-2">{i + 1}. {s.text}</p>)}
      </div>
    ),
  },
  {
    title: 'We list the videos.', line: 'One short video for each task in your manual.',
    show: (
      <ul className="text-xl font-medium sm:text-2xl">
        {['Set it up', 'Use it', 'Clean it', 'Fix it'].map(t => <li key={t} className="border-b border-[#cbc6b9] py-3">{t}</li>)}
      </ul>
    ),
  },
  {
    title: 'You approve each script.', line: 'Every line and what it shows. Two rounds of changes included.',
    show: (
      <div className="grid gap-4">
        {[2, 5].map(i => (
          <div key={i} className="grid grid-cols-[7rem_1fr] items-center gap-4 sm:grid-cols-[10rem_1fr]">
            {pic(MANUAL.steps[i].still, 'aspect-[4/3] w-full object-cover')}
            <p className="text-sm sm:text-base">{MANUAL.steps[i].text}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'You get the videos.', line: 'Tall for phones, wide for your site, square for marketplaces.',
    show: (
      <div aria-hidden="true" className="flex items-end gap-3 sm:gap-5">
        {['aspect-[9/16] w-[22%]', 'aspect-video w-[46%]', 'aspect-square w-[26%]'].map(c => <div key={c} className={`overflow-hidden bg-[#e8e4dc] ${c}`}>{pic(WHOLE, 'h-full w-full object-contain')}</div>)}
      </div>
    ),
  },
]

const OTHERS = [
  { name: ASK_NAME, href: '/askradlor', line: 'Type a question. A short voiced video draws the answer.' },
  { name: APP_NAME, href: '/radlic', line: 'A math app for children, from kindergarten through grade 8.' },
]

export default function Home() {
  const f = FINDINGS[HOME_EVIDENCE[0]]
  return (
    <div>
      <section className={`${wrap} pt-8 pb-16 sm:pt-12`}>
        <p className="font-medium text-muted">{V3D_NAME} by {COMPANY}</p>
        <h1 className="mt-3 text-[2.9rem] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">Your manual, made visible.</h1>
        <div className="mt-4 flex flex-col items-start gap-x-10 gap-y-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-[46rem] text-lg leading-relaxed text-muted">{V3D_LINE}</p>
          <Link href={V3D_SIGNUP_PATH} className={`${primary} shrink-0`}>{V3D_CTA}</Link>
        </div>
        <ManualToVideo />
      </section>

      <ManualScroll />

      <SampleStory />

      <HomeStory />

      <section className={`${wrap} pt-24 sm:pt-36`}>
        <h2 className={`${h2} max-w-[16ch]`}>From your page to their screen.</h2>
        <ol className="pile mt-14">
          {SHEETS.map((s, i) => (
            <li key={s.title} style={{ '--i': i } as CSSProperties}>
              <div>
                <h3 className="text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">{s.title}</h3>
                <p className="mt-4 max-w-[26rem] text-lg text-[#54524c]">{s.line}</p>
              </div>
              {s.show}
            </li>
          ))}
        </ol>
        <p><Link href={V3D_PATH} className={link}>What you get, and the limits</Link></p>
      </section>

      <section className={`${wrap} pt-28 sm:pt-40`}>
        <p className={`${h2} max-w-[20ch]`}>{f.short.replace('hands-on', 'hands\u2011on')}</p>
        <p className="mt-6 text-muted">
          {f.evidence}, <a href={SOURCES[f.refs[0]].url} rel="noopener" className={link}>{SOURCES[f.refs[0]].short}</a>.{' '}
          <Link href={WHY_PATH} className={link}>All the research and its limits</Link>
        </p>
      </section>

      <section className={`${wrap} pt-28 pb-28 sm:pt-40`}>
        <h2 className={h2}>Start with one product.</h2>
        <p className="mt-5 text-lg text-muted">Send us the manual and photos of one product. Questions first? <Link href="/contact" className={link}>Talk to us</Link>.</p>
        <Link href={V3D_SIGNUP_PATH} className={`${primary} mt-8`}>{V3D_CTA}</Link>
      </section>

      <section id="other-products" className={`${wrap} scroll-mt-16`}>
        <h2 className="text-xl font-semibold">Other products</h2>
        <ul className="mt-4 border-t border-line">
          {OTHERS.map(o => (
            <li key={o.href} className="border-b border-line">
              <Link href={o.href} className={`grid gap-1 py-5 hover:text-accent sm:grid-cols-[14rem_1fr] ${focus}`}>
                <span className="text-lg font-semibold">{o.name}</span>
                <span className="text-muted">{o.line}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: `${COMPANY}: ${TAGLINE}`,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        mainEntity: { '@id': `${SITE_URL}${V3D_PATH}#service` },
      })}</script>
    </div>
  )
}
