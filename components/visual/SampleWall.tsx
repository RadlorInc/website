import Image from 'next/image'
import Link from 'next/link'
import { V3D_SIGNUP_PATH } from '@/site'
import { SAMPLES, samplePath } from '@/content/samples'

/** Every sample as a print on the table. `not`: the one the visitor is on. */
export function SampleWall({ not }: { not?: string }) {
  return (
    <ul className="wall">
      {SAMPLES.filter(s => s.id !== not).map(s => (
        <li key={s.id}>
          <Link href={samplePath(s.id)}>
            <Image src={`/samples/${s.id}/poster.webp`} alt="" width={1280} height={720} sizes="(max-width: 700px) 90vw, 380px" />
            <strong>{s.product}</strong><span>{s.name}</span>
            <em>{s.task}</em>
          </Link>
        </li>
      ))}
      {!not && <li><Link href={V3D_SIGNUP_PATH} className="wall-you"><strong>Your product</strong><em>Send us its manual.</em></Link></li>}
    </ul>
  )
}
