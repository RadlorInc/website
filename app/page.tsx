import Link from 'next/link'
import { APP_NAME, COMPANY, PRICING, SITE_URL, usd } from '@/site'
import { posts } from '@/content/posts'

/**
 * The home page states, in the first screen, what an answer engine has to be able to repeat:
 * who we are, what we make, and who it is for. Everything below it is evidence for that sentence.
 *
 * The motion is the company belief made literal — "the treasure is already inside the child, we
 * just light it up" — so the light arrives on the word `child` and radiates from behind it. All of
 * it is CSS (see the MOTION block in `globals.css`): this file stays a SERVER component, the route
 * stays statically prerendered, and the copy below is in the HTML a crawler gets on the first byte.
 *
 * ⚠️ Do not make this `'use client'` to add an animation. If the CSS layer cannot do it, that is a
 * reason to want it less, not a reason to ship 50 KB of JS onto the page an answer engine reads.
 */
export default function Home() {
  return (
    <>
      {/* THE HERO GROUND IS A LOOPING VIDEO, AND IT LOOPS BY CONSTRUCTION.

          The generated clip pushes in and drifts left over 8 seconds, so its last frame is
          nowhere near its first — frame 1 vs frame 193 measured a mean absolute difference of
          29.5/255 against 1.8 for an ordinary frame step, which is a snap you would see every
          loop, forever. `public/hero.*` is therefore the first 4 seconds PING-PONGED: forward,
          then the same frames reversed, with the duplicate frame dropped at both the turn and
          the seam. The end now equals the start by construction. Measured on the shipped files
          the loop seam is 1.07 mean / 1.59% of pixels, BELOW a normal frame step — the push-in
          reads as a slow breath in and out rather than as a clip restarting.

          ⚠️ NO 'use client', NO CANVAS, NO SCROLL LISTENER. This is a plain <video>: the page is
          a server component, the route prerenders, and every word is in the HTML on the first
          byte. The last hero tied frames to scroll and had to be deleted; do not tie this one. */}
      <section className="rl-hero">
        {/* ⚠️ `media` ON <source> IS LOAD-BEARING AND IS THE ONLY REASON THERE IS NO JS HERE.
            The resource-selection algorithm picks the first <source> whose media matches; when
            NOTHING matches — which is what `prefers-reduced-motion: reduce` produces — the
            element loads no resource at all. Not hidden, not paused: never requested. That is
            the difference between honouring the preference and pretending to. Verified by
            counting requests, not by reading CSS.

            It also picks the orientation, because a 16:9 clip in a 375x715 box crops to its
            middle 30% and the mark lands off-screen entirely. The portrait file is the same
            ping-pong letterboxed onto its own black with the mark in the top third.

            ⚠️ Media here is evaluated ONCE, at resource selection — it does not re-run when the
            viewport changes. Fine for orientation; it does mean a desktop window dragged below
            768px keeps the landscape file, which is the right file anyway.

            The poster is a CSS background rather than the `poster` attribute, so that the
            portrait poster can be chosen by media query too. The attribute takes one URL, and
            on a phone that URL would be the landscape still — 63 KB fetched to show a frame
            whose subject is cropped out of the box. */}
        <video
          className="rl-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source
            src="/hero-portrait.webm"
            type="video/webm"
            media="(prefers-reduced-motion: no-preference) and (max-width: 768px)"
          />
          <source
            src="/hero-portrait.mp4"
            type="video/mp4"
            media="(prefers-reduced-motion: no-preference) and (max-width: 768px)"
          />
          <source src="/hero.webm" type="video/webm" media="(prefers-reduced-motion: no-preference)" />
          <source src="/hero.mp4" type="video/mp4" media="(prefers-reduced-motion: no-preference)" />
        </video>
        <div className="rl-hero-scrim" aria-hidden="true" />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-20 sm:py-24">
          <p className="rl-rise text-sm uppercase tracking-[0.18em] text-accent font-medium">Radlor</p>
          {/* ⚠️ 30rem, AND THE NUMBER COMES FROM THE MARK'S EYES. The subhead needs scrim 0.72
              wherever it crosses the mark's white chrome, and an eye needs 0.13 or less to stay
              #00E5FF. At the old 38rem the copy ended at x=758 and the left eye reached x=752 —
              six pixels, no gradient fits in that. At 30rem the copy ends at x=608, leaving 144px
              for the falloff. Widen this and the mark goes grey. */}
          <h1 className="rl-focus font-display text-[2.6rem] sm:text-6xl leading-[1.05] mt-4 max-w-[30rem]" style={{ '--d': '0.09s' } as React.CSSProperties}>
            Learning software that adapts to the <span className="rl-lit">child</span> in front of it.
          </h1>
          <p className="rl-rise mt-5 sm:mt-6 text-base sm:text-lg text-muted max-w-[30rem] leading-relaxed" style={{ '--d': '0.18s' } as React.CSSProperties}>
            Most educational apps give every child the same questions in the same order. We build the other kind:
            software that watches how a child answers and changes the next question because of it. Our first
            product, <strong className="text-foreground font-medium">{APP_NAME}</strong>, teaches math to ages 3–18.
          </p>
          <div className="rl-rise mt-7 sm:mt-9 flex flex-wrap gap-3" style={{ '--d': '0.27s' } as React.CSSProperties}>
            <Link
              href="/waitlist"
              className="rl-cta rounded-full bg-accent px-6 py-3 text-on-accent font-medium hover:opacity-90"
            >
              Join the waitlist
            </Link>
            <Link
              href="/adaptivelearn"
              className="rl-cta rl-cta-quiet rounded-full border border-line px-6 py-3 font-medium hover:border-foreground transition-colors"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>

      {/* The four facts on their own band below the hero, sharing its dark ground. They were
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
          for — the idea was never the problem, the label was. It is `/adaptivelearn`'s own
          claim: a five-year-old gets a narrated story world, a sixteen-year-old a design studio
          with a working chalkboard.

          ⚠️ A <ul>, NOT A <dl>. Making each item its own link inside a <dl> cannot be done
          validly: the spec lets a <div> child of <dl> contain only <dt> and <dd>, so an <a>
          wrapping the pair is invalid markup. A list of four links is what this actually is.

          ⚠️ THE ANIMATION IS `rl-reveal` HERE, and the earlier note saying it could not work was
          right AT THE TIME. `rl-reveal` is scroll-driven, so it does nothing for an element
          already in view on load — which these were, inside the old hero. Below the fold they
          enter the viewport as you scroll, so the scroll timeline is exactly the right lever and
          `--i` staggers them. Still no counters: "3–18" cannot count up from zero. */}
      <section className="rl-hero-band">
        <div className="mx-auto w-full max-w-5xl px-6 py-16">
          <ul className="rl-hero-facts">
            {[
              ['Ages 3–18', 'one app, six stages that look nothing alike', '/adaptivelearn'],
              ['Starts where your child is', 'a short check, not their school year', '/adaptivelearn'],
              ['0 frames uploaded', 'hand tracking runs on the device', '/data-and-safety'],
              [`From ${usd(PRICING.monthly.first)}/month`, `first child; ${usd(PRICING.monthly.additional)} each additional`, '/pricing'],
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
          <p className="rl-reveal mt-5 text-lg text-muted max-w-3xl leading-relaxed" style={{ '--i': 1 } as React.CSSProperties}>
            {COMPANY} is a software company building learning tools that adapt to the person using
            them — starting with math.
          </p>
          <p className="rl-reveal mt-4 text-muted max-w-3xl leading-relaxed" style={{ '--i': 2 } as React.CSSProperties}>
            Every child learns differently, but traditional learning often asks every student the same
            question at the same time. Software doesn&rsquo;t have to work that way. It can understand where a
            child is, respond to how they learn, and change what comes next.
          </p>
          <Link href="/about" className="rl-link rl-reveal mt-6 inline-block text-sm text-accent" style={{ '--i': 3 } as React.CSSProperties}>
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
                p: 'A child should never be shown a level, a rank or a red cross. The software moves the difficulty; the child just keeps playing. Getting something wrong is answered warmly and then taught again.',
              },
              {
                h: 'The math has to be done, not guessed',
                p: 'A question with two options is a coin flip. Every answer surface is built so a child who does not have the skill cannot reach the right answer by elimination — they have to actually work it out.',
              },
              {
                h: 'Children’s data stays small',
                p: 'We collect what teaching requires and nothing else. The camera work in AdaptiveLearn runs entirely on the device: no video frame and no hand position is ever uploaded.',
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
          <h2 className="rl-reveal-focus font-display text-3xl">Learning that meets them where they are</h2>
          <Link
            href="/adaptivelearn"
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
              Every child starts somewhere different. {APP_NAME} finds where your child is, then adjusts each
              question as they learn. Real math. Real thinking. No guessing.
            </p>
            <p className="mt-3 text-muted max-w-2xl leading-relaxed">
              {APP_NAME} is currently being tested with a small group of families. Join the waitlist to be among
              the first to try it.
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
