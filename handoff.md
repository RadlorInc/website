# Session Handoff — Radlor website

> **Read [CLAUDE.md](CLAUDE.md) first.** It says where every fact lives and what the rules are.
> This file is only "where work left off". Keep it short — the product repo's handoff grew to 60 KB
> and is now a running cost on every session.

## Where it is right now

**Live at radlor.com**, as the Vercel project `website`, from `github.com/RadlorInc/website`.
Production tracks the tip of `main` — **do not pin a SHA here**, it is stale the next time anyone
pushes and this file has already cost one session by being believed when wrong. Check it instead:
`git log --oneline -1 origin/main`, then confirm production actually moved. Last verified at
`c29ec14` on 2026-08-30 against production rather than the dashboard:
`/pricing` serves `$7.99`, `Free while` returns zero hits, `/waitlist` and both outcome pages are
200, the JSON-LD carries 8 offers all pointing at `radlor.com/waitlist`, and a form-encoded POST
with no JavaScript persisted a row to the `ghuvnq` Supabase project and was then deleted. The
waitlist table is empty and ready.

> ⚠️ **This section has been wrong twice, in opposite directions.** It said *"nothing is deployed
> and there is no GitHub repo"* for ten days after both became false, which cost a session. It was
> then rewritten to say the work was *unpushed* — and went stale again within the hour, when it
> was pushed. A handoff nobody updates is worse than no handoff, because it is believed.
> **If you change where something lives, change it here in the same commit.**

⚠️ **The Vercel connector cannot see this project.** Both this session and the last one called
`list_projects` on `kuwari84-2322's projects` and got back exactly one project — `adaptivelearn`,
linked to `RadlorInc/learn` — even though the dashboard shows `website` on the same account. So
the connector's grant is scoped to that one project. The practical cost: **a failed deploy cannot
be seen from here.** Nobody can read the build log, confirm a SHA, or notice a silent break — it
would only surface as "production did not change". Re-grant the Vercel connector access to the
`website` project. Until then, verify deploys by fetching radlor.com, the way this one was.

## The palette came off the logo (2026-08-29)

**The site and the logo were two different brands.** `radlor_logo/` holds the mark — a white robot
with a **cyan** ring orbiting its head — and the site was built in **amber**, a colour that appears
nowhere in it. The amber came from `Radlor Brand Kit/Radlor-brand-guide.pdf`, cited by both
`site.ts` and `globals.css`, **which is not in this repo and nobody can open**. The logo won: it is
the thing people actually see. Every value now comes off a pixel in the mark, and
[`docs/brand-palette.md`](docs/brand-palette.md) records which pixel and what it measured.

| | before | now |
|---|---|---|
| The light | Amber `#E9A93A` | **Cyan `#00E5FF`** — the ring's core and the eyes |
| Identity | Blue `#4E9AD6` | **Blue `#0061F3`** — the ring's edge and the collar |
| Links | `#2C6A98` | **`#0B57C7`** — a darker stop of that same blue, 6.2:1 |
| Ink / Paper | `#16202B` / `#F7F9FB` | **`#0A1119` / `#F5F8FC`** — the visor, and its ground cooled |

`--amber` is now `--glow`, because the token should say what it IS. Its rule is unchanged and
stricter than before: **cyan is 1.4:1 on Paper — worse than amber's 1.9:1 — so it can never be
text.** It goes behind words, which is also what the ring does: it is behind the head, not painted
on it.

**Three things this uncovered, all of them older than the palette:**

1. **The dark-mode CTA was 1.5:1.** `bg-accent text-white` was hard-coded in six files; in dark
   mode the accent is a light blue and white on it is unreadable. There is now an `--on-accent`
   token that flips to Ink, and no page carries `text-white` any more.
2. **The four Satori routes carried a THIRD palette** — rust `#b4491f` on cream `#fbfaf7`. Every
   favicon and every share card was off-brand and nothing caught it, because `BRAND` in `site.ts`
   claimed those routes imported it and **nothing imported it at all**. They do now.
