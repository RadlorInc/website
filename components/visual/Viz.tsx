import type { Viz as VizData } from '@/content/evidence'

/**
 * A finding's picture: a small bar chart, one big number, or a row of dots. Server-rendered HTML, no chart library.
 *
 * ⚠️ THE CHART IS ITS OWN TABLE. Every bar carries its label and its value as text beside it, so a screen reader and a
 * colour-blind reader get the numbers without the colour. Colour only says which bar is WITH pictures or video
 * (`--viz-visual`) and which is the comparison (`--viz-base`); the pair was checked with the dataviz palette validator
 * on the dark surface (all checks pass, 2026-11-22). Text stays in text colours, never the bar colour.
 */
export function Viz({ viz, compact = false }: { viz: VizData; compact?: boolean }) {
  if (viz.kind === 'stat') {
    return (
      <figure className="rounded-xl bg-background/60 p-5">
        <p className={`font-display leading-none text-foreground ${compact ? 'text-5xl' : 'text-6xl'}`}>{viz.value}</p>
        <figcaption className="mt-3 text-sm leading-snug text-muted">{viz.caption}</figcaption>
      </figure>
    )
  }
  if (viz.kind === 'dots') {
    return (
      <figure className="rounded-xl bg-background/60 p-5">
        <div className="flex flex-wrap gap-2.5" role="img" aria-label={viz.caption}>
          {Array.from({ length: viz.total }, (_, i) => (
            <span key={i} className={`h-8 w-8 rounded-full ${i < viz.filled ? 'bg-[var(--viz-visual)]' : 'border-2 border-dashed border-line'}`} />
          ))}
        </div>
        <figcaption className="mt-3 text-sm leading-snug text-muted">{viz.caption}</figcaption>
      </figure>
    )
  }
  const legend = new Set(viz.rows.map(r => r.tone)).size > 1
  return (
    <figure className="rounded-xl bg-background/60 p-5">
      <figcaption className="text-sm leading-snug text-muted">{viz.caption}</figcaption>
      <ul className="mt-4 space-y-3">
        {viz.rows.map(r => (
          <li key={r.label} title={`${r.label}: ${r.shown}`}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-muted">{r.label}</span>
              <span className="font-semibold tabular-nums text-foreground">{r.shown}</span>
            </div>
            <div className="mt-1.5 h-3 rounded-full bg-line/60">
              <div className="h-full rounded-full transition-[width] duration-700"
                style={{ width: `${Math.max(2, Math.min(100, (r.value / viz.max) * 100))}%`, background: `var(--viz-${r.tone})` }} />
            </div>
          </li>
        ))}
      </ul>
      {legend && (
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[var(--viz-base)]" />Comparison</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[var(--viz-visual)]" />With pictures or video</span>
        </p>
      )}
    </figure>
  )
}
