import Link from 'next/link'
import { APP_NAME, COMPANY, SITE_URL } from '@/site'
import { posts } from '@/content/posts'
import Image from 'next/image'
import { Journey } from '@/components/journey/Journey'
import { CircleReveal, PathRows, ZoomMoment, type PathRow } from '@/components/scroll/Scroll'
import { ART, POST_COVERS } from '@/components/scroll/art'

const BELIEFS: PathRow[] = [
  { ...ART.homeInvisible, title: 'Difficulty is invisible', body: 'No level, rank or red cross. A wrong answer is met warmly and taught again.' },
  { ...ART.journeySteps, title: 'Harder should mean different', body: 'The next level is a new kind of question, not bigger numbers.' },
  { ...ART.safetyStore, title: 'Children’s data stays small', body: 'Only what teaching needs. A child never needs an email address.' },
]

/**
 * The home page states, in the first screen, what an answer engine has to be able to repeat:
 * who we are, what we make, and who it is for. Everything below it is evidence for that sentence.
 *
 * ⚠️ THIS FILE STAYS A SERVER COMPONENT. The first screen is `<Journey />`, a client component — but its
 * words are server-rendered like everything else here, and its pictures are plain images. Until 2026-09-25 this comment said "no canvas, no scroll listener"; the founder chose the
 * journey that day, and the two reasons behind the old rule (a flip-book hero that stepped, and copy
 * that could not be kept legible over it on a phone) are what Journey.tsx is built against.
 */
