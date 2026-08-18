# Session Handoff — Radlor website

> **Read [CLAUDE.md](CLAUDE.md) first.** It says where every fact lives and what the rules are.
> This file is only "where work left off". Keep it short — the product repo's handoff grew to 60 KB
> and is now a running cost on every session.

## Where it is right now

**Built, unshipped.** Nothing is deployed and there is no GitHub repo yet — deliberately. The site
runs locally and is complete enough to look at.

`npx tsc --noEmit` clean · `npm run build` clean · 13 routes prerendered static · 0 console errors ·
no horizontal overflow at 360 / 375 / 768 / 1280.

## What exists

```
site.ts                    every shared fact (origin, support email, product URL, NAV, company TODOs)
app/layout.tsx             metadata + Organization/WebSite JSON-LD + header + footer
app/page.tsx               home — what we believe, the product card, latest writing
app/adaptivelearn/         the product page: how a chapter works, answering with hands,
                           the six age bands, 6 parent FAQs + SoftwareApplication & FAQPage JSON-LD
app/about/  app/contact/
app/writing/               index + [slug], markdown via `marked`, Article JSON-LD
app/robots.ts  app/sitemap.ts  app/llms.txt/route.ts  app/opengraph-image.tsx
content/posts.ts + content/posts/*.md    one seed post
```

## Decisions made, and why

- **Separate repo from the product** (`../milo-story-mode`), not a subfolder of it. The company site
  is the parent of the product, not a child of it — and practically, that repo's Vercel pipeline has
  broken silently more than once and must not be able to take radlor.com with it.
- **No GitHub repo chosen yet.** Local `git` only. Decide the remote when it is time to deploy;
  nothing here depends on the answer.
- **Next 16 + Tailwind 4**, same as the product, so there is one framework to know.
- **`/adaptivelearn`, not `/products/adaptivelearn`.** Shorter URL, one product, no folder needed
  until there are two.
- **`/writing`, not `/blog`.** Same content, less of a promise about frequency.
- **One dependency added: `marked`.** No CMS, no MDX, no component library, no analytics.

## Next steps, in order

1. **Fill in `docs/brand-facts.md`** — founded year, location, social handles. `sameAs` is the single
   biggest GEO lever left and it is currently empty.
2. **Look at the copy.** Every word is mine, written from what the product actually does. The About
   page's "why we started" especially — it should be in the founder's voice, not mine.
3. **Deploy.** New Vercel project (NOT the existing one), `radlor.com` as its production domain,
   `NEXT_PUBLIC_SITE_URL=https://radlor.com`. ⚠️ **The product repo's lesson applies here too: after
   connecting Git, push once and confirm a deployment actually appears. A green settings page is not
   evidence.** ⚠️ And Vercel Hobby will not host a private org-owned repo via the Git integration —
   keep the repo public until Pro.
4. **Write two or three more posts.** For GEO this is the whole game: answer engines cite articles,
   not homepages. Each post's `description` should state a finding a model can quote.
5. **Legal pages.** The product carries `/legal/privacy` and `/legal/terms` on its own origin. This
   site collects nothing, so it needs at most a short privacy note — but it should say so out loud
   rather than have nothing.

## The one-shot check

Drive `preview_start` on the `radlor-site` config (port 3021, defined in
`../milo-story-mode/.claude/launch.json`), then in the page:

```js
// per-page SEO surface
for (const p of ['/', '/adaptivelearn', '/about', '/writing', '/contact']) {
  const d = new DOMParser().parseFromString(await (await fetch(p)).text(), 'text/html')
  console.log(p, d.title, d.querySelector('link[rel=canonical]')?.href,
    [...d.querySelectorAll('script[type="application/ld+json"]')]
      .flatMap(s => { const j = JSON.parse(s.textContent); return (j['@graph'] || [j]).map(n => n['@type']) }))
}
```

For overflow, render each path in a 360 px-wide off-screen `<iframe>` and compare
`scrollWidth` to `clientWidth`. Both the header nav and the footer link row have overflowed there
once already, so it is worth re-running after any layout change.
