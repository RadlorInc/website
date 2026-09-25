#!/usr/bin/env node
// Every page in the sitemap shares with a card: og:image AND twitter:image, each pointing at an image the build made.
//
//   npm run build && npm run check:og
//
// Reads the BUILD OUTPUT (.next/server/app), not the source: a page's `openGraph` REPLACES the root layout's, and
// with it the root's file-based card (Next merges metadata shallowly). /radlic shipped without a card that way
// (SEO-02, 2026-09-26) while every source file looked right. Only the emitted <head> shows it.
//
// Exit 0 = looked, every page has both; 1 = a page is missing one (named); 2 = could not look (no build, a sitemap
// URL with no built page) — never reported as clean.
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const APP = join(process.cwd(), '.next/server/app')
const blind = msg => { console.log(`⚠️  ${msg} — could not look, NOT reporting clean`); process.exit(2) }

const sitemapFile = join(APP, 'sitemap.xml.body')
if (!existsSync(sitemapFile)) blind(`no ${sitemapFile}; run \`npm run build\` first`)
const paths = [...readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname)
// Positive control: an empty sitemap would make every page "pass".
if (paths.length === 0) blind('the built sitemap lists no URLs')

const meta = (html, attr, key) =>
  new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`).exec(html)?.[1]

let fail = 0
for (const p of paths) {
  const file = join(APP, p === '/' ? 'index.html' : `${p.slice(1)}.html`)
  if (!existsSync(file)) blind(`${p} is in the sitemap but ${file} was not built`)
  const html = readFileSync(file, 'utf8')
  // Positive control per page: if og:title is not found either, the reader is blind to this <head>, not the page.
  if (!meta(html, 'property', 'og:title')) blind(`${p}: no og:title found — the <head> was not read`)

  for (const [attr, key] of [['property', 'og:image'], ['name', 'twitter:image']]) {
    const url = meta(html, attr, key)
    if (!url) { console.log(`❌ ${p} has no ${key}`); fail = 1; continue }
    const body = join(APP, `${new URL(url).pathname}.body`)
    if (!existsSync(body)) { console.log(`❌ ${p} ${key} -> ${url}, but the build made no such image`); fail = 1; continue }
    console.log(`ok  ${p} ${key}`)
  }
}
if (fail) { console.log('\n❌ a page shares without its card. If it sets `openGraph`, add an opengraph-image in its segment.'); process.exit(1) }
console.log(`\n✅ all ${paths.length} sitemap pages have og:image + twitter:image, each a built image`)
