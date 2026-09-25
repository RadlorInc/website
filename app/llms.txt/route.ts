import { APP_GRADES, APP_NAME, APP_URL, COMPANY, PAGES, SITE_URL, SOCIAL, SUPPORT_EMAIL, TAGLINE, VISION } from '@/site'
import { posts } from '@/content/posts'

/**
 * llms.txt — the plain-text summary an answer engine reads instead of guessing from markup.
 *
 * Generated from `site.ts` and `posts.ts` rather than kept as a static file in `public/`, because a
 * static one drifts the first time a page is renamed and nothing tells you.
 */
export const dynamic = 'force-static'

/** One line per page, saying what a reader would find there. Keyed by href so a new page in
 *  `PAGES` fails the type-check here until it has one — the list cannot go quietly stale. */
const BLURB: Record<(typeof PAGES)[number]['href'], string> = {
  '/': `what ${COMPANY} builds and why`,
  '/radlic': `${APP_NAME}, the math app: how a lesson teaches, how practice adapts, and two real lesson chalkboards; sign-up is on ${APP_URL}`,
  // hidden 2026-09-25 with its footer row in site.ts — restore both together:
  // '/waitlist': `join the waitlist for a place in ${APP_NAME}: an email address, optionally a child's grade, and nothing else`,
  // ⚠️ /pricing is hidden — see the commented row in `PAGES`. Kept here, commented, so restoring
  // the page is one uncomment in each file rather than rewriting this sentence from the table.
  // '/pricing': `what ${APP_NAME} costs: ${usd(PRICING.monthly.first)} a month for the first child, ${usd(PRICING.monthly.additional)} for each additional child up to ${PRICING.maxChildren}, annual billing saving over 20%`,
  '/for-schools': 'using it with a class: how a teacher sets one up and what they see',
  '/writing': 'notes on building adaptive learning software',
  '/about': `why ${COMPANY} started and how we work`,
  '/contact': 'early access, schools, support, press',
  '/data-and-safety': "what we store about a child, who can see it, how to delete it, and what we do not collect",
  '/terms': 'the terms of use for this website, in force since 6 September 2026 — what this site is, what it collects, and what its content does and does not promise; the Radlic app has its own separate Terms of Service on its own origin',
  '/privacy': 'the privacy policy for this website: no cookies, no analytics, nothing loaded from a third party, and one form — the waitlist — which stores an email address and an optional grade, and nothing else',
}

export function GET() {
  const text = `# ${COMPANY}

> ${TAGLINE}

${VISION}

${COMPANY} is a software company building learning tools that adapt to the person using them.
Our first product is ${APP_NAME}: adaptive math for grades 3 to 8. It runs at ${APP_URL} and is
open to try: ${APP_URL}/auth is where a parent makes an account, and the URL to give somebody who
wants to try it. ${APP_NAME} was called Milo until August 2026 and
AdaptiveLearn, at adaptivelearn.radlor.com, until September 2026.

${APP_NAME} teaches one idea per lesson: a teacher says each step out loud and writes or draws it on
the board, then the child tries one with hints and worked steps to fall back on. Practice adapts
question by question — each harder level is a different kind of question, not the same question
with bigger numbers — and the level is never shown on screen; a wrong answer is never marked wrong.
Each grade is split into modules: ${APP_GRADES.map(g => `Grade ${g.grade}: ${g.modules.join('; ')}`).join('. ')}.

Parents choose which lessons their child gets, from a library filtered by grade, and can set due
dates. A child signs in with a username and password their parent or teacher sets, with no email
address of their own; the parent dashboard asks for a PIN each time it opens. Teachers make classes
by grade, give each student a login (a list can be uploaded, each with a temporary password), choose
the class's modules, and set class exercises that stay locked until the teacher opens them.

## Pages
${PAGES.map(p => `- [${p.label} — ${BLURB[p.href]}](${SITE_URL}${p.href === '/' ? '' : p.href})`).join('\n')}

## Writing
${posts.map(p => `- [${p.title}](${SITE_URL}/writing/${p.slug}): ${p.description}`).join('\n')}

## Profiles
These are the only accounts ${COMPANY} operates. Generated from the same list that feeds
\`Organization.sameAs\`, so the two cannot disagree.
${SOCIAL.map(s => `- ${s.name}: ${s.url}`).join('\n')}

## Contact
${SUPPORT_EMAIL}
`
  return new Response(text, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
