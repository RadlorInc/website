import { sign, PENDING_COOKIE, SESSION_COOKIE, SESSION_DAYS } from '../../_lib/session.ts'
import { auth, configured, ipOf, limited, pendingFrom, sameOrigin, secret, seeOther, setCookie } from '../../_lib/server.ts'

/**
 * Step 2 of sign-in: check the code with Supabase Auth, then set our own signed session cookie.
 * Five tries per email per 15 minutes here; Supabase limits code checks again behind this.
 */
export async function POST(req: Request) {
  const pending = pendingFrom(req.headers.get('cookie'))
  const next = pending?.next ?? '/3d-videos/account'
  const back = (e: string) => seeOther(`${next}?e=${e}`)
  if (!configured()) return back('closed')
  if (!sameOrigin(req)) return back('form')
  if (!pending) return back('expired')

  const form = await req.formData().catch(() => null)
  const code = String(form?.get('code') ?? '').replace(/\s/g, '')
  if (!/^\d{6,10}$/.test(code)) return back('code')
  if (limited(`verify:email:${pending.email}`, 5, 15 * 60_000) || limited(`verify:ip:${ipOf(req)}`, 30, 15 * 60_000)) {
    return back('wait')
  }

  const res = await auth('verify', { type: 'email', email: pending.email, token: code }).catch(() => null)
  const body = res?.ok ? await res.json().catch(() => null) : null
  const uid = body?.user?.id
  if (typeof uid !== 'string' || body?.user?.email?.toLowerCase() !== pending.email) return back('code')

  const session = sign({ uid, email: pending.email, exp: Date.now() + SESSION_DAYS * 86400_000 }, secret())
  return seeOther(next, {
    'Set-Cookie': [
      setCookie(req, SESSION_COOKIE, session, SESSION_DAYS * 86400),
      setCookie(req, PENDING_COOKIE, '', 0),
    ],
  })
}
