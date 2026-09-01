/**
 * Liveness, plus the one configuration fact that cannot be learned any other way.
 *
 * ⚠️ WHY THIS EXISTS, AND IT IS NOT A GENERIC HEALTH CHECK. `/api/waitlist` answers `303` whether
 * it succeeded or failed — deliberately, because a distinct error would tell a bot what to fix and
 * would leak whether an address is already on the list. That no-oracle design works exactly as
 * intended, and it is also why a COMPLETELY BROKEN endpoint looks fine from outside: on 2026-09-01
 * the route was deployed against a missing `SUPABASE_ANON_KEY`, every submission answered
 * `/waitlist/problem`, and the only way to notice was to submit a real signup and then read the
 * database.
 *
 * A design that refuses to tell an attacker anything refuses to tell you anything either. So the
 * signal moves OFF the submission path: this says whether the dependency is present, and nothing
 * about any particular submission, any address, or any row.
 *
 * ⚠️ BOOLEANS ONLY, NEVER VALUES — and named after the VARIABLE, not the role, so this cannot
 * become a hint about which key a public endpoint is holding.
 *
 *   curl -s https://radlor.com/api/health
 */
export const dynamic = 'force-dynamic'

export function GET() {
  return Response.json(
    {
      status: 'ok',
      supabase_url: Boolean(process.env.SUPABASE_URL),
      anon_key_configured: Boolean(process.env.SUPABASE_ANON_KEY),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
