// The order route with a fake database and a fake Stripe (2026-11-27, "← Back" from the account page).
//   node --test --experimental-strip-types --no-warnings app/api/3dlor/order/route.test.ts
// Checks the new edit path AND the attacks on it: another customer's order, a paid order, a Checkout page that is
// still open or already paid, no sign-in, another site, oversized input. Nothing here reaches a real service.
import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'

Object.assign(process.env, {
  SUPABASE_URL: 'https://db.test', SUPABASE_SERVICE_ROLE_KEY: 'service', SUPABASE_ANON_KEY: 'anon',
  V3D_SESSION_SECRET: 'x'.repeat(40), STRIPE_SECRET_KEY: 'sk_test_fake', STRIPE_WEBHOOK_SECRET: 'whsec_fake',
})
const { POST } = await import('./route.ts')
const { sign } = await import('../_lib/session.ts')
const { MIN_VIDEOS, quote } = await import('../_lib/plans.ts')

type Row = Record<string, unknown>
let orders: Row[] = []
let stripe: Record<string, string> = {}
let stripeFails = false

const A = 'aaaaaaaa-0000-0000-0000-000000000001'
const B = 'bbbbbbbb-0000-0000-0000-000000000002'
const match = (r: Row, q: URLSearchParams) =>
  [...q].every(([k, v]) => !v.startsWith('eq.') || String(r[k]) === v.slice(3))

globalThis.fetch = (async (input: string | URL, init: RequestInit = {}) => {
  const url = new URL(String(input))
  const method = init.method ?? 'GET'
  if (url.host === 'api.stripe.com') {
    if (stripeFails) return Response.json({ error: { code: 'down' } }, { status: 500 })
    const [, , , , id, act] = url.pathname.split('/') // /v1/checkout/sessions/<id>[/expire]
    if (act === 'expire') stripe[id] = 'expired'
    return Response.json({ id, status: stripe[id] })
  }
  const rows = orders.filter(r => match(r, url.searchParams))
  if (method === 'GET') return Response.json(rows.slice(0, Number(url.searchParams.get('limit') ?? 99)))
  const body = JSON.parse(String(init.body))
  if (method === 'POST') {
    // The one-unpaid-order index (migration 20261127): PostgREST answers 409 for a second unpaid order.
    if (orders.some(o => o.user_id === body.user_id && o.payment_status === 'unpaid')) return Response.json({ code: '23505' }, { status: 409 })
    orders.push({ id: `new-${orders.length}`, payment_status: 'unpaid', stripe_session_id: null, ...body })
  }
  if (method === 'PATCH') rows.forEach(r => Object.assign(r, body))
  return new Response(null, { status: 204 })
}) as typeof fetch

const cookie = (uid: string) => `v3d_session=${sign({ uid, email: `${uid}@x.test`, exp: Date.now() + 60_000 }, 'x'.repeat(40))}`
function post(fields: Record<string, string>, { uid = A as string | null, origin = 'https://radlor.test' } = {}) {
  const body = new FormData()
  for (const [k, v] of Object.entries({ videos: String(MIN_VIDEOS), products: '1', company: 'Acme', contact_name: 'Sam', languages: '', ...fields })) body.set(k, v)
  return POST(new Request('https://radlor.test/api/3dlor/order', {
    method: 'POST', body, headers: { host: 'radlor.test', origin, ...(uid ? { cookie: cookie(uid) } : {}) },
  }))
}
const where = (r: Response) => r.headers.get('location')
const order = (id: string) => orders.find(o => o.id === id)!

beforeEach(() => {
  stripeFails = false
  stripe = { cs_open: 'open', cs_done: 'complete' }
  orders = [
    { id: 'a1', user_id: A, payment_status: 'unpaid', company: 'Acme', contact_name: 'Sam', videos_ordered: MIN_VIDEOS, build_price_cents: 1, stripe_session_id: 'cs_open' },
    { id: 'b1', user_id: B, payment_status: 'paid', company: 'Bee', contact_name: 'Bo', videos_ordered: MIN_VIDEOS, build_price_cents: 2, stripe_session_id: 'cs_done' },
  ]
})

