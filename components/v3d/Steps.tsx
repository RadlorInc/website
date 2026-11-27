import Link from 'next/link'
import { JoinPart } from './JoinPart'

/** The whole way from email to payment, so nobody wonders how much is left. Steps 1–3 are on /3dlor/signup, 4–5 on the
 *  account page. */
export const STEPS = ['Email', 'Videos', 'You', 'Files', 'Pay'] as const

/** Where a finished step goes when it is tapped: a URL, or a function for a step on the same page. */
export type Go = Partial<Record<number, string | (() => void)>>

/**
 * The step bar. A finished step that has a `go` entry is a button (founder, 2026-11-27: going back must be one tap and
 * obvious), so the bar itself is a way back, beside the "← Back" button under the form.
 */
export function Progress({ step, go = {} }: { step: number; go?: Go }) {
  return (
    <nav className="su-progress" aria-label="Sign-up steps">
      <p>Step {step} of {STEPS.length}: <strong>{STEPS[step - 1]}</strong></p>
      <ol>
        {STEPS.map((s, i) => {
          const n = i + 1
          const to = n < step ? go[n] : undefined
          const label = <span>{s}</span>
          return (
            <li key={s} data-done={i < step || undefined} aria-current={n === step ? 'step' : undefined}>
              {typeof to === 'string' ? <Link href={to} title={`Back to step ${n}: ${s}`}>{label}</Link>
                : to ? <button type="button" onClick={to} title={`Back to step ${n}: ${s}`}>{label}</button>
                : label}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/** Progress, the sheet, and the sample product that comes together a little more with every step. */
export function StepPage({ step, title, go, children }: { step: number; title: string; go?: Go; children: React.ReactNode }) {
  return (
    <section className="su">
      <div className="su-main">
        <h1>{title}</h1>
        <Progress step={step} go={go} />
        {children}
      </div>
      <JoinPart step={step} />
    </section>
  )
}
