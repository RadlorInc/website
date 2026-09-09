# Handoff archive — Radlor website

Sections moved out of [`handoff.md`](../handoff.md) on 2026-09-09, when that file reached 72 KB —
larger than the 60 KB product-repo handoff its own opening line warns against becoming.

**Nothing here was deleted and nothing was edited.** These are the sections verbatim. They were
moved because they describe work that is *finished and settled*: they no longer change what anyone
does next, which is the only job `handoff.md` has. The history is worth keeping — it is where the
reasoning lives — it just should not be re-read every session.

⚠️ **EVERY LOAD-BEARING WARNING IN HERE IS ALSO ENFORCED IN CODE, AND THAT WAS CHECKED BEFORE THE
MOVE, NOT ASSUMED.** The `media`-on-`<source>` rule that keeps the hero JS-free is commented in
`app/page.tsx`; the scroll and reduced-motion rules are in `app/globals.css`; "do not restore the
amber palette" is in `CLAUDE.md`, `site.ts` and `docs/brand-palette.md`; the waitlist-is-the-only-
door rule is in `app/layout.tsx`. **If you archive another section, run that check first** — a
warning that lives only in prose, moved somewhere nobody reads, has been deleted in every way that
matters.

## The palette came off the logo (2026-08-29)

**The site and the logo were two different brands.** `radlor_logo/` holds the mark — a white robot
with a **cyan** ring orbiting its head — and the site was built in **amber**, a colour that appears
nowhere in it. The amber came from `Radlor Brand Kit/Radlor-brand-guide.pdf`, cited by both
`site.ts` and `globals.css`, **which is not in this repo and nobody can open**. The logo won: it is
the thing people actually see. Every value now comes off a pixel in the mark, and
[`docs/brand-palette.md`](../docs/brand-palette.md) records which pixel and what it measured.

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

## ⚠️ `entry` RANGES WERE A BUG FOR THE WHOLE SCROLL LAYER — fixed 2026-08-31

Rafi reported "no motion on scroll". It was running; nobody could see it.

**The misconception:** `entry 4% → 64%` was written believing those were percentages of the
VIEWPORT. They are not. Per spec the `entry` range runs from the element's top edge crossing the
viewport's bottom edge to its bottom edge crossing the same line — **its length is exactly the
element's own height.** So the percentages are of the element, and the window collapses as
elements get smaller. Raising them cannot help.

Measured on the live page at a 1440x900 viewport, before:

| class | height | animation ran over | completed at |
|---|---|---|---|
| `.rl-reveal` fact card | 82px | **45px of scroll** | 93% down the screen |
| `.rl-reveal-focus` h2 | 35px | **15px** | 97% down |
| `.rl-rule` | 1px | **0px** | never animated — it appeared |
| `.rl-tick` | 1px | **0px** | the same |
| `.rl-lampdot` | 8px | 8px | — |

Every one finished in the bottom 3–7% of the screen, before a reader's eye arrived.

**The fix is `cover`, not bigger numbers.** `cover` runs from the element's top edge at the
viewport's bottom to its bottom edge at the viewport's top, so its length is VIEWPORT + ELEMENT —
901px to 1188px across this site, viewport-dominated and near-constant. Ratio of longest to
shortest range went from **288:1** (1px rule vs 288px card) to **1.3:1**. After:

| class | animation runs over | completes at |
|---|---|---|
| `.rl-reveal` fact card | **450px of scroll** | 49% down — mid-screen |
| `.rl-reveal-focus` h2 | **420px** | 52% down |
| `.rl-rule` | **405px** | 54% down |

Same page, same scroll position with the fact row 72% down: before, all four cards sat at opacity
**1.00**; after, **0.60 / 0.53 / 0.46 / 0.40** across the row — a visible fade and a visible
stagger.

⚠️ **THE 3% STAGGER IS DERIVED IN PIXELS, NOT INHERITED.** It was 6%, which on `entry` was ~5px
per step — the stagger this file claimed for months **did not exist**. On `cover` the same 6% is
~60px per step, and `--i` reaches **7** on this site: item 7 would have finished 44px from the TOP
of the screen, i.e. after the reader had scrolled past it. 3% is ~30px per step and leaves item 7
finishing 234px down. **Re-derive in pixels if a group ever grows past `--i: 7`.**

`var(--i, 1) - 1` so the first item of a group — and anything with no `--i` — gets exactly
`cover 0% → 45%`.