3. `app/icon.tsx` still draws a letter **R**. A real mark exists; see the last section of
   `docs/brand-palette.md`.

Measured in headless Chromium, both themes: body 17.8:1 / 18.5:1, muted 6.1 / 10.9, links 6.2 /
13.0, CTA label 6.6 / 12.5. Everything passes AA in both.

## The logo is now ON the site (2026-08-29)

Taking the palette off the logo was only half of it — the logo itself was still nowhere. The header
said "Radlor" in a serif with a drawn glow imitating a mark that existed as a file; the favicon drew
a letter **R**; the share cards had no mark at all.

- **Header** — `public/mark-black.png` / `public/mark-white.png` at 57×40 beside the wordmark,
  picked by `<picture>` on `prefers-color-scheme`. The drawn glow is gone from the wordmark: it
  was imitating the thing that is now actually there.

  ⚠️ **Two artworks, and `filter: invert()` is NOT a substitute.** In the white mark the head is
  solid with the visor cut out of it; in the black one the head is an outline. They are different
  drawings, not one negated, which is why the brand ships both and why this is a `<picture>`.
  `next/image` cannot do this — it has no art-direction — so the header uses a plain `<img>`
  deliberately, with `width`/`height` set so the row does not reflow.

  Both are generated from `radlor_logo/Mark Mono {Black,White}.png`, which are RGB with **no
  alpha**: the recipe is luminance→alpha (invert for the black one), a floor at ≤4 to kill the
  1/255 film the not-quite-pure source backgrounds leave, one shared crop box so the two variants
  register identically, and a master at 4× the display box so nothing is squashed. Rendered
  smaller than ~40 px tall the hairlines and star field turn to mush — 32 px was tried and is
  illegible.
- **Favicon / touch icon** — `app/icon.png` and `app/apple-icon.png`, replacing the two `.tsx`
  routes that drew the letter.
- **Both share cards** — the mark inlined from `public/mark-black.png`, read off disk at build.
  The cards are drawn on Paper, so they take the BLACK variant; the white one would vanish.
- **Favicon / touch icon stay full-colour** (`app/icon.png`, `app/apple-icon.png`). A tab has
  no theme for `<picture>` to read and browser chrome can be either shade, so the mono marks
  are the wrong tool there. `public/mark.png`, the old full-colour crop, is now referenced by
  nothing and can be deleted.

`docs/brand-palette.md` records the crop and why it is that tight.

⚠️ **`_to_delete/` at the repo root holds `icon.tsx` and `apple-icon.tsx`. Delete it.** This session
was not permitted to delete files, and **Next cannot have both `icon.tsx` and `icon.png`** — the
build may pick the wrong one until that folder is gone.

## The motion layer

**All 10 pages animate, and it is 100% CSS.** The whole system lives in the `MOTION` block at the
foot of `app/globals.css`; pages only add class names. Zero client components, zero packages, zero
scroll listeners — so every route is still statically prerendered and a crawler still gets the full
copy on the first byte. **That is the constraint, not a coincidence: if the CSS layer cannot do an
animation, that is a reason to want it less, not a reason to ship JS onto a page an answer engine
reads.**

| | |
|---|---|
| **On load** | `rl-rise` (copy lifts), `rl-focus` (headline resolves out of blur), `rl-lit` (the ring AND its light around ONE word — `--lit` scales both), `rl-lightfield` / `rl-halo` / `rl-glow` (the room) |
| **On scroll** | `rl-reveal`, `rl-reveal-focus`, `rl-reveal-left`, `rl-rule`, `rl-tick`, `rl-lampdot`, `rl-num`, `rl-trace` (an SVG stroke drawing itself), `rl-parallax`, `rl-progress`, `rl-prose` |
| **On hover** | `rl-card`, `rl-row`, `rl-block`, `rl-link`, `rl-cta` |

