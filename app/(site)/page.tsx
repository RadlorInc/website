import Link from 'next/link'
import Image from 'next/image'
import { ASK_NAME, COMPANY, SITE_URL, TAGLINE, V3D_NAME, V3D_PATH, VISION, WHY_PATH } from '@/site'
import { posts } from '@/content/posts'
import { HOME_EVIDENCE, SOURCES } from '@/content/evidence'
import { POST_COVERS } from '@/components/scroll/art'

/**
 * The home page is the COMPANY's page (founder, 2026-10-22), and since 2026-11-22 it says ONE thing: Radlor makes
 * learning and teaching visual. Then the three products at equal weight, each with what it is, who it is for, its
 * benefits and one button. Then three findings from the research page, then why we build.
 *
 * ⚠️ Every product line below restates that product's own page (/radlic, /askradlor, /3d-videos); add no claim here
 * that its page does not make. Standing rules: no price and no age label for Ask Radlor, never say how any video is
 * made, no people or animals in the 3D product's pictures.
 *
 * ⚠️ STAYS A SERVER COMPONENT: no client JS on this page. (The hero's circle-reveal picture went on 2026-11-22;
 * the first screen is now the message alone.)
 */

/** The kids' maths app is called Radlic again (founder, 2026-11-22). `APP_NAME` in site.ts changes in its own pull
 *  request; when that is merged, replace this constant with `APP_NAME`. */
const RADLIC = 'Radlic'

const PRODUCTS = [
  {
    name: ASK_NAME,
    who: 'For students and curious people',
    what: 'Type a question. A short voiced video draws the answer step by step on a whiteboard.',
    benefits: [
      'Biology, physics, chemistry, home improvements and auto repairs',
      'One question, one video, one step at a time',
      'Ask a follow-up in the same chat',
      'Your videos stay in your library',
    ],
    pic: { src: '/askradlor-demo-poster.jpg', w: 814, h: 512, alt: 'An Ask Radlor answer: a heart drawn on a whiteboard with its conducting system labelled, from the SA node to the Purkinje fibres' },
    page: '/askradlor',
    cta: `See ${ASK_NAME}`,
  },
  {
    name: RADLIC,
    who: 'For children and parents · Math, grades K–8',
    what: 'Math lessons that adapt. A teacher at the chalkboard explains one idea, then practice follows what your child gets right and wrong.',
    benefits: [
      'A voice reads every line as it appears on the board',
      'Practice changes question by question',
      'A miss brings the worked steps, not a red mark',
      'Parents choose the lessons; a child needs no email',
    ],
    pic: { src: '/radlic-demo-poster.jpg', w: 1920, h: 1080, alt: `The ${RADLIC} app: picking a math topic by grade` },
    page: '/radlic',
    cta: `See ${RADLIC}`,
  },
  {
    name: V3D_NAME,
    who: 'For product brands',
    what: 'A library of short 3D videos that show your customers how to set up, use, clean and fix your product.',
    benefits: [
      'A full library for one product, not one video',
      'We start from product photos',
      'Exploded views show what a camera cannot',
      'Tall, wide and square formats',
    ],
    pic: { src: '/3d-videos-card.jpg', w: 1600, h: 1000, alt: 'Three frames of a 3D how-to video: a French press, its plunger pulled out, and its filter taken apart into three labelled parts' },
    page: V3D_PATH,
    cta: 'See 3D videos',
  },
]

