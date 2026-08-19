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

/**
 * The app's entity id, declared HERE and referenced by the app itself at the same string.
 *
 * ⚠️ Two sites describing one product is only a strength if they agree it IS one product. Both
 * emit `SoftwareApplication` with this exact `@id` and both point `publisher` at
 * `${SITE_URL}/#organization`, so the two pages merge into one node instead of competing as two.
 * Change this string and you silently split the product in half. The app's copy lives in
 * `../milo-story-mode/src/app/site.ts` as `APP_ID`.
 *
 * ⚠️ AND THIS MATTERS MORE THAN IT LOOKS, BECAUSE "AdaptiveLearn" IS A GENERIC PHRASE.
 * Measured 2026-08-19: searching it returns "adaptive learning" the concept plus AdaptedMind,
 * bettermarks, DreamBox and Prodigy — the category, not us. "Radlor" is distinctive and
 * effectively unclaimed. So the brand is what makes the product resolvable, and every schema
 * block, title and page must keep the two attached.
 */
export const APP_ID = `${APP_URL}/#app`

/**
 * Every page on the site, in one list — the header, the footer and the sitemap all read it, so a
 * page cannot exist in one and be missing from another.
 *
 * `where` is only about the HEADER: at nine pages the header can no longer hold them all, and the
 * ones it drops are the ones a visitor reaches from a link in the text rather than by browsing.
 * The footer carries everything.
 */
export const PAGES = [
  { href: '/', label: 'Home', where: 'footer' },
  { href: '/adaptivelearn', label: 'AdaptiveLearn', where: 'both' },
  { href: '/pricing', label: 'Pricing', where: 'both' },
  { href: '/for-schools', label: 'Schools', where: 'both' },
  { href: '/writing', label: 'Writing', where: 'both' },
  { href: '/about', label: 'About', where: 'both' },
  { href: '/contact', label: 'Contact', where: 'footer' },
  { href: '/data-and-safety', label: 'Data & safety', where: 'footer' },
  { href: '/privacy', label: 'Privacy', where: 'footer' },
] as const

export const HEADER = PAGES.filter(p => p.where === 'both')
export const FOOTER = PAGES.filter(p => p.href !== '/')

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
