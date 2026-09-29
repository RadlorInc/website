#!/usr/bin/env node
// Hold the deployed site to the security headers next.config.ts promises.
//
//   npm run check:headers                  # https://radlor.com
//   npm run check:headers http://localhost:3021
//
// It reads the headers the server actually sends, not the config: a header can go missing with no diff here (a
// platform setting, a proxy, a config that stopped loading). Expected values are written out below, by hand.
// Exit 2 = could not look (a page did not answer 200), 1 = looked and a header is missing or wrong, 0 = clean.
const BASE = (process.argv[2] ?? 'https://radlor.com').replace(/\/$/, '')
const PAGES = ['/', '/radlic', '/privacy']

const EXPECT = {
  'content-security-policy': v => ["default-src 'self'", "frame-ancestors 'none'", "object-src 'none'", "base-uri 'self'"]
    .filter(d => !v.includes(d)).map(d => `missing ${d}`),
  'x-frame-options': v => (v.toUpperCase() === 'DENY' ? [] : [`is "${v}", expected DENY`]),
  'x-content-type-options': v => (v.toLowerCase() === 'nosniff' ? [] : [`is "${v}", expected nosniff`]),
  'referrer-policy': v => (v === 'strict-origin-when-cross-origin' ? [] : [`is "${v}"`]),
  'permissions-policy': v => (['camera=()', 'microphone=()', 'geolocation=()'].every(p => v.includes(p)) ? [] : [`is "${v}"`]),
}

let fail = 0, blind = 0
for (const path of PAGES) {
  let res
  try { res = await fetch(BASE + path, { redirect: 'manual' }) } catch (e) { res = null; console.log(`  ⚠️  ${path}: ${e.message}`) }
  if (!res || res.status !== 200) { if (res) console.log(`  ⚠️  ${path}: answered ${res.status}, not 200`); blind = 1; continue }
  for (const [name, check] of Object.entries(EXPECT)) {
    const v = res.headers.get(name)
    const problems = v === null ? ['absent'] : check(v)
    console.log(`  ${problems.length ? '❌ ' : 'ok '} ${path} ${name}${problems.length ? ': ' + problems.join(', ') : ''}`)
    if (problems.length) fail = 1
  }
}
if (fail) { console.log('✗ a security header is missing or wrong'); process.exit(1) }
if (blind) { console.log('? could not look at every page — nothing was concluded about the ones that did not answer'); process.exit(2) }
console.log(`✓ ${PAGES.length} pages × ${Object.keys(EXPECT).length} headers present on ${BASE}`)
