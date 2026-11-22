import { PLANS, depositCents, isPlan } from '../_lib/plans.ts'
import { checkoutParams, stripeApi, stripeKey } from '../_lib/stripe.ts'
import { configured, db, dbJson, json, originOf, sameOrigin, sessionFrom } from '../_lib/server.ts'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

/**
 * POST {order_id} → {url} of a Stripe Checkout page (params: checkoutParams in _lib/stripe.ts).
 * The page sends the browser to the url with JavaScript (a form POST cannot redirect off-site under
 * this site's `form-action 'self'` CSP). This route never marks anything paid: the webhook does.
 */
export async function POST(req: Request) {
  if (!configured()) return json(503, { code: 'closed' })
  const s = sessionFrom(req.headers.get('cookie'))
  if (!s) return json(401, { code: 'signin' })
  if (!sameOrigin(req)) return json(403, { code: 'forbidden' })

  const body = await req.json().catch(() => null)
  const orderId = String(body?.order_id ?? '')
  if (!UUID.test(orderId)) return json(400, { code: 'bad_request' })

  try {
    const [o] = await dbJson<{ plan: string; payment_status: string; stripe_session_id: string | null }[]>(
      `v3d_orders?select=plan,payment_status,stripe_session_id&id=eq.${orderId}&user_id=eq.${s.uid}`)
    if (!o || !isPlan(o.plan)) return json(404, { code: 'not_found' })
    if (o.payment_status !== 'unpaid') return json(409, { code: 'already_paid' })
    let key: string | null
    try { key = stripeKey() } catch { key = null }
    if (!key) return json(503, { code: 'payments_not_configured' })

    // A session that is still open is used again, so two clicks cannot make two payments.
    if (o.stripe_session_id) {
      const old = await stripeApi(`checkout/sessions/${o.stripe_session_id}`, null).catch(() => null)
      if (old?.status === 'open' && old.url) return json(200, { url: old.url })
      if (old?.status === 'complete') return json(409, { code: 'already_paid' })
    }

    const today = new Date(new Date().toISOString().slice(0, 10))
    const plan = PLANS[o.plan]
    const session = await stripeApi(
      'checkout/sessions',
      checkoutParams({ orderId, uid: s.uid, email: s.email, plan: o.plan, site: originOf(req), today }),
      `v3d-checkout-${orderId}-${today.toISOString().slice(0, 10)}-${depositCents(o.plan)}-${plan.careCents}`,
    )

    await db(`v3d_orders?id=eq.${orderId}&user_id=eq.${s.uid}&payment_status=eq.unpaid`, {
      method: 'PATCH',
      body: JSON.stringify({ stripe_session_id: session.id, build_price_cents: plan.buildCents }),
    })
    return json(200, { url: session.url })
  } catch (err) {
    console.error('[3dlor] checkout failed', String(err).slice(0, 300))
    return json(502, { code: 'retry' })
  }
}
