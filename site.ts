/**
 * Every fact about Radlor that more than one page needs, in ONE place.
 *
 * The app repo (`milo-story-mode`) learned this the hard way: the support address lived as a
 * literal in four files, so a brand change meant four edits and hoping none was missed. Anything
 * a crawler, a JSON-LD block and a footer all state goes here.
 */

/** The canonical public origin. `robots.ts`, `sitemap.ts` and `metadataBase` all read it. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://radlor.com')

export const COMPANY = 'Radlor'
export const TAGLINE = 'Learning software that adapts to the child in front of it.'
export const SUPPORT_EMAIL = 'support@radlor.com'

/** The live product. Its own origin — a separate Vercel project, deployed from the app repo. */
export const APP_URL = 'https://adaptivelearn.radlor.com'
export const APP_NAME = 'AdaptiveLearn'

/** Header + footer navigation, and the sitemap. One list so they cannot drift. */
export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/adaptivelearn', label: 'AdaptiveLearn' },
  { href: '/about', label: 'About' },
  { href: '/writing', label: 'Writing' },
  { href: '/contact', label: 'Contact' },
] as const

/**
 * ⚠️ FILL THESE IN — they are the only strings on the site I could not derive from the product.
 * They are wrong-by-default rather than invented, so a wrong one is visible instead of plausible.
 * See docs/brand-facts.md.
 */
export const FOUNDED_YEAR = '2026'
export const LOCATION = { city: 'TODO', region: 'TODO', country: 'IN' }
export const SOCIAL: string[] = [
  // 'https://github.com/radlorhq',
  // 'https://www.linkedin.com/company/radlor',
]
