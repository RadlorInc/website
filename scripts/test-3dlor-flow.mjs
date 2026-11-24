#!/usr/bin/env node
// End-to-end and attack test for the 3D video sign-up, against a LOCAL stack only:
//   a local Supabase (`supabase start`, with this repo's migration) and `next dev`.
//
//   node --env-file=.env.local scripts/test-3dlor-flow.mjs http://localhost:3031 http://127.0.0.1:56324
//                                                              ^ the site               ^ Mailpit (local email)
//
// ⚠️ It refuses to run against a supabase.co URL: it signs up test users and writes rows.
// The Stripe checkout itself is tested by hand with a test card (see the PR).
import { createHmac } from 'node:crypto'

const BASE = process.argv[2] ?? 'http://localhost:3031'
const MAIL = process.argv[3] ?? 'http://127.0.0.1:56324'
const { SUPABASE_URL: SB, SUPABASE_ANON_KEY: ANON, SUPABASE_SERVICE_ROLE_KEY: SERVICE, STRIPE_WEBHOOK_SECRET: WHSEC } = process.env
if (!SB || !/^http:\/\/(127\.0\.0\.1|localhost):/.test(SB)) { console.error('SUPABASE_URL must be a local stack'); process.exit(2) }
if (!/^http:\/\/localhost:/.test(BASE)) { console.error('BASE must be localhost'); process.exit(2) }

let fail = 0
const ok = (good, msg) => { console.log(`  ${good ? 'ok ' : '❌ '} ${msg}`); if (!good) fail = 1 }
const H = { Origin: BASE }
const run = Date.now().toString(36)

async function mailCode(email) {
  for (let i = 0; i < 20; i++) {
    const r = await fetch(`${MAIL}/api/v1/search?query=${encodeURIComponent(`to:${email}`)}`).then(r => r.json())
    const id = r.messages?.[0]?.ID
    if (id) {
      const m = await fetch(`${MAIL}/api/v1/message/${id}`).then(r => r.json())
      const code = /\b(\d{6})\b/.exec(m.Text ?? m.HTML ?? '')?.[1]
      if (code) return code
    }
    await new Promise(r => setTimeout(r, 500))
  }
  throw new Error(`no email for ${email}`)
}
const cookieOf = (res, name) => res.headers.getSetCookie().map(c => c.split(';')[0]).find(c => c.startsWith(`${name}=`))
const form = o => { const f = new FormData(); for (const [k, v] of Object.entries(o)) f.set(k, v); return f }

async function signIn(email) {
  const a = await fetch(`${BASE}/api/3dlor/auth/start`, { method: 'POST', headers: H, body: form({ email, next: '/3dlor/signup' }), redirect: 'manual' })
  const pending = cookieOf(a, 'v3d_pending')
  const code = await mailCode(email)
  const b = await fetch(`${BASE}/api/3dlor/auth/verify`, { method: 'POST', headers: { ...H, Cookie: pending }, body: form({ code }), redirect: 'manual' })
  return cookieOf(b, 'v3d_session')
}

