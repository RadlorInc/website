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

export const posts: Post[] = [
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
