import { APP_NAME, APP_URL, COMPANY, SITE_URL, SUPPORT_EMAIL, TAGLINE } from '@/site'
import { posts } from '@/content/posts'

/**
 * llms.txt — the plain-text summary an answer engine reads instead of guessing from markup.
 *
 * Generated from `site.ts` and `posts.ts` rather than kept as a static file in `public/`, because a
 * static one drifts the first time a page is renamed and nothing tells you.
 */
export const dynamic = 'force-static'

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
${[
  ['/', 'Home — what we build and why'],
  ['/adaptivelearn', `${APP_NAME} — how it works, what is covered by age, and parent FAQs`],
  ['/about', `About ${COMPANY} — why we started and how we work`],
  ['/writing', 'Writing — notes on building adaptive learning software'],
  ['/contact', 'Contact — early access, schools, support, press'],
]
  .map(([href, desc]) => `- [${desc}](${SITE_URL}${href === '/' ? '' : href})`)
  .join('\n')}

## Writing
${posts.map(p => `- [${p.title}](${SITE_URL}/writing/${p.slug}): ${p.description}`).join('\n')}

## Contact
${SUPPORT_EMAIL}
`
  return new Response(text, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
