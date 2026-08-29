import type { Metadata } from 'next'
import Link from 'next/link'
import { SUPPORT_EMAIL } from '@/site'

export const metadata: Metadata = {
  title: 'You are on the waitlist',
  // An outcome page is a dead end for a search result — it tells a visitor nothing and would
  // compete with /waitlist for the same query.
  robots: { index: false, follow: true },
  alternates: { canonical: '/waitlist/thanks' },
}

export default function Thanks() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-20 pb-24">
      <h1 className="rl-focus font-display text-5xl leading-[1.05] max-w-3xl">
        You are on the list.
      </h1>
      <p className="rl-rise mt-6 text-lg text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.12s' } as React.CSSProperties}>
        We will write when there is a place. If you were already on it, you still are — signing up
        twice does not move you up or down.
      </p>
      <p className="rl-rise mt-4 text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.18s' } as React.CSSProperties}>
        To be taken off the list, write to{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="rl-link text-accent">{SUPPORT_EMAIL}</a> and it
        is deleted, not flagged.
      </p>
      <div className="rl-rise mt-9 flex flex-wrap gap-3" style={{ '--d': '0.24s' } as React.CSSProperties}>
        <Link href="/adaptivelearn" className="rl-cta rounded-full bg-accent px-6 py-3 text-on-accent font-medium hover:opacity-90">
          How it works
        </Link>
        <Link href="/" className="rl-cta rl-cta-quiet rounded-full border border-line px-6 py-3 font-medium hover:border-foreground transition-colors">
          Back to the start
        </Link>
      </div>
    </section>
  )
}
