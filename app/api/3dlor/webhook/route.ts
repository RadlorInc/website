import { verifyWebhook } from '../_lib/stripe.ts'
import { db } from '../_lib/server.ts'

/**
 * Stripe webhook. The ONLY place an order becomes paid: the success redirect changes nothing.
 * The signature is checked first (bad signature → 400, nothing changes). The Stripe account is
 * shared with other Radlor apps, so an event without our `v3d_order_id` metadata is acknowledged
 * and ignored. A database error answers 500 so Stripe sends the event again.
 *
 * Events to enable on the endpoint: checkout.session.completed, checkout.session.async_payment_succeeded,
 * customer.subscription.updated, customer.subscription.deleted.
 *
 * ponytail: refunds and disputes are not handled here; the founder sets payment_status in the table.
 */
type Obj = Record<string, unknown>
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
const idOf = (v: unknown) => (typeof v === 'string' ? v : typeof (v as Obj)?.id === 'string' ? ((v as Obj).id as string) : null)
const iso = (sec: unknown) => (typeof sec === 'number' ? new Date(sec * 1000).toISOString() : null)

async function patch(filter: string, values: Obj) {
  const res = await db(`v3d_orders?${filter}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(values) })
  if (!res.ok) throw new Error(`patch ${res.status} ${await res.text().catch(() => '')}`)
}

export async function POST(req: Request) {
  const body = await req.text()
  const event = verifyWebhook(body, req.headers.get('stripe-signature'), process.env.STRIPE_WEBHOOK_SECRET)
  if (!event) return Response.json({ code: 'bad_signature' }, { status: 400 })

  const o = event.data.object
  const orderId = (o.metadata as Obj | undefined)?.v3d_order_id
  if (typeof orderId !== 'string' || !UUID.test(orderId)) return Response.json({ outcome: 'ignored' })

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        if (o.payment_status !== 'paid') return Response.json({ outcome: 'not_paid_yet' })
        const sub = idOf(o.subscription)
        // Only an unpaid order with this exact session moves to paid, so a replay changes nothing.
        await patch(`id=eq.${orderId}&stripe_session_id=eq.${o.id}&payment_status=eq.unpaid`, {
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
          amount_paid_cents: typeof o.amount_total === 'number' ? o.amount_total : null,
          stripe_customer_id: idOf(o.customer),
          stripe_subscription_id: sub,
          care_status: 'trialing',
          // Subscription events can arrive before this one; the trial end rides in our own metadata.
          care_starts_at: iso(Number((o.metadata as Obj).v3d_trial_end) || undefined),
        })
        break
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        await patch(`id=eq.${orderId}&stripe_subscription_id=eq.${o.id}`, {
          care_status: typeof o.status === 'string' ? o.status : null,
          care_starts_at: iso(o.trial_end),
        })
        break
      }
      default:
        return Response.json({ outcome: 'ignored' })
    }
  } catch (err) {
    console.error('[3dlor] webhook database error', event.type, String(err).slice(0, 200))
    return Response.json({ code: 'retry' }, { status: 500 })
  }
  return Response.json({ outcome: 'recorded' })
}
