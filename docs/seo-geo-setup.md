# SEO and GEO setup — everything still to do

**SEO** is being found by a person searching. **GEO** is being *named* by an answer engine
(ChatGPT, Claude, Perplexity, Google AI Overviews) when someone asks it a question. They share most
of their plumbing and differ in one thing: search rewards pages, answer engines reward **facts they
can resolve and sources they can cite**.

Sections A–B are code. C–F need a person with a login or a keyboard.

---

## ✅ 0. SETTLED — THE PRODUCT IS `AdaptiveLearn`

| Where | Calls it |
|---|---|
| This website (every page) | **AdaptiveLearn** |
| The product's own `<title>`, `applicationName`, manifest, Apple web-app title | **Milo** |
| The URL both live under | `adaptivelearn.radlor.com` |

**Resolved 2026-08-19 (founder's call): the product is AdaptiveLearn, and Milo is the character.**
The app was renamed in `../milo-story-mode` the same day — 17 naming strings across the metadata,
the manifest, the landing wordmark, the sign-in headline and the legal definitions. `tsc` 0,
1122/1122 tests, build clean, service worker v120 → v121. **Not pushed.**

⚠️ **The character was deliberately left alone** — ~1,300 occurrences of "Milo" in that repo and
almost all of them are the pony speaking. It is the Duo/Duolingo split. The full rule is in that
repo's `handoff.md`; do not "fix" it toward consistency in either direction.

▶ **What is still owed on this item:** one sentence on this site saying the product used to be
called Milo, so the old name resolves to the right thing rather than to nothing. Worth adding to
`/adaptivelearn` once anything with the old name has been indexed.

---

## A. Already done in code — do not redo

- `metadataBase` + per-page `title`, `description`, `canonical`. Ten pages, all unique.
- One `<h1>` per page. Verified.
- `robots.txt` — allow all, with the sitemap and host declared.
- `sitemap.xml` — generated from `PAGES` and `posts`, so it cannot go stale.
- `llms.txt` — generated from the same two sources.
- `og:image` (1200×630) + Twitter summary card on every page.
- Structured data: `Organization` + `WebSite` sitewide · `SoftwareApplication` + `FAQPage` on
  `/adaptivelearn` · `SoftwareApplication` + `Offer` on `/pricing` (⚠️ **NOT `Product`** — see §A3)
  · `FAQPage` on `/for-schools` · `Article` on each post · `WebPage` on the rest.
- Every route prerendered static. No third-party requests, self-hosted fonts, no render-blocking JS.
- No horizontal overflow at 360–1280 (mobile usability is a ranking factor and a broken phone layout
  is the commonest way to fail it).

## A2. The two properties are now ONE entity — done 2026-08-19

⚠️ **This is the fix for the generic-name problem in §0, and it is the least obvious item here.**
"AdaptiveLearn" resolves to the *category* on its own (measured: the search returns "adaptive
learning" the concept plus AdaptedMind, bettermarks, DreamBox, Prodigy). "Radlor" is distinctive and
effectively unclaimed — only an Instagram handle and a hair salon in Madrid. So the brand has to
carry the entity, in three places at once:

- **Both sites emit `SoftwareApplication` with the identical `@id`** — `https://adaptivelearn.radlor.com/#app`
  — so the product page here and the app itself merge into one node instead of competing as two.
- **Both point `publisher` at `https://radlor.com/#organization`**, which is declared ONCE (here) and
  only *referenced* by the app. Two declarations would be two companies with one name.
- **The app links to radlor.com visibly** in its footer (*"AdaptiveLearn is made by Radlor"*), because
  a claim that exists only in schema is weaker than one a reader and a crawler both see.

⚠️ The `@id` strings live in `site.ts` here and `src/app/site.ts` there. **Retyping either one
silently splits the product in half**, which is why both files carry a warning and the app's gate
asserts the exact values.

## A3. ⚠️ A FREE PRODUCT MUST NOT CARRY `@type: Product` — added 2026-08-20

> **Updated 2026-08-30: the product is no longer free, and this section still stands.** The
> heading is now a bad summary of its own argument. The six Search Console issues were all
> RETAIL requirements — image, return policy, shipping, brand, rating, review — and a paid web
> app is no more a shippable, returnable, reviewable good than a free one was. `SoftwareApplication`
> carries real prices perfectly well; both blocks now emit one `Offer` per plan from `PLANS` in
> `site.ts`. Do not "restore" `Product` on the grounds that there is a price now.

`/pricing` was `Product` + `Offer` from launch until 2026-08-20, when Search Console sent **two
separate emails about one JSON-LD block**:

| report | field | severity |
|---|---|---|
| Merchant listings | missing `image` | **critical — blocks the page from Search features** |
| Merchant listings | missing `hasMerchantReturnPolicy` (in `offers`) | non-critical |
| Merchant listings | missing `shippingDetails` (in `offers`) | non-critical |
| Merchant listings | invalid object type for `brand` | non-critical |
| Product snippets | missing `aggregateRating` | non-critical |
| Product snippets | missing `review` | non-critical |

**One word opted the page into two retail audits at once.** A `Product` carrying `offers` is
evaluated as a merchant listing *and* as a product snippet, and every field above is about a thing
that ships in a box, is sent back, and is reviewed by the person who bought it.

⚠️ **THE TRAP IS THAT THE ERROR LIST READS LIKE A TO-DO LIST, AND WORKING THROUGH IT IS THE WRONG
MOVE.** There is no image of a web app, no returns policy for something free, no shipping on a URL —
and `aggregateRating` and `review` cannot be supplied at all without **inventing ratings, which
Google's own structured-data guidelines specifically forbid** and which would be a lie printed in
machine-readable form on a page aimed at parents. A validator asking for a field is not evidence
that the field should exist. **When every requirement of a rich result is unsatisfiable, the type is
wrong — do not fill the fields in.**

**The fix was the type.** `/pricing` now emits `SoftwareApplication` at the same `@id` as §A2, so it
merges into the one product node instead of standing up a competing retail listing beside it. The
`Offer` stays: it is how the page says *free*, which is the only reason the block exists, and
`SoftwareApplication` carries it perfectly well. Shipped `98a00b3`; verified on production that
`https://radlor.com/pricing` serves no `"@type":"Product"` at all.

⚠️ **The rule for anything added later:** `Product` is for something a person BUYS AND RECEIVES.
Software is `SoftwareApplication`, a class or course is `Course`, a piece of writing is `Article`.
Reach for `Product` only when a return address would make sense.

⚠️ **And `brand: { '@id': … }` was rejected as an invalid object type even though the reference
resolves.** Google's validator wants `brand` inline as a `Brand` or `Organization`, not an `@id`
pointer — a `@id` reference is correct schema.org and is *not* universally accepted by consumers.
Same lesson the app repo already wrote down about `THREE.Color`: **valid according to the spec is
not evidence that the consumer implements the spec.**

## B. Code left to do

| | What | Blocked on |
|---|---|---|
| ~~B1~~ ✅ | ~~**Replace the favicon.**~~ Done — `app/icon.tsx` + `app/apple-icon.tsx` generate a wordmark and the Next.js logo is deleted. ⚠️ Still a placeholder: `app/favicon.ico` is still create-next-app's Next.js logo, and no `icons` metadata is declared. It is currently shipping as Radlor's brand mark in every browser tab and bookmark. | A logo |
| ~~B2~~ ✅ | ~~**`sameAs` in the `Organization` schema.**~~ Done 2026-08-20 — five profiles, gated by `scripts/check-social.sh`. ⚠️ **Run that script before any deploy that touches `SOCIAL`, and after any GoDaddy forwarding edit**: four of the five are our own `*.radlor.com` forwards, so the strongest GEO signal on the site depends on rows in a panel nothing in this repo can see. A forward left pointing at a platform homepage still 301s, still looks configured, and corroborates the WRONG entity. | Nothing — GitHub org profile is the one profile still missing |
| B3 | **`Person` schema for the founder** on `/about`, plus a named byline on posts. Answer engines resolve people as entities the same way they resolve companies. | A decision to put your name on it |
| ~~B4~~ ✅ | ~~**`BreadcrumbList` on posts**~~ Done. (`Home → Writing → post`). Small; shows as a breadcrumb trail in results instead of a raw URL. | Nothing — say the word |
| ~~B5~~ ✅ | ~~**Per-post OG images.**~~ Done — `app/writing/[slug]/opengraph-image.tsx`, pre-rendered per post. Every post currently shares one generic card. | Nothing — say the word |
| ~~B6~~ ✅ | ~~**Make the AI-crawler policy explicit in `robots.ts`**~~ Done — every agent named in a comment, with why blocking them would be the wrong trade., with a comment. It already allows them via `*`; writing it down stops someone "hardening" it later. See D3. | Nothing — say the word |

## C. Accounts and dashboards — only you can do these

1. **Deploy the site.** New Vercel project (NOT the product's), `radlor.com` as its production domain,
   env `NEXT_PUBLIC_SITE_URL=https://radlor.com`.
   ⚠️ **After connecting Git, push once and confirm a deployment actually appears.** The product's
   pipeline broke silently three times in one day and Vercel's settings page was green throughout.
   ⚠️ Hobby will not host a private org-owned repo through the Git integration — keep it public until Pro.
2. **Google Search Console.** Add a **Domain property** (`radlor.com`, verified by DNS TXT) — one
   property then covers the site *and* `adaptivelearn.radlor.com`, which a URL-prefix property would
   not. Submit `https://radlor.com/sitemap.xml`. Then request indexing on the homepage once.
3. **Bing Webmaster Tools.** ⚠️ **This one is GEO, not SEO.** Bing's index is what ChatGPT search and
   Copilot read; skipping it means being invisible to a large share of answer traffic no matter how
   well Google is doing. It can import the whole property from Search Console in two clicks.
4. **The social profiles that feed `sameAs`.** In order of how much an answer engine trusts them:
   **LinkedIn company page** (the one models reach for on "what is <company>"), **GitHub org profile**,
   **Crunchbase**, then X.
   ✅ Done 2026-08-20 — LinkedIn, Instagram, X, Threads, Facebook and GitHub are all in `SOCIAL`.
   The GitHub org profile README lives in `RadlorInc/.github` at `profile/README.md`; it is what an
   answer engine lands on when it follows that `sameAs`, so it states the company/product/character
   split and the on-device camera claim rather than listing repos.
   ⚠️ **The org was renamed `RadlorMain` → `RadlorInc`.** GitHub 301s the old name only until
   somebody claims it — nothing may reference `RadlorMain`. Crunchbase is the one still missing.
   Send me the handles and B2 takes two minutes.
5. ~~**The product site's own metadata**~~ ✅ **DONE 2026-08-19** — and it was worse than expected.
   Measured live: **four of the five public routes declared no canonical at all**, all five inherited
   the landing page's marketing description (so the privacy policy advertised a placement check),
   `/diagnostic` — the highest-intent page in the product — had **no title and no `<h1>` of its own**
   because it is `'use client'` and a client component cannot export `metadata`, and there was **zero
   structured data anywhere in the app**. All fixed, gated by
   `../milo-story-mode/src/__tests__/publicSeo.test.ts` (13 assertions, 5 planted regressions all
   caught).

## D. Decisions to make

1. **The five questions you want to be the answer to.** Write them as a parent would type them, e.g.
   *"how do I find out what maths my child is actually missing"*, *"is there a maths app that doesn't
   show scores"*, *"maths software for a mixed-ability class"*. Everything in E is built from this
   list, and without it the writing wanders.
2. **Whether the founder is a public name.** B3 depends on it. A named person is a stronger entity
   than a nameless company, and it is a personal choice, not a marketing one.
3. **AI crawlers: allow or block.** Currently **all allowed**, which is correct if you want to be
   cited. The names, so nobody blocks them by accident: `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`
   (OpenAI) · `ClaudeBot`, `Claude-SearchBot` (Anthropic) · `PerplexityBot` · `Google-Extended`
   (Gemini — separate from Googlebot, and opt-*out* only) · `Applebot-Extended` · `CCBot`
   (Common Crawl, which feeds a lot of training data).
   ⚠️ Blocking these does not protect anything a public website has; it only removes you from the
   answers. Block only if you decide you do not want to be quoted.

## E. Content — this is the actual GEO engine

Everything above is plumbing. **Answer engines cite articles, not homepages**, so this is where the
work is and it is the only item on this list that has no shortcut.

1. **Write 5–8 posts**, one per question from D1. There is one so far.
2. **Each post's `description` states the FINDING, not the topic.** It is both the meta description
   and the sentence a model will quote. "Why we hide difficulty" is a topic; *"showing a child a
   level turns learning into a verdict"* is a finding.
3. **Write what only you can write.** A model can already produce a generic "10 tips for maths
   anxiety" and will never cite one. It cannot produce *"we built this mechanic three times and
   threw it away twice, here is what we measured"*. Specific, first-hand and numbered gets cited;
   generic does not.
4. **Answer the boring questions on their own pages.** Done for pricing and schools. The next one is
   probably an age-band page per band, but only once 2–3 posts are actually ranking.
5. **Get mentioned somewhere that is not radlor.com.** A model's confidence in a fact rises with the
   number of independent sources. Product Hunt, an education directory, a podcast, one guest post.
   One good third-party mention outweighs five more of your own pages.

## F0. THE BASELINE, as measured on 2026-08-19

Captured hours after `radlor.com` first went live and was submitted to Search Console, Bing and
IndexNow. **This is the "before" picture. Re-run the same queries monthly and compare.**

### Google — query `radlor`

> **AI Overview:** *"It looks like you might mean a **radler** (a mixed beer drink) or made a typo.
> If you meant the refreshing drink, a radler is a mix of beer and fruit soda or lemonade."*
>
> **Knowledge panel:** `RADLOR LIMITED people — Companies House, GOV.UK`

⚠️ **Google's entity for "radlor" is currently a dissolved British company, and its AI thinks the
word is a misspelling of a beer.** Not a competitor, not a disaster — just the honest starting point.

**Organic results:** `radlor.com/about` and `radlor.com/data-and-safety` were both indexed **within
hours** of submission, which is fast. ⚠️ The `/about` snippet still read *"adaptive maths for ages"* —
Google crawled before the US-spelling fix deployed, so the cached copy was one deploy stale.

### The name is clear, but not empty

| what exists on the name "Radlor" | |
|---|---|
| `RADLOR LIMITED`, company no. **16329916** | **DISSOLVED 23 June 2026.** A Companies House record with no business behind it — but structured, authoritative, government data, which is exactly why Google reaches for it over a site that is hours old |
| `instagram.com/radlor` | taken, unrelated |
| *Peluquería RadloR*, Madrid | a hair salon |

No live company holds the name. **The competition is not a rival — it is a stale record with better
provenance than us**, and the fix is provenance of our own: `sameAs`, content, third-party mentions.

⚠️ **This is what makes `sameAs` (§B2) the highest-priority code item, not a nicety.** Right now
nothing corroborates that Radlor is a real, live company. One LinkedIn company page would.

### Still to capture — nobody has asked these yet

Run them and paste the answers here. They are the GEO half, and Google's AI Overview is only one of
four voices:

```
ChatGPT      "what is Radlor"  ·  "what is AdaptiveLearn"  ·  "best adaptive math app for a 7 year old"
Claude       same three
Perplexity   same three
Copilot      same three   ← reads Bing's index, so this one should move first
```

⚠️ Expect all of them to say they have never heard of it. **Record that anyway** — "never heard of
it" on a dated line is a measurement; a vague memory of it is not.

---

## F. Measure — do this BEFORE anything above, so there is a baseline

1. ✅ **BASELINE RECORDED — see §F0 below.** Re-run those exact queries monthly.

   The point of a baseline is that "did this work?" is otherwise unanswerable. An answer engine that
   has never heard of you produces a confident wrong answer, not an empty one, and in three months
   nobody remembers what the wrong answer used to be.
2. **Validate the structured data** once deployed: Google's Rich Results Test and validator.schema.org
   on `/`, `/adaptivelearn`, `/pricing`, `/for-schools` and one post.
3. **Search Console, weekly for the first month**: coverage (is every page indexed), then queries.
4. **Check `llms.txt` and `robots.txt` are actually served** on the live domain, not just locally.

---

## If you only do five things

1. Settle the name (§0).
2. Deploy, and confirm the deployment landed (C1).
3. Search Console **and Bing** (C2, C3) — Bing is the GEO half and it is the one people skip.
4. Record the baseline answers today (F1).
5. Write three more posts (E1).

Everything else is worth doing and none of it substitutes for these.
