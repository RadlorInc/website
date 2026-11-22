import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProduct } from '@/app/help/_lib/data.ts'
import { index, MAX_QUERY, search } from '@/app/help/_lib/help.ts'
import { HelpPlayer } from '@/components/help/HelpPlayer'

/**
 * A brand's help page, reached from the QR code on the box or in the manual: every support video of one product,
 * and a search that plays the exact part that answers a question. The search runs in the browser; without
 * JavaScript the form sends ?q= and the same search runs here.
 */
type Props = { params: Promise<{ brand: string; product: string }>; searchParams: Promise<{ q?: string | string[]; part?: string | string[] }> }
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v ?? '').slice(0, MAX_QUERY)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand, product } = await params
  const p = await getProduct(brand, product).catch(() => null)
  if (!p) return { title: 'Help videos', robots: { index: false, follow: false } }
  return {
    title: { absolute: `${p.product_name} help videos · ${p.brand_name}` },
    description: `Short how-to and setup videos for the ${p.brand_name} ${p.product_name}. Type a question to jump to the part that answers it.`,
    alternates: { canonical: `/help/${p.brand_slug}/${p.product_slug}` },
    // a brand decides later whether its help page is in search results
    robots: { index: false, follow: false },
  }
}

export default async function HelpPage({ params, searchParams }: Props) {
  const [{ brand, product }, sp] = await Promise.all([params, searchParams])
  const p = await getProduct(brand, product)
  if (!p || !p.videos.length) notFound()
  const q = one(sp.q).trim()
  const hits = q ? search(index(p), q) : []
  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <p className="text-sm text-muted">{p.brand_name}</p>
      <h1 className="font-display text-3xl sm:text-4xl">{p.product_name} help videos</h1>
      <HelpPlayer product={p} initialQuery={q} initialHits={hits} initialPart={one(sp.part)} />
    </main>
  )
}