`--i` staggers a scroll-driven animation by shifting its RANGE — there is no wall clock on a
scroll timeline, so `animation-delay` does nothing. `--d` delays an on-load one, which does.

**The light is a RING, not a bulb.** It was a ray fan until 2026-08-29, because the superseded
brand guide described a bulb. In the actual mark the light is an orbit, so `rl-lit::after` is now a
circle squashed and tilted into an ellipse, with a bright arc lapping it every nine seconds — the
mask is squashed with the fill, which is what gives the stroke a real ring's uneven weight instead
of the even outline a `border` would draw. `rl-halo` is the same ring at the scale of a room.
The arc rides an `@property` angle; without `@property` it still renders, it just jumps once a lap.

**One light per page**, and it lands on the word carrying that page's idea: `child` on home,
`changes` on `/adaptivelearn`, the price on `/pricing`, `different` on `/for-schools`, `plain` on
`/data-and-safety`. Amber never touches the letters — it goes behind them, so the headline keeps
13:1 instead of amber's 1.9:1 on Paper.

⚠️ The header wordmark used to carry a seventh light and no longer does — `public/mark.png`
replaced it. So `/contact`, `/privacy`, `/writing` and each post now have **no** light at all,
where previously the wordmark gave them one. That is a consequence of the logo swap, not a
decision anyone wrote down; if those pages should keep a light, the mark is the thing to put it
behind. `.rl-lit-still`, the class that stopped the wordmark breathing, was deleted 2026-08-29 —
it was styling markup that no longer existed.

Three rules keep it safe: on-load animations use `animation-fill-mode: both` and END visible;
scroll-driven ones live inside `@supports (animation-timeline: view())` so an older browser gets
no animation and fully visible content; `prefers-reduced-motion: reduce` turns the layer off last
in the file, so it wins.

Verified on the Mac, 2026-08-28. Build clean and every route still prerendered. All 10 pages:
0 console errors, no overflow at 360 / 375, one `<h1>` each. The light lands on the right word on
all six pages that carry one — `child`, `changes`, the price, `different`, `plain` and `Radlor` on
/about — and the word itself still computes to Ink, so amber never touches the letters. (That run
also counted the header wordmark, which carried a light until the logo swap.) Under
`prefers-reduced-motion: reduce` (flipped in the CSSOM, so the real cascade was evaluated rather
than eyeballed) all 10 land readable: nothing faded, nothing still animating, pseudo-elements
included. And the failure mode worth naming: stepping each page to the bottom in 400 px increments
left **nothing** stranded below `opacity: 1`, including the two ~5,500 px pages — which is the way
a scroll-driven reveal actually breaks.

## ⚠️ THE WAITLIST IS THE ONLY DOOR — 2026-08-31

Everyone currently inside AdaptiveLearn is a **tester**. From today nothing on radlor.com lets a
visitor enter, sign in or create an account. The app stays up; this is a change to what the
marketing site OFFERS, not a shutdown.

**One clickable link to the app origin remains in the whole built site**, and it is deliberate:
`adaptivelearn.radlor.com/legal/privacy` on `/data-and-safety`. It is a document, not a door —
delete it and the page starts claiming a policy nobody can read.

Doors closed: the header CTA (now `/waitlist`, and it is on every page), the `/adaptivelearn`
hero, `/pricing`, the home hero, and `/contact`'s "Early access" reason, which offered an account
by email. `llms.txt` said the product was "available at" the app URL — an answer engine reading
that would send people to the door, so it now says it is not open for signup and names the
waitlist as the only way in.

⚠️ **`/privacy` names the app origin as text, not a link — a deviation from the brief, which had
it under KEEP.** The sentence is a fact and the page's argument needs it, so the words stayed; but
it was wrapped in an `<a>` to the app ROOT, whose homepage links straight to `/auth`. Naming
survives, the door does not. Revert to an anchor only if the app closes public signup.

