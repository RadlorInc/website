#!/usr/bin/env node
// Look at the 3Dlor sign-up on this machine with no real email, database or payment: `npm run build`, then
//   node scripts/demo-3dlor-signup.mjs [video.mp4]   → http://localhost:3045/3dlor/signup
// An email that starts with "paid" (paid@test.com) opens a paid order on /3dlor/account: the timeline and videos to check.
// Any email works, any 6 digits are the code, everything is forgotten on exit. With a Stripe TEST key in the environment
// (node --env-file=<a local env file> scripts/…) the Pay button opens a real Stripe test checkout: card 4242 4242 4242 4242.
// A live key is refused. Stripe cannot reach a laptop, so this asks Stripe every 3 s and sends the site the signed webhook itself.
import http from 'node:http'
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { createHash, createHmac, randomBytes, randomUUID } from 'node:crypto'

const PORT = 3045, FAKE = 3998
const KEY = process.env.STRIPE_SECRET_KEY ?? ''
if (KEY && !/^(sk|rk)_test_/.test(KEY)) { console.error('Only a Stripe TEST key may be used here.'); process.exit(2) }
const HOOK = `whsec_${randomBytes(24).toString('hex')}`
const t = { v3d_orders: [], v3d_files: [], v3d_videos: [] }
const film = process.argv[2] ? readFileSync(process.argv[2]) : Buffer.alloc(0)
const uidOf = email => { const h = createHash('sha1').update(email).digest('hex'); return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}` }
const SCRIPT = '1. Put a tray below the unit. Close the cold water valve.\n2. Put the wrench around the first canister. Turn it counterclockwise.\n3. Empty the canister. Take out the old cartridge.'
function seed(uid) {
  if (t.v3d_orders.some(o => o.user_id === uid)) return
  const id = randomUUID(), ago = d => new Date(Date.now() - d * 864e5).toISOString()
  t.v3d_orders.push({ ...NEW, id, created_at: ago(6), paid_at: ago(6), payment_status: 'paid', user_id: uid, company: 'Acme', product_name: 'Water filter WF-3', plan: 'basic', videos_ordered: 5, build_price_cents: 67500, amount_paid_cents: 33750, care_status: 'trialing', care_starts_at: ago(-84) })
  t.v3d_files.push({ id: randomUUID(), order_id: id, user_id: uid, kind: 'manual', name: 'manual.pdf', size_bytes: 812000, created_at: ago(6) })
  const v = (position, title, status, more = {}) => t.v3d_videos.push({ id: randomUUID(), order_id: id, user_id: uid, position, title, status, script: null, video_path: null, final_path: null, rounds_used: 0, customer_note: null, updated_at: ago(1), ...more })
  v(1, 'Change the cartridges', 'video_review', { video_path: 'demo.mp4' }); v(2, 'First set-up', 'script_review', { script: SCRIPT }); v(3, 'Stop a leak', 'in_work')
  v(4, 'Clean the housing', 'approved', { video_path: 'demo.mp4' }); v(5, 'Yearly check', 'planned')
}
const NEW = { payment_status: 'unpaid', balance_paid: false, videos_in_work: 0, videos_delivered: 0 }

http.createServer((q, r) => {
  const parts = []
  q.on('data', d => parts.push(d)).on('end', () => {
    const u = new URL(q.url, 'http://x'), send = (s, o) => { r.writeHead(s, { 'content-type': 'application/json', 'content-range': '0-0/0' }); r.end(q.method === 'HEAD' ? undefined : JSON.stringify(o)) }
    const body = () => JSON.parse(Buffer.concat(parts).toString() || '{}')
    if (u.pathname.endsWith('/otp')) return send(200, {})
    if (u.pathname.endsWith('/verify')) { const { email } = body(); if (email.startsWith('paid')) seed(uidOf(email)); return send(200, { user: { id: uidOf(email), email } }) }
    if (u.pathname.startsWith('/storage/') && q.method === 'GET' && film.length) {
      const m = /bytes=(\d*)-(\d*)/.exec(q.headers.range ?? ''), from = m ? Number(m[1]) : 0, to = m && m[2] ? Number(m[2]) : film.length - 1
      r.writeHead(m ? 206 : 200, { 'content-type': 'video/mp4', 'content-length': to - from + 1, ...(m ? { 'content-range': `bytes ${from}-${to}/${film.length}` } : {}) })
      return r.end(film.subarray(from, to + 1))
    }
    if (u.pathname.startsWith('/storage/')) return send(200, {})
    const rows = t[u.pathname.split('/').pop()]
    if (!rows) return send(404, {})
    if (q.method === 'POST') { const row = { id: randomUUID(), created_at: new Date().toISOString(), ...NEW, ...body() }; rows.push(row); return send(201, [row]) }
    const want = [...u.searchParams].filter(([, v]) => v.startsWith('eq.'))
    const hit = rows.filter(x => want.every(([k, v]) => String(x[k]) === v.slice(3)))
    if (q.method === 'PATCH') { const set = body(); for (const x of hit) Object.assign(x, set, { updated_at: new Date().toISOString() }) }
    send(200, hit)
  })
}).listen(FAKE, '127.0.0.1')

const next = spawn('npx', ['next', 'start', '-p', String(PORT), '-H', '127.0.0.1'], { stdio: 'inherit', env: { ...process.env,
  SUPABASE_URL: `http://127.0.0.1:${FAKE}`, SUPABASE_SERVICE_ROLE_KEY: 'demo', SUPABASE_ANON_KEY: 'demo', V3D_SESSION_SECRET: randomBytes(32).toString('hex'),
  STRIPE_SECRET_KEY: KEY || 'demo', STRIPE_WEBHOOK_SECRET: HOOK } })
if (KEY) setInterval(async () => {
  for (const o of t.v3d_orders.filter(o => o.stripe_session_id && o.payment_status === 'unpaid')) {
    const object = await fetch(`https://api.stripe.com/v1/checkout/sessions/${o.stripe_session_id}`, { headers: { Authorization: `Bearer ${KEY}` } }).then(r => r.json()).catch(() => null)
    if (object?.payment_status !== 'paid') continue
    const body = JSON.stringify({ id: `evt_${randomUUID()}`, type: 'checkout.session.completed', livemode: false, data: { object } })
    const at = Math.floor(Date.now() / 1000)
    await fetch(`http://127.0.0.1:${PORT}/api/3dlor/webhook`, { method: 'POST', body, headers: { 'Content-Type': 'application/json', 'Stripe-Signature': `t=${at},v1=${createHmac('sha256', HOOK).update(`${at}.${body}`).digest('hex')}` } }).catch(() => {})
  }
}, 3000)
for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => { next.kill(); process.exit() })
next.on('exit', c => process.exit(c ?? 0))
