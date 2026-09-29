import type { Metadata } from 'next'
import { PathRows, type PathRow } from '@/components/scroll/Scroll'
import { PageHero } from '@/components/scroll/PageHero'
import { ART, POST_COVERS } from '@/components/scroll/art'
import { posts } from '@/content/posts'

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'How Radlor builds adaptive learning software: what we got wrong, what the research says, and what we do differently.',
  alternates: { canonical: '/writing' },
}

// Each post is its cover picture on a drawn path (G), under a circle-reveal top (F) (2026-09-29).
export default function Writing() {
  const rows: PathRow[] = posts.map(p => ({
    ...POST_COVERS[p.slug], title: p.title, href: `/writing/${p.slug}`,
    body: <><time dateTime={p.date} className="block text-sm tabular-nums mb-1">{p.date}</time>{p.description}</>,
  }))
  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-20">
        <PageHero title="Writing" line="Design decisions, the ones we got wrong first, and what we changed." pic={ART.writingHero} />
        <PathRows rows={rows} />
      </div>
    </section>
  )
}