export default function Home() {
  return (
    <>
      {/* THE FIRST SCREEN IS THE JOURNEY (founder's call, 2026-09-25) — see components/journey/Journey.tsx.
          It carries the <h1> and the same headline, subhead and "Try Radlic" the video hero had, as real HTML;
          its pictures are decoration. Below it, the sections use the scroll styles in components/scroll. */}
      <Journey />

      {/* ⚠️ THREE FACTS SINCE 2026-09-18: the price fact was removed with every other price on the
          site (founder's call — /pricing is hidden, see PAGES in site.ts). Restore it from git.

          The facts on their own band below the hero, sharing its dark ground. They were
          inside the hero once and did not fit a single screen alongside the headline, the subhead
          and two CTAs on a short laptop.

          ⚠️ FOUR LINKS, NOT ONE. This was a single <Link href="/data-and-safety"> wrapped around
          the whole list, so pressing any fact — the price, the age range — landed on data and
          safety. A reader outside the team hit it immediately: "Idk if we can press and it takes
          u to explain further but on my end I see the data and safety information instead."
          Each fact now goes to the page that substantiates THAT fact. If you add a fact, give it
          a destination that explains it; a fact linking to the wrong page is worse than a fact
          that does not link at all.

          ⚠️ FOUR FACTS, FOUR DIFFERENT QUESTIONS — and that rule is what fixed the jargon here.
          The same reader asked "what does 6 age bands mean?", which reads as a vocabulary
          problem and was really a structure problem: facts 1 and 2 BOTH answered "who is it
          for", so the second had no question of its own left to answer and fell back on our
          internal word for a content-organisation decision. It now answers "how does it know
          where my child is", which is a question a parent actually has. The four are: is it for
          my child's age, how does it know where to start, is my child safe, what does it cost.
          Add a fifth only if it answers a fifth question.

          "six stages that look nothing alike" keeps the idea that "6 age bands" was reaching
          for — the idea was never the problem, the label was. It was the old `/adaptivelearn` page's own
          claim: a five-year-old gets a narrated story world, a sixteen-year-old a design studio
          with a working chalkboard.

          ⚠️ A <ul>, NOT A <dl>. Making each item its own link inside a <dl> cannot be done
          validly: the spec lets a <div> child of <dl> contain only <dt> and <dd>, so an <a>
          wrapping the pair is invalid markup. A list of four links is what this actually is.

          ⚠️ THE ANIMATION IS `rl-reveal` HERE, and the earlier note saying it could not work was
          right AT THE TIME. `rl-reveal` is scroll-driven, so it does nothing for an element
          already in view on load — which these were, inside the old hero. Below the fold they
          enter the viewport as you scroll, so the scroll timeline is exactly the right lever and
          `--i` staggers them. Still no counters: "K–8" cannot count up from zero.

          ⚠️ REWRITTEN 2026-09-19 FOR THE APP AS IT IS NOW. The three facts used to be "Ages 3–18",
          "a short check" and "0 frames uploaded" — the age bands, the placement check and the camera
          chapters are all hidden in the app since 2026-09-13. The three now answer: is it for my
          child's grade, how does it get harder, and what does my child have to hand over. */}
      <section className="rl-hero-band">
        <div className="mx-auto w-full max-w-5xl px-6 py-16">
          <ul className="rl-hero-facts">
            {[
              ['Grades K–8', 'one idea per lesson, taught step by step', '/radlic'],
              ['Harder means different', 'each level up is a new kind of question', '/radlic'],
              ['No email for your child', 'you set their username and password', '/data-and-safety'],
            ].map(([term, detail, href], i) => (
              <li key={term} className="rl-reveal" style={{ '--i': i + 1 } as React.CSSProperties}>
                <Link href={href} className="rl-hero-factlink">
                  <span className="rl-fact-term font-display text-xl sm:text-2xl leading-tight">{term}</span>
                  <span className="rl-fact-detail mt-1.5 text-sm text-muted leading-relaxed">{detail}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ⚠️ "WHAT IS RADLOR" STAYS RIGHT AFTER THE HERO: a reader asked for a plain sentence saying what Radlor is before
          the beliefs. Since 2026-09-29 it is the page's one zoom (scroll style E): the picture grows, then the answer. */}
      <ZoomMoment pic={ART.aboutWhat} title={`What is ${COMPANY}?`}>
        Learning software that adapts to the child, starting with math. {APP_NAME}: kindergarten to grade 8.{' '}
        <Link href="/about" className="rl-link text-accent">More about {COMPANY} →</Link>
      </ZoomMoment>

      {/* What we believe: three pictures on a drawn path (G). Each line is the old paragraph cut down, no new claim. */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="font-display text-3xl text-center">What we believe</h2>
        <PathRows rows={BELIEFS} />
      </section>

      {/* The product, opening out of a circle (F). The heading is the mechanism: difficulty MOVES (up after two right,
          down after the worked steps), so "gets harder" would be half of it. */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <CircleReveal pic={ART.journeyAdapts} className="w-64 sm:w-full max-w-[420px] justify-self-center" />
          <div>
            <h2 className="font-display text-4xl">Question difficulty moves with your child.</h2>
            <p className="mt-4 text-lg text-muted">{APP_NAME}: math that changes as your child answers.</p>
            <Link href="/radlic" className="rl-link mt-5 inline-block text-accent font-medium">See how {APP_NAME} works →</Link>
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-3xl">Writing</h2>
            <Link href="/writing" className="rl-link text-sm text-accent">All posts →</Link>
          </div>
          {/* Each post is its cover picture and title: one finding per post. */}
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {posts.slice(0, 3).map(p => (
              <li key={p.slug}>
                <Link href={`/writing/${p.slug}`} className="group block">
                  <Image src={POST_COVERS[p.slug].src} alt="" width={POST_COVERS[p.slug].w} height={POST_COVERS[p.slug].h} className="h-44 w-auto mx-auto" />
                  <span className="mt-4 block font-display text-xl leading-snug group-hover:text-accent transition-colors">{p.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': `${SITE_URL}/#webpage`,
            url: SITE_URL,
            name: `${COMPANY} — learning software that adapts to the child in front of it`,
            isPartOf: { '@id': `${SITE_URL}/#website` },
            about: { '@id': `${SITE_URL}/#organization` },
          })}</script>
    </>
  )
}
