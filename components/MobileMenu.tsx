'use client'

import Link from 'next/link'
import type { MouseEvent } from 'react'
import { HEADER, V3D_CTA, V3D_SIGNUP_PATH } from '@/site'

/**
 * The phone menu (founder, 2026-11-26): three lines in the header open a side bar with every header link and,
 * last, the 3Dlor button. Native `popover`, so Esc, a tap outside and the top layer come from the browser.
 * The one piece of JS: a tap on a link closes the bar, because a client-side navigation keeps the header mounted.
 */
const close = (e: MouseEvent<HTMLElement>) => (e.currentTarget.closest('[popover]') as HTMLElement | null)?.hidePopover()

export function MobileMenu() {
  return (
    <>
      <button
        type="button"
        popoverTarget="mobile-menu"
        aria-label="Open menu"
        className="md:hidden col-start-3 justify-self-end inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground hover:bg-surface focus-visible:outline-2 focus-visible:outline-accent"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <div id="mobile-menu" popover="auto" className="rl-header rl-drawer">
        <div className="flex h-16 items-center justify-end px-4">
          <button
            type="button"
            popoverTarget="mobile-menu"
            popoverTargetAction="hide"
            aria-label="Close menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-surface focus-visible:outline-2 focus-visible:outline-accent"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <nav aria-label="Main" className="flex flex-col px-6">
          {HEADER.map(n => (
            <Link key={n.href} href={n.href} onClick={close} className="flex min-h-12 items-center border-b border-line text-base text-muted hover:text-foreground">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 pt-6">
          <Link href={V3D_SIGNUP_PATH} onClick={close} className="flex min-h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-on-accent hover:opacity-90">
            {V3D_CTA}
          </Link>
        </div>
      </div>
    </>
  )
}
