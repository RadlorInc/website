import { ImageResponse } from 'next/og'
import { COMPANY, TAGLINE } from '@/site'

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
          background: '#fbfaf7',
          color: '#191713',
          padding: 80,
        }}
      >
        <div style={{ fontSize: 40, letterSpacing: 8, color: '#b4491f', textTransform: 'uppercase' }}>
          {COMPANY}
        </div>
        <div style={{ fontSize: 76, lineHeight: 1.15, maxWidth: 900 }}>{TAGLINE}</div>
        <div style={{ fontSize: 30, color: '#5f5a51' }}>radlor.com</div>
      </div>
    ),
    size,
  )
}
