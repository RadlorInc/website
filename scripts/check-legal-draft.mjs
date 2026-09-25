#!/usr/bin/env node
// Guard the two ways /terms can start lying about its own status.
//
//   npm run check:legal-draft
//
// ⚠️ THIS GATE INVERTED ON 2026-09-06 AND THAT IS THE POINT. Until then `DRAFT` was true and it
// asserted the markers reached the screen. An attorney has now reviewed the document, `DRAFT` is
// false, and the page renders as live binding terms — so the assertion it needs is the opposite
// one: that NOTHING unresolved survives into a document presented as final, and that the mechanism
// which would catch the next unreviewed revision is still wired.
//
// Both failure directions are real, and they are not symmetric:
//   · A MARKER ON A FINAL PAGE — `[DATE]` or `[LAWYER REVIEW]` visible on terms that claim to be in
//     force. `content/legal.ts` throws at module scope for this, so the build already dies. Asserted
//     here too because the throw only covers the SOURCE; this covers the RENDERED HTML, where a
//     markdown parser could in principle mangle one into something the source check would miss.
//   · A FINAL PAGE THAT IS NOT REVIEWED — somebody edits the terms and leaves `DRAFT` false. Nothing
//     can detect that automatically: only a human knows whether a lawyer saw the new sentence. What
//     CAN be checked is that the machinery to say so still exists — the banner block, the
//     PLACEHOLDERS list and the module-scope guard. Delete any of them and the next unreviewed
//     draft ships looking exactly like a reviewed one.
import { marked } from 'marked'
import { readFileSync } from 'node:fs'

const src = readFileSync('content/legal.ts', 'utf8')
const page = readFileSync('app/(site)/terms/page.tsx', 'utf8')

const body = /body: `([\s\S]*?)`,\n}/.exec(src)?.[1]
const html = body && (await marked.parse(body))

let fail = 0
const ok = (good, msg) => { console.log(`  ${good ? 'ok ' : '❌ '} ${msg}`); if (!good) fail = 1 }

if (!html) {
  // "Could not look", not "looked and it was clean" — see CLAUDE.md, three states three codes.
  console.error('❌ Could not extract the terms body from content/legal.ts; NOT reporting clean.')
  process.exit(2)
}

const isDraft = /export const DRAFT = true/.test(src)
console.log(`  ·   DRAFT = ${isDraft}`)

if (isDraft) {
  // The pre-2026-09-06 contract, kept because DRAFT is designed to go back to true.
  for (const p of ['[DATE]', '[LAWYER REVIEW']) {
    ok(html.includes(p), `${p} reaches the rendered page, where a reader can see it`)
  }
  ok(/role="note"/.test(page), 'the draft banner renders')
} else {
  // Today's contract: presented as final, so nothing unresolved may survive.
  for (const p of ['[DATE]', '[LAWYER REVIEW', '[NN]', '[URL]']) {
    const n = html.split(p).length - 1
    ok(n === 0, `no ${p} on a page presented as final${n ? ` — ⚠️ ${n} still rendered` : ''}`)
  }
  ok(!/\bdraft\b/i.test(html),
    'the document text does not still describe itself as a draft')
  // A real date, not a placeholder and not an empty string.
  const updated = /updated: '([^']*)'/.exec(src)?.[1] ?? ''
  ok(/\d{4}/.test(updated) && !updated.includes('['),
    `\`updated\` is a real date (${updated || 'EMPTY'})`)
  ok(html.includes(updated), `the page states that date in its own body`)
}

// ⚠️ THE MECHANISM MUST SURVIVE BEING SWITCHED OFF. These four are what make the next unreviewed
// revision detectable; with DRAFT false they are all dormant, which is exactly when someone tidies
// them away as dead code.
ok(/export const PLACEHOLDERS = \[/.test(src), 'PLACEHOLDERS list still present')
ok(/export function draftGuardError/.test(src), 'draftGuardError still present')
ok(/const GUARD = draftGuardError\(DRAFT, LEGAL_DOCS\)[\s\S]*throw new Error\(GUARD\)/.test(src),
  'the module-scope guard is still wired — a new marker breaks the build')
ok(/\{DRAFT && \(/.test(page) && /not reviewed by a lawyer/.test(page),
  'the banner block is still in the page, ready for the next unreviewed revision')

// These are two different agreements between two different sets of parties.
ok(!/adaptivelearn\.radlor\.com\/legal/.test(src),
  "it does not link the app's Terms of Service as if it were this document")

console.log(fail
  ? '\n❌ /terms misrepresents its own status, or the mechanism that would catch that is gone.'
  : isDraft
    ? '\n✅ /terms renders as a draft, with every unresolved marker visible on the page'
    : '\n✅ /terms renders as final, carries no unresolved marker, and the draft mechanism is intact')
process.exit(fail)
