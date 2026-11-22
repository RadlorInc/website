/**
 * radlor.com/3dlor — the third product (founder, 2026-11-22): 3D how-to, setup and support video libraries for
 * product brands. A service page: what it is, who it is for, the demo, how the work goes, the limits, one sign-up button.
 *
 * ⚠️ EVERY CLAIM RESTATES THE PRODUCT'S OWN PITCH NOTES as read on 2026-11-22. Rules that a build cannot check:
 *   · never say how the videos are made: the wording is "our own 3D system";
 *   · no delivery-time promise and no price (the plans are draft; they live on the sign-up page);
 *   · no people and no animals in any picture or video of this product;
 *   · the limits section stays: we are new and have no case studies, and the page says so.
 * The demo is our own demo video (a French press, 22 s), served from this site without sound so that /privacy's
 * "nothing from a third party" holds. It is a demo, not the maker's official instructions, and the page says that too.
 *
 * ⚠️ The sign-up route (`/3dlor/signup`) is built in a separate change. This page only links to it.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Icon, type IconName } from '@/components/visual/Icon'
import { StepScrubber } from '@/components/visual/StepScrubber'
import { Viz } from '@/components/visual/Viz'
import { FINDINGS } from '@/content/evidence'
import { COMPANY, SITE_URL, SUPPORT_EMAIL, V3D_NAME, V3D_PATH, V3D_SIGNUP_PATH, WHY_PATH } from '@/site'

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

/** The demo's steps, at the second each starts (read from the demo film's own timeline, 22 s in all). */
const DEMO_STEPS = [
  { label: 'Start', at: 0, thumb: '/3d-steps/step-1.jpg' },
  { label: 'Pull the plunger out', at: 2.6, thumb: '/3d-steps/step-2.jpg' },
  { label: 'Empty the grounds', at: 6.0, thumb: '/3d-steps/step-3.jpg' },
  { label: 'Take the filter apart', at: 9.6, thumb: '/3d-steps/step-4.jpg' },
  { label: 'Wash every part', at: 13.4, thumb: '/3d-steps/step-5.jpg' },
  { label: 'Put it back together', at: 16.6, thumb: '/3d-steps/step-6.jpg' },
]

const FOR: { icon: IconName; title: string; line: string }[] = [
  { icon: 'box', title: 'Assembly', line: 'Furniture and fitness equipment' },
  { icon: 'layers', title: 'Installation', line: 'Devices and fittings' },
  { icon: 'repeat', title: 'Care and cleaning', line: 'Kitchen and home products' },
]

const STEPS: { icon: IconName; title: string; line: string }[] = [
  { icon: 'upload', title: 'Send product photos', line: 'A CAD file is optional.' },
  { icon: 'list', title: 'We plan the library', line: 'Topics from your reviews and tickets.' },
  { icon: 'pencil', title: 'You approve each script', line: 'Two rounds of changes included.' },
  { icon: 'download', title: 'You get the videos', line: 'Tall, wide and square.' },
]

const LIMITS = [
  'Clean 3D, not a photoreal advert',
  'Many parts, cables or electronics take more time',
  'You approve every step and its accuracy',
  'We are new: no case studies yet',
]

const card = 'rounded-3xl border border-line bg-surface p-6'

