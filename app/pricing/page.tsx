import type { Metadata } from 'next'
import Link from 'next/link'
import { APP_ID, APP_NAME, APP_URL, PLANS, PRICING, SITE_URL, SUPPORT_EMAIL, usd } from '@/site'

const first = usd(PRICING.monthly.first)
const additional = usd(PRICING.monthly.additional)

export const metadata: Metadata = {
  title: `Pricing — ${APP_NAME} is ${first} a month for the first child`,
  description: `${APP_NAME} costs ${first} a month for the first child and ${additional} for each additional child, up to ${PRICING.maxChildren}. Annual billing saves over 20%. Every age band and every chapter is included on every plan.`,
  alternates: { canonical: '/pricing' },
}

/**
 * ⚠️ NOT ONE PRICE IS TYPED ON THIS PAGE. Every figure comes from `PRICING` / `PLANS` in
 * `site.ts`, so the table, the JSON-LD offers, the FAQ answers on `/adaptivelearn` and the fact
 * row on the home page cannot disagree with each other. Add a child count and the row appears.
 *
 * ⚠️ `npm run check:pricing` is the gate. It pins the three figures that were published to
 * families and fails if annual ever stops saving over 20% on ANY plan — the saving shrinks as
 * children are added, so the largest plan breaks the claim first and it is the row nobody
 * re-reads.
 *
 * ⚠️ The "What happens when it stops being free" section stood here until 2026-08-30 and was
 * removed with the free tier, on the founder's call. It had promised that families already using
 * the product would hear about a price from us first, with notice, and that nothing their child
 * had done would be locked. Removing the paragraph does not remove the promise — it was made in
 * public and the people it was made to are still here. It now has to be kept by writing to them
 * directly, because the page no longer says it.
 */
