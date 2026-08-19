import { ImageResponse } from 'next/og'
import { COMPANY } from '@/site'
import { bySlug, posts } from '@/content/posts'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** Pre-rendered per post, so a shared link carries its own headline instead of the generic card. */
export const generateStaticParams = () => posts.map(p => ({ slug: p.slug }))

export default async function PostImage({ params }: { params: Promise<{ slug: string }> }) {
  const post = bySlug((await params).slug)
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
        <div style={{ fontSize: 34, letterSpacing: 7, color: '#b4491f', textTransform: 'uppercase' }}>
          {/* One child, not two — Satori refuses a div with multiple children unless it is
              explicitly flex, and `{COMPANY} · Writing` is two text nodes. */}
          {`${COMPANY} · Writing`}
        </div>
        <div style={{ fontSize: 68, lineHeight: 1.15, maxWidth: 1000 }}>{post?.title ?? COMPANY}</div>
        <div style={{ fontSize: 28, color: '#5f5a51' }}>{post?.date ?? ''}</div>
      </div>
    ),
    size,
  )
}
