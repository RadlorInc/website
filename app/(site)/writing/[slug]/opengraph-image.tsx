import { ImageResponse } from 'next/og'
import { BRAND, COMPANY } from '@/site'
import { bySlug, posts } from '@/content/posts'

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
          background: BRAND.paper,
          color: BRAND.ink,
          padding: 80,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <img src={MARK} width={114} height={80} alt="" />
          <div style={{ fontSize: 34, letterSpacing: 7, color: BRAND.blueInk, textTransform: 'uppercase' }}>
            {/* One child, not two — Satori refuses a div with multiple children unless it is
                explicitly flex, and `{COMPANY} · Writing` is two text nodes. */}
            {`${COMPANY} · Writing`}
          </div>
        </div>
        <div style={{ fontSize: 68, lineHeight: 1.15, maxWidth: 1000 }}>{post?.title ?? COMPANY}</div>
        <div style={{ fontSize: 28, color: BRAND.slate }}>{post?.date ?? ''}</div>
      </div>
    ),
    size,
  )
}
