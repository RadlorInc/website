// Unit tests for the 3D video sign-up logic. Run: npm run test:3d
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { sign, verify, readCookie } from './session.ts'
import { formEncode, verifyWebhook, addMonthsSec, isLiveKey, checkoutParams } from './stripe.ts'
import { decide, timeline, type Video } from './track.ts'
import { parseDetails, parseOrder, sniffMime, cleanName, isEmail } from './validate.ts'
import { CARE, balanceCents, cheaperAt, depositCents, quote } from './plans.ts'

const SECRET = 'x'.repeat(40)

test('session: round trip, tamper, wrong secret, expiry', () => {
  const t = sign({ uid: 'u1', email: 'a@b.co', exp: Date.now() + 1000 }, SECRET)
  assert.equal(verify<{ uid: string; exp: number }>(t, SECRET)?.uid, 'u1')
  const [body, mac] = t.split('.')
  const forged = Buffer.from(JSON.stringify({ uid: 'u2', email: 'a@b.co', exp: Date.now() + 1000 })).toString('base64url')
  assert.equal(verify(`${forged}.${mac}`, SECRET), null)
  assert.equal(verify(t, 'y'.repeat(40)), null)
  assert.equal(verify(`${body}.${mac}.x`, SECRET), null)
  assert.equal(verify(sign({ exp: Date.now() - 1 }, SECRET), SECRET), null)
  assert.equal(verify(t, ''), null)
  assert.equal(verify(undefined, SECRET), null)
})

test('readCookie picks the exact name', () => {
  assert.equal(readCookie('a=1; v3d_session=abc.def; b=2', 'v3d_session'), 'abc.def')
  assert.equal(readCookie('xv3d_session=bad', 'v3d_session'), undefined)
})

test('stripe form encoding nests like Stripe expects', () => {
  const s = formEncode({ mode: 'subscription', line_items: [{ quantity: 1, price_data: { unit_amount: 900, recurring: { interval: 'month' } } }], skip: undefined })
  assert.equal(decodeURIComponent(s),
    'mode=subscription&line_items[0][quantity]=1&line_items[0][price_data][unit_amount]=900&line_items[0][price_data][recurring][interval]=month')
})

test('webhook signature: good, bad, old, missing', () => {
  const body = JSON.stringify({ id: 'evt_1', type: 'x', livemode: false, data: { object: {} } })
  const now = 1_800_000_000
  const sig = (t: number, b = body, s = 'whsec_test') => `t=${t},v1=${createHmac('sha256', s).update(`${t}.${b}`).digest('hex')}`
  assert.equal(verifyWebhook(body, sig(now), 'whsec_test', now)?.id, 'evt_1')
  assert.equal(verifyWebhook(body, `${sig(now)},v1=00`, 'whsec_test', now)?.id, 'evt_1')
  assert.equal(verifyWebhook(body, sig(now, body, 'whsec_other'), 'whsec_test', now), null)
  assert.equal(verifyWebhook(body + ' ', sig(now), 'whsec_test', now), null)
  assert.equal(verifyWebhook(body, sig(now - 301), 'whsec_test', now), null)
  assert.equal(verifyWebhook(body, null, 'whsec_test', now), null)
  assert.equal(verifyWebhook(body, sig(now), undefined, now), null)
  assert.equal(verifyWebhook(body, 't=abc,v1=00', 'whsec_test', now), null)
})

test('trial end is 3 calendar months on', () => {
  assert.equal(new Date(addMonthsSec(new Date('2026-11-22T00:00:00Z'), 3) * 1000).toISOString(), '2027-02-22T00:00:00.000Z')
})

