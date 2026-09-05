#!/usr/bin/env node
// Every migration production has run must exist as a FILE in a repository.
//
//   npm run check:migrations                       # reads the ledger over PostgREST
//   npm run check:migrations -- --ledger led.json   # or from a file you exported
//
// ⚠️ THE DEFECT THIS EXISTS FOR, WHICH WENT UNNOTICED FOR FOUR DAYS. On 2026-09-01 the migration
// that took `service_role` out of the public `/api/waitlist` endpoint was applied directly to the
// `ghuvnq` project and its file was committed to NO repository. The change existed, worked, and was
// unreproducible: the only copy of a security fix was a row in `supabase_migrations.schema_migrations`
// in the database it had already modified. A `db reset` would have come back without it — and with
// the previous migration's "RLS is on, deliberately no policies, do not add one" comment intact,
// which is the instruction that would then have been obeyed.
//
// That is a PROVENANCE failure, not a migration failure, and it is exactly machine-detectable: a
// ledger row with no file anywhere. This is the gate. It does not care who owns which directory —
// which is the point, because it keeps working through whatever ownership is chosen later.
//
// ⚠️ THREE CODEBASES WRITE TO THIS ONE DATABASE. `radlor-site` (public, this repo), the private
// `RadlorInc/video-reviewer`, and anything applied by hand in the SQL editor. Versions belonging to
// a sibling repo are ENUMERATED below by name rather than pattern-matched — the same
// enumerate-the-exceptions discipline as the `SECURITY DEFINER` drift gate in the app repo. A
// regex over "looks like a review thing" would absorb the next orphan silently, which is the
// failure being gated against.
import { readFileSync } from 'node:fs'

try {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#') || !t.includes('=')) continue
    const i = t.indexOf('=')
    const k = t.slice(0, i).trim()
    if (!process.env[k]) process.env[k] = t.slice(i + 1).trim()
  }
} catch {}

/**
 * ⚠️ EVERY ENTRY IS A CLAIM SOMEBODY MADE, NOT A PATTERN. Each version here is asserted to live in
 * the named repository. When one is added, OPEN THAT REPO AND LOOK — an unverified row here is the
 * same defect as the orphan it is meant to excuse, just written down.
 *
 * Verified 2026-09-05 against the ledger: these are the migrations applied to `ghuvnq` through the
 * Supabase MCP connector from the private tool repo.
 *
 * ⚠️ VERSIONS ONLY — THE MIGRATION NAMES ARE DELIBERATELY NOT HERE, AND MUST NOT BE ADDED.
 * **This repository is public.** The sibling repo is private, and its migration names are its
 * schema-evolution history: what it stores, what it grants, what it revoked and when. That is the
 * exact thing this project refused to publish when it declined to expose `supabase_migrations`
 * over PostgREST — declining it there and then committing it here would be the same disclosure
 * through a different door. The version stamp is all this gate needs: it maps a ledger row to an
 * owner, and a human verifying an entry looks the version up in that repo, where it is not secret.
 */
const REVIEWER = 'RadlorInc/video-reviewer (private)'

const SIBLING_OWNED = {
  '20260831165802': REVIEWER,
  '20260831165817': REVIEWER,
  '20260831170000': REVIEWER,
  '20260831175539': REVIEWER,
  '20260831180004': REVIEWER,
  '20260831183104': REVIEWER,
  '20260831185055': REVIEWER,
  '20260831191651': REVIEWER,
  '20260901060236': REVIEWER,
  '20260901094545': REVIEWER,
  '20260901100652': REVIEWER,
  '20260901135817': REVIEWER,
  '20260901135925': REVIEWER,
  '20260901143556': REVIEWER,
  '20260901150933': REVIEWER,
  '20260903185815': REVIEWER,
}

const LEDGER_SQL =
  "select version, name from supabase_migrations.schema_migrations order by version;"

/**
 * The ledger lives in the `supabase_migrations` schema, which PostgREST does NOT expose by default
 * (only public, graphql_public and review are). Two ways in, and NEITHER of them may end in a green
 * run when the ledger could not be read — a provenance gate that cannot see the ledger reports
 * exactly the state it exists to catch.
 *
 * ⚠️ AND THERE IS A THIRD WAY THAT WAS DELIBERATELY NOT TAKEN: a Supabase Management API personal
 * access token. It would need no production change, but a PAT reaches the WHOLE ACCOUNT — every
 * project, including the app's production database with children's data in it — so putting one in
 * a developer's `.env.local` to check a list of filenames trades a much larger exposure than the
 * one being detected. See CLAUDE.md: a gate is not worth a capability more dangerous than what it
 * detects. Exposing `supabase_migrations` read-only is the smaller change, and it is the founder's
 * to make, not this script's.
 */
async function readLedger() {
  const argIdx = process.argv.indexOf('--ledger')
  if (argIdx !== -1 && process.argv[argIdx + 1]) {
    const path = process.argv[argIdx + 1]
    return { rows: JSON.parse(readFileSync(path, 'utf8')), how: `file ${path}` }
  }
  const URL_ = process.env.SUPABASE_URL
  const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!URL_ || !SERVICE) return { rows: null, how: 'no SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY' }
  const res = await fetch(`${URL_}/rest/v1/schema_migrations?select=version,name&order=version`, {
    headers: {
      apikey: SERVICE, Authorization: `Bearer ${SERVICE}`,
      'Accept-Profile': 'supabase_migrations',
    },
  }).catch(() => null)
  if (!res || !res.ok) {
    const body = res ? await res.text().catch(() => '') : 'request failed'
    return { rows: null, how: `PostgREST refused (${res?.status ?? '-'}): ${body.slice(0, 120)}` }
  }
  return { rows: await res.json(), how: 'PostgREST' }
}