⚠️ **`/for-schools` keeps its mailto and did NOT become the waitlist.** A school asking about
thirty children is a conversation, not a signup: the waitlist form collects an email and one
child age band, which is meaningless for a class, and the page already promises we set the first
class up personally. Sending a head of maths to a one-field consumer form would be a worse
experience AND a worse lead.

⚠️ **This repo cannot close the last door.** `adaptivelearn.radlor.com/auth` returns 200, the app's
own homepage links to it, and it carries no `noindex`. `robots.txt` has `Disallow: /auth`, which
is not the same thing: it stops a well-behaved crawler FETCHING the page but does not stop a human
who has the URL from creating an account, and a disallowed URL can still be indexed as a bare link.
Worse, the Disallow means Google cannot read a `noindex` if one is added — the two directives
cancel out. The fix is in `../milo-story-mode`: either close public signup, or drop the Disallow
and serve `noindex` on that route. Doing both in the wrong order achieves nothing.

## Pricing and the waitlist — 2026-08-30

**The product is no longer free.** $7.99 first child, $4.99 each additional, up to 4; annual
$75.99 + $48.00 each additional. All of it derives from `PRICING` in `site.ts` — the table, both
JSON-LD `Offer` sets, the FAQ answers and the home fact row. **No price is typed on any page.**

- `npm run check:pricing` is the gate. It pins the three figures already published to families and
  fails if annual stops saving over 20% on ANY plan. The saving SHRINKS as children are added
  (20.74% → 20.15%), so the largest plan breaks the claim first and it is the row nobody re-reads.
- Percentages are **floored, never rounded** (`savedPctLabel`). `toFixed(1)` renders 20.155% as
  "20.2%", which claims a bigger discount than exists. Flooring can only understate.
- Money is in **cents**. `7.99 + 4.99` in floats is `12.979999999999999`.
- ⚠️ **A promise was deleted, not discharged.** "What happens when it stops being free" told
  early-access families they would hear about a price from us first, with notice, and that nothing
  their child had done would be locked. It was removed on the founder's call. Those families are
  still here and the promise was public — it now has to be kept by writing to them directly.
- ⚠️ **No school price is published.** A class is not a family and the per-child rule does not fit
  one; `/for-schools` and `/pricing` both say we work it out with you. Nobody decided a number.

**The waitlist** is `/waitlist` → `POST /api/waitlist` → Supabase, server-to-server.

- ⚠️ **The browser never touches supabase.co.** There is no `supabase-js` in this repo at all —
  the route handler uses `fetch` against the REST endpoint, so the SDK cannot be bundled by
  accident. The key is the SERVICE ROLE key, server-side. **Never add a `NEXT_PUBLIC_` Supabase
  variable**; that prefix is what puts a value in the browser.
- ⚠️ **It works with JavaScript off** and must keep doing so: plain `<form method="post">`, a 303,
  and outcome pages that are real URLs. `/waitlist/thanks` and `/waitlist/problem` are separate
  STATIC routes rather than `?ok=1`, because reading `searchParams` would make `/waitlist` dynamic
  and a query string cannot be read without JS anyway.
- The `Location` header is **relative** on purpose — `SITE_URL` is radlor.com, so an absolute
  redirect would bounce a localhost submit onto production.
- RLS on, **no policies, deliberately**. Policy-less + RLS = deny-all for anon; the service role
  bypasses it. Adding an INSERT policy "so the form works" would make the table world-writable.
- Honeypot returns *thanks*, not an error — an error tells the author what to fix. No CAPTCHA:
  every one is a third-party script and would break /privacy.