test('checkout: half the build today, care plan after the free months, our metadata on both', () => {
  const c = checkoutParams({ orderId: 'o1', uid: 'u1', email: 'a@b.co', plan: 'growth', videos: 40, buildCents: 440000, site: 'http://x', today: new Date('2026-11-22T00:00:00Z') })
  assert.equal(c.mode, 'subscription')
  assert.equal(c.line_items[0].price_data.unit_amount, 220000)
  assert.ok(!('recurring' in c.line_items[0].price_data))
  assert.equal(c.line_items[1].price_data.unit_amount, 39900)
  assert.deepEqual(c.line_items[1].price_data.recurring, { interval: 'month' })
  assert.equal(c.subscription_data.trial_end, Date.parse('2027-02-22T00:00:00Z') / 1000)
  assert.equal(c.metadata.v3d_order_id, 'o1')
  assert.equal(c.subscription_data.metadata.v3d_order_id, 'o1')
  assert.ok(!/interest|late fee/i.test(JSON.stringify(c.line_items)))
  assert.match(c.custom_text.after_submit.message, /do not press Back/)
})

test('live keys are recognised', () => {
  assert.ok(isLiveKey('sk_live_abc') && isLiveKey('rk_live_abc'))
  assert.ok(!isLiveKey('sk_test_abc'))
})

test('quote: the examples in PITCH-POINTS', () => {
  const total = (videos: number, products: number, languages = 1) => quote({ videos, products, languages }).buildCents / 100
  assert.deepEqual([total(3, 1), total(10, 1), total(10, 2), total(15, 1), total(40, 3), total(40, 5), total(100, 8)], [450, 1350, 1550, 1800, 4400, 4800, 9500])
  assert.equal(total(10, 1, 3), 1350 + 2 * 10 * 20)
  assert.deepEqual([quote({ videos: 39, products: 1, languages: 1 }).plan, quote({ videos: 40, products: 1, languages: 1 }).plan, quote({ videos: 100, products: 1, languages: 1 }).plan], ['basic', 'growth', 'pro'])
  assert.equal(CARE.basic.cents, 14900)
})

test('quote: halves add up, no fractions of a cent, and a dearer small order is named', () => {
  for (let videos = 3; videos <= 400; videos++) {
    const { buildCents } = quote({ videos, products: 3, languages: 2 })
    assert.equal(depositCents(buildCents) + balanceCents(buildCents), buildCents)
    assert.ok(Number.isInteger(depositCents(buildCents)) && buildCents > 0)
  }
  assert.equal(cheaperAt({ videos: 14, products: 1, languages: 1 }), 15)
  assert.equal(cheaperAt({ videos: 39, products: 1, languages: 1 }), 40)
  assert.equal(cheaperAt({ videos: 10, products: 1, languages: 1 }), null)
  assert.equal(cheaperAt({ videos: 100, products: 1, languages: 1 }), null)
})

const good = () => {
  const f = new FormData()
  for (const [k, v] of Object.entries({ videos: '10', products: '1', company: 'Acme', contact_name: 'Sam' })) f.set(k, v)
  return f
}

test('order form: accepts good input, refuses bad', () => {
  assert.ok(parseOrder(good()).ok)
  const cases: [string, string, string][] = [
    ['videos', '2', 'videos'], ['videos', '99999999', 'videos'], ['videos', '9999999', 'videos'], ['videos', '-5', 'videos'], ['videos', '5.5', 'videos'], ['videos', '1e2', 'videos'], ['videos', '', 'videos'],
    ['products', '0', 'products'], ['products', '9999999', 'videos'], ['company', '', 'company'],
    ['company', 'x'.repeat(201), 'company'], ['contact_name', 'a\u0000b', 'contact_name'],
    ['languages', ', ,', 'languages'],
  ]
  for (const [k, v, err] of cases) {
    const f = good()
    f.set(k, v)
    const r = parseOrder(f)
    assert.ok(!r.ok && r.error === err, `${k}=${v}`)
  }
  for (const v of ['301', '5000']) { const g = good(); g.set('videos', v); assert.ok(parseOrder(g).ok, `no limit: ${v}`) }
  const f = good()
  f.set('languages', 'English, Spanish')
  assert.ok(parseOrder(f).ok)
  // Fields the customer must not set are not in the output.
  f.set('payment_status', 'paid')
  f.set('build_price_cents', '1')
  f.set('plan', 'pro')
  f.set('videos_delivered', '99')
  const r = parseOrder(f)
  assert.ok(r.ok && !('payment_status' in r.data) && !('videos_delivered' in r.data) && !('build_price_cents' in r.data) && !('plan' in r.data))
  assert.ok(r.ok && r.size.languages === 2 && r.size.videos === 10)
})

