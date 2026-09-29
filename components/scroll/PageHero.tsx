import type { ReactNode } from 'react'
import { CircleReveal, type Pic } from './Scroll'

/** A page's first screen: the heading and at most one line, beside one picture that opens out of a circle (style F). */
export function PageHero({ eyebrow, title, line, pic, children }: {
  eyebrow?: string
  title: ReactNode
  line?: ReactNode
  pic: Pic
  children?: ReactNode
}) {
  return (
    <div className="grid items-center gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] pt-12 sm:pt-16 pb-10">
      <div className="order-2 sm:order-1">
        {eyebrow && <p className="text-sm uppercase tracking-[0.18em] text-accent font-medium mb-4">{eyebrow}</p>}
        <h1 className="rl-focus font-display text-5xl sm:text-6xl leading-[1.05]">{title}</h1>
        {line && <p className="mt-5 text-lg text-muted max-w-md leading-relaxed">{line}</p>}
        {children}
      </div>
      <CircleReveal pic={pic} priority className="order-1 sm:order-2 w-64 sm:w-full max-w-[460px] justify-self-center" />
    </div>
  )
}
