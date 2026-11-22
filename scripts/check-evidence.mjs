#!/usr/bin/env node
// Hold `/why-visual-learning` and the three product texts to their own rules (2026-11-22).
//
//   npm run check:evidence
//
// It reads the REPO, not the live site: the rules are about what we wrote. It fails when
//   · a source in content/evidence.ts is not cited anywhere (a source list with dead rows),
//   · a source URL is not https, or a finding has no limit or no source,
//   · a number that has no study behind it appears as a claim ("80% of what", "60,000 times"),
//     outside the one place that names them to say we do NOT use them (NOT_CLAIMED),
//   · a page text breaks a founder rule: how the videos are made, an age label, a delivery promise.
// Exit codes follow the other checks: 1 = found a defect, 0 = clean.
import { readFileSync } from 'node:fs'

let fail = 0
const ok = (good, msg) => { console.log(`  ${good ? 'ok ' : '❌ '} ${msg}`); if (!good) fail = 1 }

const ev = await import(new URL('../content/evidence.ts', import.meta.url))
const ids = Object.keys(ev.SOURCES)
const unused = ids.filter(id => !ev.SOURCE_ORDER.includes(id))
ok(unused.length === 0, `every source is cited (${ids.length} sources${unused.length ? `; unused: ${unused}` : ''})`)
ok(ids.every(id => ev.SOURCES[id].url.startsWith('https://')), 'every source URL is https')
const findings = ev.SECTIONS.flatMap(s => s.findings)
ok(findings.every(f => f.refs.length > 0 && f.limit.trim().length > 20), `every finding has a source and a limit (${findings.length} findings)`)
ok(ev.HOME_EVIDENCE.length === 3 && ev.HOME_EVIDENCE.every(h => findings.some(f => f.refs.includes(h.source))),
  'the home page shows 3 findings, each restating a finding on the research page')

// Positive control: the detector must SEE a banned phrase before an absence of hits means anything.
const MYTHS = /(\d+\s?%\s+of what (we|people|you|they) (see|read|hear))|60,?000 times|learning style[s]? (match|meshing)|visual learners? learn/i
ok(MYTHS.test('people remember 80% of what they see'), 'positive control: the myth detector sees a myth')

const claims = JSON.stringify({ s: ev.SECTIONS, h: ev.HOME_EVIDENCE })
ok(!MYTHS.test(claims), 'no myth number appears as a finding (NOT_CLAIMED may name them to reject them)')

const PAGES = ['app/(site)/page.tsx', 'app/(site)/3d-videos/page.tsx', 'app/(site)/why-visual-learning/page.tsx', 'app/llms.txt/route.ts']
// Text a visitor reads, without the comments that explain the rules.
const visible = f => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/<\/?svg\b[^>]*>/gi, '')
const RULES = [
  [/with code|\bSVG\b|pixels|drawn live in the browser|three\.js|blender/i, 'never say how the videos are made'],
  [/ages?\s*13\s*\+|13 and over/i, 'no "Ages 13+" label'],
  [/\b\d+\s*(hours|days)\b(?! later)/i, 'no delivery-time promise'],
  [/\$\s?\d/, 'no price on these pages (plans are on the sign-up page)'],
]
ok(RULES[0][0].test('we draw it with code'), 'positive control: the content-rule detector sees a banned phrase')
for (const f of PAGES) {
  const t = visible(f)
  for (const [re, rule] of RULES) { const m = re.exec(t); ok(!m, `${f}: ${rule}${m ? ` — found "${m[0]}"` : ''}`) }
}

process.exit(fail)
