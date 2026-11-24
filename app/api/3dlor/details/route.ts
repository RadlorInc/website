import { parseDetails } from '../_lib/validate.ts'
import { configured, db, limited, sameOrigin, seeOther, sessionFrom } from '../_lib/server.ts'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

/** The optional extras of a paid order (product, CAD link …). A plain form; only these five columns can change here. */
export async function POST(req: Request) {
  if (!configured()) return seeOther('/3dlor/account')
  const s = sessionFrom(req.headers.get('cookie'))
  if (!s) return seeOther('/3dlor/account?e=signin')
  const form = sameOrigin(req) ? await req.formData().catch(() => null) : null
  const id = String(form?.get('order_id') ?? '')
  if (!form || !UUID.test(id)) return seeOther('/3dlor/account?e=form')
  if (limited(`details:${s.uid}`, 60, 3600_000)) return seeOther('/3dlor/account?e=wait')
  const read = parseDetails(form)
  if (!read.ok) return seeOther(`/3dlor/account?e=field&f=${read.error}`)
  const { product_name, ...rest } = read.data
  const res = await db(`v3d_orders?id=eq.${id}&user_id=eq.${s.uid}&payment_status=eq.paid`, {
    method: 'PATCH', headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ ...rest, ...(product_name ? { product_name } : {}) }), // the name cannot be empty in the table
  }).catch(() => null)
  const rows = res?.ok ? await res.json().catch(() => []) : []
  return seeOther(rows.length ? '/3dlor/account?saved=1' : '/3dlor/account?e=save')
}
