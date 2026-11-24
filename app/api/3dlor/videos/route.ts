import { decide, NOTE_MAX, type Video } from '../_lib/track.ts'
import { configured, db, dbJson, json, limited, sameOrigin, sessionFrom } from '../_lib/server.ts'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

/**
 * A customer's answer to a script or a video: POST {id, action: 'approve' | 'change', note}. The owner, the status and the
 * round count are part of the UPDATE, so a second tab or an old page cannot change a row that has moved on.
 */
export async function POST(req: Request) {
  if (!configured()) return json(503, { code: 'closed' })
  const s = sessionFrom(req.headers.get('cookie'))
  if (!s) return json(401, { code: 'signin' })
  if (!sameOrigin(req)) return json(403, { code: 'forbidden' })
  if (Number(req.headers.get('content-length') ?? 0) > 20_000) return json(413, { code: 'too_big' })
  if (limited(`videos:${s.uid}`, 120, 3600_000)) return json(429, { code: 'wait' })

  const body = await req.json().catch(() => null)
  const id = String(body?.id ?? '')
  const note = typeof body?.note === 'string' ? body.note.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim() : ''
  if (!UUID.test(id) || note.length > NOTE_MAX) return json(400, { code: 'bad_request' })
  if (body?.action === 'change' && !note) return json(400, { code: 'note' })

  try {
    const own = `id=eq.${id}&user_id=eq.${s.uid}`
    const [v] = await dbJson<Pick<Video, 'status' | 'rounds_used' | 'order_id'>[]>(`v3d_videos?select=status,rounds_used,order_id&${own}`)
    if (!v) return json(404, { code: 'not_found' })
    // Only a paid order: an unpaid or refunded one has nothing to approve.
    const [o] = await dbJson<{ id: string }[]>(`v3d_orders?select=id&id=eq.${v.order_id}&user_id=eq.${s.uid}&payment_status=eq.paid`)
    if (!o) return json(404, { code: 'not_found' })
    const to = decide(v, body?.action)
    if (!to) return json(409, { code: 'moved' })

    const now = new Date().toISOString()
    const res = await db(`v3d_videos?${own}&status=eq.${v.status}&rounds_used=eq.${v.rounds_used}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ ...to, customer_note: note || null,
        ...(to.status === 'in_work' ? { script_approved_at: now } : {}), ...(to.status === 'approved' ? { video_approved_at: now } : {}) }),
    })
    if (!res.ok) throw new Error(`patch ${res.status}`)
    if (!(await res.json()).length) return json(409, { code: 'moved' })
    return json(200, { status: to.status })
  } catch (err) {
    console.error('[3dlor] video answer failed', String(err).slice(0, 300))
    return json(502, { code: 'retry' })
  }
}
