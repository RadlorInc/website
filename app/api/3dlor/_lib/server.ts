import { cookie, PENDING_COOKIE, readCookie, SESSION_COOKIE, verify, type Session } from './session.ts'

/**
 * Server-only helpers for the 3D video routes. Every call to Supabase happens here, on the server,
 * with plain `fetch` (no supabase-js, same as /api/waitlist). The service key never reaches a page.
 *
 * Who checks what: the routes read the signed session cookie and ALWAYS filter by its user id.
 * RLS on v3d_orders / v3d_files is the second layer (a customer token reads only its own rows).
 */
const URL_ = process.env.SUPABASE_URL
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY
const ANON = process.env.SUPABASE_ANON_KEY
const SECRET = process.env.V3D_SESSION_SECRET ?? ''
export const BUCKET = 'v3d-uploads'

/**
 * All of these must be set, or the pages say "not open yet" and the routes answer 503. The Stripe
 * pair is here too, so sign-up cannot open while a customer could not pay (the order of the setup
 * steps does not matter).
 */
export const configured = () =>
  Boolean(URL_ && SERVICE && ANON && SECRET.length >= 32 && process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET)

// A new-style `sb_secret_` / `sb_publishable_` key goes in `apikey` only; a legacy JWT key also as Bearer.
const keyHeaders = (key: string) => ({ apikey: key, ...(key.startsWith('eyJ') ? { Authorization: `Bearer ${key}` } : {}) })

export function db(path: string, init: RequestInit = {}) {
  return fetch(`${URL_}/rest/v1/${path}`, {
    ...init,
    cache: 'no-store',
    headers: { ...keyHeaders(SERVICE!), 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  })
}

export async function dbJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await db(path, init)
  if (!res.ok) throw new Error(`db ${res.status} ${await res.text().catch(() => '')}`.slice(0, 300))
  return res.json() as Promise<T>
}

export function storage(path: string, init: RequestInit = {}) {
  return fetch(`${URL_}/storage/v1/object/${BUCKET}/${path}`, {
    ...init,
    cache: 'no-store',
    headers: { ...keyHeaders(SERVICE!), ...(init.headers ?? {}) },
  })
}

export function auth(path: string, body: object) {
  return fetch(`${URL_}/auth/v1/${path}`, {
    method: 'POST',
    cache: 'no-store',
    headers: { ...keyHeaders(ANON!), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function sessionFrom(cookieHeader: string | null): Session | null {
  return verify<Session>(readCookie(cookieHeader, SESSION_COOKIE), SECRET)
}
export function pendingFrom(cookieHeader: string | null) {
  return verify<{ email: string; next: string; exp: number }>(readCookie(cookieHeader, PENDING_COOKIE), SECRET)
}
export const secret = () => SECRET

const isHttps = (req: Request) =>
  (req.headers.get('x-forwarded-proto') ?? new URL(req.url).protocol.replace(':', '')) === 'https'
export const setCookie = (req: Request, name: string, value: string, maxAgeSec: number) =>
  cookie(name, value, maxAgeSec, isHttps(req))

/** The browser's own origin, so a localhost or preview run never bounces to production. */
export function originOf(req: Request): string {
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? new URL(req.url).host
  return `${isHttps(req) ? 'https' : 'http'}://${host}`
}

/** A POST must come from a page on this site (second layer behind SameSite=Lax). */
export function sameOrigin(req: Request): boolean {
  const o = req.headers.get('origin')
  if (!o) return false
  try {
    return new URL(o).host === (req.headers.get('x-forwarded-host') ?? req.headers.get('host'))
  } catch {
    return false
  }
}

/** A relative 303, like /api/waitlist: it resolves against the browser's own origin. */
export const seeOther = (path: string, headers: Record<string, string | string[]> = {}) => {
  const h = new Headers({ Location: path, 'Cache-Control': 'no-store' })
  for (const [k, v] of Object.entries(headers)) for (const x of [v].flat()) h.append(k, x)
  return new Response(null, { status: 303, headers: h })
}
export const json = (status: number, body: unknown) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

/**
 * ponytail: per-instance counters, like /api/waitlist. On serverless the real ceiling is
 * LIMIT × instances. Supabase Auth has its own limits on emails sent and codes checked behind this.
 * Move to a shared store if abuse shows up in the logs.
 */
const hits = new Map<string, { n: number; resetAt: number }>()
export function limited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const rec = hits.get(key)
  if (!rec || now > rec.resetAt) {
    hits.set(key, { n: 1, resetAt: now + windowMs })
    if (hits.size > 5000) for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k)
    return false
  }
  rec.n += 1
  return rec.n > limit
}
export const ipOf = (req: Request) => (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'

/** Where a sign-in may send the browser next. Anything else goes to the account page. */
export const NEXT_PAGES = ['/3dlor/signup', '/3dlor/account'] as const
export const safeNext = (v: unknown) => (NEXT_PAGES as readonly unknown[]).includes(v) ? (v as string) : '/3dlor/account'
