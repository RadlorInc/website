// Unit tests for the 3D video sign-up logic. Run: npm run test:3d
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { sign, verify, readCookie } from './session.ts'
import { formEncode, verifyWebhook, addMonthsSec, isLiveKey, checkoutParams } from './stripe.ts'
import { parseOrder, sniffMime, cleanName, isEmail } from './validate.ts'
import { PLANS, depositCents, balanceCents } from './plans.ts'

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
  const c = checkoutParams({ orderId: 'o1', uid: 'u1', email: 'a@b.co', plan: 'growth', site: 'http://x', today: new Date('2026-11-22T00:00:00Z') })
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

test('plans: halves add up, no fractions of a cent', () => {
  for (const k of ['basic', 'growth', 'pro'] as const) {
    assert.equal(depositCents(k) + balanceCents(k), PLANS[k].buildCents)
    assert.ok(Number.isInteger(depositCents(k)))
  }
})

const good = () => {
  const f = new FormData()
  for (const [k, v] of Object.entries({ plan: 'basic', terms: 'yes', company: 'Acme', contact_name: 'Sam', product_name: 'Kettle', topics: 'Descale' })) f.set(k, v)
  return f
}

test('order form: accepts good input, refuses bad', () => {
  assert.ok(parseOrder(good()).ok)
  const cases: [string, string, string][] = [
    ['plan', 'enterprise', 'plan'], ['terms', '', 'terms'], ['company', '', 'company'],
    ['company', 'x'.repeat(201), 'company'], ['website', 'javascript:alert(1)', 'website'],
    ['product_url', 'ftp://x.y', 'product_url'], ['product_name', 'a\u0000b', 'product_name'],
    ['languages', 'English, Spanish', 'languages'],
  ]
  for (const [k, v, err] of cases) {
    const f = good()
    f.set(k, v)
    const r = parseOrder(f)
    assert.ok(!r.ok && r.error === err, `${k}=${v}`)
  }
  const f = good()
  f.set('plan', 'growth')
  f.set('languages', 'English, Spanish')
  assert.ok(parseOrder(f).ok)
  // Fields the customer must not set are not in the output.
  f.set('payment_status', 'paid')
  f.set('videos_delivered', '99')
  const r = parseOrder(f)
  assert.ok(r.ok && !('payment_status' in r.data) && !('videos_delivered' in r.data))
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
