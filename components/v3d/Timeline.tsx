import type { Stage } from '@/app/api/3dlor/_lib/track'

const day = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

/** The order like a parcel: what is done, what happens now, what comes next. */
export function Timeline({ stages }: { stages: Stage[] }) {
  return (
    <ol className="tl">
      {stages.map((s, i) => (
        <li key={s.title} data-state={s.state} data-you={s.you || undefined} aria-current={s.state === 'now' ? 'step' : undefined} style={{ ['--n' as string]: i }}>
          <strong>{s.title}</strong>
          <span>{s.line}</span>
          {s.you ? <b>Your turn</b> : s.state === 'done' && s.at ? <time dateTime={s.at}>{day(s.at)}</time> : s.state === 'now' ? <em>Now</em> : null}
        </li>
      ))}
    </ol>
  )
}