⚠️ **THE MINIFIER REWRITES THESE AND IT IS LOSSLESS.** The production CSS contains
`animation-range:cover cover 45%` and bare `animation-range:cover`. Verified at runtime against
`next start`: they resolve to `cover 0% cover 45%` and `cover 0% cover 100%`. Do not "fix" them.

**Browser support, measured 2026-08-31:** Chrome 152 **yes**, Safari 26.5 **yes**. Safari blocks
WebDriver and Apple-Events JS on this machine, so it was measured with a CSS-only `@supports`
probe read off the screen — the probe is worth rebuilding if the question ever returns. Firefox
not installed, not measured. **There is no no-JS fallback decision to make.**

⚠️ **`.rl-rise` AND `.rl-focus` ARE NOT IN THE `@supports` GATE** — they are time-based on-load
animations. That is why the symptom was deceptive: the hero animates everywhere, so "the hero
moves, nothing below does" looks like a broken scroll layer and is equally consistent with one
that runs and finishes unseen.

## The motion layer

**All 10 pages animate, and it is 100% CSS.** The whole system lives in the `MOTION` block at the
foot of `app/globals.css`; pages only add class names. Zero client components, zero packages, zero
scroll listeners — so every route is still statically prerendered and a crawler still gets the full
copy on the first byte. **That is the constraint, not a coincidence: if the CSS layer cannot do an
animation, that is a reason to want it less, not a reason to ship JS onto a page an answer engine
reads.**

