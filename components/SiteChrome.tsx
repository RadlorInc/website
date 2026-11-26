import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { COMPANY, FOOTER, FOOTER_OTHER, FOUNDED_YEAR, HEADER, SOCIAL, SUPPORT_EMAIL, TAGLINE, V3D_CTA, V3D_SIGNUP_PATH } from '@/site'

/**
 * The Radlor header and footer around a company page. Worn by `app/(site)/layout.tsx` (every company page) and by
 * `app/not-found.tsx`; NOT by `/radlic`, which is the Radlic product page and has its own (founder's call,
 * 2026-09-25). Moved here verbatim from the root layout.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
    {/* Keyboard users jump past the header (added 2026-11-22). Invisible until it has focus. */}
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:font-medium focus:text-on-accent">
      Skip to main content
    </a>
    <header className="rl-header border-b border-line">
      <div className="mx-auto max-w-5xl px-6 h-16 grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-6">
          {/* The whole lockup is now ONE image — the chrome wordmark with the robot in the
              'o'. The `<span>Radlor</span>` that used to sit beside the mark is gone because
              the picture contains the word.

              ⚠️ `alt` IS "Radlor" AND MUST NOT GO BACK TO "". It was empty while real text sat
              next to it and would otherwise have been announced twice. Now the picture IS the
              word, so an empty alt leaves this link — the home link, on every page — with no
              accessible name at all.

              ⚠️ One artwork, not two. The black ground is keyed to alpha, so it composites on
              any of the palette's dark values; that is why the header is pinned dark rather
              than art-directed per theme the way the old mono marks were. */}
          <Link href="/" className="flex items-center justify-self-start">
            <Image
              src="/wordmark.png"
              alt={COMPANY}
              width={280}
              height={96}
              priority
              className="h-8 w-auto"
            />
          </Link>
        {/* No hamburger. On a narrow frame the links move to the second row below (2026-11-26). Logo left, links centred (founder, 2026-09-29); no button
            on the right from 2026-10-22 (founder: "remove Our products from the nav") until the 3Dlor button below. */}
        <nav aria-label="Main" className="hidden md:flex items-center gap-8 text-sm">
          {HEADER.map(n => (
            <Link key={n.href} href={n.href} className="rl-link text-muted hover:text-foreground transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>
        {/* THE SITE'S ONE PRIMARY ACTION (founder, 2026-11-23). Right column, at EVERY width: below md the nav links
            drop out (no hamburger), so this button is the phone's only header action. Accent on the pinned-dark
            header is 12.9:1 for its text; min-h-11 is the 44 px touch target. */}
        <Link href={V3D_SIGNUP_PATH} className="rl-cta col-start-3 justify-self-end inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-accent px-4 text-sm font-semibold text-on-accent hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-5">
          {V3D_CTA}
        </Link>
      </div>
      {/* Phone nav (founder, 2026-11-26: "upar nav options dikh hi nahi rahe"). Below md the links sit in a second row
          that wraps, so every page stays one tap away without a hamburger. */}
      <nav aria-label="Main" className="md:hidden mx-auto max-w-5xl px-6 pb-2 flex flex-wrap gap-x-5 text-sm">
        {HEADER.map(n => (
          <Link key={n.href} href={n.href} className="rl-link inline-flex min-h-11 items-center text-muted hover:text-foreground transition-colors">
            {n.label}
          </Link>
        ))}
      </nav>
    </header>

    <main id="main" className="rl-paper flex-1">{children}</main>

    <footer className="border-t border-line mt-24">
      <div className="mx-auto max-w-5xl px-6 py-10 flex flex-wrap gap-6 justify-between text-sm text-muted">
        <p>
          © {FOUNDED_YEAR} {COMPANY}. {TAGLINE}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {FOOTER.map(n => (
            <Link key={n.href} href={n.href} className="rl-link hover:text-foreground transition-colors">
              {n.label}
            </Link>
          ))}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="rl-link hover:text-foreground transition-colors">
            {SUPPORT_EMAIL}
          </a>
          {SOCIAL.map(s => (
            <a
              key={s.url}
              href={s.url}
              rel="me noopener"
              target="_blank"
              className="rl-link hover:text-foreground transition-colors"
            >
              {s.name}
            </a>
          ))}
        </div>
        <nav aria-label="Other products" className="flex w-full flex-wrap gap-x-5 gap-y-2 border-t border-line pt-6">
          <span className="font-medium text-foreground">Other products</span>
          {FOOTER_OTHER.map(n => (
            <Link key={n.href} href={n.href} className="rl-link hover:text-foreground transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
    </>
  )
}
