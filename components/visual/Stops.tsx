'use client'

import { useEffect } from 'react'

/**
 * One swipe moves one step (founder, 2026-11-25). A pinned scene marks where each step is finished, as a fraction `at` of
 * its scroll. A phone stops on every mark with CSS scroll snap (see `.stop`). A mouse wheel or trackpad has no reliable
 * snap-stop, so there the page moves to the next mark once per gesture, and the rest of that gesture is ignored.
 * Outside the marks the page scrolls freely. Arrow keys, the scrollbar and links are untouched.
 */
export function Stops({ at }: { at: number[] }) {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(pointer: coarse)').matches) return
    if (users++ === 0) { addEventListener('wheel', wheel, { passive: false }); addEventListener('keydown', key) }
    return () => { if (--users === 0) { removeEventListener('wheel', wheel); removeEventListener('keydown', key); stopMoving() } }
  }, [])
  return <>{at.map(p => <i key={p} className="stop" aria-hidden="true" style={{ top: `calc(${p} * (100% - 100svh))` }} />)}</>
}

let users = 0
let frame = 0, goal = 0, y = 0, put = 0, ease = 60, then = 0 // the move in progress
let held = false, heldAt = 0, last = 0, sum = 0, dir = 0, size = 0 // the gesture in progress

const stopMoving = () => { cancelAnimationFrame(frame); frame = 0 }
const tick = (time: number) => {
  // Somebody else moved the page (a link, the scrollbar): let go.
  if (Math.abs(scrollY - put) > 3) { frame = 0; return }
  y += (goal - y) * (1 - Math.exp(-Math.min(50, time - then || 16) / ease))
  then = time
  if (Math.abs(goal - y) < 0.7) y = goal
  scrollTo({ top: y, behavior: 'instant' })
  put = scrollY
  frame = y === goal ? 0 : requestAnimationFrame(tick)
}
const move = (to: number, soft: number) => {
  goal = Math.max(0, Math.min(to, document.documentElement.scrollHeight - innerHeight))
  ease = soft
  if (!frame) { y = put = scrollY; then = 0; frame = requestAnimationFrame(tick) }
}

/** The next mark from `from` in direction `d`, and whether `from` is between two marks of one scene. */
function ahead(from: number, d: number) {
  const marks = [...document.querySelectorAll<HTMLElement>('.stop')]
    .map(el => ({ top: Math.round(el.getBoundingClientRect().top + scrollY), scene: el.parentElement }))
    .sort((a, b) => a.top - b.top)
  const below = marks.find(m => m.top > from + 2), above = marks.findLast(m => m.top < from - 2)
  const behind = d > 0 ? marks.findLast(m => m.top <= from + 2) : marks.find(m => m.top >= from - 2)
  const next = d > 0 ? below : above
  return { next, inside: !!next && next.scene === behind?.scene }
}
const step = (m: { top: number; scene: Element | null }) => {
  held = true
  heldAt = last
  move(m.top, m.scene?.classList.contains('ms') ? 260 : 130) // the film needs longer to play
}

function scrollsItself(el: Element | null, d: number) {
  for (; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
    if (el.tagName === 'DIALOG') return true
    if (/auto|scroll/.test(getComputedStyle(el).overflowY) && (d > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0)) return true
  }
  return false
}

function wheel(e: WheelEvent) {
  if (e.ctrlKey || e.shiftKey || e.defaultPrevented || !e.cancelable || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
  const d = e.deltaY * (e.deltaMode === 1 ? 18 : e.deltaMode === 2 ? innerHeight : 1)
  if (!d || scrollsItself(e.target as Element, d)) return
  e.preventDefault()
  const now = e.timeStamp, abs = Math.abs(d), since = now - heldAt
  const turned = Math.sign(d) !== dir
  // A new gesture: a pause, a turn, a push harder than the dying momentum, or a wheel that keeps its speed.
  const fresh = now - last > 400 || turned || (since > 500 && abs > 12 && abs > size * 1.5) || (since > 700 && abs >= 40 && abs >= size * 0.98)
  last = now
  size = fresh ? abs : size * 0.7 + abs * 0.3
  if (fresh) { sum = 0; dir = Math.sign(d) }
  if (held && (!fresh || since < 350)) return
  held = false
  sum += abs
  const from = frame ? goal : scrollY
  const { next, inside } = ahead(from, d)
  if (next && inside) { if (sum >= 20) step(next) }
  else if (next && (next.top - from - d) * dir <= 4) step(next)
  else move(from + d, 60)
}

function key(e: KeyboardEvent) {
  const d = e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey) ? 1 : e.key === 'PageUp' || (e.key === ' ' && e.shiftKey) ? -1 : 0
  if (!d || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return
  if ((e.target as Element).closest?.('input, textarea, select, button, a, video, audio, summary, dialog, [contenteditable]')) return
  const from = frame ? goal : scrollY
  const { next, inside } = ahead(from, d)
  if (!next || (!inside && (next.top - from) * d > innerHeight * 0.9)) return
  e.preventDefault()
  if (!e.repeat) step(next)
}
