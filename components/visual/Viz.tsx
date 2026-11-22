import { useId } from 'react'
import type { Viz as VizData } from '@/content/evidence'
import { CountUp } from './CountUp'

/**
 * A finding's picture. One chart kind per shape of fact (see `Viz` in `content/evidence.ts`). Server-rendered HTML and
 * inline drawings, no chart library and no script from another origin; the only client JS is `CountUp`.
 *
 * ⚠️ THE CHART IS ITS OWN TABLE. Every mark has its label and its value as text beside it, so a screen reader and a
 * colour-blind reader get the numbers without the colour; the drawings are `aria-hidden`. Colour only says which mark
 * is WITH pictures or video (`--viz-visual`) and which is the comparison (`--viz-base`). Text keeps the text colours.
 * ⚠️ Motion: marks grow as they scroll in (CSS scroll timeline, `.vz-*` in globals.css), and only when the visitor
 * allows motion. The waffle switch is native radio buttons + CSS, so it works without JS and with the keyboard.
 */
const tone = (t: 'base' | 'visual') => `var(--viz-${t})`
const pct = (v: number, max: number) => Math.max(0, Math.min(100, (v / max) * 100))
const box = 'rounded-xl bg-background/60 p-5'
const cap = 'text-sm leading-snug text-muted'

function Legend({ tones }: { tones: Set<string> }) {
  if (tones.size < 2) return null
  return (
    <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
      <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[var(--viz-base)]" />Comparison</span>
      <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[var(--viz-visual)]" />With pictures or video</span>
    </p>
  )
}

/** 100 squares, `value` of them filled. */
function Waffle({ value, t }: { value: number; t: 'base' | 'visual' }) {
  return (
    <svg viewBox="0 0 109 109" className="w-full max-w-32" aria-hidden="true">
      {Array.from({ length: 100 }, (_, i) => (
        <rect key={i} x={(i % 10) * 11} y={Math.floor(i / 10) * 11} width="9" height="9" rx="1.5"
          fill={i < Math.round(value) ? tone(t) : 'var(--line)'} />
      ))}
    </svg>
  )
}

