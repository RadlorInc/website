import { quote } from '../_lib/plans.ts'
import { parseOrder } from '../_lib/validate.ts'
import { configured, db, dbJson, sameOrigin, seeOther, sessionFrom } from '../_lib/server.ts'
import { stripeApi } from '../_lib/stripe.ts'

/**
 * The onboarding form posts here (plain form, works with JavaScript off). One open (unpaid) order
 * per customer: a second submit goes to the account page instead of making a duplicate.
 * The customer sets only the form fields. Payment and progress columns are never read from input.
 *
 * "← Back" from the account page (founder, 2026-11-27): a form with `edit` = the id of the customer's OWN open unpaid
 * order changes that order instead. The price is worked out again here. An open Stripe Checkout page for the old price
 * is expired FIRST: the webhook marks paid only the order's current session, so a page left open at the old price
 * could take money that never marks the order paid. If Stripe cannot expire it, nothing changes.
 */
export async function POST(req: Request) {
  if (!configured()) return seeOther('/3dlor/signup?e=closed')
  const s = sessionFrom(req.headers.get('cookie'))
  if (!s) return seeOther('/3dlor/signup?e=signin')
  if (!sameOrigin(req)) return seeOther('/3dlor/signup?e=form')

  const form = await req.formData().catch(() => null)
  if (!form) return seeOther('/3dlor/signup?e=form')
  const parsed = parseOrder(form)
  if (!parsed.ok) return seeOther(`/3dlor/signup?e=field&f=${parsed.error}`)

  try {
    const open = await dbJson<{ id: string; stripe_session_id: string | null }[]>(
      `v3d_orders?select=id,stripe_session_id&user_id=eq.${s.uid}&payment_status=eq.unpaid&limit=1`)
    const q = quote(parsed.size)
    const priced = {
      ...parsed.data,
      plan: q.plan,
      videos_ordered: parsed.size.videos,
      build_price_cents: q.buildCents, // the price, worked out here; Checkout charges this saved number
      notes: `Products: ${parsed.size.products}. Languages: ${parsed.names.join(', ')}. Rate: ${q.rateCents / 100} USD a video.`,
    }
    if (open.length) {
      const o = open[0]
      if (form.get('edit') !== o.id) return seeOther('/3dlor/account')
      if (o.stripe_session_id) {
        const old = await stripeApi(`checkout/sessions/${o.stripe_session_id}`, null)
        if (old?.status === 'complete') return seeOther('/3dlor/account?paid=1')
        if (old?.status === 'open') await stripeApi(`checkout/sessions/${o.stripe_session_id}/expire`, {})
      }
      const res = await db(`v3d_orders?id=eq.${o.id}&user_id=eq.${s.uid}&payment_status=eq.unpaid`, {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ ...priced, stripe_session_id: null }),
      })
      if (!res.ok) throw new Error(`update ${res.status} ${await res.text().catch(() => '')}`)
      return seeOther('/3dlor/account?saved=1')
    }
    // An edit with no open order left (paid in another tab meanwhile): never turn it into a second, new order.
    if (form.get('edit')) return seeOther('/3dlor/account')

    const res = await db('v3d_orders', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        ...priced,
        product_name: 'Your product', // the customer names it after payment, on the order page
        user_id: s.uid,
        waiting_on_customer: 'Product photos from all sides\nThe manual or instruction PDF\nYour logo',
      }),
    })
    // 409 = the one-unpaid-order index (migration 20261127): a second request at the same moment lost the race.
    // The first one made the order, so this is the same as "you already have an open order".
    if (res.status === 409) return seeOther('/3dlor/account')
    if (!res.ok) throw new Error(`insert ${res.status} ${await res.text().catch(() => '')}`)
  } catch (err) {
    console.error('[3dlor] order save failed', String(err).slice(0, 300))
    return seeOther('/3dlor/signup?e=save')
  }
  return seeOther('/3dlor/account?new=1')
}
