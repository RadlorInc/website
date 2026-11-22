'use client'
import { useState, type ReactNode } from 'react'

/**
 * A submit button for a plain form that shows it is working. The form still posts without JavaScript;
 * with JavaScript the button says `pending` and stops a second click while the server answers (1–2 s for
 * the sign-in email and the order). Busy is set after the click, so the browser's own submit is not blocked.
 */
export function PendingButton({ children, pending, className }: { children: ReactNode; pending: string; className: string }) {
  const [busy, setBusy] = useState(false)
  return (
    <button
      className={`${className} disabled:opacity-60 disabled:cursor-wait`}
      disabled={busy}
      aria-busy={busy}
      onClick={e => {
        if (e.currentTarget.form?.checkValidity()) setTimeout(() => setBusy(true), 0)
      }}
    >
      {busy ? pending : children}
    </button>
  )
}
