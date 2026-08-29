# The palette, and where each value came from

**The logo is the source.** Every colour below was read off `radlor_logo/Mark Full Color
Light.png` and `Mark Full Color Dark.png` with a pixel sample, not chosen. If you want to change
one, change the logo first.

> ⚠️ This file replaces the palette that cited `Radlor Brand Kit/Radlor-brand-guide.pdf`.
> That PDF **is not in this repo** — `site.ts` and `globals.css` both cited it for months and
> nobody could open it. Its Amber `#E9A93A` appears nowhere in the mark. A written guide nobody
> can check lost to the file everybody can see.

## What is actually in the mark

| | | |
|---|---|---|
| `#00E5FF` | cyan | the ring's core, and the robot's eyes — the only part that glows |
| `#0061F3` | electric blue | the ring's outer edge, and the collar under the antenna |
| `#00B1FE` | mid sky | where the two blend along the ring |
| `#FEFEFE` | white | the body |
| `#000000` | black | the visor, and the dark lockup's ground |

## The tokens, and what each one measured

Sampled against `--background` in the theme it belongs to. AA needs 4.5:1 for body text, 3:1 for
large text and UI edges.

### Light — ground `#F5F8FC`

| Token | Value | From | Contrast |
|---|---|---|---|
| `--foreground` | `#0A1119` | the visor | **17.8:1** |
| `--muted` | `#4E6076` | a desaturated stop toward the visor | **6.1:1** |
| `--accent` | `#0B57C7` | `#0061F3` darkened | **6.2:1** |
| `--on-accent` | `#FFFFFF` | the body | **6.6:1** on the accent |
| `--brand-blue` | `#0061F3` | the ring's edge | 5.2:1 — graphics |
| `--glow` | `#00E5FF` | the ring's core | **1.4:1 — NEVER TEXT** |
| `--on-glow` | `#0A1119` | the visor | 12.3:1 on the glow |

### Dark — ground `#070B11`

| Token | Value | Contrast |
|---|---|---|
| `--foreground` | `#F5F8FC` | **18.5:1** |
| `--muted` | `#B3C2D3` | **10.9:1** |
| `--accent` | `#7ADFFF` | **13.0:1** |
| `--on-accent` | `#0A1119` | **12.9:1** on the accent |
| `--glow` | `#22E9FF` | never text |

## The three rules a build cannot check

1. **`--glow` is the light, and light goes behind things.** At 1.4:1 on Paper it is worse as text
   than the amber it replaced. It sits BEHIND a word, or it is a filled surface whose text is
   `--on-glow`. The mark does the same thing: the ring is behind the head, not painted on it.
2. **Text on an accent surface is `--on-accent`, never a literal.** In dark mode the accent is
   `#7ADFFF` and white on it is **1.5:1** — which is exactly what the CTA shipped as until
   2026-08-29, because `text-white` was hard-coded in six files.
3. **The four Satori routes import `BRAND` from `site.ts`.** They cannot read a CSS custom
   property, so that import is the only thing keeping the favicon and the share cards on the same
   palette as the pages. Until 2026-08-29 they imported nothing and carried a third palette in
   rust and cream, and nothing caught it.

## The mark, and where each cut of it is used

`radlor_logo/Mark Full Color Dark.png` is the source for every one of these. It is cropped
**square, centred on the head, at 1.18× the head's height** — wide enough that the ring still
passes through the frame, tight enough that the head survives being shrunk to a 16 px browser tab.
The looser crop tried first (1.62×) read as a dark smudge at that size, which is the only size a
favicon is ever actually seen at.

| File | Size | Where |
|---|---|---|
| `app/icon.png` | 256 | the browser tab |
| `app/apple-icon.png` | 180 | the iOS home screen |
| `public/mark-black.png` | 228×160 | the header, drawn at 57×40, on a light ground |
| `public/mark-white.png` | 228×160 | the header, drawn at 57×40, on a dark ground |

⚠️ **Updated 2026-08-30. The header used to show a full-colour `public/mark.png` on its own
near-black tile**, on the reasoning that the robot's white body could not be keyed transparent
against Paper. It now uses the brand's own **mono** marks with real alpha, picked by
`<picture>` on `prefers-color-scheme`.

**They are two drawings, not one inverted.** In the white mark the head is solid with the visor
cut out of it; in the black one the head is an outline. `filter: invert()` would draw the wrong
picture — which is why the brand ships both files and why the header is a `<picture>` rather than
a CSS trick. `next/image` has no art-direction, so that `<img>` is deliberate.

The recipe, from `radlor_logo/Mark Mono {Black,White}.png` (both RGB, **no alpha**): luminance →
alpha, inverted for the black one; a floor at alpha ≤ 4 to kill the 1/255 film the not-quite-pure
source backgrounds leave; one shared crop box so the two register identically; a master at 4× the
display box so nothing is squashed. **Below ~40 px tall the hairlines and star field turn to
mush** — 32 px was tried and is illegible.

Both share cards read `public/mark-black.png` off disk at build time and inline it as a data URI:
the cards are drawn on Paper, so they take the black variant. Satori cannot fetch a relative URL,
and an absolute one would make the build depend on the site already being deployed.

The favicon stays FULL COLOUR (`app/icon.png`), and that is not an oversight: a browser tab has no
theme for `<picture>` to read and its chrome can be either shade, so a mono mark would disappear
half the time.

> `app/icon.tsx` and `app/apple-icon.tsx` drew a letter **R** until 2026-08-29, and the
> full-colour `public/mark.png` was the header lockup until 2026-08-30. All three were deleted on
> 2026-08-31; `mark.png` is regenerable from `radlor_logo/logo.png` if it is ever wanted back.
> Next cannot have both `icon.tsx` and `icon.png`.
