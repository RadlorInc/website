import type { Metadata } from 'next'
import Link from 'next/link'
import { posts } from '@/content/posts'

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'How Radlor builds adaptive learning software: what we got wrong, what the research says, and what we do differently.',
  alternates: { canonical: '/writing' },
}

export default function Writing() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-20">
      <h1 className="font-display text-5xl">Writing</h1>
      <p className="mt-5 text-lg text-muted max-w-2xl leading-relaxed">
        Notes on building learning software — design decisions, the ones we got wrong first, and what we
        changed because of it.
      </p>
      <ul className="mt-12 divide-y divide-line border-t border-line">
        {posts.map(p => (
          <li key={p.slug}>
            <Link href={`/writing/${p.slug}`} className="block py-7 group">
              <span className="text-sm text-muted tabular-nums">{p.date}</span>
              <h2 className="font-display text-2xl mt-1 group-hover:text-accent transition-colors">{p.title}</h2>
              <p className="mt-2 text-muted max-w-2xl leading-relaxed">{p.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
