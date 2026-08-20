# Facts the site needs and I could not derive

Everything else on radlor.com came from the product itself. These four are company facts, and they
are **wrong-by-default in `site.ts` rather than invented**, so a wrong one is visible instead of
plausible. Fill them in and delete the row.

| In `site.ts` | Currently | Feeds |
|---|---|---|
| `FOUNDED_YEAR` | `'2026'` — a guess from the domain registration (radlor.com was registered 2026-08-17) | `Organization.foundingDate` in JSON-LD, the About page, the footer copyright |
| `LOCATION` | `TODO` | The `PostalAddress` block, which is **omitted entirely while it says TODO** rather than shipping a placeholder. A local business address is a meaningful ranking and trust signal. |
| ~~`SOCIAL`~~ ✅ | **Filled 2026-08-20** — LinkedIn, Instagram, X, Threads (all `radlor_inc` / `radlor-inc`) and Facebook. Feeds `sameAs` **and** a visible footer row. Four go through our own `*.radlor.com` GoDaddy forwards so a handle change is a DNS edit, not a deploy; Facebook is the one raw URL, because GoDaddy never issued a cert for its forward. **`scripts/check-social.sh` is the gate** — it follows each link and fails on a bare homepage, which is the failure that would tell an answer engine that Radlor *is Facebook*. GitHub added 2026-08-20 as `github.com/RadlorInc`. ⚠️ **The org was RENAMED from `RadlorMain` on or before 2026-08-20** — GitHub 301s the old name until somebody else claims it, so nothing may rely on `RadlorMain`. (`github.com/radlor` is a separate, unrelated User account with 1 repo.) |
| Founder / team | not on the site at all | The About page currently has no named person. A named founder with a `Person` schema block is worth adding once you decide you want your name on it. |

## Two claims on the site to keep honest

- **"free while in early access"** — on `/adaptivelearn` and in the FAQ, with `price: '0'` in the
  `Offer` block. The moment pricing exists, both change together.
- **"no video frame or hand position is ever uploaded"** — this is true and verified in the product
  repo (there is no upload path in `infra/ar/*`, and the CSP `connect-src` allowlist makes one
  impossible). It is also the kind of claim a regulator reads. If the AR stack ever changes, this
  sentence changes first.
