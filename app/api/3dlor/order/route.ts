import { quote } from '../_lib/plans.ts'
import { parseOrder } from '../_lib/validate.ts'
import { configured, db, dbJson, sameOrigin, seeOther, sessionFrom } from '../_lib/server.ts'

/**
 * The onboarding form posts here (plain form, works with JavaScript off). One open (unpaid) order
 * per customer: a second submit goes to the account page instead of making a duplicate.
 * The customer sets only the form fields. Payment and progress columns are never read from input.
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
    const open = await dbJson<{ id: string }[]>(
      `v3d_orders?select=id&user_id=eq.${s.uid}&payment_status=eq.unpaid&limit=1`)
    if (open.length) return seeOther('/3dlor/account')

    const q = quote(parsed.size)
    const res = await db('v3d_orders', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        ...parsed.data,
        product_name: 'Your product', // the customer names it after payment, on the order page
        user_id: s.uid,
        plan: q.plan,
        videos_ordered: parsed.size.videos,
        build_price_cents: q.buildCents, // the price, worked out here; Checkout charges this saved number
        notes: `Products: ${parsed.size.products}. Languages: ${parsed.size.languages}. Rate: ${q.rateCents / 100} USD a video.`,
        waiting_on_customer: 'Product photos from all sides\nThe manual or instruction PDF\nYour logo',
      }),
    })
    if (!res.ok) throw new Error(`insert ${res.status} ${await res.text().catch(() => '')}`)
  } catch (err) {
    console.error('[3dlor] order insert failed', String(err).slice(0, 300))
    return seeOther('/3dlor/signup?e=save')
  }
  return seeOther('/3dlor/account?new=1')
}
