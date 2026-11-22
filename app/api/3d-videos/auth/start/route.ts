import { isEmail } from '../../_lib/validate.ts'
import { sign, PENDING_COOKIE } from '../../_lib/session.ts'
import { auth, configured, ipOf, limited, safeNext, sameOrigin, secret, seeOther, setCookie } from '../../_lib/server.ts'

/**
 * Step 1 of sign-in: email a 6-digit code (Supabase Auth). Works with JavaScript off.
 * The answer is the same for a new and a known email, so this page cannot tell who has an account.
 * The email waits in a signed 15-minute cookie, never in the URL.
 */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null)
  const next = safeNext(form?.get('next'))
  const back = (e: string) => seeOther(`${next}?e=${e}`)
  if (!configured()) return back('closed')
  if (!sameOrigin(req) || !form) return back('form')

  const email = String(form.get('email') ?? '').trim().toLowerCase()
  if (!isEmail(email)) return back('email')
  if (limited(`start:ip:${ipOf(req)}`, 10, 3600_000) || limited(`start:email:${email}`, 5, 3600_000)) return back('wait')

  const res = await auth('otp', { email, create_user: true }).catch(() => null)
  if (!res || !res.ok) {
    if (res?.status === 429) return back('wait')
    console.error('[3d-videos] otp send failed', res?.status)
    return back('send')
  }
  const pending = sign({ email, next, exp: Date.now() + 15 * 60_000 }, secret())
  return seeOther(next, { 'Set-Cookie': setCookie(req, PENDING_COOKIE, pending, 15 * 60) })
}