| | |
|---|---|
| **On load** | `rl-rise` (copy lifts), `rl-focus` (headline resolves out of blur), `rl-lit` (the ring AND its light around ONE word — `--lit` scales both), `rl-lightfield` / `rl-glow` (the room, on every page except home — the home hero's ground is the video) |
| **On scroll** | `rl-reveal`, `rl-reveal-focus`, `rl-reveal-left`, `rl-rule`, `rl-tick`, `rl-lampdot`, `rl-num`, `rl-trace` (an SVG stroke drawing itself), `rl-parallax`, `rl-progress`, `rl-prose` |
| **On hover** | `rl-card`, `rl-row`, `rl-block`, `rl-link`, `rl-cta` |

`--i` staggers a scroll-driven animation by shifting its RANGE — there is no wall clock on a
scroll timeline, so `animation-delay` does nothing. `--d` delays an on-load one, which does.

**The light is a RING, not a bulb.** It was a ray fan until 2026-08-29, because the superseded
brand guide described a bulb. In the actual mark the light is an orbit, so `rl-lit::after` is now a
circle squashed and tilted into an ellipse, with a bright arc lapping it every nine seconds — the
mask is squashed with the fill, which is what gives the stroke a real ring's uneven weight instead
of the even outline a `border` would draw. The arc rides an `@property` angle; without `@property`
it still renders, it just jumps once a lap.

⚠️ **`rl-halo` AND `rl-glow-core` ARE GONE** — they were the home hero's extra layers, the video
covers them completely, and dead CSS is not kept for sentiment. `rl-lightfield` and `rl-glow` still
run on the ten other pages. This table listed `rl-halo` as live for a day after it was deleted.

**One light per page**, and it lands on the word carrying that page's idea: `child` on home,
`changes` on `/adaptivelearn`, the price on `/pricing`, `same` on `/for-schools`, `plain` on
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

## The scroll-scrubbed hero — REMOVED, 2026-08-30

**It is gone and it is not coming back.** For a few days the home page was a 400vh sticky section
scrubbing 180 pre-rendered frames onto a `<canvas>`. It was not smooth enough — it stepped, because
it was stepping — and on a phone the mark's face sat behind the headline where the subhead needed
scrim 0.72 and the eyes needed 0.13, thirty pixels apart. `app/HeroScrub.tsx`, `public/hero/` and
`.rl-scrub-*` are all deleted. **Do not tie a hero to scroll again.**

## The hero is a looping background video — 2026-08-30

`public/hero.webm|mp4` (1600x900) and `public/hero-portrait.webm|mp4` (720x1280), plus a poster
each. No JavaScript at all: `app/page.tsx` is still a server component, the route still prerenders.

### The clip needed fixing before it could be used

Higgsfield produced it from `hero-seed.jpg`. Two generations were measured and **both failed the
same way**: the subject transform animates. v2 (the one Rafi picked) grows the chrome head from
820x568 to 1220x888 — 1.49x by 1.56x — and drifts 198px left, 10% of the frame width. Camera
prompts did not bind it.

The zoom was accepted as art direction. The **loop was not**: frame 1 against frame 193 measured a
mean absolute difference of **29.5/255 with 24.5% of pixels over 24**, against **1.8 / 2.2%** for an
ordinary frame step — a snap you would see every eight seconds, forever.

⚠️ **THE FIX IS A PING-PONG, AND IT IS WHY THE FILE IS 189 FRAMES AND NOT 193.** The shipped clip
is the first **4 seconds** forward, then the same frames reversed, with the duplicate frame dropped
at BOTH the turn and the seam (`trim=start_frame=1:end_frame=NF-1` on the reversed stream — without
it each end holds a frame twice). The end equals the start by construction. Measured on the shipped
encodes the loop seam is **1.07 mean / 1.59%**, *below* a normal frame step of 1.78 / 2.36%.

**4 seconds, not the full 8, and that was measured too.** At the midpoint of a full-8s ping-pong the
mark's left edge reaches x=265 — 21% across, pure white inside the headline box — and no gradient
survives that. At 4s it reaches x=515.

| variant | loop | webm | mp4 | mark's left edge at the midpoint |
|---|---|---|---|---|
| full 8s | 16.0s | 1,320,602 B | 957,541 B | x=265 (21% across) — unusable |
| **first 4s** | **7.88s** | **779,142 B** | **622,351 B** | **x=515 (40%)** |
| first 5s | 9.88s | 765,108 B | 515,222 B | x=481 (38%) |

### Numbers to not re-derive

| | desktop | mobile |
|---|---|---|
| file served | `hero.webm` 761 KB | `hero-portrait.webm` 182 KB |
| first load, motion allowed | 1,194,609 B (1167 KB) | 520,747 B (509 KB) |
| first load, reduced motion | 415,132 B (405 KB) | 352,943 B (345 KB) |
| video requests, reduced motion | **0** | **0** |
| subhead / headline worst case | 5.06:1 / 9.41:1 | 11.16:1 / 19.03:1 |
| mark body / eye at the loop start | `#d0d1d4` luma 209 / `#17dbed` g 219 | `#d8dade` luma 218 / `#1fe0f0` g 224 |

⚠️ **THE COPY IS 30rem AND THE NUMBER COMES FROM THE MARK'S EYES.** The subhead needs scrim 0.72
wherever it crosses white chrome; an eye needs 0.13 or less to stay `#00E5FF`. At 38rem the copy
ended at x=758 and the left eye reaches x=752 — six pixels, and no gradient fits in six pixels. At
30rem the copy ends at x=608, leaving 144px of falloff. **Widen the copy and the mark goes grey.**

⚠️ **REDUCED MOTION IS `media` ON `<source>`, NOT CSS.** When no `<source>` matches, the resource
selection algorithm loads nothing — not hidden, not paused, never requested. Verified by counting
requests in headless Chrome with `Emulation.setEmulatedMedia`: **zero** video requests, one poster.
The same attribute picks the orientation. *Caveat:* `media` on `<source>` is specced and works in
Chromium; a browser that ignored it would fetch the video under reduced motion. Re-measure if that
matters more than it does today.

⚠️ **`object-position: 50% 0` ON THE PORTRAIT VIDEO IS LOAD-BEARING.** A tablet in portrait gives a
hero box of 768x780 — nearly square — and cover-fitting a 9:16 file into it crops 586px of height.
Centred, the mark landed at y −139..91, its top half sliced off. Anchored to the top it is whole.

⚠️ **THE MOBILE MARK IS SMALL ON PURPOSE.** The mobile hero has only ~140px of clear height above
the eyebrow, so the portrait file crops tight to the mark (`crop=882:648:604:143`), scales it to
300px and seats it at y 15..130 — above the copy, and clear of the eyebrow horizontally too. A
letterboxed full-width version put the ring straight through the headline.

### The check that catches all of it

`npm run check:hero-contrast` decodes both files through the ffmpeg bundled in `imageio-ffmpeg`
(no system ffmpeg) and gates **two opposing things**: the copy at the real text boxes, and a floor
under how dark the mark's body and eyes may go. The first is always winnable by painting everything
black; the second is what stops that. It also reports the midpoint frame separately, because that
is where the mark is largest and nearest the copy.

⚠️ **ITS BOXES ARE HERO-RELATIVE, NOT VIEWPORT-RELATIVE, AND THE DIFFERENCE IS 65 PIXELS.** The
video and the scrim are `inset: 0` inside `.rl-hero`, which starts below the sticky header. With
viewport coordinates the check passed the mobile headline at 19:1 while a screenshot plainly showed
the ring crossing it. **A screenshot caught what the measurement missed; take both.**

⚠️ **THE EYE DETECTOR HAS THREE FIXES IN IT, EACH FROM A WRONG NUMBER.** The cyan mask is clipped
to the head's 10th–90th percentile box (a plain bbox let the ring's rim report as an "eye" at scrim
0.74); candidates are separated in BLOCK indices, not pixel coordinates (mixing them returned two
blocks of one blob as "two eyes"); and the pair is chosen for being LEVEL, since the head is drawn
with a slight tilt. Block size is 4 — the portrait file scales the mark down until larger blocks
never fill.

