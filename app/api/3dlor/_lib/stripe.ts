import { createHmac, timingSafeEqual } from 'node:crypto'
import { CARE, depositCents, FREE_MONTHS, type PlanKey } from './plans.ts'

/**
 * Stripe without the SDK: two API calls (Checkout session, portal session) and the webhook check.
 * The site has no SDK dependencies on purpose (see app/api/waitlist/route.ts).
 */

/** Stripe's form encoding: nested objects and arrays become `a[b][0][c]=v`. */
export function formEncode(obj: Record<string, unknown>, prefix = ''): string {
  const out: string[] = []
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue
    const key = prefix ? `${prefix}[${k}]` : k
    if (typeof v === 'object') {
      const inner = formEncode(v as Record<string, unknown>, key)
      if (inner) out.push(inner)
    } else out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`)
  }
  return out.join('&')
}

/** True for a live key. Live keys are allowed only on the production deployment. */
export const isLiveKey = (key: string) => /^(sk|rk)_live_/.test(key)

export function stripeKey(): string | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  const prod = process.env.VERCEL_ENV === 'production'
  if (prod !== isLiveKey(key)) throw new Error('Stripe key mode does not match this environment')
  return key
}

export async function stripeApi(path: string, params: Record<string, unknown> | null, idempotencyKey?: string) {
  const key = stripeKey()
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: params ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
    },
    body: params ? formEncode(params) : undefined,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`stripe ${path} ${res.status} ${json?.error?.code ?? ''}`)
  return json
}

/**
 * Checks the `Stripe-Signature` header (scheme v1: HMAC-SHA256 of `${t}.${body}`), with Stripe's
 * default 5-minute tolerance against replay. Returns the parsed event, or null.
 */
export function verifyWebhook(body: string, header: string | null, secret: string | undefined, nowSec = Date.now() / 1000) {
  if (!header || !secret) return null
  let t = ''
  const sigs: string[] = []
  for (const part of header.split(',')) {
    const [k, v] = part.split('=', 2)
    if (k === 't') t = v
    if (k === 'v1' && v) sigs.push(v)
  }
  if (!/^\d+$/.test(t) || Math.abs(nowSec - Number(t)) > 300 || !sigs.length) return null
  const want = createHmac('sha256', secret).update(`${t}.${body}`).digest()
  const ok = sigs.some(s => {
    const got = Buffer.from(s, 'hex')
    return got.length === want.length && timingSafeEqual(got, want)
  })
  if (!ok) return null
  try {
    return JSON.parse(body) as { id: string; type: string; livemode: boolean; data: { object: Record<string, unknown> } }
  } catch {
    return null
  }
}

/**
 * The Checkout session for one order, subscription mode:
 *   1. the first half of the build, a one-time line item, paid today;
 *   2. the monthly care plan, free until `trial_end`, then month to month.
 */
export function checkoutParams(o: { orderId: string; uid: string; email: string; plan: PlanKey; videos: number; buildCents: number; site: string; today: Date }) {
  const care = CARE[o.plan]
  const trialEnd = addMonthsSec(o.today, FREE_MONTHS)
  const meta = { v3d_order_id: o.orderId, v3d_user_id: o.uid, v3d_plan: o.plan, v3d_trial_end: String(trialEnd) }
  return {
    mode: 'subscription',
    customer_email: o.email,
    client_reference_id: o.orderId,
    line_items: [
      { quantity: 1, price_data: { currency: 'usd', unit_amount: depositCents(o.buildCents),
        product_data: { name: `3Dlor, ${o.videos} videos: first half (second half at delivery)` } } },
      { quantity: 1, price_data: { currency: 'usd', unit_amount: care.cents, recurring: { interval: 'month' },
        product_data: { name: `3Dlor care plan (${care.videos})` } } },
    ],
    subscription_data: {
      trial_end: trialEnd,
      metadata: meta,
      description: `${FREE_MONTHS} free months, then month to month. Fixed price, no interest and no late fees.`,
    },
    metadata: meta,
    // People were not sure if they had to press Back after the green tick (founder, 23 Nov 2026).
    custom_text: {
      submit: { message: 'After you pay, this page takes you back to radlor.com by itself.' },
      after_submit: { message: 'Payment done. Taking you back to radlor.com now; please do not press Back.' },
    },
    success_url: `${o.site}/3dlor/account?paid=1`,
    cancel_url: `${o.site}/3dlor/account`,
  }
}

/** Calendar months from a date, in seconds (Stripe time). */
export function addMonthsSec(from: Date, months: number): number {
  const d = new Date(from)
  d.setUTCMonth(d.getUTCMonth() + months)
  return Math.floor(d.getTime() / 1000)
}