export function Viz({ viz, compact = false }: { viz: VizData; compact?: boolean }) {
  const id = useId()
  const big = `font-display leading-none text-foreground ${compact ? 'text-5xl' : 'text-6xl'}`

  if (viz.kind === 'stat') {
    return (
      <figure className={box}>
        <p className={big}>{viz.value}</p>
        <figcaption className={`mt-3 ${cap}`}>{viz.caption}</figcaption>
      </figure>
    )
  }

  if (viz.kind === 'dots') {
    return (
      <figure className={box}>
        <div className="flex flex-wrap gap-2.5" role="img" aria-label={viz.caption}>
          {Array.from({ length: viz.total }, (_, i) => (
            <span key={i} className={`h-8 w-8 rounded-full ${i < viz.filled ? 'bg-[var(--viz-visual)]' : 'border-2 border-dashed border-line'}`} />
          ))}
        </div>
        <figcaption className={`mt-3 ${cap}`}>{viz.caption}</figcaption>
      </figure>
    )
  }

  // Effect sizes (or a few values) as dots on one axis, with an optional reference line.
  if (viz.kind === 'scale') {
    const one = viz.points.length === 1 ? viz.points[0] : null
    return (
      <figure className={box}>
        {one && <p className={big}><CountUp text={one.shown} /></p>}
        <figcaption className={`${one ? 'mt-3' : ''} ${cap}`}>{viz.caption}</figcaption>
        <div className="relative mx-2 mt-10 mb-10 h-2 rounded-full bg-line" aria-hidden="true">
          <div className="vz-grow-x absolute inset-y-0 left-0 rounded-full bg-[var(--viz-visual)]/25"
            style={{ width: `${pct(Math.max(...viz.points.map(p => p.value)), viz.max)}%` }} />
          {viz.mark && (
            <div className="absolute -top-3 -bottom-3 border-l-2 border-dashed border-muted" style={{ left: `${pct(viz.mark.value, viz.max)}%` }}>
              <span className="absolute top-full -translate-x-1/2 whitespace-nowrap text-xs text-muted">{viz.mark.shown}</span>
            </div>
          )}
          <span className="absolute top-full left-0 mt-3 text-xs text-muted">0</span>
          <span className="absolute top-full right-0 mt-3 text-xs text-muted">{viz.max}</span>
          {viz.points.map((p, i) => {
            const x = pct(p.value, viz.max)
            const shift = x > 85 ? '-translate-x-full' : x < 15 ? '' : '-translate-x-1/2'
            return (
              <div key={p.label} className="absolute top-1/2" style={{ left: `${x}%` }}>
                <span className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background" style={{ background: tone(p.tone) }} />
                {!one && <span className={`absolute ${i % 2 ? 'top-4' : 'bottom-4'} ${shift} text-sm font-semibold tabular-nums text-foreground`}>{p.shown}</span>}
              </div>
            )
          })}
        </div>
        <ul className="mt-4 space-y-1.5 text-sm">
          {viz.points.map(p => (
            <li key={p.label} className="flex items-baseline justify-between gap-3">
              <span className="inline-flex items-baseline gap-2 text-muted"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: tone(p.tone) }} />{p.label}</span>
              <span className="shrink-0 whitespace-nowrap font-semibold tabular-nums text-foreground">{p.shown}</span>
            </li>
          ))}
          {viz.mark && (
            <li className="flex items-baseline justify-between gap-3">
              <span className="inline-flex items-baseline gap-2 text-muted"><span className="h-3 w-0 shrink-0 border-l-2 border-dashed border-muted" />{viz.mark.label}</span>
              <span className="font-semibold tabular-nums text-foreground">{viz.mark.shown}</span>
            </li>
          )}
        </ul>
      </figure>
    )
  }

  // A share of a whole: one donut per group. Hover one to dim the others.
  if (viz.kind === 'rings') {
    return (
      <figure className={box}>
        <figcaption className={cap}>{viz.caption}</figcaption>
        <ul className="vz-dim mt-4 grid grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))] gap-4">
          {viz.rows.map(r => (
            <li key={r.label} className="flex flex-col items-center text-center transition-opacity duration-200">
              <div className="relative w-full max-w-28">
                <svg viewBox="0 0 42 42" className="w-full -rotate-90" aria-hidden="true">
                  <circle cx="21" cy="21" r="15.915" fill="none" stroke="var(--line)" strokeWidth="5" />
                  <circle className="vz-draw" cx="21" cy="21" r="15.915" fill="none" stroke={tone(r.tone)} strokeWidth="5"
                    strokeDasharray={`${r.value} ${100 - r.value}`} />
                  {viz.mark && (() => {
                    const a = (viz.mark.value / 100) * 2 * Math.PI
                    return <line x1={21 + 12 * Math.cos(a)} y1={21 + 12 * Math.sin(a)} x2={21 + 20.5 * Math.cos(a)} y2={21 + 20.5 * Math.sin(a)}
                      stroke="var(--foreground)" strokeWidth="1" strokeDasharray="1.5 1" />
                  })()}
                </svg>
                <span className="absolute inset-0 grid place-items-center text-base font-semibold tabular-nums text-foreground"><CountUp text={r.shown} /></span>
              </div>
              <span className="mt-2 text-sm leading-snug text-muted">{r.label}</span>
            </li>
          ))}
        </ul>
        {viz.mark && <p className="mt-3 text-xs text-muted">Dashed tick: {viz.mark.label.toLowerCase()}, {viz.mark.shown}</p>}
        <Legend tones={new Set(viz.rows.map(r => r.tone))} />
      </figure>
    )
  }

  // "X of N tests": one square per test.
  if (viz.kind === 'tally') {
    return (
      <figure className={box}>
        <figcaption className={cap}>{viz.caption}</figcaption>
        <ul className="mt-4 space-y-3">
          {viz.rows.map(r => (
            <li key={r.label}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-muted">{r.label}</span>
                <span className="shrink-0 font-semibold tabular-nums text-foreground">{r.shown}</span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-0.5" aria-hidden="true">
                {Array.from({ length: r.of }, (_, i) => (
                  <span key={i} className={`h-2.5 w-2.5 rounded-[2px] ${i < r.hit ? 'bg-[var(--viz-visual)]' : 'border border-muted'}`} />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </figure>
    )
  }

  // Values that step up, as columns. Hover one to dim the others.
  if (viz.kind === 'columns') {
    return (
      <figure className={box}>
        <figcaption className={cap}>{viz.caption}</figcaption>
        <ul className="vz-dim mt-4 grid grid-flow-col auto-cols-fr gap-3">
          {viz.rows.map(r => (
            <li key={r.label} className="flex flex-col transition-opacity duration-200">
              <span className="text-center text-sm font-semibold tabular-nums text-foreground">{r.shown}</span>
              <div className={`mt-1 flex items-end ${compact ? 'h-24' : 'h-32'}`} aria-hidden="true">
                <div className="vz-grow-y w-full rounded-t-lg" style={{ height: `${pct(r.value, viz.max)}%`, background: tone(r.tone) }} />
              </div>
              <span className="mt-2 border-t border-line pt-2 text-center text-xs leading-snug text-muted">{r.label}</span>
            </li>
          ))}
        </ul>
        <Legend tones={new Set(viz.rows.map(r => r.tone))} />
      </figure>
    )
  }

  // A cut from a baseline: the full bar is "before", the hatched end is the part that went away.
  if (viz.kind === 'cut') {
    return (
      <figure className={box}>
        <figcaption className={cap}>{viz.caption}</figcaption>
        <ul className="mt-4 space-y-4">
          {viz.rows.map(r => (
            <li key={r.label}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-muted">{r.label}</span>
                <span className="font-semibold tabular-nums text-foreground">{r.shown}</span>
              </div>
              <div className="mt-1.5 flex h-4 overflow-hidden rounded-full" aria-hidden="true">
                <div className="vz-grow-x h-full bg-[var(--viz-visual)]" style={{ width: `${100 - r.value}%` }} />
                <div className="h-full flex-1 border border-[var(--viz-base)]"
                  style={{ background: 'repeating-linear-gradient(135deg, var(--viz-base) 0 2px, transparent 2px 7px)' }} />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[var(--viz-visual)]" />With clear steps</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border border-[var(--viz-base)]" style={{ background: 'repeating-linear-gradient(135deg, var(--viz-base) 0 1px, transparent 1px 3px)' }} />The part that was cut</span>
        </p>
      </figure>
    )
  }

  // "X out of 100" for two groups, one measure at a time. Radio buttons + CSS: no JS needed, arrow keys move.
  return (
    <figure className={`${box} vz-switch`}>
      <figcaption className={cap}>{viz.caption}</figcaption>
      <fieldset className="mt-4">
        <legend className="sr-only">Show the measure</legend>
        <div className="flex flex-wrap gap-2">
          {viz.options.map((o, i) => (
            <label key={o.label} className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line px-4 text-sm text-muted transition-colors duration-200 hover:text-foreground has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-on-accent has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent">
              <input type="radio" name={id} value={i} defaultChecked={i === 0} className="sr-only" />{o.label}
            </label>
          ))}
        </div>
      </fieldset>
      {viz.options.map((o, i) => (
        <div key={o.label} data-panel={i} className="mt-5">
          <p className="sr-only">{o.label}:</p>
          <ul className="grid grid-cols-2 gap-4">
            {o.rows.map(r => (
              <li key={r.label} className="flex flex-col items-center text-center">
                <span className="text-2xl font-semibold tabular-nums text-foreground">{r.shown}</span>
                <span className="mb-2 text-sm text-muted">{r.label}</span>
                <Waffle value={r.value} t={r.tone} />
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Legend tones={new Set(viz.options.flatMap(o => o.rows.map(r => r.tone)))} />
    </figure>
  )
}