- ⚠️ **The table does not exist yet.** `supabase/migrations/20260830000000_waitlist.sql` is
  written but unapplied — no Supabase project was reachable from this session. Until it is applied
  and `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are set, every valid signup lands on
  `/waitlist/problem` and logs. Run `get_advisors` after applying.

**/privacy was rewritten**, not patched — it had said "There is no form here". Its header comment
now records a re-measurement taken after the form landed: 0 external hosts on four pages,
0 cookies, 0 storage keys, no `supabase.co` in the HTML.

## The home hero

Rebuilt 2026-08-29 as a full-bleed dark section: `min-height: min(88vh, 780px)`, the ambient
`rl-lightfield` layers as the ground, a scrim over them, the existing headline and CTAs, and a
row of four checkable facts linking to `/data-and-safety`.

**It was specced with a looping video and shipped without one.** The clip supplied was abstract
dunes under a sky of floating digits — measured **0.00% cyan/brand-blue, 54.5% warm pink-orange**,
against a brand whose signature colour is `#00E5FF`. It also put a wall of numerals on the front
door of a company whose own post argues a child should never see the number. The ground stayed
CSS. **A `<video>` slots into `app/page.tsx` under `.rl-hero-scrim` and nothing else changes.**

Three things worth not relearning:

- **The hero is dark in BOTH themes** and pins the dark palette locally. It sets the raw tokens
  (`--glow`, `--brand-blue` — read directly by `.rl-glow` / `.rl-lit`) *and* the `--color-*` ones,
  because `@theme inline` resolves `--color-*` at `:root`; overriding only the raw tokens would
  never reach `text-muted` or `bg-accent`.
- **The scrim floor is 0.64, not the 0.55 first specced.** Against a pure-white pixel — the upper
  bound for any content that could sit here, a video included — 0.55 measures 4.11:1 on the
  headline and fails the 4.5:1 the scrim exists to provide. 0.64 measures 5.68:1.
- ⚠️ **`.rl-lit`'s ring had to be dimmed for this ground, and this is the one thing the hero could
  not inherit.** It was tuned against Paper, where 62% cyan is a soft tint; over near-black the arc
  measured `rgb(36,163,189)` and dropped the headline to **2.80:1**, under the 3:1 large-text
  floor. The scrim cannot fix it — `.rl-lit` is in the content layer above it. The mix is lowered
  in `.rl-hero .rl-lit::after` instead. Use percentages, **not `opacity`**: `rl-fade-in` fills
  opacity forwards to 1 and an animated value beats a static declaration, so `opacity` there
  silently does nothing.

Measured after the fix, worst case per region (headless Chrome, text hidden so glyph
antialiasing could not pollute the background sample):

| | worst-case background | ratio | needs |
|---|---|---|---|
| headline over the ring's brightest arc | `rgb(18,103,117)` | **6.12:1** | 3.0 |
| subhead | `rgb(9,38,47)` | **8.70:1** | 4.5 |
| eyebrow | `rgb(9,35,42)` | **10.76:1** | 4.5 |
| fact labels / descriptions | `rgb(7,14,20)` | **17.9 / 10.8:1** | 3.0 / 4.5 |

⚠️ **On phones the hero is taller than its `min-height` and the next section does not peek** —
855 px at 360×780, 829 at 375×812, because the content is simply that tall. It peeks properly at
768 (179 px visible) and 1280 (31 px). The facts row is clipped at the fold, which is what signals
scrollability there. Cutting another ~90 px means dropping the subhead or the facts row.

## What exists

**Ten pages.** `PAGES` in `site.ts` is the list; header shows five, footer shows all.

