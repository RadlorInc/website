import type { Metadata } from 'next'
import Link from 'next/link'
import { APP_NAME, APP_URL, COMPANY, SITE_URL, SUPPORT_EMAIL } from '@/site'

export const metadata: Metadata = {
  title: `Pricing — ${APP_NAME} is free during early access`,
  description: `${APP_NAME} is free while it is in early access: every age band, every chapter, no card and no trial timer. We will tell families before that changes.`,
  alternates: { canonical: '/pricing' },
}

/**
 * ⚠️ This page and the `Offer` block in `/adaptivelearn` state the same price and must change
 * together. It is the most-asked question about any learning app, so it gets its own URL rather
 * than a line in a FAQ — an answer engine that cannot find a price will invent one.
 */
export default function Pricing() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-14">
        <p className="text-sm uppercase tracking-[0.18em] text-accent font-medium">Pricing</p>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] mt-4 max-w-3xl">
          Free while we are in early access.
        </h1>
        <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">
          No card, no trial countdown, no locked chapters. {APP_NAME} is early software and we would
          rather have fifty families using it properly and telling us what is wrong than a paywall
          around something we are still learning to build.
        </p>
        <a
          href={APP_URL}
          className="mt-9 inline-block rounded-full bg-accent px-6 py-3 text-white font-medium hover:opacity-90 transition-opacity"
        >
          Open {APP_NAME}
        </a>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 border-t border-line">
        <h2 className="font-display text-3xl">What free actually includes</h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 max-w-3xl">
          {[
            'Every age band, 3 to 18 — not a sample of the youngest one.',
            'Every chapter in every band, with no chapter held back for a paid tier.',
            'The placement check, so the child starts where they actually are.',
            'The parent view: where your child is, and what they last worked on.',
            'As many children as you have. Siblings do not cost extra.',
            'The camera chapters, on any device with a webcam.',
          ].map(t => (
            <li key={t} className="flex gap-3 text-muted leading-relaxed">
              <span className="text-accent shrink-0">—</span>
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 border-t border-line">
        <h2 className="font-display text-3xl">What happens when it stops being free</h2>
        <div className="prose mt-6">
          <p>
            It will not stay free forever — we are a company, not a charity, and software that cannot pay
            for itself eventually stops being maintained. That is worse for your child than a price.
          </p>
          <p>
            What we will not do is surprise you. When there is a price, families already using{' '}
            {APP_NAME} will hear it from us first, with notice, and nothing your child has already done
            will be taken away or locked behind it. We would rather say that now, in writing, than be
            asked about it later.
          </p>
          <p>
            We have not set a number yet, so we are not going to pretend one. If a price is the thing
            standing between you and trying it, write to us and ask —{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 border-t border-line">
        <h2 className="font-display text-3xl">Schools</h2>
        <p className="mt-5 text-muted max-w-2xl leading-relaxed">
          Also free at the moment, and we set the class up with you rather than handing over a form — at
          our size that is genuinely the faster way round.{' '}
          <Link href="/for-schools" className="text-accent hover:underline">
            How it works with a class →
          </Link>
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: APP_NAME,
            url: `${SITE_URL}/pricing`,
            description: metadata.description,
            brand: { '@id': `${SITE_URL}/#organization` },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'INR',
              availability: 'https://schema.org/LimitedAvailability',
              description: `Free for all users during ${COMPANY}'s early access period.`,
              url: APP_URL,
            },
          }),
        }}
      />
    </>
  )
}
