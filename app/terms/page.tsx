import type { Metadata } from 'next'
import Link from 'next/link'
import { marked } from 'marked'
import { APP_NAME, SITE_URL } from '@/site'
import { DRAFT, WEBSITE_TERMS, unresolvedPlaceholders } from '@/content/legal'

/**
 * /terms — the Terms of Use for THIS WEBSITE.
 *
 * ⚠️ NOT THE APP'S TERMS OF SERVICE, and the page says so in its own words above the fold. The two
 * are different agreements: this one covers reading radlor.com, the app's covers using AdaptiveLearn
 * with a child's data inside it. Never cross-link them as if they were the same document — a reader
 * who follows "Terms" from a marketing footer and lands on an agreement about their child's data has
 * been shown the wrong contract.
 *
 * ⚠️ NO `noindex`, DELIBERATELY. The banner says the text is a draft, out loud, to every reader
 * including a crawler; hiding the page would hide the banner too and leave the site with a footer
 * link to nothing. `DRAFT` is what communicates the status, not robots metadata.
 */
export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'The Terms of Use for radlor.com, the website — what this site is, what it collects, and what its content does and does not promise. It is a separate and much shorter agreement than the one covering the AdaptiveLearn app.',
  alternates: { canonical: '/terms' },
}

export default async function Terms() {
  const html = await marked.parse(WEBSITE_TERMS.body)

  return (
    <section className="relative isolate overflow-hidden">
      {/* Decorative, `aria-hidden`, behind the text — a screen reader gets the copy alone. */}
      <div className="rl-progress" aria-hidden="true" />
      <div className="rl-lightfield" aria-hidden="true">
        <div className="rl-glow rl-parallax" style={{ '--p': '30px' } as React.CSSProperties} />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-20">
        <h1 className="rl-focus font-display text-5xl">{WEBSITE_TERMS.title}</h1>
        <p className="rl-rise mt-6 text-lg text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.12s' } as React.CSSProperties}>
          These cover <strong className="text-foreground font-medium">radlor.com</strong>, the website
          you are reading. {APP_NAME} — the product — is a separate service with its own Terms of
          Service, which you accept when you create an account there.
        </p>

        {/**
          * ⚠️ LOUD, NOT SUBTLE, AND FIRST. A legal page that looks finished and is not is worse than
          * no page — a reader would rely on it. `role="note"` rather than `alert`: it is a standing
          * condition of the page, not something that just happened, and an alert would interrupt a
          * screen reader mid-sentence on every visit.
          */}
        {DRAFT && (
          <div
            role="note"
            className="rl-rise mt-8 max-w-2xl rounded-xl border-2 border-accent bg-accent-soft px-4 py-3 text-foreground"
            style={{ '--d': '0.18s' } as React.CSSProperties}
          >
            <p className="font-semibold">⚠️ Draft — not reviewed by a lawyer, and not in force.</p>
            <p className="mt-1 text-sm text-muted">
              This text is published so it can be read and corrected. It is not a binding agreement,
              it is not final, and the passages marked{' '}
              <strong className="text-foreground font-medium">[LAWYER REVIEW]</strong> and the{' '}
              <strong className="text-foreground font-medium">[DATE]</strong> below are decisions
              nobody has made yet — they are left visible on purpose rather than filled in with a
              guess.
            </p>
          </div>
        )}

        <div className="rl-prose prose mt-10" dangerouslySetInnerHTML={{ __html: html }} />

        <p className="mt-12 mb-4 text-sm text-muted max-w-2xl leading-relaxed">
          What this website stores is set out on{' '}
          <Link href="/privacy" className="rl-link text-accent">privacy</Link>, and what the product
          stores about a child on{' '}
          <Link href="/data-and-safety" className="rl-link text-accent">data and safety</Link>.
        </p>

        {/* ⚠️ NO `TermsOfService` / `DigitalDocument` JSON-LD while `DRAFT` is true. Structured data
            is a machine-readable assertion that this IS the governing agreement, and an answer
            engine cannot see the banner. `WebPage` states what the page is without claiming it
            binds anyone. Add the stronger type when a lawyer has signed it off. */}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${SITE_URL}/terms`,
          name: `${WEBSITE_TERMS.title} — radlor.com`,
          description: metadata.description,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          publisher: { '@id': `${SITE_URL}/#organization` },
          ...(DRAFT && unresolvedPlaceholders(WEBSITE_TERMS).length
            ? { creativeWorkStatus: 'Draft' }
            : {}),
        })}</script>
      </div>
    </section>
  )
}
