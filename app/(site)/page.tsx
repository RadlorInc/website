import Link from 'next/link'
import Image from 'next/image'
import { APP_NAME, ASK_NAME, COMPANY, SITE_URL, TAGLINE, V3D_CTA, V3D_LINE, V3D_NAME, V3D_PATH, V3D_SIGNUP_PATH, VISION, WHY_PATH } from '@/site'
import { posts } from '@/content/posts'
import { FINDINGS, HOME_EVIDENCE, SOURCES } from '@/content/evidence'
import { ProductTabs, type TabProduct } from '@/components/visual/ProductTabs'
import { Viz } from '@/components/visual/Viz'
import { POST_COVERS } from '@/components/scroll/art'

/**
 * The home page is the COMPANY's page (founder, 2026-10-22), and since 2026-11-22 it says ONE thing: Radlor makes
 * learning and teaching visual. Then the three products at equal weight, each with what it is, who it is for, its
 * benefits and one button. Then three findings from the research page, then why we build.
 *
 * ⚠️ Every product line below restates that product's own page (/radlic, /askradlor, /3dlor); add no claim here
 * that its page does not make. Standing rules: no price and no age label for Ask Radlor, never say how any video is
 * made, no people or animals in the 3D product's pictures.
 *
 * ⚠️ THE PAGE IS A SERVER COMPONENT. Its one client island is `ProductTabs` (2026-11-22, founder: "make it visual
 * and interactive"); every product's text is still in the server HTML.
 */


/** One row per product, in tab order: 3Dlor, Ask Radlor, Radlic (founder, 2026-11-23). `chips` are the benefits as 2-5 word labels with an icon (founder, 2026-11-22: less text). */
const PRODUCTS: (TabProduct & { pic: { src: string; w: number; h: number } })[] = [
  {
    id: '3d',
    name: V3D_NAME,
    who: 'For product brands',
    line: 'Short 3D videos that show your customers how to set up, use, clean and fix your product.',
    chips: [
      { icon: 'library', label: 'A full library, not one video' },
      { icon: 'camera', label: 'Starts from product photos' },
      { icon: 'box', label: 'Exploded views' },
      { icon: 'formats', label: 'Tall, wide and square' },
    ],
    page: V3D_PATH,
    cta: `See ${V3D_NAME}`,
    media: { video: '/3d-videos-demo.mp4', poster: '/3d-videos-demo-poster.jpg', w: 720, h: 1280, label: 'Demo, no sound: how to clean a French press, with the filter taken apart into three labelled parts' },
    pic: { src: '/3d-videos-card.jpg', w: 1600, h: 1000 },
  },
  {
    id: 'ask',
    name: ASK_NAME,
    who: 'For students and curious people',
    line: 'Type a question. A short voiced video draws the answer, step by step.',
    chips: [
      { icon: 'chat', label: 'Ask anything' },
      { icon: 'voice', label: 'A voice explains each step' },
      { icon: 'repeat', label: 'Follow-up in the same chat' },
      { icon: 'library', label: 'Videos stay in your library' },
    ],
    page: '/askradlor',
    cta: `See ${ASK_NAME}`,
    media: { video: '/askradlor-demo.mp4', poster: '/askradlor-demo-poster.jpg', w: 814, h: 512, label: 'Ask Radlor demo, no sound: a heart is drawn on a whiteboard and its conducting system is labelled step by step' },
    pic: { src: '/askradlor-demo-poster.jpg', w: 814, h: 512 },
  },
  {
    id: 'radlic',
    name: APP_NAME,
    who: 'For children and parents · Math K–8',
    line: 'A teacher at the chalkboard explains one idea. Then practice follows your child.',
    chips: [
      { icon: 'board', label: 'One idea per lesson' },
      { icon: 'adapt', label: 'Practice that adapts' },
      { icon: 'pencil', label: 'Worked steps, no red marks' },
      { icon: 'shield', label: 'No email for a child' },
    ],
    page: '/radlic',
    cta: `See ${APP_NAME}`,
    media: { video: '/radlic-demo.mp4', poster: '/radlic-demo-poster.jpg', w: 1920, h: 1080, label: `${APP_NAME} demo, no sound: a child picks a math topic and a lesson plays at the chalkboard` },
    pic: { src: '/radlic-demo-poster.jpg', w: 1920, h: 1080 },
  },
]

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
          <p className="mt-6 max-w-[38rem] text-xl leading-relaxed text-muted">
            {COMPANY} builds products that explain by showing.
          </p>
          {/* ONE PRIMARY ACTION (founder, 2026-11-23: 3Dlor first): its sign-up, then its page as the quiet second.
              The other two products stay one link away and in the tabs below. */}
          <p className="mt-8 text-lg"><span className="font-semibold">{V3D_NAME}</span> <span className="text-muted">· {V3D_LINE}</span></p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={V3D_SIGNUP_PATH} className={`${primary} font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}>{V3D_CTA}</Link>
            <Link href={V3D_PATH} className={quiet}>See {V3D_NAME}</Link>
          </div>
          <a href="#products" className="rl-link mt-5 inline-block text-sm text-muted hover:text-foreground">Or see all three products ↓</a>
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

      {/* THE THREE PRODUCTS, EQUAL WEIGHT: one tab each, each with its own demo video (2026-11-22: less text, more to
          watch). All three panels are in the HTML; see ProductTabs. */}
      <section id="products" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-16 sm:py-20">
        <p className={eyebrow}>Our products</p>
        <h2 className="font-display mt-3 text-4xl sm:text-5xl">Three products, one idea: show it.</h2>
        <div className="mt-10"><ProductTabs products={PRODUCTS} /></div>
      </section>

      {/* WHY VISUAL: three findings from the research page, as their own charts. The full list is on WHY_PATH. */}
      <section className="rl-dark">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <p className={eyebrow}>Why visual learning works</p>
          <h2 className="font-display mt-3 max-w-[40rem] text-4xl sm:text-5xl">This is research, not a slogan.</h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {HOME_EVIDENCE.map(id => FINDINGS[id]).map(f => (
              <li key={f.id} className="flex flex-col rounded-2xl border border-line bg-surface p-5">
                {f.viz && <Viz viz={f.viz} compact />}
                <h3 className="mt-5 text-lg font-semibold leading-snug">{f.short}</h3>
                <p className="mt-auto pt-4 text-sm text-muted">
                  {f.evidence} ·{' '}
                  <a href={SOURCES[f.refs[0]].url} rel="noopener" className="text-accent underline underline-offset-4">{SOURCES[f.refs[0]].short}</a>
                </p>
              </li>
            ))}
          </ul>
          <Link href={WHY_PATH} className={`${quiet} mt-10`}>See all the research and its limits →</Link>
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
                  <Image src={POST_COVERS[p.slug].src} alt="" width={POST_COVERS[p.slug].w} height={POST_COVERS[p.slug].h} className={`h-44 w-auto mx-auto${POST_COVERS[p.slug].photo ? ' rl-photo' : ''}`} />
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