`hero-source.mp4` is the Higgsfield master, gitignored: 2.9 MB the site never serves, kept locally
so the derivatives can be re-encoded.

## The four facts — 2026-08-30

⚠️ **FOUR FACTS, FOUR DIFFERENT QUESTIONS.** The same reader asked *"what does 6 age bands
mean?"*, which reads as a vocabulary problem and was really a structure problem: facts 1 and 2
both answered *who is it for*, so the second had no question left of its own and fell back on our
internal word for a content-organisation decision. The four now answer four different first-visit
questions — **is it for my child's age** (Ages 3–18), **how does it know where to start**
(Starts where your child is), **is my child safe** (0 frames uploaded), **what does it cost**
(From $7.99/month). Add a fifth only if it answers a fifth question. "six stages that look nothing
alike" keeps the idea "6 age bands" was reaching for: the idea was never the problem, the label
was.

⚠️ **THEY WERE ALL ONE LINK AND IT WENT TO THE WRONG PAGE.** A single
`<Link href="/data-and-safety">` wrapped the whole list, so pressing the price, or the age range,
landed on data and safety. A reader outside the team found it in her first pass: *"Idk if we can
press and it takes u to explain further but on my end I see the data and safety information
instead."* Each fact now links to the page that substantiates that fact — ages and bands to
`/adaptivelearn`, the camera claim to `/data-and-safety`, the price to `/pricing`. **Add a fact,
give it a destination that explains it.**

⚠️ **IT IS A `<ul>` NOW, NOT A `<dl>`, AND THAT IS FORCED.** Making each item its own link inside a
`<dl>` is invalid markup: the spec lets a `<div>` child of `<dl>` contain only `<dt>` and `<dd>`, so
an `<a>` wrapping the pair has nowhere legal to sit. Four links in a list is what this actually is.

⚠️ **NOTHING EVER OVERFLOWED, AND THE FIX IS STILL REAL.** The same reader reported the second
fact's last character looking clipped. Measured at 320, 360, 375, 390, 414, 430, 768, 1024 and
1280: `scrollWidth` never exceeds `clientWidth`, no word is wider than its column, the document
never scrolls sideways. What she saw was a line ending **3px** from the column edge — "each looks
and works" ran to 348 in a column ending at 351 — which at 2x with subpixel antialiasing reads as
clipped. Chasing that with the column gap alone is whack-a-mole, because ragged-right text lands
where it lands and every gap value leaves some width near-flush. The guarantee is `padding-right`
on the card: **minimum slack went from 1-3px to 14px at every width measured.**

## The Writing section on the home page

It was a bare `<h2>Writing</h2>`, an "All posts →" link and three dated rows. A reader outside the
team: *"I don't understand the writing portion?"* — the heading said what the section was CALLED,
not what it was. There is now one line under it:

> What we've learned building it — one finding per post.

⚠️ **IT CLAIMS NOTHING ABOUT FREQUENCY, ON PURPOSE** — same reason the URL is `/writing` and not
`/blog`. A longer draft ended "…with the working shown"; it was cut because a line whose whole job
is to stop someone being confused should not carry a third clause.

## Malaika's marketing notes — applied 2026-08-31

Source: `Script_Marketing (1).pdf`, 6 pages of notes from a reader outside the team. Her framing:
the site should answer **what is Radlor / what makes it different / how does it work / why should
I trust it**, with shorter paragraphs and a stronger visual hierarchy. Everything below is applied.

