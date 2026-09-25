@AGENTS.md

# Radlor — the company website

This repo is **radlor.com**: the marketing and company site for Radlor. It is NOT the product.

## Where everything is

| | |
|---|---|
| **This site** | `radlor.com` — this repo. Next 16 App Router, Tailwind 4, no database, no auth. The only client JS beyond Next's own is `/radlic`'s demo player (first-party, since 2026-09-25). |
| **The product** | **Radlic** at `radlic.com` (AdaptiveLearn at `adaptivelearn.radlor.com` until 2026-09-24); its product page here is `/radlic` (`/adaptivelearn` 308s to it) — a **separate repo and a separate Vercel project**, at `../milo-story-mode` on this machine (GitHub `RadlorMain/learn`). Deliberately separate: that repo carries ~1,100 tests, an AR/camera stack and a deploy pipeline that has broken silently more than once. A marketing edit must never be able to take the app down, and vice versa. |
| **Every shared fact** | [`site.ts`](site.ts) — origin, support address, product URL, nav, company facts. **Put a string there before you put it in a page.** The product repo learned this the hard way: its support address lived as a literal in four files, so a brand change meant four edits and hoping none was missed. |
| **Facts I could not derive** | [`docs/brand-facts.md`](docs/brand-facts.md) — the `TODO`s in `site.ts` and what they feed. |
| **Every colour** | [`docs/brand-palette.md`](docs/brand-palette.md) — read off the LOGO, with the pixel each came from and its contrast. ⚠️ The amber palette that cited a brand-guide PDF not in this repo is superseded; do not restore it. |
| **What the site claims** | `/privacy` and `/data-and-safety` make **checkable** claims (no third-party requests; what the app stores about a child). ⚠️ Since 2026-09-19 `/data-and-safety` makes no camera claim — the app's camera chapters are hidden. Every product fact on `/adaptivelearn`, `/for-schools` and `/data-and-safety` was re-read from the app's `release` branch that day; when the app changes, those pages are stale until re-read. Both files carry a header comment saying what was measured. Break one and fix the page in the same commit. |
| **Session state** | [`handoff.md`](handoff.md) — read it first, update it when the session wraps. |

## The rules this site is built on

**One source per fact.** `PAGES` in `site.ts` drives the header, the footer, the sitemap AND
`llms.txt`, so a new page cannot exist in one and be missing from another. `posts.ts` does the same
for the writing index, the sitemap, `llms.txt` and the JSON-LD.

To add a page: add a row to `PAGES` (`where: 'both'` puts it in the header, `'footer'` keeps it out)
and a line to `BLURB` in `app/llms.txt/route.ts` — which is typed against `PAGES`, so the build
**fails** until you write one. Don't hand-write a `<Link>` and a sitemap row.

**Every page needs exactly one `<h1>`, a `canonical`, and a description whose FIRST SENTENCE stands
alone under ~155 characters.** Search results truncate around there. Longer is fine — the rest still
feeds answer engines — as long as what survives the cut is a complete thought.

**Say true things.** No invented testimonials, no invented numbers, no "trusted by thousands". The
product is in early access with a handful of families and the copy says so. A claim that a parent
could disprove in one click is worse than no claim.

⚠️ **AND A MEASUREMENT WRITTEN INTO PROSE IS TRUE ONLY ON THE DAY IT WAS TAKEN.** Four instances
turned up on 2026-09-05 alone — a migration comment that had been the opposite of production for
four days, two `handoff.md` paragraphs describing the waitlist as "0 policies, no grants, 0 rows"
and "empty and ready", and the retention number in three files. Prose has no mechanism that can go
red, so a measured fact in the present tense reads as current until somebody re-measures — and the
migration comment was an *instruction* to revoke the grant the live signup form depends on.

**Where a page or a doc states a fact about the live system, either gate it against that system or
replace it with a pointer to the check that re-measures it.** Gated: `/privacy` and `/terms` claim
no analytics and no cookies, and `check:site-claims` fails if that stops being true. Pointed: the
waitlist paragraph in `handoff.md` now says to run `check:waitlist-rls` rather than trust it. **The
pointer is the standard move.** If you can do neither, date the sentence and write it in the past
tense — "as measured 2026-09-05" is honest; the same words in the present tense are a claim about
tomorrow that nobody can keep.

**Structured data on every page that has a shape.** `Organization` + `WebSite` sit in the root
layout; `SoftwareApplication` on `/radlic` (the `/adaptivelearn` page and its `FAQPage` went on 2026-09-25); `Article` on each post. This is the
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

**Gates worth running before a deploy:** `check:waitlist-rls` (the live grant posture),
`check:legal-draft` (/terms cannot render as final), `check:site-claims` (the live site matches what
/privacy and /terms claim — run it against `http://localhost:3021` before the deploy and against
production after), `check:migrations` (every migration production has run exists as a file
somewhere), plus `check:pricing`, `check:social` and `check:hero-contrast`.

⚠️ **A gate is not worth a capability more dangerous than what it detects.** `check:waitlist-rls`
asserts the anon grant is column-scoped by trying two INSERTs that name `id` and `created_at`,
rather than by adding an `exec_sql` RPC to production so it could read `information_schema` — a
general SQL-execution endpoint on a live database would have been the most dangerous object in the
project, created in the name of security. `check:migrations` refuses a Management API token for the
same reason: it reaches every project on the account. When a check needs a new permission, endpoint,
key or role, ask what it could observe instead of what it would like to query. The full rule is in
the app repo's `CLAUDE.md`, beside the other instrument rules.

Then drive it: `preview_start` the `radlor-site` config, and check **horizontal overflow at 360 and
375 px** — both header and footer link rows have overflowed there once already. Per-page checks
worth repeating: unique `<title>` and description, a `canonical`, an `og:image`, and the JSON-LD
types you expect. There is a one-shot script for that in `handoff.md`.
