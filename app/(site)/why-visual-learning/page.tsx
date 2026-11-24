/**
 * radlor.com/why-visual-learning — the research behind all three products (founder, 2026-11-22).
 *
 * ⚠️ THIS PAGE HOLDS NO CLAIM OF ITS OWN. Every finding, limit and source is in `content/evidence.ts`, and the rules
 * for adding one are at the top of that file: a real source that somebody opened, a claim no stronger than the source,
 * and the limit beside it. The page only lays the data out: the short answer, the sections, what we do not claim,
 * how the products use it, and the numbered source list that every [n] links to.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { COMPANY, SITE_URL, V3D_NAME, V3D_PATH, WHY_PATH } from '@/site'
import { CHECKED_ON, NOT_CLAIMED, SECTIONS, SOURCES, SOURCE_ORDER, type SourceId } from '@/content/evidence'
import { WhyStory } from '@/components/visual/WhyStory'

const TITLE = 'Why visuals make things clear'

export const metadata: Metadata = {
  title: TITLE,
  description:
    'People understand better from words and pictures together than from words alone. Here is the research from psychology, medicine and how-to tasks, where it is mixed, and every source.',
  alternates: { canonical: WHY_PATH },
  openGraph: { url: `${SITE_URL}${WHY_PATH}`, title: `${TITLE} · ${COMPANY}`, type: 'article' },
}

const num = (id: SourceId) => SOURCE_ORDER.indexOf(id) + 1

/** The bracketed source numbers after a finding. Each is a link to its row in the source list. */
function Refs({ ids }: { ids: readonly SourceId[] }) {
  return (
    <span className="whitespace-nowrap text-sm">
      {ids.map(id => (
        <a key={id} href={`#source-${num(id)}`} aria-label={`Source ${num(id)}: ${SOURCES[id].short}`}
          className="ml-1 inline-block rounded px-1 py-0.5 text-accent underline underline-offset-2 hover:bg-accent-soft">
          [{num(id)}]
        </a>
      ))}
    </span>
  )
}

export default function WhyVisualLearning() {
  return (
    <>
      <section className="mx-auto max-w-[76rem] px-6 pt-14 pb-6 sm:pt-24">
        <h1 className="font-display max-w-[14ch] text-[2.9rem] leading-[0.98] sm:text-8xl">Why visuals make things clear.</h1>
        <p className="mt-6 max-w-[34rem] text-xl leading-relaxed text-muted">
          Six short ideas from research. Scroll, and watch each one happen.
        </p>
      </section>

      <WhyStory />

      <div className="mx-auto max-w-5xl px-6">
        <section id="not-claimed" className="scroll-mt-20 py-20">
          <h2 className="font-display text-4xl leading-tight sm:text-6xl">What we do not claim.</h2>
          <dl className="mt-10 border-t border-line">
            {NOT_CLAIMED.map(n => (
              <div key={n.title} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[20rem_1fr] sm:gap-8">
                <dt className="text-lg font-semibold leading-snug">{n.title}</dt>
                <dd className="leading-relaxed text-muted">{n.body}{n.refs.length > 0 && <Refs ids={n.refs} />}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-muted">This research is about learning in general. It does not test our products, and we do not say that it does.</p>
        </section>

        <section id="evidence" className="scroll-mt-20 py-10">
          <h2 className="font-display text-4xl leading-tight sm:text-6xl">All the research, with its limits.</h2>
          {SECTIONS.map(sec => (
            <div key={sec.id} className="mt-12">
              <h3 className="text-xl font-semibold">{sec.eyebrow}</h3>
              <ul className="mt-4 border-t border-line">
                {sec.findings.map(f => (
                  <li key={f.id} className="border-b border-line">
                    <details className="group">
                      <summary className="flex min-h-14 cursor-pointer list-none items-baseline justify-between gap-4 py-4 text-lg hover:text-accent [&::-webkit-details-marker]:hidden">
                        {f.short}<span aria-hidden="true" className="text-2xl leading-none group-open:rotate-45">+</span>
                      </summary>
                      <div className="max-w-[44rem] pb-6 leading-relaxed text-muted">
                        <p>{f.body}<Refs ids={f.refs} /></p>
                        <p className="mt-3"><strong className="font-semibold text-foreground">The limit. </strong>{f.limit}</p>
                        <p className="mt-3 text-sm">Kind of evidence: {f.evidence.toLowerCase()}.</p>
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="mt-12"><Link href={V3D_PATH} className="font-medium underline underline-offset-4 hover:text-accent">See how {V3D_NAME} uses this</Link></p>
        </section>

        <section id="sources" className="scroll-mt-20 py-14">
          <h2 className="font-display mt-3 text-4xl leading-tight">Every source on this page.</h2>
          <p className="mt-4 leading-relaxed text-muted">
            We opened each source and compared it with our sentence. Last check: {CHECKED_ON}. Many journal articles
            need a subscription for the full text; the abstract is free to read. If you find a mistake, write to us on
            the <Link href="/contact" className="text-accent underline underline-offset-4">contact page</Link>.
          </p>
          <ol className="mt-8 list-decimal gap-10 space-y-3 pl-6 text-sm leading-relaxed text-muted marker:text-foreground md:columns-2">
            {SOURCE_ORDER.map((id, i) => (
              <li key={id} id={`source-${i + 1}`} className="scroll-mt-24 break-inside-avoid break-words pl-1 target:text-foreground">
                {SOURCES[id].cite}{' '}
                <a href={SOURCES[id].url} rel="noopener" className="text-accent underline underline-offset-4">{SOURCES[id].url.replace(/^https?:\/\//, '')}</a>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${SITE_URL}${WHY_PATH}#article`,
        headline: TITLE,
        description: metadata.description,
        url: `${SITE_URL}${WHY_PATH}`,
        author: { '@id': `${SITE_URL}/#organization` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        isPartOf: { '@id': `${SITE_URL}/#website` },
        citation: SOURCE_ORDER.map(id => SOURCES[id].url),
      })}</script>
    </>
  )
}
