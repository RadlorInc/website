import { stripeApi, stripeKey } from '../_lib/stripe.ts'
import { configured, dbJson, json, originOf, sameOrigin, sessionFrom } from '../_lib/server.ts'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

/** POST {order_id} → {url} of the Stripe customer portal (card, invoices, cancel the care plan). */
export async function POST(req: Request) {
  if (!configured()) return json(503, { code: 'closed' })
  const s = sessionFrom(req.headers.get('cookie'))
  if (!s) return json(401, { code: 'signin' })
  if (!sameOrigin(req)) return json(403, { code: 'forbidden' })
  let key: string | null
  try { key = stripeKey() } catch { key = null }
  if (!key) return json(503, { code: 'payments_not_configured' })

  const body = await req.json().catch(() => null)
  const orderId = String(body?.order_id ?? '')
  if (!UUID.test(orderId)) return json(400, { code: 'bad_request' })
  try {
    const [o] = await dbJson<{ stripe_customer_id: string | null }[]>(
      `v3d_orders?select=stripe_customer_id&id=eq.${orderId}&user_id=eq.${s.uid}`)
    if (!o?.stripe_customer_id) return json(404, { code: 'not_found' })
    const p = await stripeApi('billing_portal/sessions', {
      customer: o.stripe_customer_id,
      return_url: `${originOf(req)}/3dlor/account`,
    })
    return json(200, { url: p.url })
  } catch (err) {
    console.error('[3dlor] portal failed', String(err).slice(0, 300))
    return json(502, { code: 'retry' })
  }
}
