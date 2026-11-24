import { configured, dbJson, json, sessionFrom, storage, VIDEO_BUCKET } from '../../_lib/server.ts'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
const PATH = /^[\w][\w./ -]*\.mp4$/

/**
 * A customer watches one of their own videos, or (`?final=1`) downloads the clean file after the second half is paid. The
 * bytes pass through this route, with Range for seeking, so no storage URL reaches the browser and all stays on radlor.com.
 */
export async function GET(req: Request, ctx: RouteContext<'/api/3dlor/videos/[id]'>) {
  if (!configured()) return json(503, { code: 'closed' })
  const s = sessionFrom(req.headers.get('cookie'))
  if (!s) return json(401, { code: 'signin' })
  const { id } = await ctx.params
  if (!UUID.test(id)) return json(404, { code: 'not_found' })
  const final = new URL(req.url).searchParams.get('final') === '1'

  try {
    const [v] = await dbJson<{ title: string; status: string; order_id: string; video_path: string | null; final_path: string | null }[]>(
      `v3d_videos?select=title,status,order_id,video_path,final_path&id=eq.${id}&user_id=eq.${s.uid}`)
    if (!v) return json(404, { code: 'not_found' })
    const [o] = await dbJson<{ balance_paid: boolean }[]>(
      `v3d_orders?select=balance_paid&id=eq.${v.order_id}&user_id=eq.${s.uid}&payment_status=eq.paid`)
    const path = final ? (o?.balance_paid ? v.final_path : null) : ['video_review', 'video_changes', 'approved'].includes(v.status) ? v.video_path : null
    if (!o || !path || path.includes('..') || !PATH.test(path)) return json(404, { code: 'not_found' })

    const range = req.headers.get('range')
    const obj = await storage(path.split('/').map(encodeURIComponent).join('/'), range && /^bytes=\d*-\d*$/.test(range) ? { headers: { Range: range } } : {}, VIDEO_BUCKET)
    if (!obj.ok || !obj.body) return json(obj.status === 416 ? 416 : 502, { code: 'retry' })
    const h = new Headers({ 'Content-Type': 'video/mp4', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'private, no-store', 'Accept-Ranges': 'bytes' })
    for (const k of ['content-length', 'content-range']) { const x = obj.headers.get(k); if (x) h.set(k, x) }
    if (final) h.set('Content-Disposition', `attachment; filename="${v.title.replace(/[^\w -]/g, '_').slice(0, 80) || 'video'}.mp4"`)
    return new Response(obj.body, { status: obj.status === 206 ? 206 : 200, headers: h })
  } catch (err) {
    console.error('[3dlor] video read failed', String(err).slice(0, 300))
    return json(502, { code: 'retry' })
  }
}
