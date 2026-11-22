/**
 * radlor.com/3d-videos — the third product (founder, 2026-11-22): 3D how-to, setup and support video libraries for
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
 * ⚠️ The sign-up route (`/3d-videos/signup`) is built in a separate change. This page only links to it.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
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

const BENEFITS = [
  { title: 'A full library, not one video', body: 'Setup, daily use, cleaning, fixes and the most common problems. One short video for each question.' },
  { title: 'Product photos are enough', body: 'We build the 3D model of your product from photos. A CAD file makes the model better, but you do not need one.' },
  { title: 'Shows what a camera cannot', body: 'Exploded views, parts that come apart, and the inside of the product while it works.' },
  { title: 'Easy to update', body: 'When a part or a step changes, we change that step and make the video again. Nobody films again.' },
  { title: 'Every format, more than one language', body: 'Tall for phones, wide for your website and video channels, square for marketplaces. Captions and voice can change language.' },
  { title: 'Built from real customer questions', body: 'We choose the topics from your reviews and your support tickets, so each video answers a question people ask.' },
]

const STEPS = [
  { title: 'Send product photos', body: 'And a CAD file if you have one. Tell us what your customers ask most.' },
  { title: 'We plan the library', body: 'We list the videos: setup, use, care and the top problems from reviews and support tickets.' },
  { title: 'You approve each script', body: 'You see the script and still frames before we make a video. Two rounds of changes are included.' },
  { title: 'You get the videos', body: 'In tall, wide and square formats, ready for your product page, your help page and your marketplace listing.' },
]

const LIMITS = [
  'The look is clean 3D. It is not a photoreal advert.',
  'Products with many parts, cables or electronics take more time.',
  'You approve every step. You are responsible for the accuracy of the steps.',
  'We are new. We do not have customer case studies yet.',
]

const btn = 'rl-cta inline-flex min-h-11 items-center rounded-full px-6 py-3 font-medium'
const primary = `${btn} bg-accent text-on-accent hover:opacity-90`
const quiet = `${btn} rl-cta-quiet border border-line hover:border-foreground transition-colors`
const eyebrow = 'text-sm uppercase tracking-[0.18em] text-accent font-medium'

export default function ThreeDVideos() {
  return (
    <>
      <section className="rl-dark overflow-x-clip">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 pt-12 pb-16 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] sm:pt-16 sm:pb-20">
          <div>
            <p className={eyebrow}>For product brands</p>
            <h1 className="rl-focus font-display mt-4 text-[2.5rem] leading-[1.05] sm:text-6xl">
              Show customers how your product <span className="rl-lit">works</span>.
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted">
              {V3D_NAME} is a library of short 3D videos for one product: how to set it up, use it, clean it and fix
              it. Your customers watch the step, then do the step.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={V3D_SIGNUP_PATH} className={primary}>Sign up</Link>
              <a href="#how" className={quiet}>How it works</a>
            </div>
            <p className="mt-4 text-sm text-muted">Plans are on the sign-up page.</p>
          </div>
          <figure className="mx-auto w-full max-w-[300px]">
            <video
              className="aspect-[9/16] w-full rounded-3xl border border-line bg-surface"
              src="/3d-videos-demo.mp4" poster="/3d-videos-demo-poster.jpg" width={720} height={1280}
              controls muted loop playsInline preload="none"
              aria-label="Demo video, 22 seconds, no sound: how to clean a French press. The plunger comes out, the used grounds go into the bin, the filter comes apart into three labelled parts, and the parts go back together."
            />
            <figcaption className="mt-3 text-center text-sm text-muted">
              Our demo: how to clean a French press. It is a demo, not the maker’s official instructions.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <p className={eyebrow}>Who it is for</p>
        <h2 className="font-display mt-3 max-w-[40rem] text-4xl sm:text-5xl">Brands whose customers must set up, assemble or look after the product.</h2>
        <p className="mt-5 max-w-[42rem] text-lg leading-relaxed text-muted">
          Furniture and fitness equipment that people assemble. Devices that people install. Kitchen and home products
          that people clean and maintain. The goal is fewer support tickets, fewer returns and better reviews. We do
          not promise a number.
        </p>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map(b => (
            <li key={b.title} className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="font-display text-2xl leading-snug">{b.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{b.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="how" className="rl-dark scroll-mt-16">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <p className={eyebrow}>How it works</p>
          <h2 className="font-display mt-3 text-4xl sm:text-5xl">Four steps, and you approve each video.</h2>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-line bg-surface p-6">
                <span aria-hidden="true" className="font-display text-3xl text-accent">{i + 1}</span>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-[42rem] leading-relaxed text-muted">
            If a video does not match the approved script or the real product, that is our mistake and we fix it free.
            We make the videos with our own 3D system, and every video of a brand has the same style.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:py-20 md:grid-cols-2">
        <div>
          <p className={eyebrow}>Honest limits</p>
          <h2 className="font-display mt-3 text-3xl sm:text-4xl">What this is not.</h2>
          <ul className="mt-6 space-y-3 text-muted">
            {LIMITS.map(l => (
              <li key={l} className="flex gap-3 leading-relaxed">
                <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{l}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={eyebrow}>Why video instructions</p>
          <h2 className="font-display mt-3 text-3xl sm:text-4xl">People follow a step better when they can see it.</h2>
          <p className="mt-6 leading-relaxed text-muted">
            Research on instructions finds that pictures and animations help most with physical, step-by-step tasks.
            The research also has limits, and we list both.
          </p>
          <Link href={WHY_PATH} className="rl-link mt-5 inline-block font-medium text-accent">Read the research and its sources →</Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-4 text-center">
        <h2 className="font-display text-3xl sm:text-4xl">Start with one product.</h2>
        <p className="mx-auto mt-3 max-w-[34rem] text-muted">
          Sign up, tell us about the product, and pick a plan on the sign-up page. Questions first? Write to{' '}
          <a className="rl-link text-accent" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
        <Link href={V3D_SIGNUP_PATH} className={`${primary} mt-6`}>Sign up</Link>
      </section>
      <ServiceJsonLd />
    </>
  )
}
