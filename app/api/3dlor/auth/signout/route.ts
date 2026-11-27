import { PENDING_COOKIE, SESSION_COOKIE } from '../../_lib/session.ts'
import { seeOther, setCookie } from '../../_lib/server.ts'

/** Only these pages may follow a sign-out, so `next` cannot send anyone off-site. The sign-up's "← Back: Email" uses
 *  /3dlor/signup (2026-11-27). */
const NEXT = ['/3dlor/account', '/3dlor/signup']

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null)
  const next = String(form?.get('next') ?? '')
  return seeOther(NEXT.includes(next) ? next : '/3dlor/account', {
    'Set-Cookie': [setCookie(req, SESSION_COOKIE, '', 0), setCookie(req, PENDING_COOKIE, '', 0)],
  })
}
