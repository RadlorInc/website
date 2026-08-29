#!/usr/bin/env node
// Prove the waitlist table is NOT reachable with the anon key — by trying it, against the real
// endpoint, rather than by reading the config and trusting it.
//
//   npm run check:waitlist-rls
//
// ⚠️ WHY THIS EXISTS. The table is protected by RLS being ON with NO policies, plus a REVOKE
// from anon. That is a configuration, and configurations get loosened by somebody "making the
// form work" — an INSERT policy added in the dashboard at 11pm would make the list both
// harvestable and stuffable, and nothing in the repo would change. This is the only thing that
// would notice. It is the same shape of gate as check-social.sh: follow the thing, do not
// assume it.
//
// The anon key is DESIGNED to sit in browsers, so holding it is safe. It must still never be
// exported as NEXT_PUBLIC_ here: nothing in this site should hand a Supabase key to a browser,
// because /privacy claims the browser never talks to supabase.co at all.
import { readFileSync } from 'node:fs'

// Load .env.local without a dependency. Values are never printed.
try {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#') || !t.includes('=')) continue
    const i = t.indexOf('=')
    const k = t.slice(0, i).trim()
    if (!process.env[k]) process.env[k] = t.slice(i + 1).trim()
  }
} catch {}

const URL_ = process.env.SUPABASE_URL
const ANON = process.env.SUPABASE_ANON_KEY
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!URL_ || !ANON) {
  console.error('❌ SUPABASE_URL and SUPABASE_ANON_KEY must be set (see .env.example).')
  console.error('   The anon key is the one from Settings → API Keys. It is safe to hold;')
  console.error('   it is not the service_role key and must not be NEXT_PUBLIC_ prefixed.')
  process.exit(2)
}

/**
 * ⚠️ THE TRAP THIS GUARDS AGAINST, WHICH IT FELL INTO ONCE.
 * An INVALID anon key makes every request 401 — so the three denials below all "pass" and the
 * gate goes green having proved nothing at all. That is worse than having no gate. So before
 * trusting a denial we prove the key is a real anon credential, and we assert the denials are
 * PERMISSION errors (42501 / "permission denied") rather than AUTHENTICATION errors
 * (PGRST301 / "Invalid API key" / JWT complaints).
 */
function anonKeyLooksReal(k) {
  if (k.startsWith('sb_publishable_')) return { ok: true, how: 'publishable key' }
  const parts = k.split('.')
  if (parts.length !== 3) return { ok: false, how: 'not a JWT and not sb_publishable_' }
  try {
    const p = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
    if (p.role !== 'anon') return { ok: false, how: `JWT role is "${p.role}", expected "anon"` }
    return { ok: true, how: `JWT with role=anon${p.ref ? `, ref=${p.ref}` : ''}` }
  } catch { return { ok: false, how: 'JWT payload would not decode' } }
}

const shape = anonKeyLooksReal(ANON)
if (!shape.ok) {
  console.error(`❌ SUPABASE_ANON_KEY is not a usable anon key: ${shape.how}`)
  console.error('   Refusing to run: with a bad key every request 401s and this gate would')
  console.error('   report success while proving nothing. Paste the real anon key.')
  process.exit(2)
}
console.log(`  ·   anon key checked: ${shape.how}`)

// Did the server reject the CREDENTIAL rather than the PERMISSION? If so the probe is void.
const AUTH_FAILURE = /invalid (api key|authentication)|jwt|PGRST301|PGRST302/i
async function classify(res) {
  let body = ''
  try { body = await res.text() } catch {}
  const authFailed = AUTH_FAILURE.test(body)
  return { status: res.status, body, authFailed }
}

const anonH = { apikey: ANON, Authorization: `Bearer ${ANON}` }
const svcH = SERVICE ? { apikey: SERVICE, Authorization: `Bearer ${SERVICE}` } : null
const T = `${URL_}/rest/v1/waitlist`
const CANARY = 'rls-canary@radlor-test.invalid'

let fail = 0
const ok = (good, msg) => { console.log(`  ${good ? 'ok ' : '❌ '} ${msg}`); if (!good) fail = 1 }

// A GET that returns [] proves nothing if the table is empty. Plant a row the anon key SHOULD
// NOT be able to see, so "empty" means "denied" and not "there was nothing there".
let planted = false
if (svcH) {
  const existing = await fetch(`${T}?select=id&limit=1`, { headers: svcH })
  if (existing.ok && (await existing.json()).length === 0) {
    const r = await fetch(T, {
      method: 'POST',
      headers: { ...svcH, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ email: CANARY, source: 'rls-canary' }),
    })
    planted = r.ok
    console.log(planted
      ? '  ·   planted a canary row so an empty anon read means DENIED, not "table was empty"'
      : `  ·   could not plant canary (${r.status}) — an empty anon read will be inconclusive`)
  }
} else {
  console.log('  ·   no service key: cannot plant a canary, so an empty anon read is inconclusive')
}

try {
  // 1. INSERT as anon — the stuffing attack.
  const post = await classify(await fetch(T, {
    method: 'POST',
    headers: { ...anonH, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ email: 'anon-probe@radlor-test.invalid', source: 'anon-probe' }),
  }))
  ok(post.status !== 201 && post.status !== 200 && !post.authFailed,
    `POST as anon -> ${post.status}${post.authFailed ? '  ⚠️ AUTH failure, not a permission denial — probe void' : ' (denied)'}`)

  // 2. SELECT as anon — the harvesting attack. This is the one that leaks people's emails.
  const getRes = await fetch(`${T}?select=*`, { headers: anonH })
  const get = await classify(getRes.clone())
  let rows = null
  try { rows = JSON.parse(get.body) } catch {}
  const leaked = Array.isArray(rows) && rows.length > 0
  ok(!leaked && !get.authFailed,
    `GET as anon -> ${get.status}, ${Array.isArray(rows) ? `${rows.length} row(s)` : 'denied'}${get.authFailed ? '  ⚠️ AUTH failure, not a permission denial — probe void' : ''}`)
  if (leaked) console.error('     ⚠️  ANON CAN READ SIGNUP EMAILS. Every address on the waitlist is public.')

  // 3. DELETE as anon — the destruction case.
  const del = await classify(await fetch(`${T}?email=eq.${encodeURIComponent(CANARY)}`, { method: 'DELETE', headers: anonH }))
  ok(del.status !== 200 && del.status !== 204 && !del.authFailed,
    `DELETE as anon -> ${del.status}${del.authFailed ? '  ⚠️ AUTH failure, not a permission denial — probe void' : ' (denied)'}`)

  // 4. No key at all.
  const bare = await fetch(`${T}?select=id&limit=1`)
  ok(bare.status === 401, `GET with no key -> ${bare.status} (401 expected)`)
} finally {
  if (planted && svcH) {
    const r = await fetch(`${T}?email=eq.${encodeURIComponent(CANARY)}`, { method: 'DELETE', headers: svcH })
    console.log(`  ·   canary removed (${r.status})`)
  }
  // Whatever happened, make sure an anon insert that DID succeed does not survive this run.
  if (svcH) await fetch(`${T}?source=eq.anon-probe`, { method: 'DELETE', headers: svcH })
}

console.log(fail
  ? '\n❌ THE WAITLIST TABLE IS REACHABLE WITH THE ANON KEY, or the probe was void.\n   Anyone can harvest every signup email and stuff the list. RLS is on with NO policies by\n   design and anon is REVOKEd — check whether a policy or a GRANT was added.'
  : '\n✅ anon can neither insert, read nor delete the waitlist')
process.exit(fail)
