import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { APP_URL, COMPANY, FOOTER, FOUNDED_YEAR, HEADER, SOCIAL, SUPPORT_EMAIL, TAGLINE } from '@/site'

/**
 * The Radlor header and footer around a company page. Worn by `app/(site)/layout.tsx` (every company page) and by
 * `app/not-found.tsx`; NOT by `/radlic`, which is the Radlic product page and has its own (founder's call,
 * 2026-09-25). Moved here verbatim from the root layout.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
    <header className="rl-header border-b border-line">
      <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between gap-6">
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
          <Link href="/" className="flex items-center">
            <Image
              src="/wordmark.png"
              alt={COMPANY}
              width={280}
              height={96}
              priority
              className="h-8 w-auto"
            />
          </Link>
        {/* No hamburger. On a narrow frame the links drop out of the header and the footer — which
            carries the same list — becomes the navigation. One CTA is what a phone has room for. */}
        <nav className="flex items-center gap-5 text-sm">
          <div className="hidden md:flex items-center gap-5">
            {HEADER.map(n => (
              <Link key={n.href} href={n.href} className="rl-link text-muted hover:text-foreground transition-colors">
                {n.label}
              </Link>
            ))}
          </div>
          {/* The button on every page. Founder, 2026-09-25: "hide the Join the waitlist button at the top and
              from everywhere, and put Try Radlic". It goes where /radlic's "Sign up free" goes — the app's sign-in
              / sign-up page. The /waitlist page and its form still exist (unlinked), so an old shared link keeps
              working and /privacy's description of that form stays true. (2026-08-31 to 2026-09-25 this was the
              waitlist, "the only door"; history in git.) */}
          <a
            href={`${APP_URL}/auth`}
            className="rl-cta rl-cta-quiet rounded-full bg-accent px-4 py-2 text-on-accent text-sm font-medium whitespace-nowrap hover:opacity-90 transition-opacity"
          >
            Try Radlic
          </a>
        </nav>
      </div>
    </header>

    <main className="flex-1">{children}</main>

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
      </div>
    </footer>
    </>
  )
}
