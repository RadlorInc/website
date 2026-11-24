/**
 * radlor.com/3dlor — the third product (founder, 2026-11-22): 3D how-to, setup and support video libraries for
 * product brands. A service page: what it is, who it is for, the demo, how the work goes, the limits, one sign-up button.
 *
 * ⚠️ EVERY CLAIM RESTATES THE PRODUCT'S OWN PITCH NOTES as read on 2026-11-22. Rules that a build cannot check:
 *   · never say how the videos are made: the wording is "our own 3D system";
 *   · no delivery-time promise and no price (the plans are draft; they live on the sign-up page);
 *   · no people and no animals in any picture or video of this product;
 *   · the limits section stays: we are new and have no case studies, and the page says so.
 * The demo is the water filter sample, frames only, no third party.
 *
 * ⚠️ The sign-up route (`/3dlor/signup`) is built in a separate change. This page only links to it.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ManualScroll } from '@/components/visual/ManualScroll'
import { V3dStory } from '@/components/visual/V3dStory'
import { MANUAL, frame } from '@/content/manual-demo'
import { COMPANY, SAMPLES_PATH, SITE_URL, SUPPORT_EMAIL, V3D_NAME, V3D_PATH, V3D_SIGNUP_PATH, WHY_PATH } from '@/site'

const TITLE = `${V3D_NAME}: how-to and support videos for your product`

export const metadata: Metadata = {
  title: { absolute: `${TITLE} · ${COMPANY}` },
  description:
    'A library of short 3D videos that show your customers how to set up, use, clean and fix your product. We start from product photos; no film crew and no app.',
  alternates: { canonical: V3D_PATH },
  openGraph: { url: `${SITE_URL}${V3D_PATH}`, title: TITLE },
}

function ServiceJsonLd() {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}${V3D_PATH}#service`,
    name: V3D_NAME,
    serviceType: '3D how-to, setup and support videos for consumer products',
    url: `${SITE_URL}${V3D_PATH}`,
    description: metadata.description,
    provider: { '@id': `${SITE_URL}/#organization` },
    audience: { '@type': 'BusinessAudience', name: 'Product brands' },
  }
  return <script type="application/ld+json">{JSON.stringify(json)}</script>
}

const btn = 'rl-cta inline-flex min-h-11 items-center rounded-full px-6 py-3 font-medium'
const primary = `${btn} bg-accent text-on-accent hover:opacity-90`
const quiet = `${btn} rl-cta-quiet border border-line hover:border-foreground transition-colors`
const eyebrow = 'font-medium text-muted'

export default function ThreeDVideos() {
  return (
    <>
      <section className="rl-dark overflow-x-clip">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 pt-12 pb-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] sm:pt-16 sm:pb-20">
          <div>
            <p className={eyebrow}>For product brands</p>
            <h1 className="rl-focus font-display mt-4 text-[2.5rem] leading-[1.05] sm:text-6xl">
              Show customers how your product <span className="rl-lit">works</span>.
            </h1>
            <p className="mt-6 max-w-[30rem] text-xl leading-relaxed text-muted">
              Short 3D videos for one product. Your customers watch the step, then do the step.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={V3D_SIGNUP_PATH} className={primary}>Sign up</Link>
              <Link href={SAMPLES_PATH} className={quiet}>See the samples</Link>
            </div>
            <p className="mt-4 text-sm text-muted">Plans are on the sign-up page.</p>
          </div>
          <Image src={frame(MANUAL.steps[5].still)} alt="A water filter cut open: the O-ring presses on the cap" width={MANUAL.w} height={MANUAL.h}
            sizes="(max-width: 768px) 100vw, 460px" priority className="rl-fade w-full" />
        </div>
      </section>

      {/* THE DEMO IS THE VISITOR'S SCROLL, the same as home (2026-11-24). */}
      <div id="demo">
        <ManualScroll>
          <h2 className="font-display text-4xl sm:text-6xl">One page of a manual, step by step.</h2>
          <p className="mt-5 max-w-[28rem] text-lg text-muted">Scroll. Our demo, not the maker’s official instructions.</p>
        </ManualScroll>
      </div>

      <V3dStory />

      <section className="mx-auto max-w-5xl px-6 pt-16 pb-4 text-center">
        <h2 className="font-display text-3xl sm:text-4xl">Start with one product.</h2>
        <p className="mx-auto mt-3 max-w-[34rem] text-muted">
          Pick a plan on the sign-up page. Questions first? <a className="rl-link text-accent" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        </p>
        <Link href={V3D_SIGNUP_PATH} className={`${primary} mt-6`}>Sign up</Link>
        <p className="mt-6"><Link href={WHY_PATH} className="rl-link text-accent">The research and its limits</Link></p>
      </section>
      <ServiceJsonLd />
    </>
  )
}
