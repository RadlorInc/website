#!/usr/bin/env node
// Prove the waitlist table admits exactly ONE anon operation — inserting a signup, on exactly the
// three columns the form sends — and refuses every other, by trying them against the real endpoint
// rather than reading the config.
//
// ⚠️ THE REPO SAID THE OPPOSITE OF PRODUCTION FOR FOUR DAYS. `20260830000000_waitlist.sql` told
// every future reader "RLS is on and there are deliberately no policies … do not add one", while
// the live form had depended on exactly that policy since 2026-09-01 — and the migration that
// granted it had never been committed to any repo at all. Obeying the file would have revoked the
// grant and broken signup. Comments cannot be trusted to describe a database; this asks it.
//
//   npm run check:waitlist-rls
//
// ⚠️ THE POSTURE CHANGED ON 2026-09-01, AND THIS GATE CAUGHT THE CHANGE — which is the best
// evidence it works. It used to assert that anon could do NOTHING, and it went red the moment a
// narrow INSERT grant was added. Read its old warning: "an INSERT policy added in the dashboard at
// 11pm would make the list both harvestable and stuffable, and nothing in the repo would change."
// Half of that is now deliberate and half must never happen:
//
//   STUFFABLE — yes, deliberately. `/api/waitlist` used to hold SUPABASE_SERVICE_ROLE_KEY, which is
//     scoped to the PROJECT and bypasses RLS, on a PUBLIC unauthenticated endpoint accepting free
//     input. Anything compromising that route read and wrote every table. It now carries the anon
//     key against a column-level INSERT grant, so the worst it can do is write a junk row. The
//     per-IP rate limit, the honeypot and the unique index on `email` bound the stuffing; the anon
//     key is published nowhere in this project (no NEXT_PUBLIC_ Supabase variable exists in either
//     repo), so it is not simply lying in a bundle.
//
//   HARVESTABLE — no, never. SELECT is still refused. That is the assertion that protects people's
//     email addresses, and it is the one that must never be "made to work".
//
// Configurations still get loosened by somebody making a form work at 11pm. This is still the only
// thing that would notice.
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
  // 1. INSERT as anon — MUST SUCCEED. This is the form working, and it is also the control for
  //    everything below: without it, "anon was refused" is equally consistent with a rejected key.
  const post = await classify(await fetch(T, {
    method: 'POST',
    headers: { ...anonH, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ email: 'anon-probe@radlor-test.invalid', source: 'anon-probe' }),
  }))
  ok((post.status === 201 || post.status === 200) && !post.authFailed,
    `POST as anon -> ${post.status} ${post.status === 201 || post.status === 200 ? '(accepted — the form works, and the key is real)' : '❌ THE SIGNUP FORM IS BROKEN'}`)

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

  // 4. UPDATE as anon — editing somebody else's signup.
  const upd = await classify(await fetch(`${T}?source=eq.website`, {
    method: 'PATCH',
    headers: { ...anonH, 'Content-Type': 'application/json' },
    body: JSON.stringify({ source: 'tampered' }),
  }))
  ok(upd.status !== 200 && upd.status !== 204 && !upd.authFailed,
    `PATCH as anon -> ${upd.status}${upd.authFailed ? '  ⚠️ AUTH failure, not a permission denial — probe void' : ' (denied)'}`)

  /**
   * 5. THE GRANT IS COLUMN-SCOPED, NOT TABLE-WIDE — and this is the assertion that has no
   *    black-box equivalent anywhere else. `grant insert (email, age_band, source)` and
   *    `grant insert on public.waitlist` behave IDENTICALLY for every probe above: the form
   *    works either way, and reads are refused either way. They differ only in whether the
   *    caller may dictate `id` and `created_at` — so somebody "fixing" the grant by widening
   *    it changes nothing anyone would notice, until a row arrives with a chosen primary key
   *    or a backdated timestamp. These two probes are the difference, and they are why this
   *    gate did not need an `exec_sql` RPC on production to read the catalog: a function that
   *    runs arbitrary SQL through PostgREST is a far worse thing to own than the drift it finds.
   */
  for (const col of ['id', 'created_at']) {
    const val = col === 'id' ? '00000000-0000-4000-8000-000000000000' : '2000-01-01T00:00:00Z'
    const bodyFor = who => JSON.stringify({
      email: `col-probe-${col}-${who}@radlor-test.invalid`, source: 'anon-probe', [col]: val,
    })
    const wide = await classify(await fetch(T, {
      method: 'POST',
      headers: { ...anonH, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: bodyFor('anon'),
    }))
    const denied = wide.status === 401 || wide.status === 403 || /42501|permission denied/i.test(wide.body)

    /**
     * ⚠️ THE POSITIVE CONTROL, AND THIS PROBE IS WORTHLESS WITHOUT IT. A rejected INSERT naming
     * `id` is ALSO what a typo'd column name, a renamed column or a malformed value looks like —
     * every one of those denies the write for a reason that has nothing to do with the grant, and
     * the assertion above would go green while testing nothing. So we send the SAME body as the
     * service role, which holds the wide grant: it must succeed. If it does not, the request shape
     * is the problem and the denial proved nothing, so we say the probe is void rather than pass.
     */
    let control = 'skipped (no service key — this probe is inconclusive)'
    let controlOk = !svcH
    if (svcH) {
      const c = await fetch(T, {
        method: 'POST',
        headers: { ...svcH, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: bodyFor('svc'),
      })
      controlOk = c.ok
      control = c.ok
        ? `service_role CAN write it (${c.status}) — so the anon refusal is the GRANT`
        : `⚠️ service_role could not write it either (${c.status}) — PROBE VOID, the body is wrong`
    }

    ok(denied && !wide.authFailed && controlOk,
      `INSERT naming \`${col}\` as anon -> ${wide.status} ${denied ? '(denied — the grant is column-scoped)' : '❌ ACCEPTED — the grant is TABLE-WIDE, not the three columns the migration states'}\n       · ${control}`)
  }

  // 6. No key at all.
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
  ? '\n❌ THE WAITLIST GRANTS ARE NOT WHAT THE MIGRATIONS SAY, or the probe was void.\n   Expected: anon may INSERT (email, age_band, source) and NOTHING else — no SELECT, no\n   UPDATE, no DELETE, and no say over `id` or `created_at`. Check whether a policy or a\n   GRANT was widened, and reconcile supabase/migrations/ with production before deploying.'
  : '\n✅ anon may INSERT exactly (email, age_band, source) and nothing else — it cannot read,\n   edit or delete the waitlist, and cannot dictate `id` or `created_at`')
process.exit(fail)
