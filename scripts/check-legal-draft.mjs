#!/usr/bin/env node
// Prove /terms cannot quietly become a live, finished-looking legal document.
//
//   npm run check:legal-draft
//
// `content/legal.ts` already throws at module scope if DRAFT is false while placeholders remain —
// that covers the flag. This covers the other half, which nothing else can see: the RENDERER.
// The markers are bracketed (`[DATE]`, `[LAWYER REVIEW — …]`) and brackets are markdown link
// syntax territory. A renderer that swallowed one would leave the page reading as finished prose
// while the guard above still thought the hole was there — the draft banner defeated by a
// markdown parser. So we render the real document with the real call and look for them in the HTML.
import { marked } from 'marked'
import { readFileSync } from 'node:fs'

const src = readFileSync('content/legal.ts', 'utf8')

// The page imports and renders; here we only need the body, and reading it out of the module
// would drag `@/site` path aliases into a plain node run for no benefit.
const body = /body: `([\s\S]*?)`,\n}/.exec(src)?.[1]
const html = body && (await marked.parse(body))

let fail = 0
const ok = (good, msg) => { console.log(`  ${good ? 'ok ' : '❌ '} ${msg}`); if (!good) fail = 1 }

ok(!!html, 'the terms body was found and rendered')

// 1. Every marker a human still has to resolve must reach the screen.
for (const p of ['[DATE]', '[LAWYER REVIEW']) {
  const n = html ? html.split(p).length - 1 : 0
  ok(n > 0, `${p} survives rendering (${n} occurrence${n === 1 ? '' : 's'} in the HTML)`)
}

// 2. DRAFT is what puts the banner on the page. It must still be true.
ok(/export const DRAFT = true/.test(src), 'DRAFT is true, so /terms renders the banner')

// 3. The document must not have absorbed the app's agreement. These are two contracts between two
//    different sets of parties, and merging them shows a reader the wrong one.
ok(!/adaptivelearn\.radlor\.com\/legal/.test(src),
  "it does not link the app's Terms of Service as if it were this document")

console.log(fail
  ? '\n❌ /terms could render as a finished, binding document. Do not ship it.'
  : '\n✅ /terms renders as a draft, with every unresolved marker visible on the page')
process.exit(fail)
