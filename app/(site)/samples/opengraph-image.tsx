import { ogSize, sampleCard } from '@/content/og-sample'

export const size = ogSize
export const contentType = 'image/png'
export const alt = 'If it has a manual, we can show it.'

export default function OpengraphImage() {
  return sampleCard('home-diy', 'If it has a manual, we can show it.', 'Seven sample videos')
}
