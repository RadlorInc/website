# Facts the site needs and I could not derive

Everything else on radlor.com came from the product itself. These four are company facts, and they
are **wrong-by-default in `site.ts` rather than invented**, so a wrong one is visible instead of
plausible. Fill them in and strike the row.

**Three of the four are done.** Only *Founder / team* is still open, and it is a decision rather
than a lookup. The struck rows are kept rather than deleted because each one records what the
value was wrong-by-default *as*, which is the part worth not relearning.

| In `site.ts` | Currently | Feeds |
|---|---|---|
| ~~`FOUNDED_YEAR`~~ ✅ | **Confirmed 2026-08-29** as `'2026'` — the guess from the domain registration (radlor.com, 2026-08-17) turned out to match. Now a fact, not an inference from WHOIS. |
| ~~`LOCATION`~~ ✅ | **Filled 2026-08-29** — 254 Chapman Rd, Ste 208 #28608, Newark, DE 19702, US. Feeds the `PostalAddress` block, which now always renders; the `city === 'TODO'` guard in `layout.tsx` was removed because its condition can no longer be true. ⚠️ **`country` was `'IN'` and is now `'US'`.** It was never verified — a default sitting beside two TODOs. Because the guard suppressed the whole block while `city` said TODO, the wrong country never reached a crawler, which is exactly what wrong-by-default is for. |
| ~~`SOCIAL`~~ ✅ | **Filled 2026-08-20** — LinkedIn, Instagram, X, Threads (all `radlor_inc` / `radlor-inc`) and Facebook. Feeds `sameAs` **and** a visible footer row. Four go through our own `*.radlor.com` GoDaddy forwards so a handle change is a DNS edit, not a deploy; Facebook is the one raw URL, because GoDaddy never issued a cert for its forward. **`scripts/check-social.sh` is the gate** — it follows each link and fails on a bare homepage, which is the failure that would tell an answer engine that Radlor *is Facebook*. GitHub added 2026-08-20 as `github.com/RadlorInc`. ⚠️ **The org was RENAMED from `RadlorMain` on or before 2026-08-20** — GitHub 301s the old name until somebody else claims it, so nothing may rely on `RadlorMain`. (`github.com/radlor` is a separate, unrelated User account with 1 repo.) |
| Founder / team | not on the site at all | The About page currently has no named person. A named founder with a `Person` schema block is worth adding once you decide you want your name on it. |

## Two claims on the site to keep honest

- ~~**"free while in early access"**~~ — **retired 2026-08-30, when pricing was published.** The
  prediction in this row came true exactly as written: the price landed and `/adaptivelearn`, the
  `Offer` blocks and `/pricing` all had to move together. They now do so automatically — every
  figure derives from `PRICING` in `site.ts`, and `npm run check:pricing` fails if the published
  numbers drift or if annual stops saving over 20% on any plan. ⚠️ The old page also promised
  early-access families they would hear about a price from us **first**, with notice, and that
  nothing already done would be locked. That section was removed with the free tier on the
  founder's call — **the promise was made in public and removing the paragraph does not discharge
  it.** It now has to be kept by writing to those families directly.
- **"no video frame or hand position is ever uploaded"** — this is true and verified in the product
  repo (there is no upload path in `infra/ar/*`, and the CSP `connect-src` allowlist makes one
  impossible). It is also the kind of claim a regulator reads. If the AR stack ever changes, this
  sentence changes first.
