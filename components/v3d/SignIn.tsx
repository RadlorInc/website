import { SUPPORT_EMAIL } from '@/site'
import { PendingButton } from './PendingButton'

const MESSAGES: Record<string, string> = {
  closed: `Sign-up is not open yet. Write to ${SUPPORT_EMAIL} and we will set you up.`,
  form: 'That did not go through. Please try again.',
  email: 'Please check the email address.',
  wait: 'Too many tries. Please wait a few minutes and try again.',
  send: 'We could not send the code. Please try again in a minute.',
  expired: 'The code step timed out. Please enter your email again.',
  code: 'That code did not work. Check the newest email and try again.',
  signin: 'Please sign in first.',
  save: 'We could not save the form. Please try again.',
  field: 'Please check the highlighted field.',
}
export const message = (e?: string) => (e && MESSAGES[e]) || null

export function Notice({ e }: { e?: string }) {
  const m = message(e)
  return m ? <p role="alert" className="mt-6 rounded-lg border border-accent/50 bg-accent-soft px-4 py-3 text-sm">{m}</p> : null
}

/** Email, then a 6-digit code. Plain forms: they work with JavaScript off. */
export function SignIn({ next, pendingEmail, e }: { next: string; pendingEmail?: string; e?: string }) {
  const email = (
    <form method="post" action="/api/3dlor/auth/start" className="su-fields">
      <input type="hidden" name="next" value={next} />
      <label className="su-field">
        <span>Work email</span>
        <input name="email" type="email" autoComplete="email" maxLength={254} required />
      </label>
      <PendingButton className="su-next" pending="Sending the code…">{pendingEmail ? 'Send a new code' : 'Email me a code'}</PendingButton>
      {!pendingEmail && <p className="su-foot">No password.</p>}
    </form>
  )
  return (
    <div className="max-w-md">
      <Notice e={e} />
      {pendingEmail && e !== 'expired' ? (
        <>
          <form method="post" action="/api/3dlor/auth/verify" className="su-fields">
            <label className="su-field">
              <span>Code from {pendingEmail}</span>
              <input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,12}" required />
            </label>
            <PendingButton className="su-next" pending="Checking the code…">Sign in</PendingButton>
          </form>
          <details className="su-more"><summary>No email? Check spam, or get a new code</summary>{email}</details>
        </>
      ) : email}
    </div>
  )
}
