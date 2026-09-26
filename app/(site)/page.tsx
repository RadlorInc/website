import Link from 'next/link'
import { APP_NAME, COMPANY, SITE_URL } from '@/site'
import { posts } from '@/content/posts'
import { Journey } from '@/components/journey/Journey'

/**
 * The home page states, in the first screen, what an answer engine has to be able to repeat:
 * who we are, what we make, and who it is for. Everything below it is evidence for that sentence.
 *
 * ⚠️ THIS FILE STAYS A SERVER COMPONENT. The first screen is `<Journey />`, a client component — but its
 * words are server-rendered like everything else here, and the 3D it draws is imported after mount in its
 * own chunk. Until 2026-09-25 this comment said "no canvas, no scroll listener"; the founder chose the
 * journey that day, and the two reasons behind the old rule (a flip-book hero that stepped, and copy
 * that could not be kept legible over it on a phone) are what Journey.tsx is built against.
 */
export default function Home() {
  return (
    <>
      {/* THE FIRST SCREEN IS THE JOURNEY (founder's call, 2026-09-25) — see components/journey/Journey.tsx.
          It carries the <h1> and the same headline, subhead and "Try Radlic" the video hero had, as real HTML;
          the 3D world behind it loads afterwards and is decoration. Everything below is unchanged. */}
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
          `--i` staggers them. Still no counters: "3–8" cannot count up from zero.

          ⚠️ REWRITTEN 2026-09-19 FOR THE APP AS IT IS NOW. The three facts used to be "Ages 3–18",
          "a short check" and "0 frames uploaded" — the age bands, the placement check and the camera
          chapters are all hidden in the app since 2026-09-13. The three now answer: is it for my
          child's grade, how does it get harder, and what does my child have to hand over. */}
      <section className="rl-hero-band">
        <div className="mx-auto w-full max-w-5xl px-6 py-16">
          <ul className="rl-hero-facts">
            {[
              ['Grades 3–8', 'one idea per lesson, taught step by step', '/radlic'],
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

      {/* ⚠️ THIS BLOCK IS HERE BECAUSE A READER ASKED FOR IT, AND ITS POSITION IS THE POINT.
          Malaika's closing note: "consider moving the about section right after the main homepage?
          That would help a parent know right from the start what the website is all about." A
          parent landing cold met the headline, four facts, then our beliefs — and never a plain
          sentence saying what Radlor IS. This is that sentence, above the beliefs, with the full
          story still one click away. Keep it SHORT: the moment it grows into the /about page it
          stops doing the job it was added for. */}
      <section className="mx-auto max-w-5xl px-6">
        <div className="rl-rule" />
        <div className="py-14">
          <h2 className="rl-reveal-focus font-display text-3xl">What is {COMPANY}?</h2>
          {/* ⚠️ ONE PARAGRAPH, AND IT STAYS ONE PARAGRAPH. It had a second that began "Every child
              learns differently…" — which is now the heading of the product section further down
              this same page, and Malaika's first note was "sometimes less is more. There are only
              certain parts where the extra information is needed." The full answer is /about. */}
          <p className="rl-reveal mt-5 text-lg text-muted max-w-3xl leading-relaxed" style={{ '--i': 1 } as React.CSSProperties}>
            {COMPANY} is a software company building learning tools that adapt to the person using
            them — starting with math. Our first product is {APP_NAME}: adaptive math for grades 3 to 8.
          </p>
          <Link href="/about" className="rl-link rl-reveal mt-6 inline-block text-sm text-accent" style={{ '--i': 2 } as React.CSSProperties}>
            More about {COMPANY} →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6">
        <div className="rl-rule" />
        <div className="py-14">
          <h2 className="rl-reveal-focus font-display text-3xl">What we believe</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            {[
              {
                h: 'Difficulty is invisible',
                p: 'A child should never be shown a level, a rank or a red cross. The software moves the difficulty; the child just keeps going. Getting something wrong is answered warmly and then taught again.',
              },
              {
                h: 'Harder should mean different',
                p: 'The next level up is a different kind of question — a picture, then bare numbers, then a missing number, a story, a mistake to spot — not the same question with bigger numbers.',
              },
              {
                h: 'Children’s data stays small',
                p: 'We collect what teaching requires and nothing else. A child never needs an email address: their parent sets a username for them, and the parent’s side of the app is behind a PIN.',
              },
            ].map((c, i) => (
              <div key={c.h} className="rl-reveal-focus" style={{ '--i': i + 1 } as React.CSSProperties}>
                <span className="rl-lampdot block mb-4" style={{ '--i': i + 1 } as React.CSSProperties} aria-hidden="true" />
                <h3 className="font-medium text-lg">{c.h}</h3>
                <p className="mt-3 text-muted leading-relaxed">{c.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6">
        <div className="rl-rule" />
        <div className="py-14">
          {/* ⚠️ THIS HEADING STATES THE PRODUCT CLAIM, AND THE TWO IT REPLACED DID NOT.
              Malaika offered "Learning that meets them where they are" and, in a margin comment,
              "every child learns differently. their math should too". The second shipped briefly
              and is wrong twice over:

                * GRAMMAR. "should too" carries the verb from the first clause, so it reads as
                  "their math should LEARN DIFFERENTLY too" — and math does not learn. Swapping
                  "math" for "questions" does not help; the borrowed verb is the problem, not the
                  noun. A mirrored line only works when both halves can share one verb
                  ("Every child is different. Their math should be too.").
                * MEANING. "their math should be different" can be read as mathematics itself
                  being different per child, which is the opposite of the card's own
                  "Real math. Real thinking. No guessing."

              What the product actually does is set the difficulty of the next question from how
              the child answered the last one — up after two right first time, and down when the
              worked steps were needed (the app's `adaptive.ts`, re-read 2026-09-19), which is why the
              verb is "moves" and not "rises". Do not shorten it to "gets harder":
              that is half the mechanism, and the half that would put off the parent of a child who
              is struggling — who is exactly the parent this is for.

              The company tagline is TAGLINE in site.ts. It sets every page <title> and the OG
              image; changing it is a brand decision, not a copy one, and it is untouched. */}
          <h2 className="rl-reveal-focus font-display text-3xl">
            Question difficulty moves with your child.
          </h2>
          <Link
            href="/radlic"
            className="rl-reveal rl-card mt-8 block rounded-2xl border border-line bg-surface p-8 hover:border-accent"
            style={{ '--i': 1 } as React.CSSProperties}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display text-2xl">{APP_NAME}</h3>
              <span className="text-xs uppercase tracking-widest text-accent">Live</span>
            </div>
            <p className="mt-3 text-lg max-w-2xl leading-relaxed">
              Math that changes as your child answers.
            </p>
            <p className="mt-3 text-muted max-w-2xl leading-relaxed">
              {APP_NAME} teaches one idea at a time for grades 3 to 8, then adjusts each question as your child
              practices. Real math. Real thinking. No guessing.
            </p>
            <p className="mt-5 text-sm text-accent">Read more →</p>
          </Link>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="mx-auto max-w-5xl px-6">
          <div className="rl-rule" />
          <div className="py-14">
            <div className="rl-reveal flex items-baseline justify-between gap-4">
              <h2 className="font-display text-3xl">Writing</h2>
              <Link href="/writing" className="rl-link text-sm text-accent">
                All posts →
              </Link>
            </div>
            {/* ⚠️ THIS LINE EXISTS BECAUSE A READER ASKED "I don't understand the writing
                portion?" — a bare <h2>Writing</h2> over three dated rows says what the section
                is CALLED, not what it is. One line, doing one job: what the posts are, and why
                to open one. It deliberately claims nothing about frequency, which is the same
                reason the URL is /writing and not /blog. */}
            <p className="rl-reveal mt-3 text-muted max-w-2xl">
              What we&rsquo;ve learned building it — one finding per post.
            </p>
            <ul className="mt-8 divide-y divide-line">
              {posts.slice(0, 3).map((p, i) => (
                <li key={p.slug} className="rl-reveal" style={{ '--i': i + 1 } as React.CSSProperties}>
                  <Link href={`/writing/${p.slug}`} className="rl-row flex flex-wrap gap-x-6 gap-y-1 py-4 group">
                    <span className="text-sm text-muted tabular-nums w-24">{p.date}</span>
                    <span className="flex-1 group-hover:text-accent transition-colors">{p.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
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
