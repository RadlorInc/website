import { randomUUID } from 'node:crypto'
import { cleanName, EXT, isKind, KIND_MIMES, MAX_FILE_BYTES, MAX_FILES_PER_ORDER, sniffMime } from '../_lib/validate.ts'
import { configured, db, dbJson, ipOf, json, limited, sameOrigin, sessionFrom, storage } from '../_lib/server.ts'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

/**
 * One file per request (multipart: order_id, kind, file), so each request stays under Vercel's
 * 4.5 MB body limit and the browser talks only to radlor.com. The type comes from the file's first
 * bytes, not from its name or the browser. Storage is a private bucket at a random path.
 */
export async function POST(req: Request) {
  if (!configured()) return json(503, { code: 'closed' })
  const s = sessionFrom(req.headers.get('cookie'))
  if (!s) return json(401, { code: 'signin' })
  if (!sameOrigin(req)) return json(403, { code: 'forbidden' })
  if (Number(req.headers.get('content-length') ?? 0) > MAX_FILE_BYTES + 64 * 1024) return json(413, { code: 'too_big' })
  if (limited(`files:${s.uid}`, 120, 3600_000) || limited(`files:ip:${ipOf(req)}`, 300, 3600_000)) return json(429, { code: 'wait' })

  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  const orderId = String(form?.get('order_id') ?? '')
  const kind = form?.get('kind')
  if (!(file instanceof File) || !UUID.test(orderId) || !isKind(kind)) return json(400, { code: 'bad_request' })
  if (file.size === 0 || file.size > MAX_FILE_BYTES) return json(413, { code: 'too_big' })

  const bytes = new Uint8Array(await file.arrayBuffer())
  if (bytes.length > MAX_FILE_BYTES) return json(413, { code: 'too_big' })
  const mime = sniffMime(bytes)
  if (!mime || !KIND_MIMES[kind].includes(mime)) return json(415, { code: 'wrong_type' })

  try {
    // The order must be this customer's. Same answer for "not yours" and "does not exist".
    const own = await dbJson<{ id: string }[]>(`v3d_orders?select=id&id=eq.${orderId}&user_id=eq.${s.uid}`)
    if (!own.length) return json(404, { code: 'not_found' })
    const count = await db(`v3d_files?select=id&order_id=eq.${orderId}`, { method: 'HEAD', headers: { Prefer: 'count=exact' } })
    const n = Number(count.headers.get('content-range')?.split('/')[1] ?? 0)
    if (n >= MAX_FILES_PER_ORDER) return json(409, { code: 'too_many' })

    const path = `${s.uid}/${orderId}/${randomUUID()}.${EXT[mime]}`
    const up = await storage(path, { method: 'POST', headers: { 'Content-Type': mime, 'x-upsert': 'false' }, body: bytes })
    if (!up.ok) throw new Error(`storage ${up.status} ${await up.text().catch(() => '')}`)

    const name = cleanName(file.name)
    const ins = await db('v3d_files', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ order_id: orderId, user_id: s.uid, kind, name, path, size_bytes: bytes.length, mime }),
    })
    if (!ins.ok) {
      await storage(path, { method: 'DELETE' }).catch(() => {})
      throw new Error(`insert ${ins.status} ${await ins.text().catch(() => '')}`)
    }
    const [row] = await ins.json()
    return json(201, { id: row.id, name, kind, size_bytes: bytes.length })
  } catch (err) {
    console.error('[3dlor] upload failed', String(err).slice(0, 300))
    return json(500, { code: 'retry' })
  }
}
