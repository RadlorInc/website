import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { COMPANY, V3D_NAME } from '@/site'

export const ogSize = { width: 1200, height: 630 }

/** The share card of the samples: the product on the paper ground. Satori cannot read webp, so each sample has an og.jpg. */
export function sampleCard(id: string, title: string, line: string) {
  const pic = 'data:image/jpeg;base64,' + readFileSync(join(process.cwd(), 'public', 'samples', id, 'og.jpg')).toString('base64')
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#e8e4dc', color: '#16181b', padding: 56, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: 430 }}>
          <div style={{ fontSize: 28, color: '#54524c' }}>{`${V3D_NAME} by ${COMPANY}`}</div>
          <div style={{ fontSize: 66, lineHeight: 1.05, marginTop: 24 }}>{title}</div>
          <div style={{ fontSize: 32, color: '#54524c', marginTop: 24, lineHeight: 1.3 }}>{line}</div>
        </div>
        <img src={pic} width={620} height={349} alt="" style={{ border: '12px solid #fdfcf8' }} />
      </div>
    ),
    ogSize,
  )
}
