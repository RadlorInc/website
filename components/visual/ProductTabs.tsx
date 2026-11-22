'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Icon, type IconName } from './Icon'

export type TabProduct = {
  id: string
  name: string
  who: string
  line: string
  chips: { icon: IconName; label: string }[]
  page: string
  cta: string
  media: { video: string; poster: string; w: number; h: number; label: string }
}

/**
 * The three products as tabs, each with its own demo video (founder, 2026-11-22: "too much text, make it visual").
 *
 * ⚠️ ALL THREE PANELS ARE IN THE SERVER HTML. Inactive panels carry `hidden`, so a crawler and a reader without JS
 * still get every product, and the first panel shows without JS. Keyboard: the WAI-ARIA tabs pattern (arrow keys,
 * Home, End; only the active tab is in the tab order).
 *
 * ⚠️ ONE VIDEO PLAYS AT A TIME, AND ONLY WITHOUT `prefers-reduced-motion`. Inactive videos are paused and have
 * `preload="none"`, so the page downloads one demo, not three. Every video has controls, so a reader can stop it.
 */
export function ProductTabs({ products }: { products: TabProduct[] }) {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const videos = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    videos.current.forEach((v, i) => {
      if (!v) return
      if (i !== active) { v.pause(); return }
      if (!still) v.play().catch(() => {})
    })
  }, [active])

  const onKey = (e: KeyboardEvent) => {
    const n = products.length
    const to = e.key === 'ArrowRight' ? (active + 1) % n : e.key === 'ArrowLeft' ? (active - 1 + n) % n
      : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1
    if (to < 0) return
    e.preventDefault(); setActive(to); tabs.current[to]?.focus()
  }

  return (
    <div>
      <div role="tablist" aria-label="Our products" onKeyDown={onKey}
        className="grid grid-cols-3 gap-1.5 rounded-2xl border border-line bg-surface p-1.5">
        {products.map((p, i) => (
          <button key={p.id} ref={el => { tabs.current[i] = el }} role="tab" id={`tab-${p.id}`}
            aria-selected={i === active} aria-controls={`panel-${p.id}`} tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`min-h-12 cursor-pointer rounded-xl px-2 py-2.5 text-sm font-medium transition-colors duration-200 sm:text-base ${
              i === active ? 'bg-accent text-on-accent' : 'text-muted hover:bg-background hover:text-foreground'}`}>
            {p.name}
          </button>
        ))}
      </div>

      {products.map((p, i) => (
        <div key={p.id} role="tabpanel" id={`panel-${p.id}`} aria-labelledby={`tab-${p.id}`} hidden={i !== active}
          className="mt-6 grid items-center gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="relative overflow-hidden rounded-2xl border border-line bg-[#05080c]">
            <video ref={el => { videos.current[i] = el }} src={p.media.video} poster={p.media.poster}
              width={p.media.w} height={p.media.h} muted loop playsInline controls
              preload={i === 0 ? 'metadata' : 'none'} autoPlay={i === 0}
              aria-label={p.media.label}
              className="aspect-[16/10] w-full object-contain" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{p.who}</p>
            <h3 className="font-display mt-2 text-4xl">{p.name}</h3>
            <p className="mt-3 text-lg leading-relaxed text-muted">{p.line}</p>
            <ul className="mt-6 grid grid-cols-2 gap-2.5">
              {p.chips.map(c => (
                <li key={c.label} className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-3 text-sm leading-snug">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent"><Icon name={c.icon} className="h-4.5 w-4.5" /></span>
                  {c.label}
                </li>
              ))}
            </ul>
            <Link href={p.page} className="rl-cta mt-7 inline-flex min-h-11 items-center rounded-full bg-accent px-6 py-3 font-medium text-on-accent hover:opacity-90">
              {p.cta}
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
