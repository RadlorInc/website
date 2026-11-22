import { SUPPORT_EMAIL } from '@/site'

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

const input = 'mt-2 w-full rounded-lg border border-line bg-surface px-4 py-3 text-foreground'
const button = 'rl-cta mt-4 rounded-full bg-accent px-6 py-3 text-on-accent font-medium hover:opacity-90'

/** Email, then a 6-digit code. Plain forms: they work with JavaScript off. */
export function SignIn({ next, pendingEmail, e }: { next: string; pendingEmail?: string; e?: string }) {
  return (
    <div className="max-w-md">
      <Notice e={e} />
      {pendingEmail && e !== 'expired' ? (
        <form method="post" action="/api/3d-videos/auth/verify" className="mt-6">
          <label className="block text-sm text-muted">
            We sent a code to <strong className="text-foreground">{pendingEmail}</strong>. Enter it here.
            <input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,12}" required className={input} />
          </label>
          <button className={button}>Sign in</button>
          <p className="mt-4 text-sm text-muted">No email after a few minutes? Check spam, or enter your email again below.</p>
        </form>
      ) : null}
      <form method="post" action="/api/3d-videos/auth/start" className="mt-6">
        <input type="hidden" name="next" value={next} />
        <label className="block text-sm text-muted">
          Work email
          <input name="email" type="email" autoComplete="email" maxLength={254} required className={input} />
        </label>
        <button className={button}>{pendingEmail ? 'Send a new code' : 'Email me a sign-in code'}</button>
      </form>
    </div>
  )
}
