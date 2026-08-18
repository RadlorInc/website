# Facts the site needs and I could not derive

Everything else on radlor.com came from the product itself. These four are company facts, and they
are **wrong-by-default in `site.ts` rather than invented**, so a wrong one is visible instead of
plausible. Fill them in and delete the row.

| In `site.ts` | Currently | Feeds |
|---|---|---|
| `FOUNDED_YEAR` | `'2026'` — a guess from the domain registration (radlor.com was registered 2026-08-17) | `Organization.foundingDate` in JSON-LD, the About page, the footer copyright |
| `LOCATION` | `TODO` | The `PostalAddress` block, which is **omitted entirely while it says TODO** rather than shipping a placeholder. A local business address is a meaningful ranking and trust signal. |
| `SOCIAL` | empty | `Organization.sameAs` — the strongest single GEO signal there is, because it is what ties the name "Radlor" to profiles that corroborate it. `github.com/radlor` is TAKEN; `radlorhq` / `radlor-labs` / `getradlor` were free as of 2026-08-19. |
| Founder / team | not on the site at all | The About page currently has no named person. A named founder with a `Person` schema block is worth adding once you decide you want your name on it. |

## Two claims on the site to keep honest

- **"free while in early access"** — on `/adaptivelearn` and in the FAQ, with `price: '0'` in the
  `Offer` block. The moment pricing exists, both change together.
- **"no video frame or hand position is ever uploaded"** — this is true and verified in the product
  repo (there is no upload path in `infra/ar/*`, and the CSP `connect-src` allowlist makes one
  impossible). It is also the kind of claim a regulator reads. If the AR stack ever changes, this
  sentence changes first.
