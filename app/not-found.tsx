import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { APP_NAME, HEADER, SUPPORT_EMAIL } from '@/site'
import { SiteChrome } from '@/components/SiteChrome'

/**
 * The 404. Until 2026-09-07 this file did not exist and Next served its own default — an unstyled
 * page with no header, no footer and no way onward except the back button.
 *
 * ⚠️ `robots` IS THE ONE PIECE OF METADATA THAT MATTERS HERE. Next returns a real 404 status, so a
 * crawler already knows not to index it; this says the same thing to anything that reads the tag
 * instead of the status. There is no `canonical` on purpose — a canonical on a 404 tells a crawler
 * the missing page IS this page, which is the opposite of true.
 */
export const metadata: Metadata = {
  title: 'Page not found',
  description: `That page is not here. The rest of ${APP_NAME} is.`,
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <SiteChrome>
    <section className="mx-auto max-w-5xl px-6 pt-20 pb-24">
      {/* ⚠️ `rl-dark` PINS THIS PANEL DARK IN BOTH THEMES, and that is not decoration — the mascot
          render has a pure black ground, so on the light theme an unpinned panel would frame it as
          a black rectangle. Same reasoning as the header and the wordmark. */}
      <div className="rl-dark rounded-2xl border border-line overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-8 p-8 sm:p-12">
          {/* Decorative: the sentence beside it already says everything this says.
              ⚠️ `alt=""` AND `aria-hidden` TOGETHER — the empty alt keeps it out of the
              accessibility tree, and there is real text next to it, so announcing the mascot would
              add a noun a screen reader user cannot use. */}
          <Image
            src="/milo-thinking.webp"
            alt=""
            aria-hidden="true"
            width={720}
            height={682}
            /* Above the fold on this page — lazy-loading it leaves an empty panel for a beat on the
               one page a visitor arrives at already confused. */
            priority
            className="rl-onblack w-40 sm:w-56 h-auto shrink-0"
          />
          <div className="text-center sm:text-left">
            <p className="text-sm uppercase tracking-[0.18em] text-accent font-medium">404</p>
            <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] mt-3">
              That page is not here.
            </h1>
            <p className="mt-5 text-muted leading-relaxed max-w-md">
              It may have been renamed, or the link may be wrong. Nothing is broken on your end.
            </p>
          </div>
        </div>
      </div>

      <nav className="mt-10" aria-label="Main pages">
        <p className="text-sm text-muted">Try one of these instead:</p>
        {/* Built from HEADER, not hand-written — a renamed page cannot leave a dead link here.
            Same rule as the footer and the sitemap: PAGES is the one list. */}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {HEADER.map(n => (
            <Link key={n.href} href={n.href} className="rl-link text-accent">
              {n.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="mt-9 flex flex-wrap gap-3">
        <Link href="/waitlist" className="rl-cta rounded-full bg-accent px-6 py-3 text-on-accent font-medium hover:opacity-90">
          Join the waitlist
        </Link>
        <Link href="/" className="rl-cta rl-cta-quiet rounded-full border border-line px-6 py-3 font-medium hover:border-foreground transition-colors">
          Back to the start
        </Link>
      </div>

      <p className="mt-8 text-sm text-muted">
        If a link on this site sent you here, tell us and we will fix it:{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="rl-link text-accent">{SUPPORT_EMAIL}</a>.
      </p>
    </section>
    </SiteChrome>
  )
}
