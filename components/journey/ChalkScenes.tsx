'use client'
/**
 * The journey's pictures: one chalk drawing per stop, drawn line by line when the reader arrives at it.
 * Founder's call, 2026-09-25: the low-poly 3D "looks AI generated"; use the chalk-drawing look the app already has.
 * Every line is hand-placed SVG (a 600 × 420 board), no generated image anywhere. Colours and the tracing technique
 * are the app's own (see app/radlic/chalk.ts and Chalkboard.tsx); the ground is the site's navy, not a green board.
 */
import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { CHALK } from '@/app/radlic/chalk'

const W = CHALK.w, Y = CHALK.y, B = CHALK.b, R = CHALK.r, D = CHALK.d
const line = (d: string, c = W, w = 3.4) => <path d={d} stroke={c} strokeWidth={w} />
const word = (t: string, x: number, y: number, s = 30, c = W) => <text x={x} y={y} fontSize={s} fill={c}>{t}</text>

/** The robot guide, Radlor's mascot, standing with its feet at (x, y). */
const robot = (x: number, y: number) => <>
  {line(`M${x - 40} ${y - 26} V${y - 116} H${x + 40} V${y - 26} Z`)}
  {line(`M${x - 30} ${y - 126} V${y - 170} Q${x - 30} ${y - 180} ${x - 20} ${y - 180} H${x + 20} Q${x + 30} ${y - 180} ${x + 30} ${y - 170} V${y - 126} Z`)}
  {line(`M${x} ${y - 180} V${y - 200}`)}
  {line(`M${x - 6} ${y - 206} a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0`, Y)}
  {line(`M${x - 14} ${y - 158} v4 M${x + 14} ${y - 158} v4`, B, 5)}
  {line(`M${x - 10} ${y - 140} Q${x} ${y - 133} ${x + 10} ${y - 140}`)}
  {line(`M${x - 40} ${y - 96} L${x - 70} ${y - 130} M${x - 70} ${y - 130} l-8 -10 M${x - 70} ${y - 130} l-12 -2`)}
  {line(`M${x + 40} ${y - 96} L${x + 62} ${y - 66}`)}
  {line(`M${x - 20} ${y - 26} V${y} M${x + 20} ${y - 26} V${y}`)}
  {line(`M${x - 10} ${y - 70} h20 v-18 h-20 z`, Y)}
</>

/** A child standing with feet at (x, y); `reach` is where the right hand points. */
const child = (x: number, y: number, reach: [number, number]) => <>
  {line(`M${x - 22} ${y - 128} a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0`)}
  {line(`M${x - 22} ${y - 134} Q${x} ${y - 162} ${x + 22} ${y - 134}`, R)}
  {line(`M${x} ${y - 106} V${y - 50} M${x} ${y - 50} L${x - 16} ${y} M${x} ${y - 50} L${x + 16} ${y}`)}
  {line(`M${x} ${y - 90} L${x - 26} ${y - 64} M${x} ${y - 90} L${reach[0]} ${reach[1]}`)}
</>

const ground = line('M30 372 C180 364 420 378 570 366', D, 2.6)

