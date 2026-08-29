import type { Metadata } from 'next'
import Link from 'next/link'
import { AGE_BANDS, APP_NAME, PRICING, SUPPORT_EMAIL, usd } from '@/site'

export const metadata: Metadata = {
  title: `Join the ${APP_NAME} waitlist`,
  description: `${APP_NAME} is opening to new families a few at a time. Leave an email address and we will write when there is a place. We ask for an email and, if you want to tell us, an age band — nothing else.`,
  alternates: { canonical: '/waitlist' },
}

/**
 * ⚠️ THIS PAGE HAS NO JAVASCRIPT AND IS NOT A CLIENT COMPONENT. It is a plain
 * `<form method="post">` posting to a Route Handler on our own origin, which is what makes it
 * work with JS disabled AND what keeps /privacy true: the browser talks to radlor.com and to
 * nobody else. There is no Supabase key in this HTML and no SDK in the bundle.
 *
 * ⚠️ The outcome pages are separate static routes (/waitlist/thanks, /waitlist/problem) rather
 * than `?ok=1` read from `searchParams`. Reading searchParams here would opt this page out of
 * static prerendering, and a query string cannot be read without JS anyway. Two tiny static
 * pages cost less than one dynamic one.
 */
export default function Waitlist() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        {/* Decorative, `aria-hidden`, behind the text — a screen reader gets the copy alone. */}
        <div className="rl-lightfield" aria-hidden="true">
          <div className="rl-glow rl-parallax" style={{ '--p': '30px' } as React.CSSProperties} />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-14">
          <p className="rl-rise text-sm uppercase tracking-[0.18em] text-accent font-medium">Waitlist</p>
          <h1 className="rl-focus font-display text-5xl sm:text-6xl leading-[1.05] mt-4 max-w-3xl" style={{ '--d': '0.09s' } as React.CSSProperties}>
            We are opening to new families a few at a time.
          </h1>
          <p className="rl-rise mt-6 text-lg text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.18s' } as React.CSSProperties}>
            {APP_NAME} is early software and we would rather add families slowly than badly. Leave an
            email address and we will write when there is a place. Pricing starts at{' '}
            {usd(PRICING.monthly.first)} a month for the first child —{' '}
            <Link href="/pricing" className="rl-link text-accent">the full price list is here</Link>.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6"><div className="rl-rule" /></div>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <form method="post" action="/api/waitlist" className="max-w-xl">
          <div className="rl-reveal" style={{ '--i': 1 } as React.CSSProperties}>
            <label htmlFor="email" className="block font-medium">
              Email address
            </label>
            <p className="mt-1 text-sm text-muted">The only thing we actually need.</p>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              maxLength={254}
              placeholder="you@example.com"
              className="mt-3 w-full rounded-xl border border-line bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>

          <div className="rl-reveal mt-8" style={{ '--i': 2 } as React.CSSProperties}>
            <label htmlFor="age_band" className="block font-medium">
              Age band <span className="font-normal text-muted">(optional)</span>
            </label>
            <p className="mt-1 text-sm text-muted">
              Only so we know which bands families are waiting for. Not your child&rsquo;s birthday, and
              not their name — we do not need either.
            </p>
            <select
              id="age_band"
              name="age_band"
              defaultValue=""
              className="mt-3 w-full rounded-xl border border-line bg-surface px-4 py-3 text-foreground focus:border-accent focus:outline-none"
            >
              <option value="">Rather not say</option>
              {AGE_BANDS.map(b => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          {/*
            The honeypot. Hidden from people and from screen readers, left in the tab order's
            blind spot with `tabIndex={-1}`. A bot fills every field it finds; a person cannot
            fill this one. This is why there is no CAPTCHA — every CAPTCHA is a third-party
            script and would break the claim on /privacy that the browser contacts nobody else.
          */}
          <div aria-hidden="true" className="hidden">
            <label htmlFor="company">Company</label>
            <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="rl-reveal mt-9" style={{ '--i': 3 } as React.CSSProperties}>
            <button
              type="submit"
              className="rl-cta rounded-full bg-accent px-6 py-3 text-on-accent font-medium hover:opacity-90"
            >
              Join the waitlist
            </button>
          </div>
        </form>

        <p className="mt-10 text-sm text-muted max-w-xl leading-relaxed">
          We store the address and the band, and nothing else — no name, no date of birth, no
          child&rsquo;s name. It is used to write to you about a place and for nothing else, and you can
          have it deleted by asking:{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="rl-link text-accent">{SUPPORT_EMAIL}</a>.{' '}
          <Link href="/privacy" className="rl-link text-accent">What this website stores →</Link>
        </p>
      </section>
    </>
  )
}
