import type { Metadata } from 'next'
import { MiloPanel } from '@/components/MiloPanel'
import { APP_NAME, APP_URL, COMPANY, SUPPORT_EMAIL } from '@/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${COMPANY} — support, early access to ${APP_NAME}, schools, and press.`,
  alternates: { canonical: '/contact' },
}

const REASONS: { h: string; p: string; href?: string; cta?: string }[] = [
  { h: 'Try it', p: `${APP_NAME} is open to try: make a parent account on ${APP_URL.replace('https://', '')} and add your child. Write here instead if you have a question first.`, href: `${APP_URL}/auth`, cta: `Try ${APP_NAME} →` },
  { h: 'Schools', p: 'Classroom accounts are paused while we build a way for a school to give consent for its students. Write to us and we will tell you when they open.' },
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

      <div className="mt-12 max-w-2xl">
        {/* Restates this page's own line — "One address, read by the people who build the thing" —
            and /privacy's "a person at Radlor answers them". No new promise about response time:
            the site has never made one and a mascot band is not where one starts. */}
        <MiloPanel src="/milo-contact.webp" width={760} height={681} size="sm">
          <p className="text-lg">One address, read by the people who build the thing.</p>
        </MiloPanel>
      </div>

      <div className="mt-16 grid gap-10 sm:grid-cols-2 border-t border-line pt-10">
        {REASONS.map((r, i) => (
          <div key={r.h} className="rl-reveal" style={{ '--i': i + 1 } as React.CSSProperties}>
            <h2 className="font-medium text-lg">{r.h}</h2>
            <p className="mt-2 text-muted leading-relaxed">{r.p}</p>
            {r.href && (
              <a href={r.href} className="rl-link text-accent mt-2 inline-block">
                {r.cta}
              </a>
            )}
          </div>
        ))}
      </div>
      </div>
    </section>
  )
}
