import type { Metadata } from 'next'
import Link from 'next/link'
import { APP_NAME, COMPANY, SITE_URL, SUPPORT_EMAIL } from '@/site'

export const metadata: Metadata = {
  title: 'Privacy on this website',
  description:
    'radlor.com sets no cookies, runs no analytics and loads nothing from a third party. There is one form — the waitlist — and it stores an email address and nothing else. This page says exactly what does and does not happen when you read it.',
  alternates: { canonical: '/privacy' },
}

/**
 * ⚠️ THIS PAGE MAKES CHECKABLE CLAIMS AND THEY WERE CHECKED, NOT ASSUMED.
 *
 * Re-measured 2026-08-30, after the waitlist form was added — which is the change that could most
 * easily have broken this page, because a form is normally where a third party arrives. Across
 * `/`, `/privacy`, `/pricing` and `/waitlist`, each loaded in a real browser:
 *
 *   · 18 resources per page, and `performance.getEntriesByType('resource')` reports
 *     **0 hosts other than the origin** — the waitlist page included.
 *   · fonts all from our own `/_next/static/media/` — no font host.
 *   · `document.cookie` empty; `localStorage` and `sessionStorage` both 0 keys.
 *   · **no `supabase.co` anywhere in the served HTML**, and no Supabase SDK in any bundle:
 *     `app/api/waitlist/route.ts` reaches the database with `fetch` from the server, so the
 *     dependency does not exist in this repo and cannot be bundled by accident.
 *   · the form is `method="post" action="/api/waitlist"` — our own origin. Submitting it sends
 *     exactly one request, to us. Verified with form-encoded POSTs and JavaScript never involved:
 *     a new address 303s to /waitlist/thanks, a repeat is handled as success rather than a 500,
 *     and the honeypot and per-IP rate limit both redirect without ever reaching the database.
 *
 * If you add ANYTHING that talks to another origin — an analytics snippet, an embedded video, a
 * hosted font, a map, a CAPTCHA, or a browser-side Supabase client — this page is wrong and has to
 * change in the same commit. Re-run the check above; it is four lines in a console.
 */
export default function Privacy() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Decorative, `aria-hidden`, behind the text — a screen reader gets the copy alone. */}
      <div className="rl-progress" aria-hidden="true" />
      <div className="rl-lightfield" aria-hidden="true">
        <div className="rl-glow rl-parallax" style={{ '--p': '30px' } as React.CSSProperties} />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-20">
      <h1 className="rl-focus font-display text-5xl">Privacy on this website</h1>
      <p className="rl-rise mt-6 text-lg text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.12s' } as React.CSSProperties}>
        This page is about <strong className="text-foreground font-medium">radlor.com</strong>, the site
        you are reading. {APP_NAME} — the product — handles children&rsquo;s data and has its own,
        longer policy.
      </p>

      <div className="rl-prose prose mt-10">
        <h2>What this website does not do</h2>
        <p>It sets no cookies. It runs no analytics. It loads nothing from anyone else&rsquo;s server.</p>
        <p>
          There is no Google Analytics, no advertising pixel, no session recorder, no chat widget and no
          embedded video. The typefaces are served from our own domain rather than from a font host, so
          no third party is told that you visited. Nothing is written to your browser&rsquo;s storage. We
          do not have an account with anyone who would receive your reading of this page, because we
          never signed up for one.
        </p>
        <p>
          You can check all of that yourself: open your browser&rsquo;s network tab and reload. Every
          request goes to radlor.com. Do it on{' '}
          <Link href="/waitlist" className="rl-link">the waitlist page</Link> too, and submit the form
          while you watch — the only request that leaves is a POST to radlor.com.
        </p>

        <h2>What does happen</h2>
        <p>
          The site is hosted by <strong>Vercel</strong>, and like any web server theirs records the
          requests it serves — an IP address, the page asked for, a timestamp, the browser&rsquo;s own
          description of itself. We do not build profiles from those logs and they expire on Vercel&rsquo;s
          own schedule. It is the minimum a server does in order to be a server, and we would be lying if
          we said nothing was recorded anywhere.
        </p>

        <h2>The waitlist form</h2>
        <p>
          There is one form on this site, at{' '}
          <Link href="/waitlist" className="rl-link">the waitlist</Link>, and it is the only thing here
          that collects anything. It stores{' '}
          <strong className="text-foreground font-medium">an email address</strong>, and{' '}
          <strong className="text-foreground font-medium">an age band if you pick one</strong> — that
          field is optional and &ldquo;rather not say&rdquo; is the default. There is no name field, no
          date of birth and nowhere to type a child&rsquo;s name, because a waitlist does not need any of
          it.
        </p>
        <p>
          It is stored in a database we run, hosted by <strong>Supabase</strong>, and used to write to
          you about a place and for nothing else. It is not a mailing list, it is not sold, and nobody
          else is given it. Ask us to remove you —{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> — and the row is deleted, not marked
          as unsubscribed.
        </p>
        <p>
          <strong className="text-foreground font-medium">
            The form does not change what your browser talks to.
          </strong>{' '}
          It posts to radlor.com, and our own server passes it on to the database — so the request
          leaves your machine addressed to us and to nobody else. That is unusual enough to be worth
          saying out loud: most forms hand your browser a key and let it talk straight to the database
          vendor, which would put a second name in the network tab below. Ours does not, and the check
          further up this page still passes on the waitlist page itself. There is no CAPTCHA either,
          for the same reason — every one of them is somebody else&rsquo;s script.
        </p>

        <h2>If you write to us</h2>
        <p>
          The address on this site is <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>, and you
          can use it instead of the form for anything, including asking for a place. If you email us we
          keep the message so that we can answer it and remember the conversation next time. Ask us to
          delete it and we will.
        </p>

        <h2>Children</h2>
        <p>
          This website is written for adults — parents, teachers, people deciding whether to try{' '}
          {APP_NAME}. It is not aimed at children, and the one form on it asks for an adult&rsquo;s email
          address so that we can write back about an account an adult would set up. We do not ask a
          child for anything here. Everything about what we store when a child actually uses the product
          is on <Link href="/data-and-safety" className="rl-link">data and safety</Link>.
        </p>

        <h2>The product</h2>
        <p>
          {/* ⚠️ NAMED, NOT LINKED — and that is deliberate. This page's argument depends on
              naming the two origins separately, so the address stays. But an anchor on the app's
              ROOT is a door: that page links straight to /auth, and from 2026-08-31 the waitlist
              is the only way in. The sentence loses nothing as text. The deep link to the legal
              policy on /data-and-safety is a different case and stays clickable — a policy
              nobody can open is not a published policy. */}
          {APP_NAME} lives on a different address —{' '}
          <strong className="text-foreground font-medium">adaptivelearn.radlor.com</strong> — and is a
          different piece of software with accounts, a database and a camera feature. Its policy is
          published there, and the plain-English version is on{' '}
          <Link href="/data-and-safety" className="rl-link">data and safety</Link>.
        </p>

        <h2>Changes, and who to ask</h2>
        <p>
          If this page ever stops being true we will change it in the same breath as the thing that made
          it untrue — that is a rule we hold ourselves to, not a promise about a review cycle. Questions
          about any of it go to <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>, and a person at{' '}
          {COMPANY} answers them.
        </p>
      </div>

      <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': `${SITE_URL}/privacy`,
            name: 'Privacy on this website',
            description: metadata.description,
            isPartOf: { '@id': `${SITE_URL}/#website` },
            publisher: { '@id': `${SITE_URL}/#organization` },
          })}</script>
      </div>
    </section>
  )
}
