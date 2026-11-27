/**
 * radlor.com/why-visual-learning/sources — every source behind the research page, on its own page like /privacy
 * (founder, 2026-11-26). The list comes from `content/evidence.ts`; each row keeps the id `source-n`, so the [n] links
 * on the research page land on it.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { COMPANY, SITE_URL, SOURCES_PATH, WHY_PATH } from '@/site'
import { CHECKED_ON, SOURCES, SOURCE_ORDER } from '@/content/evidence'

const TITLE = 'Research sources'

export const metadata: Metadata = {
  title: TITLE,
  description: 'Every study and review behind "Why visuals make things clear", numbered, with a link to each one.',
  alternates: { canonical: SOURCES_PATH },
  openGraph: { url: `${SITE_URL}${SOURCES_PATH}`, title: `${TITLE} · ${COMPANY}`, type: 'article' },
}

export default function ResearchSources() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-20 pb-14">
      <h1 className="font-display text-5xl">{TITLE}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
        These are the sources for <Link href={WHY_PATH} className="text-accent underline underline-offset-4">Why visuals
        make things clear</Link>. We opened each source and compared it with our sentence. Last check: {CHECKED_ON}. Many
        journal articles need a subscription for the full text; the abstract is free to read. If you find a mistake,
        write to us on the <Link href="/contact" className="text-accent underline underline-offset-4">contact page</Link>.
      </p>
      <ol className="mt-10 list-decimal gap-10 space-y-3 pl-6 text-sm leading-relaxed text-muted marker:text-foreground md:columns-2">
        {SOURCE_ORDER.map((id, i) => (
          <li key={id} id={`source-${i + 1}`} className="scroll-mt-24 break-inside-avoid break-words pl-1 target:text-foreground">
            {SOURCES[id].cite}{' '}
            <a href={SOURCES[id].url} rel="noopener" className="text-accent underline underline-offset-4">{SOURCES[id].url.replace(/^https?:\/\//, '')}</a>
          </li>
        ))}
      </ol>
    </section>
  )
}
