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
    <section className="relative isolate overflow-hidden">
      {/* Decorative, `aria-hidden`, behind the text — a screen reader gets the copy alone. */}
      <div className="rl-lightfield" aria-hidden="true">
        <div className="rl-glow rl-parallax" style={{ '--p': '30px' } as React.CSSProperties} />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-20">
      <h1 className="rl-focus font-display text-5xl">Writing</h1>
      <p className="rl-rise mt-5 text-lg text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.12s' } as React.CSSProperties}>
        Notes on building learning software — design decisions, the ones we got wrong first, and what we
        changed because of it.
      </p>
      <ul className="mt-12 divide-y divide-line border-t border-line">
        {posts.map((p, i) => (
          <li key={p.slug} className="rl-reveal" style={{ '--i': i + 1 } as React.CSSProperties}>
            <Link href={`/writing/${p.slug}`} className="rl-row block py-7 group">
              <span className="text-sm text-muted tabular-nums">{p.date}</span>
              <h2 className="font-display text-2xl mt-1 group-hover:text-accent transition-colors">{p.title}</h2>
              <p className="mt-2 text-muted max-w-2xl leading-relaxed">{p.description}</p>
            </Link>
          </li>
        ))}
      </ul>
      </div>
    </section>
  )
}