| # | Page | Change |
|---|---|---|
| 1 | home | product card is now "Learning that meets them where they are" + her shorter copy |
| 2 | home | **new short "What is Radlor?" block directly after the facts**, above the beliefs |
| 3 | /adaptivelearn | hero: "Every child starts somewhere different…" + "Real math. Real thinking. No guessing." |
| 4 | /adaptivelearn | chapter steps rewritten (Intro / Demo / Your turn / Practice) |
| 5 | /adaptivelearn | hands section: "Math you can show, not just tap", simple answer first |
| 6 | /adaptivelearn | age-band syllabus in her wording; 9–11 world renamed **Interactive math** |
| 7 | /adaptivelearn | FAQ rewritten, new "How is AdaptiveLearn different from other math apps?", + two links |
| 8 | /pricing | "Simple pricing for the whole family", her intro, up-to-4 line, label-first plan list |
| 9 | /pricing + /for-schools | schools copy in her words |
| 10 | /for-schools | **removed** "At our size that is genuinely faster than any form we could build" |
| 11 | /about | rewritten to her structure (Why we started / potential / How we work / Where we are) |
| 12 | /data-and-safety | all seven of her points |

⚠️ **"What about ages 17–18?" — HER LIST STOPPED AT 15–16; THE SITE DID NOT.** `AGE_BANDS` in
`site.ts` has always had a sixth band (17–18, Math studio: Algebra II, pre-calculus, statistics,
intro to calculus) and the page renders all six from that array. Nothing was missing; her source
document only listed five. **Do not "add" a 17–18 band — it is there.**

⚠️ **TWO FAQ ANSWERS ARE KEPT THAT HER LIST DOES NOT CONTAIN**, deliberately, and they are marked
in the file: *"Was AdaptiveLearn called something else before?"* is the only place on the site that
connects **Milo** to AdaptiveLearn, and families who used Milo still search that name; *"Does it
work offline?"* is a real parent question. She wrote "keep whatever you feel suits you". Deleting
them should be a decision, not tidying.

⚠️ **THE `/data-and-safety` REWRITE CHANGED TONE, NOT FACTS.** Simple answer first, technical
detail underneath; "no upload path" and "content security policy" are now explained in words rather
than named; "Nobody who is not you" became **"Who can access it?"** with parent / teacher /
service-provider spelled out separately, because the old absolute contradicted the Supabase and
Vercel paragraph two lines later. Every underlying claim is unchanged and still true.

The jargon survives in two places on purpose: the engineering comment at the top of the file, and
`content/posts/a-camera-claim-you-can-check.md`, which is written for a technical reader who wants
to verify the claim themselves.

### Her margin comments on the same document — applied 2026-09-01

Four comments in the Google Doc margin, which are the "notes coming separately" the copy pass was
waiting for:

- **2:06am, "sometimes less is more. There are only certain parts where the extra information is
  needed."** The home "What is Radlor?" block is now ONE paragraph — its second began "Every child
  learns differently…", which is the heading of the product section further down the same page.
- **2:20am, "Possible tagline? also thought of: every child learns differently. their math should
  too"** — shipped briefly, then **replaced with "Question difficulty moves with your child."** on
  Rafi's call. ⚠️ **Both of Malaika's options were wrong twice over and the reason is worth
  keeping.** GRAMMAR: "should too" borrows the verb from the first clause, so it reads as *"their
  math should LEARN DIFFERENTLY too"* — and math does not learn. Swapping "math" for "questions"
  does not help; the borrowed verb is the problem, not the noun. A mirrored line only works when
  both halves can share one verb ("Every child is different. Their math should be too."). MEANING:
  "their math should be different" can be read as mathematics itself differing per child, which is
  the opposite of the same card's "Real math. Real thinking. No guessing."
  ⚠️ **The verb is "moves", not "rises", and it must stay that way.** Difficulty goes UP after
  three right and DOWN after three wrong. "Gets harder as your child gets better" is half the
  mechanism — and the half that would put off the parent of a struggling child, who is exactly the
  parent this product is for. `TAGLINE` in `site.ts` is untouched: it sets every page `<title>` and
  the OG image, so it is a brand decision rather than a copy one.
- **2:22am, "it should only be Join the Waitlist. the family part feels like extra information that
  the customer doesnt HAVE to know"** — the "currently being tested with a small group of families"
  sentence is gone **from the home card**. ⚠️ It is deliberately KEPT on `/adaptivelearn` and
  `/pricing`: on the home page it is throat-clearing, but on the pricing page it is the reason
  nobody is being charged yet, which is a material fact rather than extra information.
