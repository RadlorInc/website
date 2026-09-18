import type { Metadata } from 'next'
import { SectionIcon } from '@/components/SectionIcon'
import Image from 'next/image'
import Link from 'next/link'
import { APP_GRADES, APP_ID, APP_NAME, APP_URL, COMPANY, SITE_URL } from '@/site'

export const metadata: Metadata = {
  title: `${APP_NAME} — adaptive math for grades 3 to 8`,
  description:
    'AdaptiveLearn teaches math for grades 3 to 8 one idea at a time, then adapts practice so each harder question is a different kind of question. Parents choose the lessons, children sign in with a username their parent sets, and a wrong answer is never marked wrong.',
  alternates: { canonical: '/adaptivelearn' },
}

// ⚠️ THE APP CHANGED SHAPE ON 2026-09-13 AND EVERY CLAIM BELOW WAS RE-READ FROM ITS `release` BRANCH
// on 2026-09-19 (sw v205). The old page described story chapters for ages 3–18, a placement check and
// camera answers — all three are hidden in the app now (`LEGACY_CHAPTERS_HIDDEN`), so none is claimed
// here. Sources in the app repo, `../milo-story-mode`: the grades and module titles are `TITLES` in
// `src/features/lessons/modules.ts`; the lesson steps are docs/new-flow/README.md; the practice rules
// are the header of `src/features/lessons/adaptive.ts`; "never marked wrong" is LessonPlayer.tsx /
// ModulePractice.tsx. When the app changes one of those, this page is wrong until it is changed too.
const GRADE_MODULES = APP_GRADES.map(g => ({
  grade: g.grade,
  modules: g.modules.join(' · '),
}))

const FAQ: { q: string; a: string; href?: string; hrefLabel?: string }[] = [
  {
    q: 'What grades is AdaptiveLearn for?',
    a: `Grades 3 to 8. Each grade is split into modules, and each module into short lessons that teach one idea each.`,
  },
  {
    q: 'How does AdaptiveLearn know what to teach my child?',
    a: `You choose. The parent dashboard has a library of every lesson, searchable and filtered by grade. Add a whole module or single topics to your child’s lessons, and give them a due date if you like. Inside each topic the practice adapts to how your child answers, and their weakest topics come back when they practice a whole module.`,
  },
  {
    q: 'Can my child sign in on their own?',
    a: `Yes. You set a username and a password for them — they do not need an email address. Your parent dashboard asks for a four-digit PIN every time it opens.`,
  },
  {
    q: 'What happens when my child gets an answer wrong?',
    a: `It is never marked wrong. The first miss brings back the lesson’s big idea; a second shows the worked steps. No score is shown during practice.`,
  },
  {
    q: 'How is AdaptiveLearn different from other math apps?',
    a: `A harder question is a different kind of question — a picture, then bare numbers, then a missing number, a story, a mistake to spot — not the same question with bigger numbers. The practice moves up or down with how your child answers.`,
  },
  {
    q: 'When can I try AdaptiveLearn?',
    a: `${APP_NAME} is currently being tested with a small group of families. Join the waitlist to be notified when more families are invited.`,
    href: '/waitlist',
    hrefLabel: 'Join the waitlist →',
  },
  // ⚠️ THE TWO BELOW ARE NOT IN MALAIKA'S LIST AND ARE KEPT ON PURPOSE. The rename answer is the
  // only place on the site that connects "Milo" to AdaptiveLearn, and families who used Milo still
  // search for it; the offline answer is a real question from a parent on a train. Delete them
  // only as a deliberate decision, not as tidying.
  // ⚠️ The offline answer claims only what `src/infra/storage/lessonSync.ts` does — answers and
  // progress are queued on the device and uploaded later. Whether a lesson itself PLAYS offline was
  // not verified on 2026-09-19, so it is not claimed.
  {
    q: 'Does it work offline?',
    a: 'Answers and progress are saved on the device first and sent to your account when there is a connection, so a dropped connection does not lose your child’s work.',
  },
  {
    q: 'Was AdaptiveLearn called something else before?',
    a: `Yes — it was called Milo until August 2026. The app is ${APP_NAME}, made by ${COMPANY}.`,
  },
]

