@AGENTS.md

# Radlor — the company website

This repo is **radlor.com**: the marketing and company site for Radlor. It is NOT the product.

## Where everything is

| | |
|---|---|
| **This site** | `radlor.com` — this repo. Next 16 App Router, Tailwind 4, no database, no auth, no client JS beyond Next's own. |
| **The product** | `adaptivelearn.radlor.com` — a **separate repo and a separate Vercel project**, at `../milo-story-mode` on this machine (GitHub `RadlorMain/learn`). Deliberately separate: that repo carries ~1,100 tests, an AR/camera stack and a deploy pipeline that has broken silently more than once. A marketing edit must never be able to take the app down, and vice versa. |
| **Every shared fact** | [`site.ts`](site.ts) — origin, support address, product URL, nav, company facts. **Put a string there before you put it in a page.** The product repo learned this the hard way: its support address lived as a literal in four files, so a brand change meant four edits and hoping none was missed. |
| **Facts I could not derive** | [`docs/brand-facts.md`](docs/brand-facts.md) — the `TODO`s in `site.ts` and what they feed. |
| **Session state** | [`handoff.md`](handoff.md) — read it first, update it when the session wraps. |

## The rules this site is built on

**One source per fact.** `NAV` drives the header, the footer AND the sitemap, so a new page cannot
exist without appearing in all three. `posts.ts` drives the writing index, the sitemap, `llms.txt`
and the JSON-LD. If you add a page, add it to `NAV` — don't hand-write a `<Link>` and a sitemap row.

**Say true things.** No invented testimonials, no invented numbers, no "trusted by thousands". The
product is in early access with a handful of families and the copy says so. A claim that a parent
could disprove in one click is worse than no claim.

**Structured data on every page that has a shape.** `Organization` + `WebSite` sit in the root
layout; `SoftwareApplication` + `FAQPage` on `/adaptivelearn`; `Article` on each post. This is the
half of SEO that also does the **GEO** work — an answer engine that cannot resolve who Radlor *is*
will not name it.

**`llms.txt` is generated, not written.** `app/llms.txt/route.ts` builds it from `site.ts` and
`posts.ts`. A static one in `public/` drifts the first time a page is renamed and nothing tells you.

**Ship the small version.** No CMS, no MDX, no component library, no analytics. Posts are a typed
array plus a `.md` file, rendered with `marked`. Add machinery when writing a post is genuinely the
thing slowing you down — not before.

## Writing a post

1. Add an entry to `content/posts.ts` (slug, title, description, ISO date).
2. Write `content/posts/<slug>.md` — plain markdown, starts at `##` for sections.

The `description` is both the `<meta description>` and the sentence an answer engine will quote.
**State the finding, not the topic.**

## Verifying

```
npx tsc --noEmit && npm run build
```

Then drive it: `preview_start` the `radlor-site` config, and check **horizontal overflow at 360 and
375 px** — both header and footer link rows have overflowed there once already. Per-page checks
worth repeating: unique `<title>` and description, a `canonical`, an `og:image`, and the JSON-LD
types you expect. There is a one-shot script for that in `handoff.md`.