test('file type comes from the bytes', () => {
  assert.equal(sniffMime(new Uint8Array([0xff, 0xd8, 0xff, 0xe0])), 'image/jpeg')
  assert.equal(sniffMime(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), 'image/png')
  assert.equal(sniffMime(new TextEncoder().encode('RIFF\0\0\0\0WEBPVP8 ')), 'image/webp')
  assert.equal(sniffMime(new TextEncoder().encode('%PDF-1.7')), 'application/pdf')
  assert.equal(sniffMime(new TextEncoder().encode('<svg onload=alert(1)>')), null)
  assert.equal(sniffMime(new TextEncoder().encode('<html>')), null)
  assert.equal(sniffMime(new Uint8Array([])), null)
})

test('file names and emails', () => {
  assert.equal(cleanName('../../etc/passwd'), 'passwd')
  assert.equal(cleanName('C:\\x\\a"<b>.pdf'), 'ab.pdf')
  assert.equal(cleanName(''), 'file')
  assert.ok(isEmail('a@b.co') && !isEmail('a@b') && !isEmail(`${'a'.repeat(250)}@b.co`))
})

test('a customer can only answer a video that waits for them, with two change rounds', () => {
  assert.equal(decide({ status: 'script_review', rounds_used: 0 }, 'approve')?.status, 'in_work')
  assert.equal(decide({ status: 'script_review', rounds_used: 0 }, 'change')?.status, 'script_changes')
  assert.equal(decide({ status: 'video_review', rounds_used: 2 }, 'approve')?.status, 'approved')
  assert.deepEqual(decide({ status: 'video_review', rounds_used: 1 }, 'change'), { status: 'video_changes', rounds_used: 2 })
  assert.equal(decide({ status: 'video_review', rounds_used: 2 }, 'change'), null)
  for (const status of ['planned', 'script_changes', 'in_work', 'video_changes', 'approved'] as const) assert.equal(decide({ status, rounds_used: 0 }, 'approve'), null)
  assert.equal(decide({ status: 'video_review', rounds_used: 0 }, 'paid'), null)
})

test('timeline follows the rows', () => {
  const o = { created_at: '2026-11-24T00:00:00Z', paid_at: '2026-11-24T01:00:00Z', balance_paid: false, videos_ordered: 2 }
  const v = (status: Video['status']): Video => ({ id: status, order_id: 'o', position: 0, title: 't', status, script: null, video_path: null, final_path: null, rounds_used: 0, customer_note: null, updated_at: '2026-11-25T00:00:00Z' })
  const now = (videos: Video[], manual = true, paid = false) => timeline({ ...o, balance_paid: paid }, videos, manual).filter(s => s.state === 'now').map(s => s.title)
  assert.deepEqual(now([]), ['We read your manual'])
  assert.equal(timeline(o, [], false)[2].you, true)
  assert.deepEqual(now([v('script_review'), v('planned')]), ['You approve the scripts'])
  assert.deepEqual(now([v('in_work'), v('video_review')]), ['We make the videos', 'You check the videos'])
  assert.deepEqual(now([v('approved')]), ['You approve the scripts']) // one of two ordered: the second is not planned yet
  assert.deepEqual(now([v('approved'), v('approved')]), ['Second half paid'])
  assert.deepEqual(now([v('approved'), v('approved')], true, true), [])
})

test('details: optional, checked, and only these columns', () => {
  const f = new FormData()
  assert.deepEqual(parseDetails(f), { ok: true, data: { product_name: null, product_url: null, files_link: null, website: null, phone: null } })
  for (const [k, v] of [['website', 'javascript:alert(1)'], ['files_link', 'ftp://x.y'], ['product_name', 'a\u0000b'], ['phone', '1'.repeat(41)]]) {
    const g = new FormData()
    g.set(k, v)
    const r = parseDetails(g)
    assert.ok(!r.ok && r.error === k, k)
  }
  f.set('payment_status', 'paid')
  f.set('build_price_cents', '1')
  const r = parseDetails(f)
  assert.ok(r.ok && !('payment_status' in r.data) && !('build_price_cents' in r.data))
})