```
site.ts                    every shared fact + PAGES (the one page list) + company TODOs
app/layout.tsx             metadata + Organization/WebSite JSON-LD + header + footer
app/page.tsx               home — what we believe, the product card, latest writing
app/adaptivelearn/         how a chapter works, answering with hands, the six age bands,
                           6 parent FAQs · SoftwareApplication + FAQPage
app/pricing/               the price table, generated from PRICING in site.ts; what every
                           plan includes; schools · SoftwareApplication + Offers
app/waitlist/              the form (+ /thanks, /problem — static outcome pages, noindex)
app/api/waitlist/          Route Handler; the ONLY thing that talks to Supabase
app/for-schools/           setting up a class, good-at / not-built-for, 5 FAQs · FAQPage
app/data-and-safety/       the camera, what we store, who else sees it, deleting it,
                           and what we have NOT finished
app/privacy/               this website only: no cookies, no analytics, no third parties
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
- **Nine pages, then stop.** `/features`, `/faq`, `/team` and comparison pages were considered and
  refused: they would compete with pages that already exist. Everything after this should be an
  ARTICLE, not a marketing page — GEO comes from articles.
- **`/privacy` and `/data-and-safety` are separate on purpose.** One is about this website (which
  collects nothing), one is about the product (which necessarily does). Merging them buries the
  interesting half.
- **No compliance badge anywhere.** `/data-and-safety` describes what we do and has a section
  headed *what we have not finished*, which states plainly that email-and-password signup is not a
  formal age-verification method. ⚠️ Do not "improve" this into a claim of COPPA compliance.

## Next steps, in order

1. ~~**Fill in `docs/brand-facts.md`**~~ — **done 2026-08-29, except the founder row.** `sameAs`
   carries six profiles and `npm run check:social` follows every one to a real Radlor profile;
   `FOUNDED_YEAR` is confirmed `2026`; `LOCATION` is the Delaware address and the `PostalAddress`
   block now renders. ⚠️ This item said `sameAs` "is currently empty" until 2026-08-29 — it had
   been filled on 2026-08-20 and this line was never updated. **Only `docs/brand-facts.md` is
   authoritative about which facts are open; this list drifts.** The one still open is *Founder /
   team*, which is a decision, not a lookup.
2. **Look at the copy.** Every word is mine, written from what the product actually does. The About
   page's "why we started" especially — it should be in the founder's voice, not mine.
3. **Deploy.** New Vercel project (NOT the existing one), `radlor.com` as its production domain,
   `NEXT_PUBLIC_SITE_URL=https://radlor.com`, plus the two the waitlist needs —
   **`SUPABASE_URL`** (no trailing slash) and **`SUPABASE_SERVICE_ROLE_KEY`** — in
   **Production AND Preview**. ⚠️ Env vars are read at build/run time, so adding them does **not**
   change an existing deployment: **redeploy.** Names and where each value comes from are in
   `.env.example` and README.md. ⚠️ Never `NEXT_PUBLIC_` either Supabase var — that inlines it into
   the browser bundle, and a service key there is write access to every table. ⚠️ The key must be
   the radlor-site project's, **not** the product's (`qaymxunzlarwusogwyak`), which holds
   children's data. Without them the site builds fine and every signup 303s to /waitlist/problem.
   ⚠️ **The product repo's lesson applies here too: after
   connecting Git, push once and confirm a deployment actually appears. A green settings page is not
   evidence.** ⚠️ And Vercel Hobby will not host a private org-owned repo via the Git integration —
   keep the repo public until Pro.
4. **Write two or three more posts.** For GEO this is the whole game: answer engines cite articles,
   not homepages. Each post's `description` should state a finding a model can quote.
5. **Legal pages.** The product carries `/legal/privacy` and `/legal/terms` on its own origin. This
   site collects nothing, so it needs at most a short privacy note — but it should say so out loud
   rather than have nothing.

## The one-shot check

Drive `preview_start` on the `radlor-site` config — port 3021, defined in **this repo's**
[`.claude/launch.json`](.claude/launch.json). The port itself lives in the `dev` script in
`package.json`, so `npm run dev` by hand lands on 3021 too. It used to be declared in the product
repo's launch file as well, same name and same port; the duplicate was removed 2026-08-29 because
one fact in two files is the thing CLAUDE.md forbids. Then in the page:

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
