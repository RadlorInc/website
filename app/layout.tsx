import type { Metadata } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import './globals.css'
import { COMPANY, FOUNDED_YEAR, LOCATION, SITE_URL, SOCIAL, SUPPORT_EMAIL, TAGLINE } from '@/site'

const sans = Inter({ variable: '--font-sans-src', subsets: ['latin'] })
const display = Instrument_Serif({ variable: '--font-display-src', subsets: ['latin'], weight: '400' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${COMPANY} — ${TAGLINE}`, template: `%s · ${COMPANY}` },
  description:
    `${COMPANY} builds learning software that adapts to the child using it. Our first product, Radlic, ` +
    'teaches math for grades 3 to 8, one idea at a time, with practice that changes question by question.',
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

/**
 * ⚠️ NO HEADER OR FOOTER HERE, deliberately (2026-09-25). The Radlor header and footer are `SiteChrome`, worn by
 * every company page through `app/(site)/layout.tsx` and by the 404. `/radlic` — the Radlic product page — is
 * outside that group and wears none of it, so it looks like the product it describes (founder's call).
 */
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <OrganizationJsonLd />

        {children}
      </body>
    </html>
  )
}
