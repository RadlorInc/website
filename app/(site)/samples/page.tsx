import type { Metadata } from 'next'
import Link from 'next/link'
import { COMPANY, SAMPLES_PATH, SITE_URL, V3D_CTA, V3D_NAME, V3D_SIGNUP_PATH } from '@/site'
import { SampleWall } from '@/components/visual/SampleWall'

const TITLE = 'Samples'

export const metadata: Metadata = {
  title: TITLE,
  description: `Seven ${V3D_NAME} sample videos, from an e-bike to a water filter. Each one turns a written manual page into a narrated 3D video.`,
  alternates: { canonical: SAMPLES_PATH },
  openGraph: { url: `${SITE_URL}${SAMPLES_PATH}`, title: `${TITLE} · ${COMPANY}` },
}

export default function Samples() {
  return (
    <section className="mx-auto max-w-[76rem] px-6 pt-14 sm:pt-24">
      <h1 className="font-display max-w-[15ch] text-[2.9rem] leading-[0.98] sm:text-8xl">If it has a manual, we can show it.</h1>
      <p className="mt-6 max-w-[34rem] text-xl leading-relaxed text-muted">Seven kinds of product. Each video starts from a written page. Tap one.</p>
      <SampleWall />
      <p className="mt-8 text-sm text-muted">Our own samples. Generic products, and manual pages written by us; not a maker’s official instructions.</p>
      <div className="mt-16 flex flex-wrap items-center gap-6">
        <p className="text-2xl font-semibold">Yours is not here? Send us its manual.</p>
        <Link href={V3D_SIGNUP_PATH} className="rl-cta inline-flex min-h-12 items-center px-6 font-semibold">{V3D_CTA}</Link>
      </div>
    </section>
  )
}
