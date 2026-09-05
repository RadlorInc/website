import { COMPANY, LOCATION, SITE_URL, SUPPORT_EMAIL } from '@/site'

/**
 * The site's legal copy, and the mechanism that stops an unreviewed draft rendering as binding.
 *
 * ⚠️ THIS IS THE MARKETING SITE'S DOCUMENT AND ONLY THAT — radlor.com, the pages a visitor reads
 * before they ever sign up. The APP has its own, much longer Terms of Service covering an account
 * and a child's data, and it lives in the app repo at `../milo-story-mode/src/app/legal/content.ts`.
 * They are two different agreements between two different sets of parties. Do NOT merge them, do
 * NOT present one as the other, and do NOT copy copy between them: the moment this file quotes the
 * app's terms, a parent reading radlor.com is being shown an agreement they have not entered.
 *
 * The banner mechanism below is deliberately the same shape as the app repo's, because the failure
 * it prevents is the same one. It is not shared code — two repos, no dependency between them, on
 * purpose (see CLAUDE.md).
 */

/**
 * ⚠️ FALSE SINCE 2026-09-06: AN ATTORNEY HAS REVIEWED THIS DOCUMENT AND IT IS NOW LIVE, BINDING
 * TERMS. Founder confirmed the review covers §11 (Delaware governing law and courts) and §9 (the
 * liability cap); Delaware stands as written.
 *
 * ⚠️ IT GOES BACK TO `true` THE MOMENT THE TEXT CHANGES IN A WAY A LAWYER HAS NOT SEEN. That is
 * what this switch is for — it is not a one-way door. A legal page that LOOKS reviewed and is not
 * is worse than no page at all, because a reader would believe it. The whole mechanism below
 * (`PLACEHOLDERS`, `draftGuardError`, the module-scope throw) stays wired precisely so the next
 * revision cannot go out unreviewed by accident: add a marker while this is `false` and the build
 * dies. Do not delete it now that the banner is off.
 */
export const DRAFT = false

export interface LegalDoc { slug: string; title: string; updated: string; body: string }

/**
 * From `radlor-website-terms.md`, minus its markdown H1 (the page renders its own <h1> from
 * `title`).
 *
 * ⚠️ EVERY PLACEHOLDER IS NOW RESOLVED, AND EACH ONE WAS RESOLVED BY A DECISION SOMEBODY MADE —
 * never to make the page look finished. That distinction is the whole rule (see CLAUDE.md):
 *   · `[DATE]` → **6 September 2026**, the day the document went live.
 *   · §11's `[LAWYER REVIEW]` (Delaware governing law and courts) → removed on 2026-09-06 when the
 *     founder confirmed an attorney had reviewed it, together with §9's liability cap. Delaware
 *     stands as written; the clause text is unchanged.
 *   · §3's `[LAWYER REVIEW]` (analytics) → resolved 2026-09-05 by measurement, recorded below.
 *
 * ⚠️ A NEW MARKER IN THIS TEXT NOW BREAKS THE BUILD, because `DRAFT` is `false`. That is correct:
 * either the change has been reviewed, or `DRAFT` goes back to `true` and the banner returns.
 *
 * ⚠️ FOUR THINGS WERE CHANGED, ALL ON THE FOUNDER'S INSTRUCTION 2026-09-05, AND THE DISTINCTION
 * THAT PERMITTED IT IS WORTH KEEPING. A placeholder removed because the decision was made and
 * evidenced is not the same act as a placeholder removed to make a page look finished. Only the
 * second is forbidden.
 *
 *   1. §3's analytics `[LAWYER REVIEW]` asked which provider runs here. It was answered by
 *      measurement, not assumption: no analytics dependency in `package.json`, zero off-origin
 *      requests on a live load of `/` and `/waitlist`, no `Set-Cookie`, empty `document.cookie`
 *      and empty storage, and `/_vercel/insights/script.js` 404 (Vercel Web Analytics off). The
 *      one lead that looked like a hit — a `speed-insights` grep in a JS chunk — was Next's own
 *      `WEB_VITALS` constant, and the page never requests that script. So the sentence now states
 *      what is true. Leaving the original would have published "we use basic website analytics"
 *      beside a /privacy page saying the opposite.
 *      ⚠️ AND IT IS NOW GATED: `npm run check:site-claims` loads the live site and fails if any
 *      off-origin script, any Set-Cookie, or the insights script ever appears. Vercel Web
 *      Analytics is a dashboard toggle that injects a script with NO diff in this repo — this
 *      paragraph is the kind of true sentence that goes false while nobody is editing anything.
 *   2. §3 described "anything you write in a message field" and a form to "apply for a role".
 *      Neither exists. There is one form — email, optional age band, and a honeypot — so it now
 *      says that. Same defect as the analytics sentence, one notch quieter.
 *   3. The "Note to Rafi, delete before publishing" blockquote is gone. It made the page read as
 *      something someone forgot to finish, which is a different thing from being marked unfinished
 *      on purpose — that was the banner's job, while there still was one.
 *   4. `${SUPPORT_EMAIL}` and the address from `LOCATION` are interpolated rather than spelled
 *      out — identical strings, now unable to drift. See CLAUDE.md: one source per fact.
 *
 * ⚠️ The address lines end in TWO SPACES. That is a markdown hard break and it is what keeps the
 * contact block four lines instead of one run-on sentence. Do not trim them.
 */
