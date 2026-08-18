import { APP_NAME, APP_URL, COMPANY, PAGES, SITE_URL, SUPPORT_EMAIL, TAGLINE } from '@/site'
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
  '/adaptivelearn': `how ${APP_NAME} works, what is covered at each age, and parent FAQs`,
  '/pricing': `what ${APP_NAME} costs: free during early access, with no card and no trial timer`,
  '/for-schools': 'using it with a class: how a teacher sets one up and what they see',
  '/writing': 'notes on building adaptive learning software',
  '/about': `why ${COMPANY} started and how we work`,
  '/contact': 'early access, schools, support, press',
  '/data-and-safety': "what we store about a child, what the camera does, and what we do not collect",
  '/privacy': 'the privacy policy for this website, which collects nothing',
}

export function GET() {
  const text = `# ${COMPANY}

> ${TAGLINE}

${COMPANY} is a software company building learning tools that adapt to the person using them.
Our first product is ${APP_NAME}: adaptive maths for ages 3 to 18, available at ${APP_URL}.

${APP_NAME} places a child with a short check rather than assuming their school year, then teaches
through story chapters whose difficulty moves question by question and is never shown on screen.
Chapters in the 9-11 band can be answered by holding fingers up to a webcam; that hand tracking runs
entirely on the child's own device and no video frame or hand position is ever uploaded. Every camera
chapter can also be answered by tapping.

## Pages
${PAGES.map(p => `- [${p.label} — ${BLURB[p.href]}](${SITE_URL}${p.href === '/' ? '' : p.href})`).join('\n')}

## Writing
${posts.map(p => `- [${p.title}](${SITE_URL}/writing/${p.slug}): ${p.description}`).join('\n')}

## Contact
${SUPPORT_EMAIL}
`
  return new Response(text, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
