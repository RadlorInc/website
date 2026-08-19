# SEO and GEO setup — everything still to do

**SEO** is being found by a person searching. **GEO** is being *named* by an answer engine
(ChatGPT, Claude, Perplexity, Google AI Overviews) when someone asks it a question. They share most
of their plumbing and differ in one thing: search rewards pages, answer engines reward **facts they
can resolve and sources they can cite**.

Sections A–B are code. C–F need a person with a login or a keyboard.

---

## ⚠️ 0. THE BLOCKER: THE PRODUCT HAS TWO NAMES

| Where | Calls it |
|---|---|
| This website (every page) | **AdaptiveLearn** |
| The product's own `<title>`, `applicationName`, manifest, Apple web-app title | **Milo** |
| The URL both live under | `adaptivelearn.radlor.com` |

This was my assumption from the subdomain and it may be the wrong one. **Nothing else on this list
is worth doing until it is settled**, because every signal below — the sitemap, the schema, the
articles, the Search Console properties, the `sameAs` links — attaches the authority to a *name*.
Two names means two half-piles, and an answer engine asked "what is Milo" and "what is AdaptiveLearn"
gets two different half-answers with no way to tell they are one product.

Pick one. Then whichever loses becomes a sentence on this site — *"AdaptiveLearn was previously
called Milo"* — so the old name still resolves to the right thing rather than to nothing.

⚠️ Renaming inside the product is not a find-and-replace. `applicationName`, `manifest.json`, the
Apple web-app title and the icon set are four separate places, and a changed manifest `name` prompts
an install refresh on every device that has it on a home screen.

---

## A. Already done in code — do not redo

- `metadataBase` + per-page `title`, `description`, `canonical`. Ten pages, all unique.
- One `<h1>` per page. Verified.
- `robots.txt` — allow all, with the sitemap and host declared.
- `sitemap.xml` — generated from `PAGES` and `posts`, so it cannot go stale.
- `llms.txt` — generated from the same two sources.
- `og:image` (1200×630) + Twitter summary card on every page.
- Structured data: `Organization` + `WebSite` sitewide · `SoftwareApplication` + `FAQPage` on
  `/adaptivelearn` · `Product` + `Offer` on `/pricing` · `FAQPage` on `/for-schools` · `Article` on
  each post · `WebPage` on the rest.
- Every route prerendered static. No third-party requests, self-hosted fonts, no render-blocking JS.
- No horizontal overflow at 360–1280 (mobile usability is a ranking factor and a broken phone layout
  is the commonest way to fail it).

## B. Code left to do

| | What | Blocked on |
|---|---|---|
| B1 | ⚠️ **Replace the favicon.** `app/favicon.ico` is still create-next-app's Next.js logo, and no `icons` metadata is declared. It is currently shipping as Radlor's brand mark in every browser tab and bookmark. | A logo |
| B2 | **`sameAs` in the `Organization` schema.** The single strongest GEO signal available — it is what ties the string "Radlor" to profiles that corroborate it. Currently an empty array. | C4 |
| B3 | **`Person` schema for the founder** on `/about`, plus a named byline on posts. Answer engines resolve people as entities the same way they resolve companies. | A decision to put your name on it |
| B4 | **`BreadcrumbList` on posts** (`Home → Writing → post`). Small; shows as a breadcrumb trail in results instead of a raw URL. | Nothing — say the word |
| B5 | **Per-post OG images.** Every post currently shares one generic card. | Nothing — say the word |
| B6 | **Make the AI-crawler policy explicit in `robots.ts`**, with a comment. It already allows them via `*`; writing it down stops someone "hardening" it later. See D3. | Nothing — say the word |

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
   **LinkedIn company page** (the one models reach for on "what is <company>"), **GitHub org profile**
   with a README on `RadlorMain` (free, already exists, currently empty), **Crunchbase**, then X.
   ⚠️ `github.com/radlor` is taken; `radlorhq` / `radlor-labs` / `getradlor` were free on 2026-08-19.
   Send me the handles and B2 takes two minutes.
5. **The product site's own metadata**, once §0 is settled — it is a second property competing in the
   same results and it needs its own title, description and canonical to not fight this one.

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

## F. Measure — do this BEFORE anything above, so there is a baseline

1. **Ask the engines about yourself today and save the answers.** ChatGPT, Claude, Perplexity, Google
   AI Overviews: *"what is Radlor"*, *"what is AdaptiveLearn"* (and *"Milo maths app"*), *"best
   adaptive maths app for a 7 year old"*. Right now the answers will be nothing or wrong. **That is
   the measurement** — without it, in three months there is no way to tell whether any of this
   worked. Re-run monthly, same questions.
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