export const WEBSITE_TERMS: LegalDoc = {
  slug: 'terms',
  title: 'Terms of Use',
  updated: '6 September 2026',
  body: `**Last updated: 6 September 2026**

---

## 1. About this site

This website at radlor.com is published by **${COMPANY} Inc.**, a Delaware
corporation ("${COMPANY}", "we", "us"). It describes who we are and what we build.

By using this site you agree to these Terms of Use. If you do not agree, please
do not use the site.

**This site is not the product.** Our learning application, Milo, is a separate
service with its own Terms of Service and Privacy Policy, which you accept when
you create an account there. Nothing on this site creates an account, and
nothing here governs your use of the app.

## 2. Who this site is for

This site is written for **adults** — parents, guardians, educators and people
interested in the company. It is not directed at children and we do not knowingly
collect information from children through it.

If you believe a child has submitted information through this site, write to
${SUPPORT_EMAIL} and we will delete it.

## 3. What we collect here

**You can read this whole site without giving us anything.**

There is one form on this site: the waitlist. It asks for your email address
and, if you choose to give it, an age band. There is no name field, no date of
birth and nowhere to type a child's name. The form also carries one hidden field
that a person never sees and never fills in; it catches automated submissions,
and what lands in it is discarded rather than stored. We use what you give us
only to write to you about a place, and we do not sell it.

You can ask us to delete it at any time at ${SUPPORT_EMAIL}.

**We do not use website analytics.** This site sets no cookies at all — not
analytics cookies, and not "strictly necessary" ones either — and it loads
nothing from anyone else's server. You do not have to take our word for it: open
your browser's network tab and reload, and every request you see will be to
radlor.com. Our Privacy Policy explains the full picture.

## 4. Information on this site is general

We try to keep this site accurate and current, but content here is general
information about the company and the product. It may be incomplete, out of
date, or superseded.

In particular:

- **Descriptions of the product are not promises.** Features shown may change or
  may not ship.
- **Nothing here is educational, medical, psychological, legal or financial
  advice.**
- **Nothing here is an offer of investment or employment**, and nothing on this
  site forms a contract. Any role we offer is set out in a separate written
  offer, and any commercial arrangement in a separate written agreement.
- **Prices, plans and availability shown here** are indicative. What binds is
  what is shown at checkout in the app.

## 5. Our content

The text, design, artwork, logos and the names **${COMPANY}** and **Milo** belong to
us or our licensors and are protected by copyright and trademark law.

You may read, quote briefly with attribution, and link to this site. You may not
copy it substantially, republish it, use our name or logo to suggest we endorse
you, or scrape it for training data or a commercial database.

## 6. Anything you send us

If you send us an idea, a suggestion or feedback — by email or through a form —
you agree we may use it without obligation, payment or confidentiality. Please
do not send us anything you consider confidential or want to be paid for.

Do not send us personal information about a child through this site.

## 7. Links to other sites

We link to sites we do not control. We are not responsible for their content or
their privacy practices, and a link is not an endorsement.

## 8. Availability

We may change, suspend or withdraw this site or any part of it at any time
without notice. We do not promise it will always be available or error-free.

## 9. Disclaimer and liability

THIS SITE IS PROVIDED "AS IS" AND "AS AVAILABLE", WITHOUT WARRANTIES OF ANY KIND
TO THE FULLEST EXTENT PERMITTED BY LAW.

TO THE FULLEST EXTENT PERMITTED BY LAW, WE WILL NOT BE LIABLE FOR ANY INDIRECT,
INCIDENTAL, SPECIAL OR CONSEQUENTIAL LOSS ARISING FROM YOUR USE OF THIS SITE. OUR
TOTAL LIABILITY IN CONNECTION WITH THIS SITE WILL NOT EXCEED **USD 100**.

**Nothing here limits liability that cannot be limited by law**, including for
fraud, or for death or personal injury caused by negligence. Some jurisdictions
do not allow these exclusions, in which case they apply only as far as the law
allows.

## 10. Changes

We may update these Terms of Use. The current version is always at this address,
with the date it was last changed at the top. Continued use of the site after a
change means you accept it.

## 11. Governing law

These Terms of Use are governed by the laws of the State of Delaware, without
regard to its conflict-of-laws rules, and disputes about this site will be
brought in the state or federal courts of Delaware.

This does not remove any right you have under the consumer-protection law of the
place where you live.

## 12. Contact

**${COMPANY} Inc.**  
${LOCATION.street}  
${LOCATION.city}, ${LOCATION.region} ${LOCATION.postalCode}  
United States

**${SUPPORT_EMAIL}**
`,
}

