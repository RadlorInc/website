import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { COMPANY, SAMPLES_PATH, SITE_URL, V3D_CTA, V3D_NAME, V3D_SIGNUP_PATH } from '@/site'
import { SAMPLES, samplePath } from '@/content/samples'
import { SamplePlayer } from '@/components/visual/SamplePlayer'
import { SampleWall } from '@/components/visual/SampleWall'

/** One sample, with its own address: the link to send to a brand in that field. */
export const dynamicParams = false
export const generateStaticParams = () => SAMPLES.map(s => ({ id: s.id }))
const find = async (params: Promise<{ id: string }>) => { const { id } = await params; return SAMPLES.find(s => s.id === id) }

export async function generateMetadata({ params }: PageProps<'/samples/[id]'>): Promise<Metadata> {
  const s = await find(params)
  if (!s) return {}
  const title = `${s.product}: ${s.task}`
  return {
    title,
    description: `A ${s.seconds}-second narrated 3D sample from a written manual page. ${V3D_NAME} makes videos like this for ${s.name.toLowerCase()} brands.`,
    alternates: { canonical: samplePath(s.id) },
    openGraph: { url: `${SITE_URL}${samplePath(s.id)}`, title: `${title} · ${COMPANY}` },
  }
}

export default async function SamplePage({ params }: PageProps<'/samples/[id]'>) {
  const s = await find(params)
  if (!s) notFound()
  return (
    <section className="mx-auto max-w-[80rem] px-6 pt-10 sm:pt-16">
      <p className="text-muted"><Link href={SAMPLES_PATH} className="underline underline-offset-4 hover:text-accent">Samples</Link> / {s.name}</p>
      <h1 className="font-display mt-3 text-[2.4rem] leading-[1] sm:text-6xl">{s.product}</h1>
      <p className="mt-3 text-xl text-muted">{s.task}.</p>
      <SamplePlayer s={s} />
      <div className="mt-14 flex flex-wrap items-center gap-6">
        <p className="text-2xl font-semibold">Your manual can look like this.</p>
        <Link href={V3D_SIGNUP_PATH} className="rl-cta inline-flex min-h-12 items-center px-6 font-semibold">{V3D_CTA}</Link>
      </div>
      <h2 className="font-display mt-28 text-3xl sm:text-5xl">If it has a manual, we can show it.</h2>
      <SampleWall not={s.id} />
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org', '@type': 'VideoObject', name: `${s.product}: ${s.task}`,
        description: `A 3D sample video made from a written manual page: ${s.steps.map(x => x.text).join(' ')}`,
        thumbnailUrl: `${SITE_URL}/samples/${s.id}/poster.webp`, contentUrl: `${SITE_URL}/samples/${s.id}/wide.mp4`,
        uploadDate: '2026-11-24', duration: `PT${s.seconds}S`, publisher: { '@id': `${SITE_URL}/#organization` },
      })}</script>
    </section>
  )
}
