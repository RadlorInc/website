import type { Metadata } from 'next'
import Link from 'next/link'
import { APP_NAME, APP_URL, COMPANY, SITE_URL, SUPPORT_EMAIL } from '@/site'

export const metadata: Metadata = {
  title: 'Privacy on this website',
  description:
    'radlor.com sets no cookies, runs no analytics and loads nothing from a third party. This page says exactly what does and does not happen when you read it.',
  alternates: { canonical: '/privacy' },
}

/**
 * ⚠️ THIS PAGE MAKES CHECKABLE CLAIMS AND THEY WERE CHECKED, NOT ASSUMED.
 * Measured on the running site: 0 external hosts in `performance.getEntriesByType('resource')`,
 * fonts served from our own `/_next/static/media/`, `document.cookie` empty, `localStorage` empty.
 * If you add ANYTHING that talks to another origin — an analytics snippet, an embedded video, a
 * hosted font, a map — this page is wrong and has to change in the same commit. Re-run that check.
 */
export default function Privacy() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-20">
      <h1 className="font-display text-5xl">Privacy on this website</h1>
      <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">
        This page is about <strong className="text-foreground font-medium">radlor.com</strong>, the site
        you are reading. {APP_NAME} — the product — handles children&rsquo;s data and has its own,
        longer policy.
      </p>

      <div className="prose mt-10">
        <h2>What this website does not do</h2>
        <p>It sets no cookies. It runs no analytics. It loads nothing from anyone else&rsquo;s server.</p>
        <p>
          There is no Google Analytics, no advertising pixel, no session recorder, no chat widget and no
          embedded video. The typefaces are served from our own domain rather than from a font host, so
          no third party is told that you visited. Nothing is written to your browser&rsquo;s storage. We
          do not have an account with anyone who would receive your reading of this page, because we
          never signed up for one.
        </p>
        <p>
          You can check all of that yourself: open your browser&rsquo;s network tab and reload. Every
          request goes to radlor.com.
        </p>

        <h2>What does happen</h2>
        <p>
          The site is hosted by <strong>Vercel</strong>, and like any web server theirs records the
          requests it serves — an IP address, the page asked for, a timestamp, the browser&rsquo;s own
          description of itself. We do not build profiles from those logs and they expire on Vercel&rsquo;s
          own schedule. It is the minimum a server does in order to be a server, and we would be lying if
          we said nothing was recorded anywhere.
        </p>

        <h2>If you write to us</h2>
        <p>
          The only address on this site is <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. There
          is no form here, so nothing is collected unless you choose to send it. If you email us we keep
          the message so that we can answer it and remember the conversation next time. Ask us to delete
          it and we will.
        </p>

        <h2>Children</h2>
        <p>
          This website is written for adults — parents, teachers, people deciding whether to try{' '}
          {APP_NAME}. It is not aimed at children and collects nothing from anyone, so it collects
          nothing from a child either. Everything about what we store when a child actually uses the
          product is on <Link href="/data-and-safety">data and safety</Link>.
        </p>

        <h2>The product</h2>
        <p>
          {APP_NAME} lives on a different address —{' '}
          <a href={APP_URL}>adaptivelearn.radlor.com</a> — and is a different piece of software with
          accounts, a database and a camera feature. Its policy is published there, and the plain-English
          version is on <Link href="/data-and-safety">data and safety</Link>.
        </p>

        <h2>Changes, and who to ask</h2>
        <p>
          If this page ever stops being true we will change it in the same breath as the thing that made
          it untrue — that is a rule we hold ourselves to, not a promise about a review cycle. Questions
          about any of it go to <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>, and a person at{' '}
          {COMPANY} answers them.
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': `${SITE_URL}/privacy`,
            name: 'Privacy on this website',
            description: metadata.description,
            isPartOf: { '@id': `${SITE_URL}/#website` },
            publisher: { '@id': `${SITE_URL}/#organization` },
          }),
        }}
      />
    </section>
  )
}
