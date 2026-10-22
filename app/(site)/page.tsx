import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { APP_NAME, ASK_NAME, COMPANY, SITE_URL, TAGLINE, VISION } from '@/site'
import { posts } from '@/content/posts'
import { CircleReveal } from '@/components/scroll/Scroll'
import { ART, POST_COVERS } from '@/components/scroll/art'

/**
 * The home page is the COMPANY's page, not a product's (founder, 2026-10-22: "Radlic dominates, askRadlor is nowhere;
 * the site should show our vision and why we build"). So: who we are and why, then the two products side by side at
 * equal weight, then what they share. Each product's own pitch lives on its landing page (/radlic, /askradlor).
 *
 * ⚠️ Replaced the scroll "journey" first screen (founder's pick 2026-09-25, in git before this change) and the Radlic
 * facts band. Every product line below restates that product's own landing page; add no claim here that its page
 * does not make.
 *
 * ⚠️ STAYS A SERVER COMPONENT — no client JS on this page beyond the shared scroll styles.
 */

const PRODUCTS = [
  {
    name: APP_NAME,
    who: 'For children · Math, grades K–8',
    line: 'Math lessons that adapt. A teacher at the chalkboard, one idea at a time, then practice that follows what your child gets right and wrong.',
    pic: { src: '/radlic-demo-poster.jpg', w: 1920, h: 1080, alt: 'The Radlic app: picking a math topic by grade' },
    page: '/radlic',
  },
  {
    name: ASK_NAME,
    who: 'For ages 13+ · Any question',
    line: 'Ask anything, watch it drawn. Type a question and a short voiced video draws the answer step by step on a whiteboard.',
    pic: { src: '/askradlor-demo-poster.jpg', w: 814, h: 512, alt: 'An askRadlor answer: a heart drawn on a whiteboard with its conducting system labelled, from the SA node to the Purkinje fibres' },
    page: '/askradlor',
  },
]

/** What both products share. Each line must be true of BOTH — check both landing pages before adding one. */
const SHARED: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: 'A teacher at the board',
    body: `Both teach by drawing. A voice explains each step as it appears: chalk in ${APP_NAME}, a whiteboard in ${ASK_NAME}.`,
    icon: <><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M12 16v4M8 20h8M7 12l3-3 2 2 4-4" /></>,
  },
  {
    title: 'One idea at a time',
    body: `A ${APP_NAME} lesson explains one idea. An ${ASK_NAME} video answers one question. Step by step, never all at once.`,
    icon: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></>,
  },
  {
    title: 'It answers back',
    body: `${APP_NAME}’s practice changes with every answer. In ${ASK_NAME} you ask a follow-up in the same chat.`,
    icon: <><path d="M20 12a8 8 0 0 1-13.7 5.7L4 20v-5h5" /><path d="M4 12a8 8 0 0 1 13.7-5.7L20 4v5h-5" /></>,
  },
  {
    title: 'Honest by default',
    body: `${APP_NAME} asks no email of a child. ${ASK_NAME} says plainly that AI answers can be wrong.`,
    icon: <><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></>,
  },
]


const btn = 'rl-cta inline-flex min-h-11 items-center rounded-full px-6 py-3 font-medium'
const primary = `${btn} bg-accent text-on-accent hover:opacity-90`
const quiet = `${btn} rl-cta-quiet border border-line hover:border-foreground transition-colors`

export default function Home() {
  return (
    <>
      {/* WHO WE ARE AND WHY — the company, no product named in the first screen's heading. */}
      <section className="rl-dark overflow-x-clip">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 pt-14 pb-20 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] sm:pt-20 sm:pb-24">
          <div className="order-2 sm:order-1">
            <p className="text-sm uppercase tracking-[0.18em] text-accent font-medium">{COMPANY} · Education technology</p>
            <h1 className="rl-focus font-display mt-4 text-[2.6rem] leading-[1.05] sm:text-6xl">
              Learning that adapts to the <span className="rl-lit">learner</span>.
            </h1>
            <p className="mt-6 max-w-[32rem] text-lg leading-relaxed text-muted">
              We build learning products that teach the way a good teacher does: one idea at a time, drawn out on a
              board, and changed by how you answer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#products" className={primary}>See our products</a>
              <a href="#why" className={quiet}>Why we build</a>
            </div>
          </div>
          <CircleReveal pic={ART.journeyTreasure} priority className="order-1 sm:order-2 w-56 sm:w-full max-w-[420px] justify-self-center" />
        </div>
      </section>

      {/* THE TWO PRODUCTS, EQUAL WEIGHT: same card, same size, one link each (the Try / Explore buttons live on each product page, not here). Order is launch order. */}
      <section id="products" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-16 sm:py-20">
        <p className="text-sm uppercase tracking-[0.18em] text-accent font-medium">Our products</p>
        <h2 className="font-display mt-3 text-4xl sm:text-5xl">Two products, one way of teaching.</h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {PRODUCTS.map(p => (
            <li key={p.name}>
              <Link href={p.page} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-accent">
                <Image src={p.pic.src} alt={p.pic.alt} width={p.pic.w} height={p.pic.h}
                  className="aspect-[16/10] w-full border-b border-line object-cover object-top" />
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <span className="text-xs uppercase tracking-[0.16em] text-muted font-medium">{p.who}</span>
                  <h3 className="font-display mt-2 text-3xl">{p.name}</h3>
                  <span className="mt-3 flex-1 leading-relaxed text-muted">{p.line}</span>
                  <span className="mt-6 font-medium text-accent">Learn more <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span></span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* WHY WE BUILD — the founder's belief, word for word from site.ts, then what both products hold to. */}
      <section id="why" className="rl-dark scroll-mt-16">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <p className="text-sm uppercase tracking-[0.18em] text-accent font-medium">Why we build</p>
          <blockquote className="font-display mt-4 max-w-[46rem] text-3xl leading-snug sm:text-4xl">“{VISION}”</blockquote>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2">
            {SHARED.map(s => (
              <li key={s.title} className="rounded-2xl border border-line bg-surface p-6">
                <svg viewBox="0 0 24 24" className="h-7 w-7 text-accent" fill="none" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{s.icon}</svg>
                <h3 className="font-display mt-4 text-2xl">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ul>
          <Link href="/about" className="rl-link mt-10 inline-block text-accent font-medium">More about {COMPANY} →</Link>
        </div>
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
        <p className="mt-3 text-muted">Schools, partners, press, or just a question.</p>
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
