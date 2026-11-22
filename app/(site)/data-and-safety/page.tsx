import type { Metadata } from 'next'
import { PathRows, type PathRow } from '@/components/scroll/Scroll'
import { PageHero } from '@/components/scroll/PageHero'
import { ART } from '@/components/scroll/art'
import Link from 'next/link'
import { APP_NAME, APP_URL, SITE_URL, SUPPORT_EMAIL } from '@/site'

export const metadata: Metadata = {
  title: 'Data and safety',
  description:
    'What Radlic stores about a child, who else can see it, and how to delete it all. A child never needs an email address, and nothing is sold or shared with an advertiser.',
  alternates: { canonical: '/data-and-safety' },
}

/**
 * ⚠️ EVERY CLAIM HERE IS ABOUT THE PRODUCT AND MUST STAY TRUE OF THE PRODUCT.
 *
 * ⚠️ REWRITTEN 2026-09-19 FROM THE APP'S `release` BRANCH (sw v205). The camera section is GONE:
 * since 2026-09-13 every chapter that used the camera is hidden (`LEGACY_CHAPTERS_HIDDEN` in the
 * app's `src/core/chapters.ts`) and the lessons that replaced them have no camera at all. If the
 * camera chapters come back, the camera section comes back first — it is in git (before this
 * commit), and so is the reasoning for why its upload claim was true.
 *
 * Where the list below comes from: the app's Terms §6 (`src/app/legal/content.ts`, still a draft
 * but updated with each feature), child logins and the parent PIN (RadlorInc/learn PRs #115–#118),
 * points (docs/new-flow/points.md), class exercise results (PRs #125–#127), and account deletion +
 * per-child export (`src/app/parent/account/page.tsx`). No analytics library is in the app's
 * package.json, as read 2026-09-19.
 *
 * Note what is deliberately NOT claimed: nowhere does this say "COPPA compliant" or "GDPR
 * compliant". We describe what we do. A compliance badge is a legal conclusion and we have not
 * earned the right to print one.
 */

const STORE = [
  ['The child’s name', 'Whatever you type — a first name or a nickname is fine, and plenty of our families use one — and which of four animal pictures they picked. It is there so the child sees themselves in the app.'],
  ['An age band', 'Which of six bands they are in. Not a date of birth: we used to have a field for one, never filled it in, and removed it.'],
  ['A username, if you give them one', 'So your child can sign in as themselves. You choose it; they do not need an email address. The password is kept only in scrambled form by the sign-in system, where nobody at Radlor can read it.'],
  ['Their lessons and progress', 'Which lessons you gave them and any due dates, which topics they have finished, and where practice stands on each — the level reached and whether it is mastered. This is the whole point: it is what lets the next question be the right one.'],
  ['Points and game time', 'Each time points were earned or spent, and the game-time settings you choose: on or off, and the most minutes per day.'],
  ['Class exercise results', 'Only if a teacher’s class sets exercises: how each question went and when, which that class’s teacher can see.'],
  ['The parent’s email, and your PIN', 'Your email is for the account — the address you signed up with, or the one attached to your Google account. The four-digit PIN that guards your dashboard is kept only in scrambled form.'],
]

const NEVER = [
  'Video, photographs or audio of your child.',
  'A date of birth, a home address, a phone number, a school ID or a photograph of your child.',
  'An email address for your child.',
  'Anything sold, rented or shared with an advertiser. We run no advertising and have no advertisers.',
  'Third-party analytics or tracking inside the product. There is no Google Analytics, no pixel, no session recorder.',
]

// One picture and one plain line per question a parent has, joined by a drawn path (scroll style G) under a
// circle-reveal top (F) (founder, 2026-09-29: "least text"). ⚠️ THE FULL WORDING IS STILL HERE, word for word, under
// each "Read the details": this is the page a regulator reads, so the short line may only summarise what the details
// say and never add to it.
export default function DataAndSafety() {
  const rows: PathRow[] = [
    {
      ...ART.safetyStore, title: 'What we store',
      body: 'Only what teaching needs: your child’s name, their lessons and progress, and your account.',
      more: (
        <>
          <dl>
            {STORE.map(([h, p]) => (
              <div key={h}><dt><strong>{h}</strong></dt><dd>{p}</dd></div>
            ))}
          </dl>
          <p>If you asked for early access before you had an account, we also still have the email address
          you gave us and the grade (or, before 19 September 2026, the age band) you picked, from that request.</p>
        </>
      ),
    },
    {
      ...ART.safetyNever, title: 'What we never store',
      body: 'No video, photos or audio of your child. No date of birth. Nothing sold or shared with an advertiser.',
      more: <ul>{NEVER.map(t => <li key={t}>{t}</li>)}</ul>,
    },
    {
      ...ART.safetyAccess, title: 'Who can access it?',
      body: 'You, your child, their teacher if a school uses it, and the two companies that host it for us. Nobody else.',
      more: (
        <>
          <p>
            <strong>You.</strong> A parent account can see its own children, and no other family&rsquo;s.
          </p>
          <p>
            That is not a rule we wrote down and hope everybody follows — the database itself refuses to
            return another family&rsquo;s rows, and we test that by trying it.
          </p>
          <p>
            <strong>Your child, if you give them a login.</strong> Signed in as themselves they see their
            own lessons. Your dashboard asks for your PIN every time it opens.
          </p>
          <p>
            <strong>Your child&rsquo;s teacher, if a school is using it.</strong> A teacher can see the
            students in a class they created — including their class exercise results — and nothing
            outside it. If you are not using {APP_NAME} through a school, no teacher can see anything.
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
        </>
      ),
    },
    {
      ...ART.safetyDelete, title: 'Deleting it',
      body: 'Delete a child and everything attached to them goes with it. Removed, not hidden.',
      more: (
        <>
          <p>
            Delete a child from your account and everything attached to them goes with it — every session,
            every answer, every record. Not marked as hidden: removed. You can download a copy of each
            child&rsquo;s data first, and close the whole account yourself from the account page in the
            parent dashboard, which removes your children and their logins with it. If anything is left
            you want gone, email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
          </p>
        </>
      ),
    },
    {
      ...ART.safetyUnfinished, title: 'What we have not finished',
      body: 'Signing up is not a formal age-verification method, and we will not claim it is. We are working on it.',
      more: (
        <>
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
        </>
      ),
    },
    {
      ...ART.contactHero, title: 'Asking us anything',
      body: <><a href={`mailto:${SUPPORT_EMAIL}`} className="rl-link text-accent">{SUPPORT_EMAIL}</a> reaches the people who built it.</>,
      more: (
        <>
          <p>
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> reaches the people who built the thing.
            The full legal policy is published inside the product at{' '}
            <a href={`${APP_URL}/legal/privacy`}>radlic.com/legal/privacy</a>; this page is
            the same facts without the lawyering. Privacy on this website — as opposed to in the product —
            is <Link href="/privacy" className="rl-link">its own short page</Link>.
          </p>
        </>
      ),
    },
  ]
  return (
    <section className="relative isolate overflow-hidden">
      <div className="rl-progress" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-20">
      <PageHero
        eyebrow="Data and safety"
        title={<>What we know about your child, in <span className="rl-lit" style={{ '--lit': 0.5 } as React.CSSProperties}>plain</span> English.</>}
        line="A child never needs an email address, and nothing we hold is sold or shared with an advertiser."
        pic={ART.safetyHero}
      />
      <PathRows rows={rows} />

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
