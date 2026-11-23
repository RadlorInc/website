'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Spinner } from './Spinner'

/**
 * Shown after Stripe brings the customer back (`?paid=1`). Stripe tells our server by webhook, which can take a few
 * seconds, so while the order is still unpaid this checks again every 3 s by itself; nobody has to reload. When it is
 * paid it says so and takes `?paid=1` out of the address, so Back and reload do not show this again.
 */
export function PaymentWait({ waiting }: { waiting: boolean }) {
  const router = useRouter()
  const [tries, setTries] = useState(0)
  const slow = tries >= 30   // about 90 seconds

  useEffect(() => {
    if (!waiting) {
      window.history.replaceState(null, '', window.location.pathname)
      return
    }
    if (slow) return
    const t = setTimeout(() => { setTries(n => n + 1); router.refresh() }, 3000)
    return () => clearTimeout(t)
  }, [waiting, tries, slow, router])

  if (!waiting) {
    return (
      <p role="status" className="mt-6 rounded-lg border border-accent/50 bg-accent-soft px-4 py-3">
        Payment received. Thank you! Your order is below.
      </p>
    )
  }
  return (
    <p role="status" className="mt-6 flex items-center gap-3 rounded-lg border border-line px-4 py-3">
      {slow
        ? <>Stripe has not confirmed the payment yet. Please reload this page in a minute. You do not need to pay again.</>
        : <><Spinner />Confirming your payment with Stripe. This page updates by itself; please wait here.</>}
    </p>
  )
}
