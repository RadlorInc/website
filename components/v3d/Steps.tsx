import { JoinPart } from './JoinPart'

/** The whole way from email to payment, so nobody wonders how much is left. Steps 1–3 are on /3dlor/signup, 4–5 on the
 *  account page. */
export const STEPS = ['Email', 'Videos', 'You', 'Files', 'Pay'] as const

export function Progress({ step }: { step: number }) {
  return (
    <div className="su-progress">
      <p>Step {step} of {STEPS.length}: <strong>{STEPS[step - 1]}</strong></p>
      <ol aria-hidden="true">{STEPS.map((s, i) => <li key={s} data-done={i < step || undefined}><span>{s}</span></li>)}</ol>
    </div>
  )
}

/** Progress, the sheet, and the sample product that comes together a little more with every step. */
export function StepPage({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <section className="su">
      <div className="su-main">
        <h1>{title}</h1>
        <Progress step={step} />
        {children}
      </div>
      <JoinPart step={step} />
    </section>
  )
}
