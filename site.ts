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

/**
 * The brand palette, read off the logo itself — `radlor_logo/Mark Full Color Light.png` and
 * `Mark Full Color Dark.png`. `docs/brand-palette.md` records which pixel each value came from
 * and every contrast ratio quoted below.
 *
 * ⚠️ SUPERSEDES the amber palette that lived here until 2026-08-29, which cited
 * `Radlor Brand Kit/Radlor-brand-guide.pdf` — a file that is not in this repo, that nobody on the
 * team can open, and whose Amber #E9A93A appears NOWHERE in the mark. When a written guide and the
 * actual logo disagree, the logo wins: it is the thing people see.
 *
 * ⚠️ THESE VALUES ARE READ FROM AN IMAGE — do not invent a shade. The routes that render images
 * (`app/icon.tsx`, `app/apple-icon.tsx`, both `opengraph-image.tsx`) run in Satori, which cannot
 * read a CSS custom property, so they import from HERE and `app/globals.css` declares the same
 * values as tokens. That is the one duplication, and it is deliberate: this file is the source and
 * the stylesheet is the copy. (Until 2026-08-29 those four routes imported nothing and carried a
 * THIRD palette in rust and cream — every favicon and every share card was off-brand, and nothing
 * caught it because nothing was importing this.)
 *
 * The rules that come with the palette, worth stating because a build cannot check them:
 * - **`cyan` is the light, never the structure.** In the mark it is the ring's core and the eyes —
 *   the only part that glows.
 * - **`cyan` is 1.4:1 on `paper`. It can NEVER be text on a light background,** and it is worse at
 *   this than the amber it replaces. Where the site wants light on a pale page it puts `cyan`
 *   BEHIND the words, not in them — which is what the mark does too: the ring is behind the head.
 * - **Text on a `cyan` surface is ALWAYS `ink`** (12.3:1). White on `cyan` is 1.4:1.
 * - `blue` is 5.2:1 on white and would just pass as text, but it is the identity colour and should
 *   stay free to be a graphic at full strength. `blueInk` is a darker stop of the same blue
 *   (6.2:1) and is what links and small accent text use.
 * - **On a dark ground the accent is `sky`, and text on it is `ink`, not white** — white on `sky`
 *   is 1.5:1, which is what the CTA shipped as until this palette landed.
 */
export const BRAND = {
  /** The ring's core and the robot's eyes. THE LIGHT — 1.4:1 on `paper`, so never text. */
  cyan: '#00E5FF',
  /** The ring's outer edge and the collar. The identity colour, for graphics. */
  blue: '#0061F3',
  /** A darker stop of the same blue, dark enough to be TEXT on `paper` (6.2:1). */
  blueInk: '#0B57C7',
  /** The deep end of the ring's gradient · structure. */
  deep: '#062A6B',
  /** Body copy on a light background (6.1:1). */
  slate: '#4E6076',
  /** Text. The visor. */
  ink: '#0A1119',
  /** Background. The mark's light ground, cooled toward its blue. */
  paper: '#F5F8FC',
  /** The light lifted for DARK grounds — the accent there (13.0:1). Text on it is `ink`. */
  sky: '#7ADFFF',
  /** The muted end used ON dark backgrounds (10.9:1). */
  mist: '#B3C2D3',
} as const

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
 * THE PRICE, AND THE ONLY PLACE IT IS WRITTEN. Every row of the table on /pricing, the
 * `Offer` blocks in the JSON-LD, the hero fact and the FAQ answers are generated from these
 * six numbers. Do not hand-write a row — add a child count and it answers itself.
 *
 * ⚠️ CENTS, NOT DOLLARS. `7.99 + 4.99` in binary floating point is `12.979999999999999`, and
 * a price that renders as $12.98 on one page and $12.97 on another is the kind of bug nobody
 * finds until a parent screenshots it. Integers throughout; `usd()` is the only formatter.
 *
 * ⚠️ ANNUAL IS A RULE, NOT A LOOKUP TABLE. $75.99 for the first child and $48.00 for each
 * additional reproduces the published figures exactly ($75.99 / $123.99 / $171.99) and keeps
 * answering past them.
 *
 * ⚠️ THE SAVING IS 20.15%–20.74%, NEVER A FLAT 20% OFF. It shrinks as children are added, so
 * the claim is "over 20%" or the actual dollar figure — never a bigger round number than the
 * one that is real. `scripts/check-pricing.mjs` fails the moment that stops being true.
 */
/**
 * The six age bands, and the ONE list of them. `/adaptivelearn` renders them with their worlds
 * and syllabus; the waitlist form offers them as options and stores `id`. Split into an ASCII
 * `id` and a typographic `label` on purpose: the label carries an en-dash for the page, and the
 * id is what goes in the database and in a CHECK constraint, where a stray en-dash is a bug
 * nobody sees until an insert fails.
 */
