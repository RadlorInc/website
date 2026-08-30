import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Inter, Instrument_Serif } from 'next/font/google'
import './globals.css'
import { APP_NAME, COMPANY, FOOTER, FOUNDED_YEAR, HEADER, LOCATION, SITE_URL, SOCIAL, SUPPORT_EMAIL, TAGLINE } from '@/site'

const sans = Inter({ variable: '--font-sans-src', subsets: ['latin'] })
const display = Instrument_Serif({ variable: '--font-display-src', subsets: ['latin'], weight: '400' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${COMPANY} — ${TAGLINE}`, template: `%s · ${COMPANY}` },
  description:
    `${COMPANY} builds learning software that adapts to the child using it. Our first product, AdaptiveLearn, ` +
    'teaches math to ages 3–18 through story chapters that change difficulty question by question.',
  applicationName: COMPANY,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: COMPANY, url: SITE_URL, locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

/**
 * Organization + WebSite, once, on every page.
 *
 * This is the half of "SEO" that also does the GEO work: an answer engine that cannot resolve
 * who Radlor IS will not name it. Keep `sameAs` populated — it is what ties the name to the
 * profiles that corroborate it.
 */
function OrganizationJsonLd() {
  const json = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: COMPANY,
        url: SITE_URL,
        description: TAGLINE,
        foundingDate: FOUNDED_YEAR,
        email: SUPPORT_EMAIL,
        ...(SOCIAL.length ? { sameAs: SOCIAL.map(s => s.url) } : {}),
        // Guarded on the DATA being there, not on a sentinel spelling. The previous version
        // tested `city === 'TODO'`, which is exactly as good as whoever remembers to type TODO —
        // and an empty string, a stray space or a renamed placeholder would all have sailed past
        // it. This shape suppresses the block for any address we do not actually have.
        //
        // ⚠️ Only locality/region/country are published, and that is deliberate — see LOCATION
        // in site.ts. Do not add `streetAddress` or `postalCode` back here.
        ...(LOCATION.city && LOCATION.country
          ? {
              address: {
                '@type': 'PostalAddress',
                addressLocality: LOCATION.city,
                addressRegion: LOCATION.region,
                addressCountry: LOCATION.country,
              },
            }
          : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: COMPANY,
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  }
  return <script type="application/ld+json">{JSON.stringify(json)}</script>
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <OrganizationJsonLd />

        <header className="rl-header border-b border-line">
          <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between gap-6">
              {/* The whole lockup is now ONE image — the chrome wordmark with the robot in the
                  'o'. The `<span>Radlor</span>` that used to sit beside the mark is gone because
                  the picture contains the word.

                  ⚠️ `alt` IS "Radlor" AND MUST NOT GO BACK TO "". It was empty while real text sat
                  next to it and would otherwise have been announced twice. Now the picture IS the
                  word, so an empty alt leaves this link — the home link, on every page — with no
                  accessible name at all.

                  ⚠️ One artwork, not two. The black ground is keyed to alpha, so it composites on
                  any of the palette's dark values; that is why the header is pinned dark rather
                  than art-directed per theme the way the old mono marks were. */}
              <Link href="/" className="flex items-center">
                <Image
                  src="/wordmark.png"
                  alt={COMPANY}
                  width={280}
                  height={96}
                  priority
                  className="h-8 w-auto"
                />
              </Link>
            {/* No hamburger. On a narrow frame the links drop out of the header and the footer — which
                carries the same list — becomes the navigation. One CTA is what a phone has room for. */}
            <nav className="flex items-center gap-5 text-sm">
              <div className="hidden md:flex items-center gap-5">
                {HEADER.map(n => (
                  <Link key={n.href} href={n.href} className="rl-link text-muted hover:text-foreground transition-colors">
                    {n.label}
                  </Link>
                ))}
              </div>
              {/* ⚠️ THE WAITLIST IS THE ONLY DOOR — founder's call 2026-08-31, and this button is
                  the one that matters because it is on every page. It has been "Open AdaptiveLearn"
                  and then "Sign in"; both offered entry to a product that is in testing. Everyone
                  currently inside is a tester. Do not point this at APP_URL again: if a visitor
                  arriving through radlor.com can reach the app from here, the waitlist is not the
                  only door and the copy on /adaptivelearn stops being true. */}
              <Link
                href="/waitlist"
                className="rl-cta rl-cta-quiet rounded-full bg-accent px-4 py-2 text-on-accent text-sm font-medium whitespace-nowrap hover:opacity-90 transition-opacity"
              >
                Join the waitlist
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-line mt-24">
          <div className="mx-auto max-w-5xl px-6 py-10 flex flex-wrap gap-6 justify-between text-sm text-muted">
            <p>
              © {FOUNDED_YEAR} {COMPANY}. {TAGLINE}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {FOOTER.map(n => (
                <Link key={n.href} href={n.href} className="rl-link hover:text-foreground transition-colors">
                  {n.label}
                </Link>
              ))}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="rl-link hover:text-foreground transition-colors">
                {SUPPORT_EMAIL}
              </a>
              {SOCIAL.map(s => (
                <a
                  key={s.url}
                  href={s.url}
                  rel="me noopener"
                  target="_blank"
                  className="rl-link hover:text-foreground transition-colors"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
