@AGENTS.md

# Radlor — the company website

This repo is **radlor.com**: the marketing and company site for Radlor. It is NOT the product.

## Where everything is

| | |
|---|---|
| **This site** | `radlor.com` — this repo. Next 16 App Router, Tailwind 4. The marketing pages have no database and no auth; only the waitlist and 3Dlor sign-up (next row) write to the radlor-site Supabase. The only client JS beyond Next's own is `/radlic`'s demo player, the 3Dlor sign-up widgets and the shared scroll styles (first-party). The home page is 3Dlor's since 2026-11-23 (`OpenIt`: everyday objects that open under a slider), and must not read or look like school; Ask Radlor and Radlic are only under \"Other products\", and `/why-visual-learning` holds the research with its sources (`content/evidence.ts`, gated by `check:evidence`); its old journey scroll is in git. Pictures on the company pages are real photos since 2026-11-23 (`public/photos/`, `photo: true` in `components/scroll/art.ts`, every file credited in `docs/image-credits.md`); `/radlic` keeps its drawings by the founder's choice. |
| **3Dlor sign-up** | `/3dlor/signup` and `/3dlor/account`; API in `app/api/3dlor/` (plain `fetch` to Supabase and Stripe, no SDKs). Prices live only in `app/api/3dlor/_lib/plans.ts` (draft until the founder confirms). Tables `v3d_orders` + `v3d_files` with RLS, private bucket `v3d-uploads` (migrations `supabase/migrations/2026112*_v3d_*.sql`, applied by hand). Paid = the signed webhook `app/api/3dlor/webhook/` only; it needs a Vercel firewall bypass rule (Attack Challenge Mode blocks Stripe). Stripe is test mode only until the founder approves live; `stripeKey()` refuses a key whose mode does not match the environment. ⚠️ **Whether sign-up is open is not written here on purpose:** `configured()` in `app/api/3dlor/_lib/server.ts` decides it, and `/3dlor/signup` says "Sign-up is not open yet" while it is false. Read the live page. Steps to open it: `handoff.md`. |
| **The product** | **Radlic** at `radlic.com` (called Radlor at `app.radlor.com` from 2026-11-14 to 2026-11-22; that address redirects to `radlic.com`; AdaptiveLearn at `adaptivelearn.radlor.com` until 2026-09-24); its product page here is `/radlic` (`/adaptivelearn` 308s to it) — a **separate repo and a separate Vercel project**, at `../milo-story-mode` on this machine (GitHub `RadlorMain/learn`). Deliberately separate: that repo carries ~1,100 tests, an AR/camera stack and a deploy pipeline that has broken silently more than once. A marketing edit must never be able to take the app down, and vice versa. |
| **Every shared fact** | [`site.ts`](site.ts) — origin, support address, product URL, nav, company facts. **Put a string there before you put it in a page.** The product repo learned this the hard way: its support address lived as a literal in four files, so a brand change meant four edits and hoping none was missed. |
| **Facts I could not derive** | [`docs/brand-facts.md`](docs/brand-facts.md) — the `TODO`s in `site.ts` and what they feed. |
| **Every colour** | [`docs/brand-palette.md`](docs/brand-palette.md) — read off the LOGO, with the pixel each came from and its contrast. ⚠️ The amber palette that cited a brand-guide PDF not in this repo is superseded; do not restore it. |
| **What the site claims** | `/privacy` and `/data-and-safety` make **checkable** claims (no third-party requests; what the app stores about a child). ⚠️ Since 2026-09-19 `/data-and-safety` makes no camera claim — the app's camera chapters are hidden. Every product fact on `/adaptivelearn`, `/for-schools` and `/data-and-safety` was re-read from the app's `release` branch that day; when the app changes, those pages are stale until re-read. Both files carry a header comment saying what was measured. Break one and fix the page in the same commit. |
| **Session state** | [`handoff.md`](handoff.md) — read it first, update it when the session wraps. Its top note "START HERE" (2026-11-23) lists what the 14–23 Nov sessions merged and what is still open. |

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
somewhere), plus `check:pricing` and `check:social`. (`check:hero-contrast` went with the video hero on
2026-09-25; the home page's first screen is now the journey, and nothing re-measures its text contrast yet.)

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

# Write every answer in ASD-STE100 (Simplified Technical English)

Use ASD-STE100 rules for all replies, recaps, commit messages, PR text and docs. This applies to every project.

- Use simple words. Give one word one meaning. Use the same word for the same thing every time.
- Keep sentences short: 20 words maximum for instructions, 25 words maximum for descriptions.
- Write one instruction in one sentence. Put the instructions in a numbered list when the order is important.
- Use the imperative for instructions ("Run the tests."). Use the active voice ("The script deletes the file.").
- Use only the simple tenses: present, past and future. Do not use "-ing" forms as verbs or nouns where you can avoid them.
- Do not leave out articles ("the", "a") or verbs to make a sentence shorter.
- Keep one topic in one paragraph. Use 6 sentences maximum in a paragraph.
- Put a warning or caution before the instruction it is about. Start it with the danger, then the action.
- Use technical names (files, commands, functions) exactly as they are. Do not change code, commands or quoted text to STE.
- Reply in the language of the user. English message: English STE. Hindi or Hinglish message: Simplified Hinglish (rules below).

## Simplified Hinglish (STE rules for Hinglish)

Use these rules when the user writes in Hindi or Hinglish. They are the STE rules, adapted to Hinglish.

**Script and words**
- Write in Roman script only. Do not use Devanagari.
- Keep technical words in English: file, branch, commit, test, error, deploy, API, database.
- Use common spoken Hindi for the rest. Do not use difficult Sanskrit or Urdu words (not "sanshodhan", "tasdeek"; use "change", "check").
- Use one word for one meaning, every time. Fixed terms: "file", "change", "error", "fix", "test", "step", "check".

**Sentences**
- One sentence has one idea. Instructions: 15 words maximum. Descriptions: 20 words maximum.
- Use Hindi grammar order: subject, object, verb. Example: "Script file ko delete karti hai."
- Use active voice. Write "Maine file change ki", not "File change ki gayi".
- Use simple tenses only: "karta hai", "kiya", "karega". Do not use "kar raha hoga", "kiya ja chuka hai".

**Instructions**
- Use the "karo" form for instructions: "Tests run karo." "Branch push karo."
- Use one English verb + "karo / kiya / karega". Fixed set: run, check, add, delete, change, fix, push, open, save, install.
- Put one instruction in one sentence. Use a numbered list when the order is important.
- Put a warning before the instruction: "**Dhyan do:** Ye command data delete karti hai. Pehle backup lo."

**Paragraphs and format**
- One paragraph has one topic and 6 sentences maximum.
- Do not write filler words: "basically", "matlab", "actually", "toh dekho".
- Keep code, commands, file names and quoted text exactly as they are.
