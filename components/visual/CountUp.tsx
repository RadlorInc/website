'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * A number that counts up once, when it scrolls into view. The server HTML holds the FINAL text, so without JS, with
 * reduced motion, or when the number is already on screen at load, the visitor sees the real value and nothing moves.
 * Only the first number in `text` counts ("d = 1.35", "47.8%"); the rest of the text stays as written.
 */
export function CountUp({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(text)
  useEffect(() => {
    const m = text.match(/\d+(?:\.\d+)?/)
    if (!m || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const end = parseFloat(m[0]), dp = m[0].split('.')[1]?.length ?? 0
    const at = (n: number) => text.replace(m[0], n.toFixed(dp))
    let first = true, raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (first) { first = false; if (e.isIntersecting) { io.disconnect(); return } setShown(at(0)); return }
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / 900)
        setShown(at(end * (1 - (1 - k) ** 3)))
        if (k < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    })
    io.observe(ref.current!)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [text])
  // The screen reader always gets the real value; the moving digits are hidden from it.
  return <span ref={ref}><span aria-hidden="true">{shown}</span><span className="sr-only">{text}</span></span>
}
