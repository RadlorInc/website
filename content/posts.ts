import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Posts are declared here and written as plain markdown in `content/posts/<slug>.md`.
 *
 * Deliberately not MDX and not a CMS: the whole engine is this file plus `marked`. Add one when
 * writing a post is actually the thing slowing you down.
 */
export type Post = {
  slug: string
  title: string
  /** The <meta name="description"> AND the summary an answer engine will quote. Say the finding. */
  description: string
  /** ISO date. Shown as-is, so keep it sortable. */
  date: string
  updated?: string
}

/** Newest first — nothing sorts this array, the writing index and llms.txt render it in order. */
export const posts: Post[] = [
  {
    slug: 'the-gap-is-lower-than-the-grade',
    title: "A sixteen-year-old's math gap is often in grade four",
    description:
      'Placing a child by their school year assumes the year taught them. When a teenager is stuck, the skill that is actually missing is frequently several grades below, so the placement check walks down the prerequisites of what failed rather than testing the grade.',
    date: '2026-08-29',
  },
  {
    slug: 'a-camera-claim-you-can-check',
    title: 'A camera claim you can check',
    description:
      'A promise not to upload video is weaker than an app with no upload path. AdaptiveLearn reads hand gestures inside the browser, and a content security policy the build tests is what stops a frame leaving — here is how to check the same of any app.',
    date: '2026-08-29',
  },
  {
    slug: 'difficulty-should-be-invisible',
    title: 'A child should never see their level',
    description:
      'Showing a child a difficulty level, a rank or a score turns learning into a verdict. Adaptive software can move the difficulty without ever naming it — here is how we do it, and what breaks when you get it wrong.',
    date: '2026-08-19',
  },
]

export const bySlug = (slug: string) => posts.find(p => p.slug === slug)

/** Reads the post body at build time. Throws loudly if a declared post has no file. */
export const body = (slug: string) =>
  readFileSync(join(process.cwd(), 'content', 'posts', `${slug}.md`), 'utf8')