export default function Pricing() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        {/* Decorative, `aria-hidden`, behind the text — a screen reader gets the copy alone. */}
        <div className="rl-lightfield" aria-hidden="true">
          <div className="rl-glow rl-parallax" style={{ '--p': '32px' } as React.CSSProperties} />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-14">
          <p className="rl-rise text-sm uppercase tracking-[0.18em] text-accent font-medium">Pricing</p>
          <h1 className="rl-focus font-display text-5xl sm:text-6xl leading-[1.05] mt-4 max-w-3xl" style={{ '--d': '0.09s' } as React.CSSProperties}>
            <span className="rl-lit" style={{ '--lit': 0.62 } as React.CSSProperties}>{first}</span> a month for the first child.
          </h1>
          <p className="rl-rise mt-6 text-lg text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.18s' } as React.CSSProperties}>
            Each additional child is {additional}. Annual billing saves over 20%. Every age band and
            every chapter is on every plan — there is no tier that holds content back.
          </p>
          <p className="rl-rise mt-5 text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.22s' } as React.CSSProperties}>
            <strong className="text-foreground font-medium">
              {APP_NAME} is being tested with a small group of families.
            </strong>{' '}
            Nobody is being charged yet — the waitlist is how you get in when we open it up, and the
            prices above are what it will cost when you do.
          </p>
          <Link
            href="/waitlist"
            className="rl-rise rl-cta mt-9 inline-block rounded-full bg-accent px-6 py-3 text-on-accent font-medium hover:opacity-90"
            style={{ '--d': '0.27s' } as React.CSSProperties}
          >
            Join the waitlist
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6"><div className="rl-rule" /></div>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="rl-reveal-focus font-display text-3xl">Simple pricing for the whole family</h2>
        <p className="rl-reveal mt-5 text-muted max-w-2xl leading-relaxed" style={{ '--i': 1 } as React.CSSProperties}>
          The first child is {first}/month, and each additional child is {additional}/month. Every child
          gets access to the same complete {APP_NAME} experience.
        </p>
        <p className="rl-reveal mt-4 text-muted max-w-2xl leading-relaxed text-sm" style={{ '--i': 2 } as React.CSSProperties}>
          The annual column is the same thing paid once. The dollar saving is exact; the percentage
          beside it is rounded <em>down</em>, so it is never larger than what you actually save.
        </p>

        <div className="mt-9 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="py-3 pr-4 font-medium text-sm uppercase tracking-widest text-muted">Children</th>
                <th scope="col" className="py-3 pr-4 font-medium text-sm uppercase tracking-widest text-muted">Monthly</th>
                <th scope="col" className="py-3 pr-4 font-medium text-sm uppercase tracking-widest text-muted">Annual</th>
                <th scope="col" className="py-3 font-medium text-sm uppercase tracking-widest text-muted">You save</th>
              </tr>
            </thead>
            <tbody>
              {PLANS.map((p, i) => (
                <tr key={p.children} className="rl-reveal-left border-b border-line" style={{ '--i': i + 1 } as React.CSSProperties}>
                  <th scope="row" className="py-4 pr-4 font-display text-2xl font-normal">{p.children}</th>
                  <td className="py-4 pr-4">
                    {usd(p.monthly)}
                    <span className="text-muted text-sm"> /mo</span>
                  </td>
                  <td className="py-4 pr-4">
                    {usd(p.annual)}
                    <span className="text-muted text-sm"> /yr</span>
                  </td>
                  <td className="py-4 text-muted">
                    {usd(p.saved)} <span className="text-sm">({p.savedPctLabel})</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="rl-reveal mt-6 text-muted max-w-2xl leading-relaxed" style={{ '--i': 3 } as React.CSSProperties}>
          Family plans cover up to {PRICING.maxChildren} children. Have more than four?{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="rl-link text-accent">Write to us</a> and
          we&rsquo;ll work with you.
        </p>
      </section>

      <div className="mx-auto max-w-5xl px-6"><div className="rl-rule" /></div>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="rl-reveal-focus font-display text-3xl">What every plan includes</h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 max-w-3xl">
          {[
            ['Every age band', 'Ages 3–18.'],
            ['Every chapter', 'Nothing is locked behind a higher tier.'],
            ['Placement check', 'Helps your child start where they actually are.'],
            ['Parent view', 'See where your child is and what they last worked on.'],
            ['Camera chapters', 'Available on compatible devices with a webcam.'],
            ['Full access', 'Annual and monthly plans include the same product.'],
          ].map(([label, t], i) => (
            <li key={label} className="rl-reveal-left flex gap-3 text-muted leading-relaxed" style={{ '--i': i + 1 } as React.CSSProperties}>
              <span className="text-accent shrink-0">—</span>
              <span>
                <strong className="text-foreground font-medium">{label}:</strong> {t}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mx-auto max-w-5xl px-6"><div className="rl-rule" /></div>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="rl-reveal-focus font-display text-3xl">Schools</h2>
        <p className="rl-reveal mt-5 text-muted max-w-2xl leading-relaxed" style={{ '--i': 1 } as React.CSSProperties}>
          A class is not a family, so the per-child price above does not fit one and we haven&rsquo;t
          published a standard school price yet. For our first schools we&rsquo;ll work with you directly
          to set up your class, understand your needs, and make sure {APP_NAME} is working for your
          students.{' '}
          <Link href="/for-schools" className="rl-link text-accent">
            How it works with a class →
          </Link>
        </p>
      </section>

      {/*
        ⚠️ NOT `Product`. It was one until 2026-08-20, and Search Console reported six issues
        against it: four Merchant listings (missing `image` — CRITICAL — plus
        `hasMerchantReturnPolicy`, `shippingDetails`, and `brand` rejected as an invalid object
        type for a bare `@id` reference) and two Product snippets (`aggregateRating`, `review`).
        Every one of them is retail: a thing that ships, is returned, and is reviewed. This is web
        software with no reviews, and inventing ratings to satisfy a validator is exactly what
        Google's own guidelines forbid. THAT REASONING SURVIVES THE PRICE — a paid web app is no
        more a shippable good than a free one was.

        So the type is the fix. `SoftwareApplication` at the SAME `@id` the app and
        `/adaptivelearn` declare merges this page into that one node instead of standing up a
        competing retail product — and it carries the price perfectly well, which is the only
        reason the block exists.

        ⚠️ Still no `aggregateRating` and no `review`. We have none.

        `LimitedAvailability`, not `InStock`: the way in is a waitlist, so it is not something a
        visitor can buy this second, and saying otherwise in markup is the same lie as saying it
        in copy.
      */}
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        '@id': APP_ID,
        name: APP_NAME,
        url: APP_URL,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web browser',
        description: metadata.description,
        publisher: { '@id': `${SITE_URL}/#organization` },
        offers: PLANS.flatMap(p => [
          {
            '@type': 'Offer',
            name: `${p.children} ${p.children === 1 ? 'child' : 'children'}, billed monthly`,
            price: (p.monthly / 100).toFixed(2),
            priceCurrency: PRICING.currency,
            availability: 'https://schema.org/LimitedAvailability',
            url: `${SITE_URL}/waitlist`,
          },
          {
            '@type': 'Offer',
            name: `${p.children} ${p.children === 1 ? 'child' : 'children'}, billed annually`,
            price: (p.annual / 100).toFixed(2),
            priceCurrency: PRICING.currency,
            availability: 'https://schema.org/LimitedAvailability',
            url: `${SITE_URL}/waitlist`,
          },
        ]),
      })}</script>
    </>
  )
}
