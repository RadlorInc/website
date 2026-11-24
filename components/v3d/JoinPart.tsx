'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { MANUAL, frame } from '@/content/manual-demo'
import { STEPS } from './Steps'

const LAST = MANUAL.steps[0].from - 1 // the first frames of the demo: the parts come together
const poseOf = (step: number) => Math.round((step - 1) / (STEPS.length - 1) * LAST)

/** Decorative: the sample's parts move a few poses closer each time a step is done. Jumps with reduced motion. */
export function JoinPart({ step }: { step: number }) {
  const goal = poseOf(step)
  const [n, setN] = useState(() => poseOf(Math.max(1, step - 1)))
  useEffect(() => {
    if (n === goal) return
    const jump = matchMedia('(prefers-reduced-motion: reduce)').matches
    const t = setTimeout(() => setN(jump ? goal : n + Math.sign(goal - n)), jump ? 0 : 55)
    return () => clearTimeout(t)
  }, [n, goal])
  return (
    <div className="su-art" aria-hidden="true">
      {Array.from({ length: LAST + 1 }, (_, i) => (
        <Image key={i} src={frame(i)} alt="" width={1200} height={900} sizes="(max-width: 899px) 240px, 560px" loading="eager" data-on={i === n || undefined} />
      ))}
    </div>
  )
}