const SCENES: ReactNode[] = [
  // 0 · Start: the guide and a child, and the idea lighting up between them
  <>{ground}{robot(170, 372)}{child(420, 372, [388, 248])}
    {line('M285 150 C262 128 268 88 300 86 C332 88 338 128 315 150 L313 166 H287 Z', Y)}
    {line('M289 174 H311 M292 182 H308', Y)}
    {line('M300 62 V44 M252 84 L238 72 M348 84 L362 72 M242 124 H224 M358 124 H376', Y, 2.8)}
  </>,
  // 1 · Mission: the treasure is already there, the light comes out of the chest
  <>{ground}
    {line('M210 262 H390 V360 H210 Z')}
    {line('M210 262 L232 186 H412 L390 262')}
    {line('M210 300 H390', D, 2.4)}
    {line('M288 282 h24 v26 h-24 z', Y)}
    {line('M300 240 V112 M262 244 L206 150 M338 244 L394 150 M236 250 L150 196 M364 250 L450 196', Y, 2.8)}
    {line('M300 58 L310 82 L336 84 L316 100 L323 126 L300 112 L277 126 L284 100 L264 84 L290 82 Z', Y)}
    {child(110, 372, [168, 262])}
  </>,
  // 2 · How we build: the four rules, one picture each
  <>
    {line('M300 40 V380 M70 210 H530', D, 2)}
    {line('M135 132 C118 116 122 84 150 82 C178 84 182 116 165 132 L163 146 H137 Z', Y)}
    {line('M140 154 H160', Y)}
    {line('M190 98 L204 86 V140 M190 140 H218', Y)}
    {line('M405 120 a45 45 0 1 0 90 0 a45 45 0 1 0 -90 0', B)}
    {line('M428 122 L446 142 L478 102', B, 4.2)}
    {line('M96 340 L118 300 L140 340 Z')}
    {line('M160 340 V296 H200 V340 Z', B)}
    {line('M222 290 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0', Y)}
    {line('M100 368 C150 380 220 372 250 330 M250 330 l-2 12 M250 330 l-12 4', D, 2.4)}
    {line('M428 296 h44 a6 6 0 0 1 6 6 v36 a6 6 0 0 1 -6 6 h-44 a6 6 0 0 1 -6 -6 v-36 a6 6 0 0 1 6 -6 z')}
    {line('M434 296 V280 C434 258 466 258 466 280 V296')}
    {line('M450 314 v14', Y, 4)}
  </>,
  // 3 · Radlic: one question, and the next question depends on the answer
  <>
    {word('3 × 4 = ?', 300, 86, 46)}
    {line('M300 108 V160')}
    {line('M300 160 C300 190 190 184 170 226 M170 226 l-2 -14 M170 226 l12 -8', D, 2.8)}
    {line('M300 160 C300 190 410 184 430 226 M430 226 l2 -14 M430 226 l-12 -8', D, 2.8)}
    {word('12', 150, 266, 38, Y)}
    {line('M186 256 L196 268 L214 246', Y)}
    {line('M160 290 V326 M160 326 l-8 -10 M160 326 l8 -10', D, 2.6)}
    {word('3 × 14 = ?', 160, 362, 34, Y)}
    {word('7', 430, 266, 38, B)}
    {line('M430 290 V316 M430 316 l-8 -10 M430 316 l8 -10', D, 2.6)}
    {line([0, 1, 2].flatMap(r => [0, 1, 2, 3].map(c => `M${384 + c * 30} ${340 + r * 24} a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0`)).join(' '), B, 3)}
  </>,
  // 4 · Who it's for: a home, a school, a partnership, joined up
  <>{ground}
    {line('M84 372 V292 L140 244 L196 292 V372')}
    {line('M126 372 V330 H154 V372', R)}
    {line('M100 300 h18 v18 h-18 z M162 300 h18 v18 h-18 z', Y, 2.8)}
    {line('M238 372 V262 H362 V372')}
    {line('M226 264 L300 216 L374 264')}
    {line('M300 216 V176 L328 186 L300 196', R)}
    {line('M254 282 h22 v22 h-22 z M324 282 h22 v22 h-22 z M254 322 h22 v22 h-22 z M324 322 h22 v22 h-22 z', B, 2.8)}
    {line('M286 372 V334 H314 V372', B)}
    {line('M424 262 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0 M484 262 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0')}
    {line('M440 278 V330 L426 372 M440 330 L454 372 M500 278 V330 L486 372 M500 330 L514 372')}
    {line('M440 292 L470 312 L500 292', Y)}
    {line('M140 226 Q220 150 300 160 Q380 150 470 226', D, 2.2)}
  </>,
  // 5 · What comes next: a road to the horizon, and a sun coming up at the end of it
  <>
    {line('M30 260 H570', D, 2.4)}
    {line('M200 420 L292 262 M400 420 L308 262')}
    {line('M300 410 V380 M300 350 V326 M300 304 V288', D, 2.6)}
    {line('M254 260 A46 46 0 0 1 346 260', Y)}
    {line('M300 196 V176 M252 212 L238 198 M348 212 L362 198 M228 246 H210 M372 246 H390', Y, 2.8)}
    {line('M120 372 V316 M120 334 C98 330 90 312 92 300 C112 302 120 316 120 334 M120 322 C140 314 152 298 150 284 C132 288 122 302 120 322', B)}
    {line('M464 372 V340 M464 350 C480 346 488 332 486 322 C472 326 466 336 464 350', B)}
    {line('M110 120 l6 -14 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 z M470 90 l5 -11 l5 11 l11 5 l-11 5 l-5 11 l-5 -11 l-11 -5 z', W, 2.4)}
  </>,
]

/** Shows the drawing for stop `here`; on arriving, its lines are traced one after another and its words fade on. */
export function ChalkScenes({ here }: { here: number }) {
  const root = useRef<HTMLDivElement>(null)

  // Before paint, so a line is never seen whole for one frame before it starts to draw.
  useLayoutEffect(() => {
    const svg = root.current?.querySelector(`svg[data-stop="${here}"]`)
    if (!svg || typeof svg.animate !== 'function' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = [...svg.querySelectorAll<SVGPathElement | SVGTextElement>('path, text')]
    const lens = els.map(el => el instanceof SVGTextElement ? 0 : el.getTotalLength() || 200)
    const durs = lens.map(len => len ? Math.max(260, Math.min(1100, len * 1.6)) : 450)
    // the whole drawing is done within ~3 s however many lines it has: a reader who flicks on should still see it finished
    const k = Math.min(1, 3000 / durs.reduce((s, d) => s + d * 0.7, 0))
    let t = 200
    const anims = els.map((el, i) => {
      const dur = durs[i] * k, len = lens[i]
      const a = len
        ? el.animate([{ strokeDasharray: `${len}`, strokeDashoffset: `${len}` }, { strokeDasharray: `${len}`, strokeDashoffset: '0' }],
          { duration: dur, delay: t, easing: 'ease-in-out', fill: 'backwards' })
        : el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur, delay: t, fill: 'backwards' })
      t += dur * 0.7   // the next line starts before this one finishes, like a hand that does not stop
      return a
    })
    return () => anims.forEach(a => a.cancel())
  }, [here])

  return (
    <div ref={root} className="rl-journey-chalk">
      {SCENES.map((scene, i) => (
        <svg key={i} data-stop={i} viewBox="0 0 600 420" className={i === here ? 'is-here' : undefined}>
          <g fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#rl-chalk)" opacity={0.95}
            style={{ fontFamily: 'var(--rl-gaegu), cursive', fontWeight: 700 }} textAnchor="middle" dominantBaseline="middle">
            {scene}
          </g>
        </svg>
      ))}
      {/* Rough, powdery edges: the line is nudged by noise and has specks of the board showing through it. */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="rl-chalk" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.4 0 0 0 -0.55" result="specks" />
          <feComposite in="d" in2="specks" operator="in" />
        </filter>
      </svg>
    </div>
  )
}
