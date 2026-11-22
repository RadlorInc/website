import { configured, dbJson, json, sessionFrom, storage } from '../../_lib/server.ts'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

/**
 * A customer downloads one of their own files. The bytes come through this route (not a redirect to
 * a Supabase signed URL), so no storage URL ever reaches the browser and every request stays on
 * radlor.com. Always a download, never rendered inline, with nosniff.
 */
export async function GET(req: Request, ctx: RouteContext<'/api/3d-videos/files/[id]'>) {
  if (!configured()) return json(503, { code: 'closed' })
  const s = sessionFrom(req.headers.get('cookie'))
  if (!s) return json(401, { code: 'signin' })
  const { id } = await ctx.params
  if (!UUID.test(id)) return json(404, { code: 'not_found' })

  const [f] = await dbJson<{ name: string; path: string; mime: string }[]>(
    `v3d_files?select=name,path,mime&id=eq.${id}&user_id=eq.${s.uid}`)
  if (!f) return json(404, { code: 'not_found' })
  const obj = await storage(f.path)
  if (!obj.ok || !obj.body) return json(502, { code: 'retry' })

  const ascii = f.name.replace(/[^\x20-\x7e]/g, '_').replace(/["\\;]/g, '_')
  return new Response(obj.body, {
    headers: {
      'Content-Type': f.mime,
      'Content-Disposition': `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(f.name)}`,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'private, no-store',
    },
  })
}
