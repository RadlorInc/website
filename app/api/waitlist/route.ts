import { AGE_BANDS } from '@/site'

/**
 * The waitlist endpoint. A plain `<form method="post">` on /waitlist posts here; this talks to
 * Supabase server-to-server and then 303s the browser to a static outcome page.
 *
 * ⚠️ THE BROWSER MUST NEVER TALK TO supabase.co. /privacy states, and invites the reader to
 * verify in the network tab, that every request goes to radlor.com. So:
 *   - there is no `supabase-js` anywhere in this repo. This uses `fetch` against the REST
 *     endpoint, which means no client bundle can ever pick the SDK up by accident.
 *   - the key here is the ANON key, NOT the service role key. ⚠️ It used to be `service_role`,
 *     which is scoped to the PROJECT and bypasses RLS — so this public, unauthenticated endpoint
 *     that accepts free input was the widest credential in the system, and anything that
 *     compromised it read and wrote every table. It now carries the anon key against a
 *     column-level INSERT grant and one policy, so the worst a compromise here does is write a
 *     junk row. Verified by `scripts/check-waitlist-anon-narrow.mjs`: anon INSERT succeeds, anon
 *     SELECT / UPDATE / DELETE are all refused with 42501.
 *   - it is still SERVER-side and still never serialised into HTML. Do NOT add a `NEXT_PUBLIC_`
 *     Supabase variable — that prefix is what puts a value in the browser bundle, and it is also
 *     what would make the rate limit below bypassable by anyone who read the page source.
 *
 * ⚠️ IT MUST WORK WITH JAVASCRIPT OFF. Hence form-encoded input, a 303 redirect, and outcome
 * pages that are real URLs rather than client-rendered state. Nothing here assumes a fetch().
 */

const SUPABASE_URL = process.env.SUPABASE_URL
const ANON_KEY = process.env.SUPABASE_ANON_KEY

const BAND_IDS = new Set<string>(AGE_BANDS.map(b => b.id))

/**
 * A per-IP backstop. In-process only.
 *
 * ⚠️ IT WAS 5 PER 10 MINUTES UNTIL 2026-08-31, AND THAT WAS WRONG. An IP is not a person: a
 * school, an office or a block of flats behind one NAT address shares a single address, so the
 * old limit blocked the sixth family of the day and told them "that did not go through". The
 * failure was invisible to us and looked like a broken form to them — the worst shape of bug.
 *
 * 60 per hour instead. A script doing damage does thousands, so this still stops one; thirty
 * families signing up from one school over an afternoon never approach it. The honeypot is the
 * real filter for bots, and the unique index makes a repeat submission harmless — this is only
 * here so a loop cannot fill the table while nobody is looking.
 *
 * ponytail: per-instance Map, not shared state. On serverless each instance keeps its own
 * counter, so the true ceiling is LIMIT × instances rather than LIMIT. That is the right trade
 * for a waitlist — a Redis round-trip per signup costs more than the abuse it prevents. If this
 * ever guards something that costs money to get wrong, move it to a shared store, and key it on
 * something better than an IP at the same time.
 */
const WINDOW_MS = 60 * 60 * 1000
const LIMIT = 60
const hits = new Map<string, { n: number; resetAt: number }>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const rec = hits.get(ip)
  if (!rec || now > rec.resetAt) {
    hits.set(ip, { n: 1, resetAt: now + WINDOW_MS })
    // Opportunistic sweep so the Map cannot grow without bound on a long-lived instance.
    if (hits.size > 5000) for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k)
    return false
  }
  rec.n += 1
  return rec.n > LIMIT
}

/**
 * A RELATIVE Location, deliberately. `SITE_URL` resolves to https://radlor.com off Vercel, so an
 * absolute redirect would bounce a local or preview submission onto production — you would submit
 * against localhost and land on the live site. RFC 7231 allows a relative Location and every
 * browser follows it against the request's own origin, which is the behaviour we actually want.
 */
const seeOther = (path: string) =>
  new Response(null, { status: 303, headers: { Location: path, 'Cache-Control': 'no-store' } })

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null)
  if (!form) return seeOther('/waitlist/problem')

  // The honeypot. A real person never sees this field, so anything in it is a bot — and we say
  // "thanks" rather than "caught you", because an error tells the author what to fix.
  if (String(form.get('company') ?? '').trim() !== '') return seeOther('/waitlist/thanks')

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'
  if (rateLimited(ip)) return seeOther('/waitlist/problem')

  const email = String(form.get('email') ?? '').trim().toLowerCase()
  if (!email || email.length > 254 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return seeOther('/waitlist/problem')
  }

  const rawBand = String(form.get('age_band') ?? '').trim()
  const age_band = BAND_IDS.has(rawBand) ? rawBand : null

  if (!SUPABASE_URL || !ANON_KEY) {
    // Misconfiguration, not the visitor's fault — say so in the log, not in their face.
    console.error('[waitlist] SUPABASE_URL or SUPABASE_ANON_KEY is not set')
    return seeOther('/waitlist/problem')
  }

  let res: Response
  try {
    res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ email, age_band, source: 'website' }),
    })
  } catch (err) {
    console.error('[waitlist] insert failed to reach Supabase', err)
    return seeOther('/waitlist/problem')
  }

  // 23505 is the unique violation. Someone signing up twice is not an error to them — they are
  // on the list either way, so they get the same page as a first-time signup.
  if (res.status === 409) return seeOther('/waitlist/thanks')

  if (!res.ok) {
    console.error('[waitlist] Supabase returned', res.status, await res.text().catch(() => ''))
    return seeOther('/waitlist/problem')
  }

  return seeOther('/waitlist/thanks')
}

/** A GET here is someone pasting the URL. Send them to the form rather than 405-ing at them. */
export async function GET() {
  return seeOther('/waitlist')
}
