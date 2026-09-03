import type { Metadata } from 'next'
import Link from 'next/link'
import { APP_NAME, APP_URL, SITE_URL, SUPPORT_EMAIL } from '@/site'

export const metadata: Metadata = {
  title: 'Data and safety',
  description:
    'What AdaptiveLearn stores about a child, what the camera does and does not do, who else can see anything, and how to delete it all. Hand tracking runs on the device and no video frame is ever uploaded.',
  alternates: { canonical: '/data-and-safety' },
}

/**
 * ⚠️ EVERY CLAIM HERE IS ABOUT THE PRODUCT AND MUST STAY TRUE OF THE PRODUCT.
 * The camera paragraph in particular is the kind of sentence a regulator reads. It is currently
 * true — there is no upload path in the app's AR code and its Content-Security-Policy makes one
 * impossible — and if that stack ever changes, this page changes first.
 *
 * Note what is deliberately NOT claimed: nowhere does this say "COPPA compliant" or "GDPR
 * compliant". We describe what we do. A compliance badge is a legal conclusion and we have not
 * earned the right to print one.
 */

const STORE = [
  ['The child’s name', 'Whatever you type — a first name or a nickname is fine, and plenty of our families use one. It is there so the child sees themselves in the app.'],
  ['An age band', 'Which of the six bands they are in. Not a date of birth: we used to have a field for one, never filled it in, and removed it.'],
  ['What they have played', 'Which chapters were opened, which questions were answered, and whether each was right. This is the whole point — it is what lets the next question be the right one.'],
  ['The parent’s email', 'Yours, for the account. Either the address you signed up with or the one attached to your Google account.'],
]

const NEVER = [
  'Video, photographs or audio. None of it is recorded and none of it is uploaded.',
  'Hand positions from the camera. They are read and used and thrown away, on the device.',
  'A date of birth, a home address, a phone number, a school ID or a photograph of your child.',
  'Anything sold, rented or shared with an advertiser. We run no advertising and have no advertisers.',
  'Third-party analytics or tracking inside the product. There is no Google Analytics, no pixel, no session recorder.',
]