const btn = 'rl-cta inline-flex min-h-11 items-center rounded-full px-6 py-3 font-medium'
const primary = `${btn} bg-accent text-on-accent hover:opacity-90`
const quiet = `${btn} rl-cta-quiet border border-line hover:border-foreground transition-colors`
const eyebrow = 'text-sm uppercase tracking-[0.18em] text-accent font-medium'

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
              <a href="#demo" className={quiet}>Try the demo</a>
            </div>
            <p className="mt-4 text-sm text-muted">Plans are on the sign-up page.</p>
          </div>
          {/* Three frames of our demo, fanned out. Decorative: the demo below plays the same steps. */}
          <div aria-hidden="true" className="relative mx-auto h-[360px] w-full max-w-[380px] sm:h-[440px]">
            {[2, 4, 6].map((n, i) => (
              <Image key={n} src={`/3d-steps/step-${n}.jpg`} alt="" width={360} height={640} priority={i === 1}
                className="absolute top-0 w-[46%] rounded-2xl border border-line shadow-2xl shadow-black/60"
                style={{ left: `${i * 27}%`, top: `${[6, 0, 6][i]}%`, rotate: `${[-7, 0, 7][i]}deg`, zIndex: [1, 2, 1][i] }} />
            ))}
          </div>
        </div>
      </section>

      {/* THE DEMO UNDER THE VISITOR'S HAND: a slider through the video and a button per step. */}
      <section id="demo" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-16 sm:py-20">
        <p className={eyebrow}>Try it</p>
        <h2 className="font-display mt-3 text-4xl sm:text-5xl">Take it apart, one step at a time.</h2>
        <p className="mt-3 text-muted">Tap a step, or drag the slider. Our demo, not the maker’s official instructions.</p>
        <div className="mt-10">
          <StepScrubber video="/3d-videos-demo.mp4" poster="/3d-videos-demo-poster.jpg" duration={22} steps={DEMO_STEPS}
            label="Demo video, 22 seconds, no sound: how to clean a French press. The plunger comes out, the grounds go into the bin, the filter comes apart into three labelled parts, the parts are washed and go back together." />
        </div>
      </section>

      {/* WHAT YOU GET, as a bento grid: one big picture, short labels, no paragraphs. */}
      <section className="rl-dark">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <p className={eyebrow}>What you get</p>
          <h2 className="font-display mt-3 text-4xl sm:text-5xl">A full video library for one product.</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className={`${card} overflow-hidden p-0 sm:col-span-2 lg:row-span-2`}>
              <Image src="/3d-steps/exploded.jpg" alt="The filter of a French press taken apart into three labelled parts: mesh, top plate and bottom plate"
                width={600} height={600} className="aspect-square w-full bg-white object-cover" />
              <div className="p-6">
                <h3 className="flex items-center gap-2 text-xl font-semibold"><Icon name="eye" className="h-5 w-5 text-accent" />Shows what a camera cannot</h3>
                <p className="mt-1 text-muted">Exploded views, parts that come apart, the inside at work.</p>
              </div>
            </div>
            <div className={card}>
              <Icon name="library" className="h-7 w-7 text-accent" />
              <h3 className="mt-4 text-lg font-semibold">One video per question</h3>
              <ul className="mt-3 flex flex-wrap gap-1.5 text-xs">
                {['Setup', 'Daily use', 'Cleaning', 'Fixes', 'Top problems'].map(t => <li key={t} className="rounded-full border border-line px-2.5 py-1 text-muted">{t}</li>)}
              </ul>
            </div>
            <div className={card}>
              <Icon name="camera" className="h-7 w-7 text-accent" />
              <h3 className="mt-4 text-lg font-semibold">Starts from photos</h3>
              <p className="mt-1 text-sm text-muted">A CAD file helps. You do not need one.</p>
            </div>
            <div className={card}>
              <Icon name="repeat" className="h-7 w-7 text-accent" />
              <h3 className="mt-4 text-lg font-semibold">Easy to update</h3>
              <p className="mt-1 text-sm text-muted">A step changes? We change that step. Nobody films again.</p>
            </div>
            <div className={card}>
              <Icon name="question" className="h-7 w-7 text-accent" />
              <h3 className="mt-4 text-lg font-semibold">From real questions</h3>
              <p className="mt-1 text-sm text-muted">Topics come from your reviews and tickets.</p>
            </div>
            <div className={`${card} sm:col-span-2`}>
              <h3 className="flex items-center gap-2 text-lg font-semibold"><Icon name="formats" className="h-5 w-5 text-accent" />Every format</h3>
              <div className="mt-5 flex items-end gap-4" aria-hidden="true">
                {[['h-24 w-[54px]', 'Phone'], ['h-[54px] w-24', 'Website'], ['h-16 w-16', 'Marketplace']].map(([size, l]) => (
                  <div key={l} className="text-center">
                    <div className={`${size} rounded-lg border-2 border-accent/70 bg-accent-soft`} />
                    <p className="mt-2 text-xs text-muted">{l}</p>
                  </div>
                ))}
              </div>
              <p className="sr-only">Tall for phones, wide for websites, square for marketplaces.</p>
            </div>
            <div className={`${card} sm:col-span-2`}>
              <h3 className="flex items-center gap-2 text-lg font-semibold"><Icon name="globe" className="h-5 w-5 text-accent" />More than one language</h3>
              <p className="mt-2 text-sm text-muted">Captions and voice can change language. Every video of a brand has the same style.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IT IS FOR, then HOW IT WORKS as a timeline. */}
      <section id="how" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-16 sm:py-20">
        <p className={eyebrow}>Who it is for</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {FOR.map(f => (
            <li key={f.title} className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent"><Icon name={f.icon} className="h-6 w-6" /></span>
              <span><span className="block font-semibold">{f.title}</span><span className="text-sm text-muted">{f.line}</span></span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-muted">The goal: fewer support tickets, fewer returns, better reviews. We do not promise a number.</p>

        <h2 className="font-display mt-16 text-4xl sm:text-5xl">How it works</h2>
        <ol className="relative mt-10 grid gap-8 sm:grid-cols-4 sm:gap-4">
          <span aria-hidden="true" className="absolute top-7 right-[12%] left-[12%] hidden h-px bg-line sm:block" />
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative flex items-start gap-4 sm:flex-col sm:items-center sm:text-center">
              <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full border border-line bg-surface text-accent">
                <Icon name={s.icon} className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-accent text-xs font-semibold text-on-accent">{i + 1}</span>
              </span>
              <span><span className="block font-semibold sm:mt-4">{s.title}</span><span className="text-sm text-muted">{s.line}</span></span>
            </li>
          ))}
        </ol>
        <p className="mt-10 flex items-start gap-3 rounded-2xl border border-line bg-surface p-5 text-sm text-muted">
          <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          A video that does not match the approved script or the real product is our mistake. We fix it free.
        </p>
      </section>

      <section className="rl-dark">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:py-20 md:grid-cols-2">
          <div>
            <p className={eyebrow}>Why video instructions</p>
            <h2 className="font-display mt-3 text-3xl sm:text-4xl">Animation helps most with hands-on steps.</h2>
            <div className="mt-6">{FINDINGS.animation.viz && <Viz viz={FINDINGS.animation.viz} />}</div>
            <Link href={WHY_PATH} className="rl-link mt-5 inline-block font-medium text-accent">See the research and its limits →</Link>
          </div>
          <div>
            <p className={eyebrow}>Honest limits</p>
            <h2 className="font-display mt-3 text-3xl sm:text-4xl">What this is not.</h2>
            <ul className="mt-6 grid gap-3">
              {LIMITS.map(l => (
                <li key={l} className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5 text-muted">
                  <Icon name="x" className="h-5 w-5 shrink-0 text-muted" />{l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pt-16 pb-4 text-center">
        <h2 className="font-display text-3xl sm:text-4xl">Start with one product.</h2>
        <p className="mx-auto mt-3 max-w-[34rem] text-muted">
          Pick a plan on the sign-up page. Questions first? <a className="rl-link text-accent" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        </p>
        <Link href={V3D_SIGNUP_PATH} className={`${primary} mt-6`}>Sign up</Link>
      </section>
      <ServiceJsonLd />
    </>
  )
}
