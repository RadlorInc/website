#!/usr/bin/env node
// Hold the site to the claims it makes about itself, against the LIVE deployment.
//
//   npm run check:site-claims                  # https://radlor.com
//   npm run check:site-claims http://localhost:3021
//
// ⚠️ WHY THIS EXISTS: THE CLAIM CAN GO FALSE WITH NO DIFF. /privacy and /terms both state that this
// site runs no analytics, sets no cookies and loads nothing from a third party. Every other gate in
// this repo watches the repo — and Vercel Web Analytics is a DASHBOARD TOGGLE. Flipping it injects
// a script into every page while `git status` stays clean, and the two pages that promise otherwise
// keep serving unchanged. A reviewer diffing a pull request would never see it. So this check does
// not read the repo at all: it loads the deployed pages and looks at what they actually serve.
//
// It is the same rule /privacy has always carried in a comment ("if you add ANYTHING that talks to
// another origin, this page is wrong and has to change in the same commit"), moved from a comment
// nobody executes into something that fails.
const BASE = (process.argv[2] ?? 'https://radlor.com').replace(/\/$/, '')

// The pages that make the claim, plus the form page — historically the most likely place for a
// third party to arrive (a CAPTCHA, an embed, a browser-side database client).
// /radlic since 2026-09-25: the Radlic landing page, the one page here with a script of its own (the demo player).
const PAGES = ['/', '/privacy', '/terms', '/waitlist', '/radlic']

/**
 * ⚠️ THREE STATES, THREE EXIT CODES: 2 "could not look", 1 "looked and found a defect", 0 "looked
 * and it was clean". A page that would not load is NOT evidence of a violation and must not be
 * reported as one — it is the check being blind, and a reader who cannot tell those apart will
 * eventually treat a real finding as an outage. See CLAUDE.md.
 */
let fail = 0
let blind = 0
const ok = (good, msg) => { console.log(`  ${good ? 'ok ' : '❌ '} ${msg}`); if (!good) fail = 1 }
const cannotSee = msg => { console.log(`  ⚠️  ${msg}`); blind = 1 }

/**
 * Cross-origin URLs on elements that actually CAUSE THE BROWSER TO FETCH SOMETHING.
 *
 * ⚠️ `<link>` IS FILTERED BY `rel`, AND THAT IS NOT A DETAIL. A naive "any absolute href" sweep
 * flags `<link rel="canonical" href="https://radlor.com/…">` on every local run, because
 * `metadataBase` makes canonicals absolute while the dev origin is localhost. Canonical, alternate
 * and og:* are ASSERTIONS ABOUT a URL, not loads of it — no request is made, no third party learns
 * anything, and treating them as violations trains everyone to ignore this gate. Only rels that
 * fetch count.
 */
const FETCHING_REL = /\b(stylesheet|preload|modulepreload|prefetch|preconnect|dns-prefetch|icon)\b/i

function offOrigin(html, origin) {
  const hits = new Set()
  const add = raw => {
    if (!/^https?:\/\//i.test(raw)) return            // relative — same origin by construction
    try { const u = new URL(raw); if (u.origin !== origin) hits.add(u.origin) } catch {}
  }
  for (const m of html.matchAll(/<(script|iframe|img)\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/gi)) add(m[2])
  for (const m of html.matchAll(/<link\b([^>]*)>/gi)) {
    const attrs = m[1]
    const rel = /\brel\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1] ?? ''
    if (!FETCHING_REL.test(rel)) continue
    const href = /\bhref\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1]
    if (href) add(href)
  }
  return [...hits]
}

/**
 * ⚠️ THE POSITIVE CONTROLS, AND THIS SCRIPT IS A GREEN LIGHT OVER NOTHING WITHOUT THEM. Every
 * assertion below is an ABSENCE — no cookie, no foreign origin, no insights script — and absence is
 * exactly what a typo'd URL, a 404, a DNS failure or an empty response body also produces. This
 * project has hit that failure twice already (a dead anon key made three RLS denials "pass"; an
 * empty table made a leak probe "pass"), so before trusting any absence we prove the detectors can
 * see a presence, using a page that genuinely does set a cookie and serve a foreign script.
 */