export default function DataAndSafety() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Decorative, `aria-hidden`, behind the text — a screen reader gets the copy alone. */}
      <div className="rl-progress" aria-hidden="true" />
      <div className="rl-lightfield" aria-hidden="true">
        <div className="rl-glow rl-parallax" style={{ '--p': '30px' } as React.CSSProperties} />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-20">
      <p className="rl-rise text-sm uppercase tracking-[0.18em] text-accent font-medium">Data and safety</p>
      <h1 className="rl-focus font-display text-5xl mt-4 max-w-3xl" style={{ '--d': '0.09s' } as React.CSSProperties}>
        What we know about your child, in <span className="rl-lit" style={{ '--lit': 0.5 } as React.CSSProperties}>plain</span> English.
      </h1>
      <p className="rl-rise mt-6 text-lg text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.18s' } as React.CSSProperties}>
        {APP_NAME} is used by children, so you should be able to read this page and simply know where
        you stand. It is in plain English, it describes what we actually do, and where something is a
        limitation rather than a promise, it says so.
      </p>

      <div className="rl-prose prose mt-14">
        <h2>The camera</h2>
        <p>
          <strong>
            Nothing from the camera is uploaded or stored. No video, no photograph, no hand position.
          </strong>{' '}
          Some chapters in the 9&ndash;11 band let a child answer by holding fingers up, tilting a hand or
          holding two hands apart, and this is the part parents ask about first. That is the short answer.
          The detail is below.
        </p>
        <p>
          The tracking runs inside your own browser, on your own device. Each frame is looked at, turned
          into a few coordinates, compared with the expected answer, and thrown away — all on your machine,
          in a fraction of a second. Nothing is written to a file and nothing is sent anywhere.
        </p>
        <p>
          Two things make that hard to break by accident. There is no code anywhere in the app that sends a
          camera frame or a hand position &mdash; not one that is switched off, none at all. And the app
          carries a list of the only places it is allowed to contact, enforced by the browser itself, which
          does not include anywhere those images could go. Adding an upload would mean changing both, in
          public, in this repository.
        </p>
        <p>
          Two things we will not hide. First, the tracking software has to be downloaded the first time it
          is used, and it comes from file servers run by Google and jsDelivr. Those two companies see that
          a device asked them for a file &mdash; the same thing they see when any website loads any
          library. <strong>They do not receive camera footage, hand data, or anything about your
          child.</strong> Second, the browser asks your permission before the camera turns on, and that
          permission is yours to refuse.
        </p>
        <p>
          <strong>Refusing costs your child nothing.</strong> Every chapter that accepts a hand gesture
          also accepts taps, with the same questions and the same scoring. A child who says no to the
          camera lands straight on the tap version. The camera is a nicer way to answer, never the only
          way.
        </p>

        <h2>What we store</h2>
        <div className="not-prose mt-6 grid gap-px bg-line border border-line rounded-2xl overflow-hidden">
          {STORE.map(([h, p], i) => (
            <div key={h} className="rl-reveal-left bg-surface p-6 flex flex-wrap gap-x-8 gap-y-2" style={{ '--i': i + 1 } as React.CSSProperties}>
              <p className="font-medium w-48 shrink-0">{h}</p>
              <p className="flex-1 min-w-56 text-muted leading-relaxed">{p}</p>
            </div>
          ))}
        </div>
        <p className="mt-6">
          If you asked for early access before you had an account, we also still have the email address
          you gave us and the age band you picked, from that request.
        </p>

        <h2>What we never store</h2>
        <ul>
          {NEVER.map(t => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <h2>Who can access it?</h2>
        <p>
          <strong>You.</strong> A parent account can see its own children, and no other family&rsquo;s.
          That is not a rule we wrote down and hope everybody follows — the database itself refuses to
          return another family&rsquo;s rows, and we test that by trying it.
        </p>
        <p>
          <strong>Your child&rsquo;s teacher, if a school is using it.</strong> A teacher can see the
          children in a class they created, and nothing outside it. If you are not using {APP_NAME}
          through a school, no teacher can see anything.
        </p>
        <p>
          <strong>Two companies that hold it for us,</strong> because we do not run our own servers.{' '}
          <strong>Supabase</strong> stores the database and <strong>Vercel</strong> serves the app. They
          store it on our behalf under contract and use it for nothing of their own. If you sign in with
          Google, Google confirms to us that the email address is yours and tells us nothing else about
          you.
        </p>
        <p>
          Nobody else. We do not sell it, rent it or share it with advertisers, and we have no
          advertisers to share it with.
        </p>

        <h2>Deleting it</h2>
        <p>
          Delete a child from your account and everything attached to them goes with it — every session,
          every answer, every record. Not marked as hidden: removed. If you want the whole account and
          everything in it gone, email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> and we
          will do it and confirm when it is done.
        </p>

        <h2>What we have not finished</h2>
        <p>
          We would rather write this than let you find it out later. {APP_NAME} is early software.
          Signing up is an email address and a password, or a Google account — it is not one of the
          formal age-verification methods that a regulator such as the American COPPA rules expect of a
          service aimed at young children, and we are not going to claim it is. We are working on it. In
          the meantime the honest position is that an adult sets the account up, and the design assumes
          that adult is nearby.
        </p>
        <p>
          If a specific requirement matters to you — for a school, a district, or your own peace of mind
          — write and ask. You will get a straight answer about what we do and do not have, including
          the parts we have not built yet.
        </p>

        <h2>Asking us anything</h2>
        <p>
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> reaches the people who built the thing.
          The full legal policy is published inside the product at{' '}
          <a href={`${APP_URL}/legal/privacy`}>adaptivelearn.radlor.com/legal/privacy</a>; this page is
          the same facts without the lawyering. Privacy on this website — as opposed to in the product —
          is <Link href="/privacy" className="rl-link">its own short page</Link>.
        </p>
      </div>

      <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': `${SITE_URL}/data-and-safety`,
            name: 'Data and safety',
            description: metadata.description,
            isPartOf: { '@id': `${SITE_URL}/#website` },
            publisher: { '@id': `${SITE_URL}/#organization` },
          })}</script>
      </div>
    </section>
  )
}
