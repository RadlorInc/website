import type { Metadata } from 'next'
import Link from 'next/link'
import { APP_NAME, COMPANY, SUPPORT_EMAIL } from '@/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${COMPANY} — support, early access to ${APP_NAME}, schools, and press.`,
  alternates: { canonical: '/contact' },
}

const REASONS: { h: string; p: string; href?: string; cta?: string }[] = [
  { h: 'Early access', p: `${APP_NAME} is being tested with a small group of families, and the waitlist is how you get in when we open it up — it is one field and it is the fastest route. Write here instead if you have a question the form cannot answer.`, href: '/waitlist', cta: 'Join the waitlist →' },
  { h: 'Schools', p: 'We can create a class, add children to it and choose which chapters they see. Say roughly how many children and what year group.' },
  { h: 'Support', p: 'Something broken, a question about your account, or a request to delete your data. We answer every one of these ourselves.' },
  { h: 'Press and partnerships', p: 'Happy to talk about what we are building and what we have learned doing it.' },
]

export default function Contact() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Decorative, `aria-hidden`, behind the text — a screen reader gets the copy alone. */}
      <div className="rl-lightfield" aria-hidden="true">
        <div className="rl-glow rl-parallax" style={{ '--p': '30px' } as React.CSSProperties} />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-20">
      <h1 className="rl-focus font-display text-5xl">Contact</h1>
      <p className="rl-rise mt-6 text-lg text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.12s' } as React.CSSProperties}>
        One address, read by the people who build the thing.
      </p>
      <a
        href={`mailto:${SUPPORT_EMAIL}`}
        className="rl-rise rl-cta mt-8 inline-block rounded-full bg-accent px-6 py-3 text-on-accent font-medium hover:opacity-90"
        style={{ '--d': '0.22s' } as React.CSSProperties}
      >
        {SUPPORT_EMAIL}
      </a>

      <div className="mt-16 grid gap-10 sm:grid-cols-2 border-t border-line pt-10">
        {REASONS.map((r, i) => (
          <div key={r.h} className="rl-reveal" style={{ '--i': i + 1 } as React.CSSProperties}>
            <h2 className="font-medium text-lg">{r.h}</h2>
            <p className="mt-2 text-muted leading-relaxed">{r.p}</p>
            {r.href && (
              <Link href={r.href} className="rl-link text-accent mt-2 inline-block">
                {r.cta}
              </Link>
            )}
          </div>
        ))}
      </div>
      </div>
    </section>
  )
}
