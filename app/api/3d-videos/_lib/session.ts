import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * The customer's sign-in cookie: `<base64url json>.<base64url hmac>`, signed with V3D_SESSION_SECRET.
 * Supabase Auth checks the email code once; after that this cookie carries the user id. It is
 * HttpOnly, SameSite=Lax, and holds no Supabase token, so nothing here reaches supabase.co from
 * the browser (the site's privacy rule).
 */
export const SESSION_COOKIE = 'v3d_session'
export const PENDING_COOKIE = 'v3d_pending'
export const SESSION_DAYS = 14

const b64 = (b: Buffer | string) => Buffer.from(b).toString('base64url')

export function sign(payload: object, secret: string): string {
  const body = b64(JSON.stringify(payload))
  return `${body}.${b64(createHmac('sha256', secret).update(body).digest())}`
}

/** Returns the payload when the signature is good and `exp` (ms) is in the future, else null. */
export function verify<T extends { exp: number }>(token: string | undefined, secret: string, now = Date.now()): T | null {
  if (!token || !secret) return null
  const [body, mac, extra] = token.split('.')
  if (!body || !mac || extra !== undefined) return null
  const want = createHmac('sha256', secret).update(body).digest()
  const got = Buffer.from(mac, 'base64url')
  if (got.length !== want.length || !timingSafeEqual(got, want)) return null
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString()) as T
    return typeof p.exp === 'number' && p.exp > now ? p : null
  } catch {
    return null
  }
}

export type Session = { uid: string; email: string; exp: number }

export function readCookie(header: string | null, name: string): string | undefined {
  for (const part of (header ?? '').split(';')) {
    const i = part.indexOf('=')
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim()
  }
}

export function cookie(name: string, value: string, maxAgeSec: number, secure: boolean): string {
  return `${name}=${value}; Path=/; Max-Age=${maxAgeSec}; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`
}
