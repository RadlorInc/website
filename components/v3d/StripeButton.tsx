'use client'
import { useState } from 'react'

/** Asks our API for a Stripe page (Checkout or the customer portal) and goes there. */
export function StripeButton({ orderId, kind, label }: { orderId: string; kind: 'checkout' | 'portal'; label: string }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
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
      window.location.assign(body.url)
      return
    }
    setBusy(false)
    setError(body?.code === 'already_paid' ? 'This order is already paid. Reload the page.' : 'That did not work. Please try again.')
  }
  return (
    <div>
      <button type="button" onClick={go} disabled={busy}
        className={kind === 'checkout'
          ? 'rl-cta rounded-full bg-accent px-6 py-3 text-on-accent font-medium hover:opacity-90 disabled:opacity-60'
          : 'rounded-full border border-line px-5 py-2 text-sm hover:border-accent disabled:opacity-60'}>
        {busy ? 'Opening…' : label}
      </button>
      {error && <p role="alert" className="mt-2 text-sm text-accent">{error}</p>}
    </div>
  )
}
