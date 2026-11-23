'use client'
import { useEffect, useState } from 'react'
import { Spinner } from './Spinner'

/** Asks our API for a Stripe page (Checkout or the customer portal) and goes there. */
export function StripeButton({ orderId, kind, label }: { orderId: string; kind: 'checkout' | 'portal'; label: string }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  // Back from Stripe can show this page from the browser's cache, still "Opening…". Reset it then.
  useEffect(() => {
    const reset = (e: PageTransitionEvent) => { if (e.persisted) setBusy(false) }
    window.addEventListener('pageshow', reset)
    return () => window.removeEventListener('pageshow', reset)
  }, [])
  async function go() {
    setBusy(true)
    setError('')
    const res = await fetch(`/api/3dlor/${kind}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId }),
    }).catch(() => null)
    const body = await res?.json().catch(() => null)
    if (res?.ok && typeof body?.url === 'string' && /^https:\/\/[a-z.]+\.stripe\.com\//.test(body.url)) {
      window.location.assign(body.url)   // stays busy until the Stripe page opens
      return
    }
    setBusy(false)
    setError(body?.code === 'already_paid' ? 'This order is already paid. Reload the page.' : 'That did not work. Please try again.')
  }
  return (
    <div>
      <button type="button" onClick={go} disabled={busy} aria-busy={busy}
        className={kind === 'checkout'
          ? 'rl-cta rounded-full bg-accent px-6 py-3 text-on-accent font-medium hover:opacity-90 disabled:opacity-70 disabled:cursor-wait'
          : 'rounded-full border border-line px-5 py-2 text-sm hover:border-accent disabled:opacity-70 disabled:cursor-wait'}>
        {busy
          ? <span className="inline-flex items-center gap-2"><Spinner />Opening Stripe…</span>
          : label}
      </button>
      {kind === 'checkout' && !error && (
        <p className="mt-2 text-sm text-muted">You pay on Stripe&rsquo;s secure page. After you pay, it brings you back here by itself.</p>
      )}
      {error && <p role="alert" className="mt-2 text-sm text-accent">{error}</p>}
    </div>
  )
}
