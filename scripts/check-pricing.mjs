#!/usr/bin/env node
// Prove the published price claims are still true of the numbers in site.ts.
//
//   node scripts/check-pricing.mjs
//
// ⚠️ WHY THIS EXISTS. /pricing says annual "saves over 20%". That is not a design constant —
// it is an OUTCOME of four numbers, and it SHRINKS as children are added (20.74% at one child,
// 20.15% at four). Nudge the additional-child annual price up and the claim silently becomes
// false on the largest plan only, which is the row nobody re-reads. This fails the build first.
//
// It also pins the three figures that were published to families, so a refactor of `priceFor`
// cannot quietly move a price that is already in somebody's inbox.
import { PRICING, PLANS, priceFor, usd } from '../site.ts'

let fail = 0
const check = (ok, msg) => { console.log(`  ${ok ? 'ok ' : '❌ '} ${msg}`); if (!ok) fail = 1 }

// The published table, exactly as it went out.
const PUBLISHED = [
  { children: 1, monthly: 799, annual: 7599, saved: 1989 },
  { children: 2, monthly: 1298, annual: 12399, saved: 3177 },
  { children: 3, monthly: 1797, annual: 17199, saved: 4365 },
]
for (const row of PUBLISHED) {
  const p = priceFor(row.children)
  check(p.monthly === row.monthly && p.annual === row.annual && p.saved === row.saved,
    `${row.children} child${row.children > 1 ? 'ren' : ''}: ${usd(p.monthly)}/mo · ${usd(p.annual)}/yr · saves ${usd(p.saved)}`)
}

// The claim on the page, for EVERY plan we publish — not just the first one.
const worst = Math.min(...PLANS.map(p => p.savedPct))
check(worst > 20, `annual saves over 20% on every plan (worst is ${worst.toFixed(2)}% at ${PRICING.maxChildren} children)`)

// A saving we state must never be larger than the one that exists.
check(PLANS.every(p => p.saved === p.monthly * 12 - p.annual), 'every stated saving equals monthly×12 − annual')

// The cap is real: a 5th child must not silently price as a 4th.
check(priceFor(99).children === PRICING.maxChildren, `priceFor() clamps at ${PRICING.maxChildren} children`)

// A printed percentage must never claim more than the real one.
for (const p of PLANS) {
  const printed = parseFloat(p.savedPctLabel)
  check(printed <= p.savedPct + 1e-9,
    `${p.children}: prints ${p.savedPctLabel}, real ${p.savedPct.toFixed(3)}% — never overstates`)
}

console.log(fail ? '\n❌ pricing claims are no longer true — fix the copy or the numbers'
                 : `\n✅ all pricing claims hold across ${PLANS.length} plans`)
process.exit(fail)
