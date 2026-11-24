import { SAMPLES } from '@/content/samples'
import { ogSize, sampleCard } from '@/content/og-sample'

export const size = ogSize
export const contentType = 'image/png'
export const alt = 'A 3D sample video made from a written manual page'

// Built once: the card reads its picture from disk, which a server function would not have.
export const generateStaticParams = () => SAMPLES.map(s => ({ id: s.id }))

export default async function OpengraphImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const s = SAMPLES.find(x => x.id === id) ?? SAMPLES[0]
  return sampleCard(s.id, s.product, s.task)
}