async function selfTest() {
  /**
   * ⚠️ THE CONTROL IS A SERVER WE START HERE, NOT A THIRD-PARTY ONE. An earlier draft pointed this
   * at httpbin.org, which makes the gate depend on somebody else's uptime to prove its own
   * detectors work — and a gate that goes red because a public service is down is a gate everyone
   * learns to re-run until it passes. That is worse than no gate: it teaches people to dismiss the
   * exact signal this exists to send. So the "bad page" is nine lines of `node:http`, on loopback,
   * torn down before the real checks run. It is also the only honest way to test the cookie path —
   * a synthetic string cannot exercise `fetch`'s header parsing, which is what actually reads a
   * real `Set-Cookie` off the wire.
   */
  const { createServer } = await import('node:http')
  const server = createServer((_req, res) => {
    res.setHeader('Set-Cookie', 'probe=1; Path=/')
    res.setHeader('Content-Type', 'text/html')
    res.end('<link rel="canonical" href="https://radlor.com/x">' +   // must NOT be flagged
            '<script src="https://evil.example.com/a.js"></script>' +
            '<link rel="stylesheet" href="https://fonts.googleapis.com/css2">')
  })
  await new Promise(r => server.listen(0, '127.0.0.1', r))
  const base = `http://127.0.0.1:${server.address().port}`

  try {
    const res = await fetch(base + '/')
    const cookies = res.headers.getSetCookie?.() ?? (res.headers.get('set-cookie') ? [res.headers.get('set-cookie')] : [])
    ok(cookies.length === 1,
      `positive control: the cookie detector SEES a real Set-Cookie (${cookies.length} found)`)

    const found = offOrigin(await res.text(), base)
    ok(found.length === 2 && found.includes('https://evil.example.com') && found.includes('https://fonts.googleapis.com'),
      `positive control: the off-origin detector SEES a foreign script and stylesheet (${found.length} found)`)
    // NEGATIVE control for the rel filter: the canonical on that same page must not count, or the
    // filter is too loose and every local run would cry wolf.
    ok(!found.includes('https://radlor.com'),
      'negative control: a cross-origin `rel="canonical"` is NOT counted as a load')
  } finally {
    server.close()
  }
}

console.log(`  ·   checking ${BASE}`)
await selfTest()

const origin = new URL(BASE).origin
for (const path of PAGES) {
  let res
  try { res = await fetch(BASE + path, { redirect: 'follow' }) } catch (e) {
    cannotSee(`${path} — could not be fetched (${e.message}); NOT reporting clean`)
    continue
  }
  if (!res.ok) { cannotSee(`${path} -> ${res.status}; could not look, NOT reporting clean`); continue }
  const html = await res.text()

  const cookies = res.headers.getSetCookie?.() ?? (res.headers.get('set-cookie') ? [res.headers.get('set-cookie')] : [])
  ok(cookies.length === 0, `${path} sets no cookie${cookies.length ? ` — ⚠️ ${cookies.length}: ${cookies.map(c => c.split('=')[0]).join(', ')}` : ''}`)

  const foreign = offOrigin(html, origin)
  ok(foreign.length === 0, `${path} loads nothing off-origin${foreign.length ? ` — ⚠️ ${foreign.join(', ')}` : ''}`)

  const injected = /_vercel\/(insights|speed-insights)/.test(html)
  ok(!injected, `${path} carries no Vercel analytics script${injected ? ' — ⚠️ THE DASHBOARD TOGGLE IS ON' : ''}`)
}

// The claim is only breakable while the pages still make it. If someone rewrites /privacy to admit
// analytics, this gate should stop applying rather than fail forever — so check the claim is there.
const privacy = await fetch(`${BASE}/privacy`).then(r => r.text()).catch(() => '')
ok(/runs no analytics/i.test(privacy),
  '/privacy still claims "runs no analytics" — this gate is the thing keeping that true')

if (fail) {
  console.log(`\n❌ ${BASE} DOES NOT MATCH WHAT /privacy AND /terms CLAIM.\n   Either remove what was added, or change both pages in the same commit. Do not ship the\n   claim and the contradiction together.`)
  process.exit(1)
}
if (blind) {
  console.log(`\n⚠️  COULD NOT CHECK ${BASE} FULLY — a page above did not load, so this run proves\n   nothing about it. Not a violation, and NOT a clean bill of health either.`)
  process.exit(2)
}
console.log(`\n✅ ${BASE} matches its own claims: no cookies, no analytics, nothing off-origin`)
process.exit(0)
