import Link from 'next/link'
import { APP_NAME, APP_URL, COMPANY, SITE_URL } from '@/site'
import { posts } from '@/content/posts'

/**
 * The home page states, in the first screen, what an answer engine has to be able to repeat:
 * who we are, what we make, and who it is for. Everything below it is evidence for that sentence.
 */
export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-16">
        <p className="text-sm uppercase tracking-[0.18em] text-accent font-medium">Radlor</p>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] mt-4 max-w-3xl">
          Learning software that adapts to the child in front of it.
        </h1>
        <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">
          Most educational apps give every child the same questions in the same order. We build the other kind:
          software that watches how a child answers and changes the next question because of it. Our first
          product, <strong className="text-foreground font-medium">{APP_NAME}</strong>, teaches maths to ages 3–18.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href={APP_URL}
            className="rounded-full bg-accent px-6 py-3 text-white font-medium hover:opacity-90 transition-opacity"
          >
            Try {APP_NAME}
          </a>
          <Link
            href="/adaptivelearn"
            className="rounded-full border border-line px-6 py-3 font-medium hover:border-foreground transition-colors"
          >
            How it works
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 border-t border-line">
        <h2 className="font-display text-3xl">What we believe</h2>
        <div className="mt-10 grid gap-10 sm:grid-cols-3">
          {[
            {
              h: 'Difficulty is invisible',
              p: 'A child should never be shown a level, a rank or a red cross. The software moves the difficulty; the child just keeps playing. Getting something wrong is answered warmly and then taught again.',
            },
            {
              h: 'The maths has to be done, not guessed',
              p: 'A question with two options is a coin flip. Every answer surface is built so a child who does not have the skill cannot reach the right answer by elimination — they have to actually work it out.',
            },
            {
              h: 'Children’s data stays small',
              p: 'We collect what teaching requires and nothing else. The camera work in AdaptiveLearn runs entirely on the device: no video frame and no hand position is ever uploaded.',
            },
          ].map(c => (
            <div key={c.h}>
              <h3 className="font-medium text-lg">{c.h}</h3>
              <p className="mt-3 text-muted leading-relaxed">{c.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 border-t border-line">
        <h2 className="font-display text-3xl">Our products</h2>
        <Link
          href="/adaptivelearn"
          className="mt-8 block rounded-2xl border border-line bg-surface p-8 hover:border-accent transition-colors"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="font-display text-2xl">{APP_NAME}</h3>
            <span className="text-xs uppercase tracking-widest text-accent">Live</span>
          </div>
          <p className="mt-3 text-muted max-w-2xl leading-relaxed">
            Adaptive maths for ages 3–18. A placement check finds where a child actually is, then story chapters
            teach from there — with the difficulty moving question by question. Younger bands answer by
            <em> holding up fingers to the camera</em>; older bands work on a chalkboard.
          </p>
          <p className="mt-5 text-sm text-accent">Read more →</p>
        </Link>
      </section>

      {posts.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-14 border-t border-line">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-3xl">Writing</h2>
            <Link href="/writing" className="text-sm text-accent hover:underline">
              All posts →
            </Link>
          </div>
          <ul className="mt-8 divide-y divide-line">
            {posts.slice(0, 3).map(p => (
              <li key={p.slug}>
                <Link href={`/writing/${p.slug}`} className="flex flex-wrap gap-x-6 gap-y-1 py-4 group">
                  <span className="text-sm text-muted tabular-nums w-24">{p.date}</span>
                  <span className="flex-1 group-hover:text-accent transition-colors">{p.title}</span>
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