const ORDER = { videos: '40', products: '3', terms: 'yes', company: 'Acme', contact_name: 'Sam', product_name: 'Kettle K1', topics: 'Descale\nFirst use', languages: 'English, Spanish' }
async function makeOrder(cookie, extra = {}) {
  const r = await fetch(`${BASE}/api/3dlor/order`, { method: 'POST', headers: { ...H, Cookie: cookie }, body: form({ ...ORDER, ...extra }), redirect: 'manual' })
  return r.headers.get('location')
}
const admin = (path, init = {}) => fetch(`${SB}/rest/v1/${path}`, { ...init, headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) } })
async function orderOf(email) {
  const users = await fetch(`${SB}/auth/v1/admin/users?per_page=1000`, { headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}` } }).then(r => r.json())
  const u = users.users.find(x => x.email === email)
  const [o] = await admin(`v3d_orders?select=*&user_id=eq.${u.id}`).then(r => r.json())
  return { uid: u.id, order: o }
}
const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, ...new Array(200).fill(1)])
const PDF = new TextEncoder().encode('%PDF-1.4\n%test\n')
async function upload(cookie, order_id, kind, bytes, name, type) {
  const r = await fetch(`${BASE}/api/3dlor/files`, { method: 'POST', headers: { ...H, Cookie: cookie },
    body: form({ order_id, kind, terms: 'yes', file: new File([bytes], name, { type }) }) })
  return { status: r.status, body: await r.json().catch(() => null) }
}
const post = (path, cookie, body, headers = H) =>
  fetch(`${BASE}${path}`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) }, body: JSON.stringify(body) })

const A = `a-${run}@example.com`, B = `b-${run}@example.com`

console.log('\nMain flow')
const ca = await signIn(A)
ok(!!ca, 'customer A signs in with an emailed code')
ok((await makeOrder(ca)) === '/3dlor/account?new=1', 'A submits the onboarding form')
ok((await makeOrder(ca)) === '/3dlor/account', 'a second submit makes no duplicate open order')
const { uid: uidA, order: oa } = await orderOf(A)
ok(oa?.plan === 'growth' && oa.payment_status === 'unpaid' && oa.videos_ordered === 40, 'order saved: growth, unpaid, 40 videos')
{ const r = await fetch(`${BASE}/api/3dlor/files`, { method: 'POST', headers: { ...H, Cookie: ca }, body: form({ order_id: oa.id, kind: 'photo', file: new File([JPEG], 'a.jpg', { type: 'image/jpeg' }) }) }); ok(r.status === 403, 'no consent, no upload (403)') }
const upJ = await upload(ca, oa.id, 'photo', JPEG, 'front.jpg', 'image/jpeg')
const upP = await upload(ca, oa.id, 'manual', PDF, 'manual.pdf', 'application/pdf')
ok(upJ.status === 201 && upP.status === 201, 'A uploads a photo and a PDF')
const dl = await fetch(`${BASE}/api/3dlor/files/${upJ.body.id}`, { headers: { Cookie: ca } })
const dlBytes = new Uint8Array(await dl.arrayBuffer())
ok(dl.status === 200 && dlBytes.length === JPEG.length && /attachment/.test(dl.headers.get('content-disposition') ?? ''), 'A downloads the photo (as an attachment)')
const page = await fetch(`${BASE}/3dlor/account`, { headers: { Cookie: ca } }).then(r => r.text())
ok(page.includes('Acme') && page.includes('front.jpg') && page.includes('$2,600'), 'account page shows the order, the file and the amount due today')

console.log('\nAttack: bad uploads')
ok((await upload(ca, oa.id, 'photo', new TextEncoder().encode('<svg onload=alert(1)>'), 'x.jpg', 'image/jpeg')).status === 415, 'SVG named .jpg → 415')
ok((await upload(ca, oa.id, 'photo', PDF, 'x.jpg', 'image/jpeg')).status === 415, 'PDF as a photo → 415')
ok((await upload(ca, oa.id, 'photo', new TextEncoder().encode('MZ\x90\x00'), 'x.exe', 'application/octet-stream')).status === 415, 'EXE → 415')
const big = new Uint8Array(4 * 1024 * 1024 + 10); big.set([0xff, 0xd8, 0xff])
ok((await upload(ca, oa.id, 'photo', big, 'big.jpg', 'image/jpeg')).status === 413, 'file over 4 MB → 413')
ok((await upload(ca, oa.id, 'video', JPEG, 'a.jpg', 'image/jpeg')).status === 400, 'unknown kind → 400')
ok((await upload(ca, 'not-a-uuid', 'photo', JPEG, 'a.jpg', 'image/jpeg')).status === 400, 'bad order id → 400')
const nameRow = await upload(ca, oa.id, 'photo', JPEG, '../../<script>x.jpg', 'image/jpeg')
ok(nameRow.status === 201 && nameRow.body.name === 'scriptx.jpg', 'path and HTML in a file name are stripped')

console.log('\nAttack: another customer')
const cb = await signIn(B)
await makeOrder(cb, { company: 'Other', product_name: 'Lamp L2', videos: '10', languages: 'English' })
const { order: ob } = await orderOf(B)
ok((await fetch(`${BASE}/api/3dlor/files/${upJ.body.id}`, { headers: { Cookie: cb } })).status === 404, "B cannot download A's file")
ok((await upload(cb, oa.id, 'photo', JPEG, 'x.jpg', 'image/jpeg')).status === 404, "B cannot upload into A's order")
ok((await post('/api/3dlor/checkout', cb, { order_id: oa.id })).status !== 200, "B cannot open a checkout for A's order")
ok((await post('/api/3dlor/portal', cb, { order_id: oa.id })).status !== 200, "B cannot open A's billing portal")
const pageB = await fetch(`${BASE}/3dlor/account`, { headers: { Cookie: cb } }).then(r => r.text())
ok(!pageB.includes('Acme') && !pageB.includes('front.jpg'), "B's account page shows nothing of A's")
const forged = (() => { const [body, mac] = cb.split('=')[1].split('.'); const p = JSON.parse(Buffer.from(body, 'base64url')); p.uid = uidA
  return `v3d_session=${Buffer.from(JSON.stringify(p)).toString('base64url')}.${mac}` })()
ok((await fetch(`${BASE}/api/3dlor/files/${upJ.body.id}`, { headers: { Cookie: forged } })).status === 401, "B's cookie edited to A's user id → 401")
await makeOrder(cb, { payment_status: 'paid', videos_delivered: '99', user_id: uidA, plan: 'pro', build_price_cents: '1', languages: 'English' })
const [obAfter] = await admin(`v3d_orders?select=payment_status,videos_delivered,user_id&id=eq.${ob.id}`).then(r => r.json())
ok(obAfter.payment_status === 'unpaid' && obAfter.videos_delivered === 0, 'B cannot set payment_status or progress through the form')

console.log('\nAttack: no login, other sites')
ok((await upload('', oa.id, 'photo', JPEG, 'a.jpg', 'image/jpeg')).status === 401, 'upload without login → 401')
ok((await fetch(`${BASE}/api/3dlor/files/${upJ.body.id}`)).status === 401, 'download without login → 401')
ok((await post('/api/3dlor/checkout', '', { order_id: oa.id })).status === 401, 'checkout without login → 401')
ok((await post('/api/3dlor/portal', '', { order_id: oa.id })).status === 401, 'portal without login → 401')
ok((await fetch(`${BASE}/api/3dlor/order`, { method: 'POST', headers: H, body: form(ORDER), redirect: 'manual' })).headers.get('location')?.includes('e=signin'), 'order without login → sign-in')
ok((await post('/api/3dlor/checkout', ca, { order_id: oa.id }, { Origin: 'https://evil.example' })).status === 403, 'checkout from another origin → 403')
ok((await upload(ca, oa.id, 'photo', JPEG, 'a.jpg', 'image/jpeg').then(() => fetch(`${BASE}/api/3dlor/files`, { method: 'POST', headers: { Cookie: ca }, body: form({}) }))).status === 403, 'upload with no Origin → 403')
const longF = await makeOrder(cb, { company: 'x'.repeat(5000) })
ok(longF === '/3dlor/account' || longF?.includes('e=field'), 'oversized field is refused (or no new order is made)')

console.log('\nAttack: skip payment, forged webhook')
const thanks = await fetch(`${BASE}/3dlor/account?paid=1`, { headers: { Cookie: ca } })
const [oaAfter] = await admin(`v3d_orders?select=payment_status&id=eq.${oa.id}`).then(r => r.json())
ok(thanks.status === 200 && oaAfter.payment_status === 'unpaid', 'visiting the success URL does not mark the order paid')
await admin(`v3d_orders?id=eq.${oa.id}`, { method: 'PATCH', body: JSON.stringify({ stripe_session_id: `cs_test_${run}` }) })
const event = JSON.stringify({ id: `evt_${run}`, type: 'checkout.session.completed', livemode: false, data: { object: {
  id: `cs_test_${run}`, object: 'checkout.session', payment_status: 'paid', amount_total: 220000, customer: 'cus_x', subscription: 'sub_x',
  metadata: { v3d_order_id: oa.id, v3d_trial_end: '1800000000' } } } })
const sign = (secret, t = Math.floor(Date.now() / 1000)) => `t=${t},v1=${createHmac('sha256', secret).update(`${t}.${event}`).digest('hex')}`
const hook = (sig, b = event) => fetch(`${BASE}/api/3dlor/webhook`, { method: 'POST', headers: { 'Stripe-Signature': sig, 'Content-Type': 'application/json' }, body: b })
ok((await hook('')).status === 400, 'webhook without a signature → 400')
ok((await hook(sign('whsec_attacker'))).status === 400, 'webhook signed with another secret → 400')
ok((await hook(sign(WHSEC, Math.floor(Date.now() / 1000) - 600))).status === 400, 'webhook older than 5 minutes (replay) → 400')
ok((await hook(sign(WHSEC), event.replace('"paid"', '"paid" '))).status === 400, 'body changed after signing → 400')
const [still] = await admin(`v3d_orders?select=payment_status&id=eq.${oa.id}`).then(r => r.json())
ok(still.payment_status === 'unpaid', 'after all forged webhooks the order is still unpaid')
const good = await hook(sign(WHSEC))
const [paid] = await admin(`v3d_orders?select=payment_status,stripe_customer_id,care_starts_at&id=eq.${oa.id}`).then(r => r.json())
ok(good.status === 200 && paid.payment_status === 'paid' && paid.stripe_customer_id === 'cus_x' && paid.care_starts_at?.startsWith('2027-01-15'), 'a correctly signed event marks the order paid')
const again = (await post('/api/3dlor/checkout', ca, { order_id: oa.id })).status
ok(again === 409 || (again === 503 && !process.env.STRIPE_SECRET_KEY), `a paid order cannot open a second checkout (got ${again})`)

console.log('\nRLS (direct to the database, the second layer)')
const C = `c-${run}@example.com`
await fetch(`${SB}/auth/v1/otp`, { method: 'POST', headers: { apikey: ANON, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: C, create_user: true }) })
const tok = await fetch(`${SB}/auth/v1/verify`, { method: 'POST', headers: { apikey: ANON, 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'email', email: C, token: await mailCode(C) }) }).then(r => r.json())
const asUser = (path, init = {}) => fetch(`${SB}/rest/v1/${path}`, { ...init, headers: { apikey: ANON, Authorization: `Bearer ${tok.access_token}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) } })
const asAnon = path => fetch(`${SB}/rest/v1/${path}`, { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } })
await admin('v3d_orders', { method: 'POST', body: JSON.stringify({ user_id: tok.user.id, company: 'C', contact_name: 'C', product_name: 'C-prod', topics: 't', plan: 'basic' }) })
const seen = await asUser('v3d_orders?select=company').then(r => r.json())
ok(Array.isArray(seen) && seen.length === 1 && seen[0].company === 'C', 'a customer token reads only its own order')
ok((await asUser('v3d_files?select=id').then(r => r.json())).length === 0, "a customer token reads none of the others' files")
const anon = await asAnon('v3d_orders?select=id')
ok(anon.status === 401 || anon.status === 403 || (await anon.json()).length === 0, 'anon reads nothing')
const upd = await asUser(`v3d_orders?user_id=eq.${tok.user.id}`, { method: 'PATCH', body: JSON.stringify({ payment_status: 'paid' }) })
ok(upd.status === 401 || upd.status === 403, `a customer token cannot UPDATE (got ${upd.status})`)
const ins = await asUser('v3d_orders', { method: 'POST', body: JSON.stringify({ user_id: tok.user.id, company: 'x', contact_name: 'x', product_name: 'x', topics: 'x', plan: 'pro', payment_status: 'paid' }) })
ok(ins.status === 401 || ins.status === 403, `a customer token cannot INSERT (got ${ins.status})`)
const [fileRow] = await admin(`v3d_files?select=path&order_id=eq.${oa.id}&limit=1`).then(r => r.json())
const obj = await fetch(`${SB}/storage/v1/object/v3d-uploads/${fileRow.path}`, { headers: { apikey: ANON, Authorization: `Bearer ${tok.access_token}` } })
ok(obj.status >= 400, `a customer token cannot read a stored file directly (got ${obj.status})`)
const pub = await fetch(`${SB}/storage/v1/object/public/v3d-uploads/${fileRow.path}`)
ok(pub.status >= 400, `the bucket is not public (got ${pub.status})`)