function Q({ q, a, href, hrefLabel, i }: { q: string; a: string; href?: string; hrefLabel?: string; i: number }) {
  return (
    <div className="rl-block rl-reveal border-t border-line py-6" style={{ '--i': i } as React.CSSProperties}>
      <h3 className="font-medium text-lg">{q}</h3>
      <p className="mt-2 text-muted leading-relaxed max-w-2xl">{a}</p>
      {href && hrefLabel && (
        <Link href={href} className="rl-link mt-3 inline-block text-sm text-accent">
          {hrefLabel}
        </Link>
      )}
    </div>
  )
}

export default function AdaptiveLearn() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        {/* Decorative, `aria-hidden`, behind the text — a screen reader gets the copy alone. */}
        <div className="rl-lightfield" aria-hidden="true">
          <div className="rl-glow rl-parallax" style={{ '--p': '32px' } as React.CSSProperties} />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-14">
        <p className="rl-rise text-sm uppercase tracking-[0.18em] text-accent font-medium">A {COMPANY} product</p>
        <h1 className="rl-focus font-display text-5xl sm:text-6xl leading-[1.05] mt-4 max-w-3xl" style={{ '--d': '0.09s' } as React.CSSProperties}>
          {APP_NAME}: math that <span className="rl-lit" style={{ '--lit': 0.62 } as React.CSSProperties}>changes</span> as your child answers.
        </h1>
        <p className="rl-rise mt-6 text-lg text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.18s' } as React.CSSProperties}>
          Math for grades 3 to 8, one idea at a time. A lesson teaches the idea step by step, then the
          practice adjusts each question to how your child answers.
        </p>
        <p className="rl-rise mt-5 font-display text-2xl max-w-2xl" style={{ '--d': '0.22s' } as React.CSSProperties}>
          Real math. Real thinking. No guessing.
        </p>
        <p className="rl-rise mt-6 text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.26s' } as React.CSSProperties}>
          <strong className="text-foreground font-medium">
            {APP_NAME} is currently being tested with a small group of families.
          </strong>{' '}
          Join the waitlist to be among the first to try it.
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

      {/* ⚠️ `rl-dark` PINS THIS BAND DARK IN BOTH THEMES. The mascot render is on a pure black
          ground; on the light theme (#f5f8fc) an unpinned panel would frame it as a black
          rectangle. The wordmark has exactly this property and the header solves it the same
          way — one artwork, a dark surface under it, no light-mode second render.

          ⚠️ THE COPY HERE STATES NO NEW CLAIM. "The difficulty moves ... never sees a level" is
          already asserted in llms.txt, on the scoring section further down this page, and in the
          post it links to. A band added for decoration must not become the place a claim first
          appears — see CLAUDE.md, "say true things". */}
      <section className="mx-auto max-w-5xl px-6 pb-4">
        <div className="rl-dark rounded-2xl border border-line overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 p-8 sm:p-10">
            <Image
              src="/milo-cubes.webp"
              alt=""
              aria-hidden="true"
              width={1100}
              height={665}
              className="rl-onblack w-56 sm:w-72 h-auto shrink-0"
            />
            <p className="text-lg leading-relaxed text-center sm:text-left">
              The difficulty moves with every answer, and a child never sees a level, a rank or a
              score — only the next question.{' '}
              <Link href="/writing/difficulty-should-be-invisible" className="rl-link text-accent">
                Why we build it that way
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6"><div className="rl-rule" /></div>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <SectionIcon src="/ico-steps.webp" />
        <h2 className="rl-reveal-focus font-display text-3xl">How a lesson works</h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-3">
          {[
            ['A real question', 'A picture from everyday life and a question about it. Nothing to answer yet.'],
            ['The big idea', 'One sentence your child can reuse. It comes back whenever they get stuck.'],
            ['Step by step', 'A teacher says each step out loud, then writes or draws it on the board.'],
            ['One thing not to do', 'The most common mistake, shown once, beside the right way.'],
            ['Now you try', 'Almost the same problem. A hint after a miss, another after a second, then the worked steps.'],
            ['Practice that adapts', 'Each harder level is a different kind of question, not the same one with bigger numbers.'],
          ].map(([h, p], i) => (
            <li key={h} className="rl-reveal" style={{ '--i': i + 1 } as React.CSSProperties}>
              <span className="rl-num font-display text-3xl text-accent" style={{ '--i': i + 1 } as React.CSSProperties}>{i + 1}</span>
              <div className="rl-tick mt-2 mb-3" style={{ '--i': i + 1 } as React.CSSProperties} aria-hidden="true" />
              <h3 className="font-medium">{h}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{p}</p>
            </li>
          ))}
        </ol>

        {/*
          The claim this page is built on, drawn instead of asserted: difficulty
          moving question by question, two right first time raising it and the
          worked steps stepping it back (the rules in the app's `adaptive.ts`). Decorative and `aria-hidden` — the sentence under it
          carries the same information in text, which is what a crawler and an
          answer engine read.
        */}
        <figure className="mt-14">
          <svg viewBox="0 0 640 160" className="w-full h-auto max-w-3xl" role="presentation" aria-hidden="true">
            <line x1="40" y1="140" x2="600" y2="140" stroke="var(--line)" strokeWidth="1" />
            <line x1="40" y1="16" x2="40" y2="140" stroke="var(--line)" strokeWidth="1" />
            <polyline
              className="rl-trace"
              style={{ '--len': 748 } as React.CSSProperties}
              points="40,120 96,120 96,96 152,96 152,72 208,72 208,48 264,48 264,72 320,72 320,56 376,56 376,40 432,40 432,64 488,64 488,44 544,44 544,28 600,28"
              fill="none"
              stroke="var(--glow)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <figcaption className="mt-3 text-sm text-muted max-w-2xl">
            Where practice sits on one topic. Two right first time moves it up a level; needing the
            worked steps moves it down. The child is never shown this line.
          </figcaption>
        </figure>
      </section>

      <div className="mx-auto max-w-5xl px-6"><div className="rl-rule" /></div>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <SectionIcon src="/ico-stairs.webp" />
        <h2 className="rl-reveal-focus font-display text-3xl">What is covered, by grade</h2>
        <div className="mt-10 grid gap-px bg-line border border-line rounded-2xl overflow-hidden">
          {GRADE_MODULES.map((g, i) => (
            <div key={g.grade} className="rl-reveal-left bg-surface p-6 flex flex-wrap gap-x-8 gap-y-2" style={{ '--i': i + 1 } as React.CSSProperties}>
              <div className="w-28 shrink-0">
                <p className="font-display text-2xl">Grade {g.grade}</p>
              </div>
              <p className="flex-1 min-w-64 text-muted leading-relaxed">{g.modules}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6"><div className="rl-rule" /></div>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <SectionIcon src="/ico-bubble.webp" />
        <h2 className="rl-reveal-focus font-display text-3xl">Questions parents ask</h2>
        <div className="mt-8">
          {FAQ.map((f, i) => (
            <Q key={f.q} {...f} i={i + 1} />
          ))}
        </div>
      </section>

      <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                // The SAME id the app itself declares, so the two pages describe one node.
                '@id': APP_ID,
                name: APP_NAME,
                alternateName: [`${APP_NAME} by ${COMPANY}`, 'Milo'],
                url: APP_URL,
                applicationCategory: 'EducationalApplication',
                operatingSystem: 'Web browser',
                description: metadata.description,
                publisher: { '@id': `${SITE_URL}/#organization` },
                audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
                // ⚠️ NO `offers` SINCE 2026-09-18 — every price was taken off the site (founder's
                // call). Restore from git: they were generated from PLANS in site.ts.
              },
              {
                '@type': 'FAQPage',
                mainEntity: FAQ.map(f => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
              },
            ],
          })}</script>
    </>
  )
}
