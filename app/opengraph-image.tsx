import { ImageResponse } from 'next/og'
import { BRAND, COMPANY, TAGLINE } from '@/site'

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * The mark, inlined as a data URI. Satori cannot fetch a relative URL and the site has no
 * public origin yet, so an absolute one would make the BUILD depend on the site already being
 * deployed. Reading the file off disk is the version that works before the first deploy and
 * after it, and it keeps `public/mark-black.png` the single copy of the image.
 * The card is drawn on Paper, so it takes the BLACK mark — the same file the header serves to
 * a light-themed browser. The white one is for dark backgrounds and would be invisible here.
 */
const MARK =
  'data:image/png;base64,' +
  readFileSync(join(process.cwd(), 'public', 'mark-black.png')).toString('base64')

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = `${COMPANY} — ${TAGLINE}`

/** One card for the whole site. Per-page images are worth adding when a page earns its own share. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BRAND.paper,
          color: BRAND.ink,
          padding: 80,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <img src={MARK} width={137} height={96} alt="" />
          <div style={{ fontSize: 40, letterSpacing: 8, color: BRAND.blueInk, textTransform: 'uppercase' }}>
            {COMPANY}
          </div>
        </div>
        <div style={{ fontSize: 76, lineHeight: 1.15, maxWidth: 900 }}>{TAGLINE}</div>
        <div style={{ fontSize: 30, color: BRAND.slate }}>radlor.com</div>
      </div>
    ),
    size,
  )
}
