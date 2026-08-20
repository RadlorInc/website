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

/**
 * The company belief, in the founder's own words (2026-08-20). Distinct from TAGLINE: the tagline
 * is what the PRODUCT does, this is why we build it at all. Both are stated on `/about` and in
 * `llms.txt`, from here, so the two surfaces cannot drift apart.
 */
export const VISION =
  'Education technology. We build learning products for children; the treasure is already inside the child, we just light it up.'
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
/**
 * The company's own profiles. Feeds BOTH `Organization.sameAs` and the visible footer row — a
 * schema-only claim is the weaker half, exactly as the app links back here visibly rather than
 * only in JSON-LD.
 *
 * ⚠️ THESE ARE OUR OWN `*.radlor.com` VANITY FORWARDS, WHICH IS A DELIBERATE CHOICE WITH ONE
 * HARD CONDITION: each one must 301 to the PROFILE, never to the platform's homepage. Founder's
 * call — one set of links, ours, that we can repoint without a code deploy when a handle changes.
 * The cost is that the whole thing is only as good as four GoDaddy rows, so it is gated rather
 * than trusted: `scripts/check-social.sh` follows every URL here and FAILS if it lands on a bare
 * homepage.
 *
 * ⚠️ WHY THAT GATE IS NOT PAPERWORK. `sameAs` is the strongest GEO signal we have, and a crawler
 * that follows `facebook.radlor.com` to `facebook.com/` corroborates FACEBOOK as the entity named
 * Radlor. Measured 2026-08-19, Google already answers "radlor" with a radler and a dissolved
 * Companies House record — a wrong `sameAs` argues against us rather than for us, so an empty
 * array beats a wrong one and the script is what tells the two apart.
 */
export const SOCIAL: { name: string; url: string }[] = [
  { name: 'LinkedIn', url: 'https://linkedin.radlor.com' },
  { name: 'Instagram', url: 'https://instagram.radlor.com' },
  // ⚠️ THE ONE RAW URL, AND ONLY BECAUSE GODADDY WOULD NOT ISSUE A CERT FOR THE FORWARD.
  // `facebook.radlor.com` 301s to exactly this page over HTTP, but its 443 never opened — it sat
  // on GoDaddy's non-SSL forwarding pool (600s TTL, port 443 closed) for hours, so the https URL
  // a crawler would actually fetch was dead. A dead `sameAs` entry is worth less than none.
  // Swap it back to 'https://facebook.radlor.com' once `scripts/check-social.sh` passes on it.
  { name: 'Facebook', url: 'https://www.facebook.com/people/Radlor-Inc/61593729350767/' },
  { name: 'X', url: 'https://x.radlor.com' },
  { name: 'Threads', url: 'https://threads.radlor.com' },
  // Raw for now — there is no `github.radlor.com` forward yet. Worth having in `sameAs` out of
  // proportion to its traffic: the org page independently states name=Radlor, blog=radlor.com and
  // email=admin@radlor.com, so it corroborates the entity rather than just listing another handle.
  { name: 'GitHub', url: 'https://github.com/RadlorInc' },
]