export const AGE_BANDS = [
  { id: '3-5', label: '3–5' },
  { id: '6-8', label: '6–8' },
  { id: '9-11', label: '9–11' },
  { id: '12-14', label: '12–14' },
  { id: '15-16', label: '15–16' },
  { id: '17-18', label: '17–18' },
] as const

export type AgeBandId = (typeof AGE_BANDS)[number]['id']

export const PRICING = {
  currency: 'USD',
  monthly: { first: 799, additional: 499 },
  annual: { first: 7599, additional: 4800 },
  /** ⚠️ Founder's call, 2026-08-30. Past this a family writes to us — there is no published
   *  price for a fifth child and inventing one is exactly what this file exists to prevent. */
  maxChildren: 4,
} as const

/** The one money formatter. Cents in, "$12.98" out. */
export const usd = (cents: number) => `$${(cents / 100).toFixed(2)}`

/** What a family of `children` pays. Clamped to `maxChildren` — see the note there. */
export function priceFor(children: number) {
  const n = Math.max(1, Math.min(Math.trunc(children), PRICING.maxChildren))
  const monthly = PRICING.monthly.first + (n - 1) * PRICING.monthly.additional
  const annual = PRICING.annual.first + (n - 1) * PRICING.annual.additional
  const perYearMonthly = monthly * 12
  const saved = perYearMonthly - annual
  const savedPct = (saved / perYearMonthly) * 100
  return {
    children: n,
    monthly,
    annual,
    saved,
    savedPct,
    /**
     * The percentage as it may be PRINTED — floored to one decimal, never rounded.
     * `toFixed(1)` on 20.155% renders "20.2%", which states a discount 0.045 points larger than
     * the one that exists. Small, and still a number we would have to defend. Flooring can only
     * ever understate.
     */
    savedPctLabel: `${(Math.floor(savedPct * 10) / 10).toFixed(1)}%`,
  }
}

/** Every published plan, in order. The table on /pricing is this array. */
export const PLANS = Array.from({ length: PRICING.maxChildren }, (_, i) => priceFor(i + 1))

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
  // 'footer', not 'both': the header already carries a hard-coded "Join the waitlist" CTA, so a
  // nav link beside it is the same destination twice in one row. Still in the sitemap and in
  // llms.txt via this row — it is the only way in, so it is the page an answer engine most needs.
  { href: '/waitlist', label: 'Waitlist', where: 'footer' },
  { href: '/contact', label: 'Contact', where: 'footer' },
  { href: '/data-and-safety', label: 'Data & safety', where: 'footer' },
  { href: '/privacy', label: 'Privacy', where: 'footer' },
] as const

export const HEADER = PAGES.filter(p => p.where === 'both')
export const FOOTER = PAGES.filter(p => p.href !== '/')

/**
 * Company facts — the only strings on the site not derived from the product itself. They were
 * wrong-by-default rather than invented, so a wrong one stayed visible instead of plausible.
 * All confirmed by the founder 2026-08-29; see docs/brand-facts.md.
 *
 * The year radlor.com was registered, and the year the company counts as founded — they happen
 * to be the same, which is why this was a safe guess, but it is now a confirmed fact rather than
 * an inference from a WHOIS record.
 */
export const FOUNDED_YEAR = '2026'
/**
 * The registered business address. Feeds the `PostalAddress` block in the `Organization` JSON-LD
 * and nothing else — no page prints it, so this is the only place it is written.
 *
 * ⚠️ ONLY `city`, `region` AND `country` ARE PUBLISHED. `street` and `postalCode` are held here
 * and deliberately left out of the JSON-LD. In an `Organization` node the address does entity
 * disambiguation — it tells an answer engine which "Radlor" this is — and `Newark / DE / US`
 * already does that completely. The street line adds nothing a model uses, and this particular
 * one is a mail-forwarding suite (the `#28608` box) shared with thousands of other registrants,
 * so publishing it corroborates the FORWARDING SERVICE as much as it corroborates us — the same
 * failure `scripts/check-social.sh` exists to prevent for `sameAs`.
 *
 * They are kept in full here because the registered address is a real fact the company has, and
 * something outside the JSON-LD may legitimately need it one day. Adding them back to
 * `app/layout.tsx` is a decision, not a fix.
 *
 * ⚠️ `country` was `'IN'` until 2026-08-29, alongside `city: 'TODO'`. It was never verified — a
 * default sitting next to two placeholders. `layout.tsx` used to suppress the entire address
 * block while `city` said TODO, so the wrong country never reached a crawler; that guard is now
 * gone, because with the value filled its condition can no longer be true. Wrong-by-default did
 * its job here, which is the argument for keeping the next unknown a `TODO` and not a plausible
 * guess. Radlor is a Delaware company; the address below is the registered one.
 */
export const LOCATION = {
  street: '254 Chapman Rd, Ste 208 #28608',
  city: 'Newark',
  region: 'DE',
  postalCode: '19702',
  country: 'US',
}
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