- **2:38am, "tagline to add to this part"** on *Math you can show, not just tap* — already the
  section heading on `/adaptivelearn`.
- **7:04am on the About section, "had to be shortened by a lot… it should have a question the
  parent might ask like what is this company with a quick and easy answer"** — `/about` now opens
  with **"What is Radlor?"** answered in two sentences, and went from ~350 words to ~190. The
  second blockquote and the "We believe the potential is already there" heading were cut as the
  same point made a third way. **If you add to that page, take something out.**

⚠️ **ONE OPEN ITEM, FLAGGED TO RAFI AND NOT YET DECIDED.** The product section on the home page now
says the same thing three times: the heading *"Question difficulty moves with your child."*, the
card lead *"Math that changes as your child answers."*, and the card body's first clause
*"AdaptiveLearn finds where your child is, then adjusts each question as they learn."* That is
exactly what Malaika's "less is more" note was about, but the lead and the body are both **her own
lines** from the document, so they were not cut unilaterally. The proposal on the table is to drop
the body's first clause, leaving *"Real math. Real thinking. No guessing."* — which is the most
distinctive sentence on that card and is currently hidden behind a longer one.

Her praise, recorded so nobody "improves" it away: *"Love the visuals with the chart here!"* (the
difficulty line on `/adaptivelearn`) and *"The chart with pricing looks perfect"*.

## The home hero

A full-bleed dark section: `min-height: min(88vh, 780px)`, the looping video as the ground, the
headline and CTAs, and a row of four checkable facts on their own band below, linking to
`/data-and-safety`. **No client JS.** `.rl-lightfield` is NOT in this hero — the video covers it —
which is why `.rl-halo` and `.rl-glow-core` were deleted; `.rl-lightfield` and `.rl-glow` still run
on the ten other pages.

**It was specced with a looping video and shipped without one.** The clip supplied was abstract
dunes under a sky of floating digits — measured **0.00% cyan/brand-blue, 54.5% warm pink-orange**,
against a brand whose signature colour is `#00E5FF`. It also put a wall of numerals on the front
door of a company whose own post argues a child should never see the number. The ground stayed
CSS — and then a frame set was tried in its place and removed too, for the reasons above. **Two
attempts at a moving ground have now failed on measurement. The bar for a third is a ground that
is measurably on-brand and a legibility check written before it ships, not after.**

Three things worth not relearning:

- **The hero is dark in BOTH themes** and pins the dark palette locally. It sets the raw tokens
  (`--glow`, `--brand-blue` — read directly by `.rl-glow` / `.rl-lit`) *and* the `--color-*` ones,
  because `@theme inline` resolves `--color-*` at `:root`; overriding only the raw tokens would
  never reach `text-muted` or `bg-accent`.
- ⚠️ **`.rl-hero-scrim` WAS DELETED WHEN THE GROUND WAS FLAT AND IS BACK NOW THAT IT MOVES.** With
  a flat token background a gradient over it was a measurable no-op and it went. The video goes to
  pure white on the mark's chrome, so it is earning its place again — horizontal on desktop
  (0.74 out to 47.7%, effectively off past 58.6%), vertical on mobile. Mobile's measured
  requirement is **0.00 at every row**, because the portrait file seats the mark above the copy;
  the mobile scrim is insurance against a future re-crop, not a fix.
- ⚠️ **`.rl-lit`'s ring had to be dimmed for this ground, and this is the one thing the hero could
  not inherit.** It was tuned against Paper, where 62% cyan is a soft tint; over near-black the arc
  measured `rgb(36,163,189)` and dropped the headline to **2.80:1**, under the 3:1 large-text
  floor. Nothing behind it can fix it — `.rl-lit` is in the content layer above any ground. The mix is lowered
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

✅ **The old "hero is taller than its `min-height` on phones and nothing peeks" problem is fixed,**
and moving the facts onto their own band is what fixed it. The hero now sits AT its `min-height`
everywhere and the band below peeks at every width measured: **29 px at 360×780** (hero 686),
**32 px at 375×812** (hero 715), **179 px at 768×1024** (hero 780, capped), and it peeks at 1280
too. It used to be 855 px at 360×780 with nothing visible below the fold. No horizontal overflow
at 360 or 375.
