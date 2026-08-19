import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/**
 * A generated wordmark rather than a file, because the alternative was shipping create-next-app's
 * Next.js logo as Radlor's brand mark — which is what this site did until now.
 *
 * ⚠️ Replace this the moment a real logo exists. `apple-icon.tsx` is the same drawing at 180px and
 * has to change with it.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#b4491f',
          color: '#fbfaf7',
          fontSize: 118,
          fontWeight: 700,
        }}
      >
        R
      </div>
    ),
    size,
  )
}