const Check = () => (
  <svg viewBox="0 0 20 20" className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true">
    <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const btn = 'rl-cta inline-flex min-h-11 items-center rounded-full px-6 py-3 font-medium'
const primary = `${btn} bg-accent text-on-accent hover:opacity-90`
const quiet = `${btn} rl-cta-quiet border border-line hover:border-foreground transition-colors`
const eyebrow = 'text-sm uppercase tracking-[0.18em] text-accent font-medium'

export default function Home() {
  return (
    <>
      {/* ONE MESSAGE. No product is named in the heading; the three products come next. */}
      <section className="rl-dark overflow-x-clip">
        <div className="mx-auto grid max-w-5xl items-center gap-12 px-6 pt-16 pb-20 sm:pt-24 sm:pb-24 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          <div>
          <p className={eyebrow}>{COMPANY} · Visual learning and teaching</p>
          <h1 className="rl-focus font-display mt-4 max-w-[18ch] text-[2.75rem] leading-[1.03] sm:text-7xl">
            When you can see it, you can <span className="rl-lit">understand</span> it.
          </h1>
          <p className="mt-6 max-w-[38rem] text-lg leading-relaxed text-muted">
            {COMPANY} builds products that explain by showing: a math lesson at the chalkboard, an answer drawn step
            by step, a product taken apart in 3D.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#products" className={primary}>See the three products</a>
            <Link href={WHY_PATH} className={quiet}>Why visual learning works</Link>
          </div>
          </div>
          {/* One frame from each product, stacked. Decorative: the cards below name and describe each one. */}
          <div aria-hidden="true" className="relative mx-auto hidden aspect-[4/5] w-full max-w-[340px] md:block">
            {PRODUCTS.map((p, i) => (
              <Image key={p.name} src={p.pic.src} alt="" width={p.pic.w} height={p.pic.h}
                className="absolute aspect-[16/11] w-[86%] rounded-2xl border border-line object-cover object-top shadow-2xl shadow-black/60"
                style={{ top: `${i * 31}%`, left: i === 1 ? '14%' : '0%', rotate: `${[-3, 2.5, -1.5][i]}deg` }} />
            ))}
          </div>
        </div>
      </section>

      {/* THE THREE PRODUCTS, EQUAL WEIGHT: same card, same parts, one button each. */}
      <section id="products" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-16 sm:py-20">
        <p className={eyebrow}>Our products</p>
        <h2 className="font-display mt-3 text-4xl sm:text-5xl">Three products, one idea: show it.</h2>
        <ul className="mt-10 grid gap-6 lg:grid-cols-3">
          {PRODUCTS.map(p => (
            <li key={p.name} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
              <Image src={p.pic.src} alt={p.pic.alt} width={p.pic.w} height={p.pic.h}
                className="aspect-[16/10] w-full border-b border-line object-cover object-top" />
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs uppercase tracking-[0.14em] text-muted font-medium">{p.who}</p>
                <h3 className="font-display mt-2 text-3xl">{p.name}</h3>
                <p className="mt-3 leading-relaxed text-muted">{p.what}</p>
                <ul className="mt-5 flex-1 space-y-2.5 text-[0.95rem] leading-snug">
                  {p.benefits.map(b => <li key={b} className="flex gap-2.5"><Check />{b}</li>)}
                </ul>
                <Link href={p.page} className={`${primary} mt-7 self-start`}>{p.cta}</Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* WHY VISUAL: three findings from the research page, each with its source. The full list is on WHY_PATH. */}
      <section className="rl-dark">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <p className={eyebrow}>Why visual learning works</p>
          <h2 className="font-display mt-3 max-w-[40rem] text-4xl sm:text-5xl">This is research, not a slogan.</h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {HOME_EVIDENCE.map(e => (
              <li key={e.title} className="flex flex-col rounded-2xl border border-line bg-surface p-6">
                <h3 className="font-display text-2xl leading-snug">{e.title}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-muted">{e.body}</p>
                <p className="mt-4 text-sm text-muted">
                  Source:{' '}
                  <a href={SOURCES[e.source].url} rel="noopener" className="text-accent underline underline-offset-4">{SOURCES[e.source].short}</a>
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-[42rem] leading-relaxed text-muted">
            We do not use the “learning styles” idea or the popular “people remember 80% of what they see” numbers.
            The evidence does not support them.
          </p>
          <Link href={WHY_PATH} className="rl-link mt-6 inline-block text-accent font-medium">Read the research, its limits and every source →</Link>
        </div>
      </section>

      {/* WHY WE BUILD: the founder's belief, word for word from site.ts. */}
      <section id="why" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-16 sm:py-20">
        <p className={eyebrow}>Why we build</p>
        <blockquote className="font-display mt-4 max-w-[46rem] text-3xl leading-snug sm:text-4xl">“{VISION}”</blockquote>
        <Link href="/about" className="rl-link mt-8 inline-block text-accent font-medium">More about {COMPANY} →</Link>
      </section>

      {posts.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-3xl">Writing</h2>
            <Link href="/writing" className="rl-link text-sm text-accent">All posts →</Link>
          </div>
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {posts.slice(0, 3).map(p => (
              <li key={p.slug}>
                <Link href={`/writing/${p.slug}`} className="group block">
                  <Image src={POST_COVERS[p.slug].src} alt="" width={POST_COVERS[p.slug].w} height={POST_COVERS[p.slug].h} className="h-44 w-auto mx-auto" />
                  <span className="mt-4 block font-display text-xl leading-snug group-hover:text-accent transition-colors">{p.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mx-auto max-w-5xl px-6 pb-20 text-center">
        <h2 className="font-display text-3xl sm:text-4xl">Want to build with us?</h2>
        <p className="mt-3 text-muted">Brands, schools, partners, press, or just a question.</p>
        <Link href="/contact" className={`${primary} mt-6`}>Talk to us</Link>
      </section>

      <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': `${SITE_URL}/#webpage`,
            url: SITE_URL,
            name: `${COMPANY} — ${TAGLINE}`,
            isPartOf: { '@id': `${SITE_URL}/#website` },
            about: { '@id': `${SITE_URL}/#organization` },
          })}</script>
    </>
  )
}
