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
import { ASK_NAME, COMPANY, SITE_URL, V3D_NAME, V3D_PATH, WHY_PATH } from '@/site'
import { CHECKED_ON, NOT_CLAIMED, SECTIONS, SOURCES, SOURCE_ORDER, type SourceId } from '@/content/evidence'

const TITLE = 'Why visual learning works'

export const metadata: Metadata = {
  title: TITLE,
  description:
    'People learn better from words and pictures together than from words alone. Here is the research from psychology, medicine and education, where it is mixed, and every source.',
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

const eyebrow = 'text-sm uppercase tracking-[0.18em] text-accent font-medium'

export default function WhyVisualLearning() {
  return (
    <>
      <section className="rl-dark overflow-x-clip">
        <div className="mx-auto max-w-3xl px-6 pt-14 pb-14 sm:pt-20 sm:pb-16">
          <p className={eyebrow}>The research</p>
          <h1 className="rl-focus font-display mt-4 text-[2.75rem] leading-[1.03] sm:text-7xl">
            Why visual learning <span className="rl-lit">works</span>.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            The short answer: people learn better from words and pictures together than from words alone. This holds
            when the picture shows the idea and nothing distracting sits beside it. It does not hold for every picture, every
            video or every task. Below are the findings, their limits and the sources.
          </p>
          <nav aria-label="On this page" className="mt-8">
            <ul className="flex flex-wrap gap-2 text-sm">
              {[...SECTIONS.map(s => ({ id: s.id, label: s.nav })), { id: 'not-claimed', label: 'What we do not claim' }, { id: 'sources', label: 'Sources' }].map(l => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 hover:border-foreground transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6">
        {SECTIONS.map(sec => (
          <section key={sec.id} id={sec.id} className="scroll-mt-20 border-b border-line py-14">
            <p className={eyebrow}>{sec.eyebrow}</p>
            <h2 className="font-display mt-3 text-4xl leading-tight">{sec.title}</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">{sec.intro}</p>
            <ul className="mt-8 space-y-5">
              {sec.findings.map(f => (
                <li key={f.title} className="rounded-2xl border border-line bg-surface p-6">
                  <h3 className="text-xl font-semibold leading-snug">{f.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{f.body}<Refs ids={f.refs} /></p>
                  <p className="mt-4 border-l-2 border-line pl-4 text-[0.95rem] leading-relaxed text-muted">
                    <strong className="font-semibold text-foreground">The limit. </strong>{f.limit}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section id="not-claimed" className="scroll-mt-20 border-b border-line py-14">
          <p className={eyebrow}>Honest limits</p>
          <h2 className="font-display mt-3 text-4xl leading-tight">What we do not claim.</h2>
          <ul className="mt-8 space-y-6">
            {NOT_CLAIMED.map(n => (
              <li key={n.title}>
                <h3 className="text-xl font-semibold leading-snug">{n.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{n.body}{n.refs.length > 0 && <Refs ids={n.refs} />}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-b border-line py-14">
          <p className={eyebrow}>What we do with it</p>
          <h2 className="font-display mt-3 text-4xl leading-tight">How our products use this.</h2>
          <ul className="mt-8 space-y-6 leading-relaxed text-muted">
            <li>
              <Link href="/askradlor" className="font-semibold text-accent underline underline-offset-4">{ASK_NAME}</Link>{' '}
              answers one question as one short video. A voice explains each step while the step is drawn, so the words
              and the picture arrive together.
            </li>
            <li>
              <Link href="/radlic" className="font-semibold text-accent underline underline-offset-4">Radlic</Link>{' '}
              teaches one math idea in one lesson. The teacher writes or draws each step on the chalkboard and says it
              aloud, then the child practices.
            </li>
            <li>
              <Link href={V3D_PATH} className="font-semibold text-accent underline underline-offset-4">{V3D_NAME}</Link>{' '}
              show one task in one short video: the product, the part that moves and where it goes, with a short
              caption for each step.
            </li>
          </ul>
          <p className="mt-6 leading-relaxed text-muted">
            This research is about learning in general. It does not test our products, and we do not say that it does.
          </p>
        </section>

        <section id="sources" className="scroll-mt-20 py-14">
          <p className={eyebrow}>Sources</p>
          <h2 className="font-display mt-3 text-4xl leading-tight">Every source on this page.</h2>
          <p className="mt-4 leading-relaxed text-muted">
            We opened each source and compared it with our sentence. Last check: {CHECKED_ON}. Many journal articles
            need a subscription for the full text; the abstract is free to read. If you find a mistake, write to us on
            the <Link href="/contact" className="text-accent underline underline-offset-4">contact page</Link>.
          </p>
          <ol className="mt-8 list-decimal space-y-4 pl-6 text-[0.95rem] leading-relaxed text-muted marker:text-foreground">
            {SOURCE_ORDER.map((id, i) => (
              <li key={id} id={`source-${i + 1}`} className="scroll-mt-24 break-words pl-1 target:text-foreground">
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