console.log('\nAttack: sign-in')
const bad = await fetch(`${BASE}/api/3dlor/auth/verify`, { method: 'POST', headers: H, body: form({ code: '123456' }), redirect: 'manual' })
ok(bad.headers.get('location')?.includes('e=expired') && !cookieOf(bad, 'v3d_session'), 'a code without the email step gets no session')
const E = `e-${run}@example.com`
const s1 = await fetch(`${BASE}/api/3dlor/auth/start`, { method: 'POST', headers: H, body: form({ email: E, next: '/3dlor/account' }), redirect: 'manual' })
const pend = cookieOf(s1, 'v3d_pending')
const tries = []
for (let i = 0; i < 6; i++) tries.push((await fetch(`${BASE}/api/3dlor/auth/verify`, { method: 'POST', headers: { ...H, Cookie: pend }, body: form({ code: String(100000 + i) }), redirect: 'manual' })).headers.get('location'))
ok(tries.slice(0, 5).every(l => l.includes('e=code')) && tries[5].includes('e=wait'), 'the 6th wrong code in 15 minutes is refused (brute force)')
const nxt = await fetch(`${BASE}/api/3dlor/auth/start`, { method: 'POST', headers: H, body: form({ email: 'bad', next: 'https://evil.example' }), redirect: 'manual' })
ok(nxt.headers.get('location')?.startsWith('/3dlor/account'), 'an outside "next" URL is not followed (no open redirect)')

console.log(fail ? '\n❌ FAILED' : '\n✅ all checks passed')
process.exit(fail)
