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
      <section className="rl-hero">
        {/* Decorative, `aria-hidden`, and behind the text — a screen reader gets the copy alone.
            These layers ARE the ground. They were going to be dropped for a video; the clip we
            were given was abstract dunes and floating digits with 0.00% of the brand's cyan in
            it, so the ground stayed CSS. A `<video>` slots in here later, under the scrim, and
            nothing else in this file has to change. */}
        <div className="rl-lightfield" aria-hidden="true">
          <div className="rl-halo" />
          <div className="rl-glow rl-parallax" style={{ '--p': '40px' } as React.CSSProperties} />
          <div className="rl-glow rl-glow-core rl-parallax" style={{ '--p': '-70px' } as React.CSSProperties} />
        </div>
        <div className="rl-hero-scrim" aria-hidden="true" />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-14 sm:py-20">
          <p className="rl-rise text-sm uppercase tracking-[0.18em] text-accent font-medium">Radlor</p>
          <h1 className="rl-focus font-display text-[2.6rem] sm:text-6xl leading-[1.05] mt-4 max-w-3xl" style={{ '--d': '0.09s' } as React.CSSProperties}>
            Learning software that adapts to the <span className="rl-lit">child</span> in front of it.
          </h1>
          <p className="rl-rise mt-5 sm:mt-6 text-base sm:text-lg text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.18s' } as React.CSSProperties}>
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

          {/* Four facts, every one of them checkable and every one already stated on the page
              that substantiates it. No counters: "3–18" cannot count up from zero, and animating
              a number would need JS on the one page that must stay a server component. The
              stagger is `rl-rise` with `--d`, NOT `rl-reveal` with `--i` — `rl-reveal` is
              scroll-driven, and an element that is already in view on load has passed its range,
              so it would never animate here. `--d` is the on-load lever. */}
          <Link
            href="/data-and-safety"
            className="rl-hero-factlink rl-rise mt-9 sm:mt-12"
            style={{ '--d': '0.36s' } as React.CSSProperties}
          >
            <dl className="rl-hero-facts">
              {[
                ['Ages 3–18', 'every band, not a sample of the youngest'],
                ['6 age bands', 'each looks and works differently'],
                ['0 frames uploaded', 'hand tracking runs on the device'],
                [`From ${usd(PRICING.monthly.first)}/month`, `first child; ${usd(PRICING.monthly.additional)} each additional`],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-display text-xl sm:text-2xl leading-tight">{k}</dt>
                  <dd className="mt-1.5 text-sm text-muted leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>
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
          <h2 className="rl-reveal-focus font-display text-3xl">Our products</h2>
          <Link
            href="/adaptivelearn"
            className="rl-reveal rl-card mt-8 block rounded-2xl border border-line bg-surface p-8 hover:border-accent"
            style={{ '--i': 1 } as React.CSSProperties}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display text-2xl">{APP_NAME}</h3>
              <span className="text-xs uppercase tracking-widest text-accent">Live</span>
            </div>
            <p className="mt-3 text-muted max-w-2xl leading-relaxed">
              Adaptive math for ages 3–18. A placement check finds where a child actually is, then story chapters
              teach from there — with the difficulty moving question by question. Younger bands answer by
              <em> holding up fingers to the camera</em>; older bands work on a chalkboard.
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
