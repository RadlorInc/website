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
import { Icon, type IconName } from '@/components/visual/Icon'
import { Viz } from '@/components/visual/Viz'
import { WordsVsPictures } from '@/components/visual/WordsVsPictures'

const SECTION_ICON: Record<string, IconName> = { mind: 'eye', video: 'film', math: 'ruler', medicine: 'pill', brain: 'brain' }

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
        <div className="mx-auto max-w-5xl px-6 pt-14 pb-14 sm:pt-20 sm:pb-16">
          <p className={eyebrow}>The research</p>
          <h1 className="rl-focus font-display mt-4 text-[2.75rem] leading-[1.03] sm:text-7xl">
            Why visual learning <span className="rl-lit">works</span>.
          </h1>
          <p className="mt-6 max-w-[40rem] text-xl leading-relaxed text-muted">
            People learn better from words and pictures together than from words alone. Not from every picture, and
            not for every task. Here is the evidence, with its limits and sources.
          </p>
          <div className="mt-10"><WordsVsPictures /></div>
          <nav aria-label="On this page" className="mt-10">
            <ul className="flex flex-wrap gap-2 text-sm">
              {SECTIONS.map(sec => (
                <li key={sec.id}>
                  <a href={`#${sec.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 hover:border-foreground transition-colors">
                    <Icon name={SECTION_ICON[sec.id]} className="h-4 w-4 text-accent" />{sec.nav}
                  </a>
                </li>
              ))}
              {[{ id: 'not-claimed', label: 'What we do not claim', icon: 'x' as const }, { id: 'sources', label: 'Sources', icon: 'list' as const }].map(l => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 hover:border-foreground transition-colors">
                    <Icon name={l.icon} className="h-4 w-4 text-accent" />{l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6">
        {SECTIONS.map(sec => (
          <section key={sec.id} id={sec.id} className="scroll-mt-20 border-b border-line py-16">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent"><Icon name={SECTION_ICON[sec.id]} className="h-5 w-5" /></span>
              <p className={eyebrow}>{sec.eyebrow}</p>
            </div>
            <h2 className="font-display mt-4 max-w-[36rem] text-4xl leading-tight sm:text-5xl">{sec.title}</h2>
            <ul className="mt-10 grid items-start gap-5 md:grid-cols-2">
              {sec.findings.map(f => (
                <li key={f.id} className="flex flex-col rounded-3xl border border-line bg-surface p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted">{f.evidence}</span>
                    {!f.viz && <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent"><Icon name={SECTION_ICON[sec.id]} className="h-5 w-5" /></span>}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold leading-snug">{f.short}<Refs ids={f.refs} /></h3>
                  {f.viz && <div className="mt-5"><Viz viz={f.viz} /></div>}
                  <details className="group mt-5 border-t border-line pt-4">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-medium text-accent [&::-webkit-details-marker]:hidden">
                      Details and limits
                      <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                    </summary>
                    <p className="mt-3 text-sm font-semibold text-foreground">{f.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
                    <p className="mt-3 border-l-2 border-[var(--viz-base)] pl-3 text-sm leading-relaxed text-muted">
                      <strong className="font-semibold text-foreground">The limit. </strong>{f.limit}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section id="not-claimed" className="scroll-mt-20 border-b border-line py-16">
          <p className={eyebrow}>Honest limits</p>
          <h2 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">What we do not claim.</h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {NOT_CLAIMED.map(n => (
              <li key={n.title} className="rounded-3xl border border-line bg-surface p-6">
                <Icon name="x" className="h-8 w-8 text-[var(--viz-base)]" />
                <h3 className="mt-4 text-lg font-semibold leading-snug">{n.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{n.body}{n.refs.length > 0 && <Refs ids={n.refs} />}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-b border-line py-16">
          <p className={eyebrow}>What we do with it</p>
          <h2 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">How our products use this.</h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { href: '/askradlor', name: ASK_NAME, icon: 'voice' as const, line: 'The voice explains each step while the step is drawn.' },
              { href: '/radlic', name: 'Radlic', icon: 'board' as const, line: 'One math idea per lesson, written and said at the board.' },
              { href: V3D_PATH, name: V3D_NAME, icon: 'box' as const, line: 'One task per video: the part, and where it goes.' },
            ].map(p => (
              <li key={p.href}>
                <Link href={p.href} className="group flex h-full flex-col rounded-3xl border border-line bg-surface p-6 transition-colors duration-200 hover:border-accent">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent-soft text-accent"><Icon name={p.icon} className="h-6 w-6" /></span>
                  <span className="mt-4 text-lg font-semibold">{p.name}</span>
                  <span className="mt-1 flex-1 text-sm leading-relaxed text-muted">{p.line}</span>
                  <span className="mt-4 text-sm font-medium text-accent">See {p.name} →</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">This research is about learning in general. It does not test our products, and we do not say that it does.</p>
        </section>

        <section id="sources" className="scroll-mt-20 py-14">
          <p className={eyebrow}>Sources</p>
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
