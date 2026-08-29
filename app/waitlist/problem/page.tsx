import type { Metadata } from 'next'
import Link from 'next/link'
import { SUPPORT_EMAIL } from '@/site'

export const metadata: Metadata = {
  title: 'That did not go through',
  robots: { index: false, follow: true },
  alternates: { canonical: '/waitlist/problem' },
}

/**
 * Every failure lands here: a malformed address, too many attempts from one place, or our end
 * being broken. It deliberately does not say which — telling a submitter exactly which check
 * they tripped is how you help somebody tune past it — but it always gives a way through that
 * does not depend on us, which is the mailto.
 */
export default function Problem() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-20 pb-24">
      <h1 className="rl-focus font-display text-5xl leading-[1.05] max-w-3xl">
        That did not go through.
      </h1>
      <p className="rl-rise mt-6 text-lg text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.12s' } as React.CSSProperties}>
        Either the address did not look like an address, or you have tried a few times in quick
        succession, or something broke at our end. Nothing was stored.
      </p>
      <p className="rl-rise mt-4 text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.18s' } as React.CSSProperties}>
        Go back and try once more, or skip the form entirely and write to{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="rl-link text-accent">{SUPPORT_EMAIL}</a> — that
        reaches a person and works just as well.
      </p>
      <div className="rl-rise mt-9" style={{ '--d': '0.24s' } as React.CSSProperties}>
        <Link href="/waitlist" className="rl-cta rounded-full bg-accent px-6 py-3 text-on-accent font-medium hover:opacity-90">
          Back to the form
        </Link>
      </div>
    </section>
  )
}