export const LEGAL_DOCS: LegalDoc[] = [WEBSITE_TERMS]

/**
 * ⚠️ THE MARKS OF A DECISION NOBODY HAS MADE — a date, and the two places an attorney has to look.
 * They are rendered ON SCREEN rather than tidied away, because a placeholder you can see is a
 * draft and a placeholder you have quietly resolved is a false statement to a reader.
 *
 * `'[LAWYER REVIEW'` has no closing bracket on purpose — those markers carry their reason inside
 * the brackets (`[LAWYER REVIEW — …]`), so the prefix is the only stable part.
 */
export const PLACEHOLDERS = ['[LAWYER REVIEW', '[DATE]'] as const

export function unresolvedPlaceholders(doc: LegalDoc): string[] {
  const hay = `${doc.title}\n${doc.updated}\n${doc.body}`
  return PLACEHOLDERS.filter(p => hay.includes(p))
}

/**
 * ⚠️ A DRAFT MAY NEVER RENDER AS LIVE, AND THIS IS THE THING THAT ENFORCES IT — not a note, not a
 * checklist. It runs at module scope, so it fires in `next build` (/terms is statically generated,
 * so this file is imported during the build) and in `next dev`. Flipping `DRAFT` to false with a
 * hole still in the text stops the build rather than shipping a document that looks finished and
 * is not.
 *
 * Watched fail (2026-09-05): `DRAFT = false` with the placeholders present → the build dies here
 * naming the document and each marker. Watched pass (2026-09-06): `DRAFT = false` with every
 * placeholder resolved → inert, which is today's state. It is inert while `DRAFT` is `true` too.
 * ⚠️ Now that `DRAFT` is `false` this is LIVE on every build: the next unreviewed marker fails it.
 */
export function draftGuardError(draft: boolean, docs: LegalDoc[]): string | null {
  if (draft) return null
  const holes = docs.flatMap(d => unresolvedPlaceholders(d).map(p => `${d.slug}: ${p}`))
  if (!holes.length) return null
  return (
    'A legal document is marked FINAL (DRAFT = false) but still contains unresolved placeholders, ' +
    `so the draft banner is gone while the holes are not:\n  ${holes.join('\n  ')}\n` +
    'Resolve them with the attorney, or set DRAFT = true. Do not delete the markers.'
  )
}

const GUARD = draftGuardError(DRAFT, LEGAL_DOCS)
if (GUARD) throw new Error(GUARD)

/** Where the document lives. One string, so the page, the sitemap and llms.txt cannot disagree. */
export const TERMS_URL = `${SITE_URL}/${WEBSITE_TERMS.slug}`