const { rows: ledger, how } = await readLedger()

if (!ledger) {
  console.error(`❌ Could not read the migration ledger — ${how}`)
  console.error('')
  console.error('   The `supabase_migrations` schema is not exposed over PostgREST by default.')
  console.error('   Either export it once and pass the file:')
  console.error('')
  console.error(`     ${LEDGER_SQL}`)
  console.error('     (Supabase SQL editor → copy the JSON result)')
  console.error('     npm run check:migrations -- --ledger ledger.json')
  console.error('')
  console.error('   ...or expose the schema read-only so this runs unattended. That is a')
  console.error('   production change and a decision, not something this script should make.')
  console.error('')
  console.error('   Exiting 2 — NOT 0. A provenance gate that cannot see the ledger is reporting')
  console.error('   the exact condition it exists to detect.')
  process.exit(2)
}

let fail = 0
const ok = (good, msg) => { console.log(`  ${good ? 'ok ' : '❌ '} ${msg}`); if (!good) fail = 1 }

// Files in THIS repo, keyed by the leading version stamp.
const { readdirSync } = await import('node:fs')
const ours = new Map()
for (const f of readdirSync('supabase/migrations')) {
  const v = /^(\d+)_/.exec(f)?.[1]
  if (v) ours.set(v, f)
}

console.log(`  ·   ledger read via ${how}: ${ledger.length} row(s); ${ours.size} file(s) in this repo`)

/**
 * ⚠️ THE POSITIVE CONTROL. Every assertion below is "this row was accounted for", and a ledger that
 * failed to parse, or arrived empty, or lost its `version` field would account for nothing and
 * still print no failures. So first prove the two sides can actually meet: at least one ledger row
 * must resolve to a file in THIS repo. If none does, the comparison is not happening.
 */
const matchedHere = ledger.filter(r => ours.has(String(r.version)))
ok(matchedHere.length > 0,
  `positive control: ${matchedHere.length} ledger row(s) resolve to a file here — the two sides meet`)
if (!matchedHere.length) {
  /**
   * ⚠️ THE VOID MESSAGE HAS TO BE ACTIONABLE, BECAUSE IN A REPO THAT OWNS FEW FILES THIS IS THE
   * BRANCH A REAL DELETION LANDS IN. With zero matches the script genuinely cannot tell "somebody
   * removed the file" from "the ledger arrived malformed" — that ambiguity is why it refuses to
   * report an orphan count it cannot trust. But it CAN say which rows it failed to resolve, and
   * that list is the answer in both cases. Watched: with the only owned file moved away, this
   * branch names `20260901071510_waitlist_anon_narrow_insert`.
   */
  const unresolved = ledger
    .filter(r => !SIBLING_OWNED[String(r.version)])
    .map(r => `${r.version}_${r.name ?? '(unnamed)'}`)
  console.error('\n❌ PROBE VOID: no ledger row matched any local file, so the orphan count cannot')
  console.error('   be trusted. Either the ledger is malformed, or every file this repo owns is')
  console.error('   gone. Rows with no file here and no named sibling owner:')
  for (const u of unresolved.length ? unresolved : ['(none — the ledger itself looks wrong)']) {
    console.error(`     ${u}`)
  }
  process.exit(1)
}

// THE ASSERTION. A row with no file in this repo and no named sibling owner is an orphan.
const orphans = []
for (const row of ledger) {
  const v = String(row.version)
  if (ours.has(v) || SIBLING_OWNED[v]) continue
  orphans.push(`${v}_${row.name ?? '(unnamed)'}`)
}
ok(orphans.length === 0,
  orphans.length
    ? `⚠️ ${orphans.length} MIGRATION(S) IN PRODUCTION WITH NO FILE IN ANY REPO:\n       ${orphans.join('\n       ')}`
    : 'every ledger row has a file here or a named owner in a sibling repo')

// A named owner that is ALSO here means the enumeration went stale in the other direction.
const doubleClaimed = Object.keys(SIBLING_OWNED).filter(v => ours.has(v))
ok(doubleClaimed.length === 0,
  doubleClaimed.length
    ? `⚠️ claimed by a sibling repo but present here too: ${doubleClaimed.join(', ')}`
    : 'no version is both claimed by a sibling and committed here')

/**
 * The mirror defect, reported but NOT failing: a file here with no ledger row. That is the known
 * 2026-08-30 state — `20260830000000_waitlist.sql` was pasted into the SQL editor before this
 * project had any history, so it is applied but unrecorded. It is documented in handoff.md and is
 * why `supabase db push` must not be run from this repo. It becomes a failure the day somebody
 * backfills the ledger; until then, shouting about it every run is how a gate gets ignored.
 */
const unrecorded = [...ours.entries()].filter(([v]) => !ledger.some(r => String(r.version) === v))
if (unrecorded.length) {
  console.log(`  ·   ${unrecorded.length} file(s) applied but NOT in the ledger (known, see handoff.md):`)
  for (const [, f] of unrecorded) console.log(`      ${f}`)
}

console.log(fail
  ? '\n❌ A MIGRATION EXISTS IN PRODUCTION THAT EXISTS IN NO REPOSITORY.\n   That change is unreproducible: a rebuilt database comes back without it. Recover the SQL\n   from the ledger row (`select statements from supabase_migrations.schema_migrations where\n   version = ...`) and commit it to whichever repo owns it, before anything else.'
  : '\n✅ every migration production has run exists as a file in a named repository')
process.exit(fail)