test('edit: changes the own open order, prices it again, expires the old Checkout page first', async () => {
  const r = await post({ edit: 'a1', videos: String(MIN_VIDEOS + 5), company: 'Acme 2', products: '3' })
  assert.equal(where(r), '/3dlor/account?saved=1')
  const o = order('a1')
  assert.equal(o.company, 'Acme 2')
  assert.equal(o.videos_ordered, MIN_VIDEOS + 5)
  assert.equal(o.build_price_cents, quote({ videos: MIN_VIDEOS + 5, products: 3, languages: 1 }).buildCents)
  assert.match(String(o.notes), /^Products: 3\./)
  assert.equal(o.stripe_session_id, null)
  assert.equal(stripe.cs_open, 'expired')
  assert.equal(orders.length, 2, 'no new order')
})

test('no edit field: an open order still goes to the account page, unchanged', async () => {
  assert.equal(where(await post({ company: 'Other' })), '/3dlor/account')
  assert.equal(order('a1').company, 'Acme')
})

test("attack: another customer's order id does nothing to that order", async () => {
  // B has no open order and names A's order: refused, and no new order is made either.
  assert.equal(where(await post({ edit: 'a1', company: 'Hacked' }, { uid: B })), '/3dlor/account')
  assert.equal(order('a1').company, 'Acme')
  assert.equal(orders.length, 2)
  // A names B's PAID order: A's own open order is not the one named, so nothing changes.
  assert.equal(where(await post({ edit: 'b1', company: 'Hacked' })), '/3dlor/account')
  assert.equal(order('b1').company, 'Bee')
  assert.equal(order('a1').company, 'Acme')
})

test('a Checkout page already paid: no change, the customer sees the payment', async () => {
  order('a1').stripe_session_id = 'cs_done'
  assert.equal(where(await post({ edit: 'a1', company: 'Late' })), '/3dlor/account?paid=1')
  assert.equal(order('a1').company, 'Acme')
})

test('Stripe down: the order does not change (the old price page could still be paid)', async () => {
  stripeFails = true
  assert.equal(where(await post({ edit: 'a1', company: 'Nope' })), '/3dlor/signup?e=save')
  assert.equal(order('a1').company, 'Acme')
  assert.equal(order('a1').stripe_session_id, 'cs_open')
})

test('edit after the order was paid in another tab: no second order', async () => {
  order('a1').payment_status = 'paid'
  assert.equal(where(await post({ edit: 'a1' })), '/3dlor/account')
  assert.equal(orders.length, 2)
})

test('no sign-in, another site, oversized or bad input: refused, nothing written', async () => {
  assert.equal(where(await post({ edit: 'a1' }, { uid: null })), '/3dlor/signup?e=signin')
  assert.equal(where(await post({ edit: 'a1' }, { origin: 'https://evil.test' })), '/3dlor/signup?e=form')
  assert.equal(where(await post({ edit: 'a1', company: 'x'.repeat(201) })), '/3dlor/signup?e=field&f=company')
  assert.equal(where(await post({ edit: 'a1', videos: '1' })), '/3dlor/signup?e=field&f=videos')
  assert.equal(where(await post({ edit: 'a1', languages: 'Klingon' })), '/3dlor/signup?e=field&f=languages')
  assert.equal(order('a1').company, 'Acme')
})

test('two new orders at the same moment: one order, both land on the account page', async () => {
  const C = 'cccccccc-0000-0000-0000-000000000003'
  // Both requests pass the "open order?" check before either inserts; the index refuses the second.
  const rs = await Promise.all([post({}, { uid: C }), post({}, { uid: C })])
  assert.deepEqual(rs.map(where).sort(), ['/3dlor/account', '/3dlor/account?new=1'])
  assert.equal(orders.filter(o => o.user_id === C).length, 1)
})
