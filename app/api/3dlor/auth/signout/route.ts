import { PENDING_COOKIE, SESSION_COOKIE } from '../../_lib/session.ts'
import { seeOther, setCookie } from '../../_lib/server.ts'

export async function POST(req: Request) {
  return seeOther('/3dlor/account', {
    'Set-Cookie': [setCookie(req, SESSION_COOKIE, '', 0), setCookie(req, PENDING_COOKIE, '', 0)],
  })
}
