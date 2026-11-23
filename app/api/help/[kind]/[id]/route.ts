import { anon, configured, MODEL, storage, UUID } from '@/app/help/_lib/data.ts'

/**
 * The files of a published help page, streamed through radlor.com so the browser never talks to another host:
 *   /api/help/audio/<video id>   the voice of a video (Range requests pass through, so seeking works)
 *   /api/help/still/<part id>    the still picture of a part (weak phones, no 3D)
 *   /api/help/engine/<name>      a player file: core, run, or a model that a published video uses
 * Every lookup is an anon read, so RLS answers "is this published?"; only then are the bytes read with the service key.
 */
const TYPES: Record<string, string> = {
  'audio/mpeg': 'audio/mpeg', 'audio/mp4': 'audio/mp4', 'image/webp': 'image/webp', 'image/jpeg': 'image/jpeg',
  'image/png': 'image/png', 'text/javascript': 'text/javascript; charset=utf-8',
}
const PLAYER = new Set(['core', 'run'])
// a page unpublished in the table editor stops serving within about an hour (the CDN copy)
const CACHE = 'public, max-age=300, s-maxage=3600'
const notFound = () => new Response('Not found', { status: 404, headers: { 'Cache-Control': 'public, max-age=60' } })

async function pathOf(kind: string, id: string): Promise<string | null> {
  if (kind === 'engine') {
    if (!MODEL.test(id)) return null
    if (PLAYER.has(id)) return `engine/${id}.js`
    const used = await anon<unknown[]>(`v3d_help_videos?select=id&model_id=eq.${id}&limit=1`)
    return used.length ? `engine/${id}.js` : null
  }
  if (!UUID.test(id)) return null
  if (kind === 'audio') return (await anon<{ audio_path: string | null }[]>(`v3d_help_videos?select=audio_path&id=eq.${id}`))[0]?.audio_path ?? null
  if (kind === 'still') return (await anon<{ still_path: string | null }[]>(`v3d_help_parts?select=still_path&id=eq.${id}`))[0]?.still_path ?? null
  return null
}

export async function GET(req: Request, ctx: RouteContext<'/api/help/[kind]/[id]'>) {
  if (!configured()) return new Response('Not open', { status: 503 })
  const { kind, id } = await ctx.params
  const path = await pathOf(kind, id).catch(() => null)
  if (!path) return notFound()

  const range = req.headers.get('range')
  const obj = await storage(path, range && /^bytes=\d*-\d*$/.test(range) ? { headers: { Range: range } } : {})
  if (obj.status === 416) return new Response(null, { status: 416, headers: { 'Content-Range': obj.headers.get('content-range') ?? '' } })
  if (!obj.ok || !obj.body) return obj.status === 404 || obj.status === 400 ? notFound() : new Response('Retry', { status: 502 })

  const type = TYPES[(obj.headers.get('content-type') ?? '').split(';')[0].trim()]
  if (!type || (kind === 'engine') !== type.startsWith('text/javascript')) return notFound()   // a file of the wrong kind is never served
  const h = new Headers({ 'Content-Type': type, 'Cache-Control': CACHE, 'X-Content-Type-Options': 'nosniff', 'Accept-Ranges': 'bytes' })
  for (const k of ['content-length', 'content-range', 'etag', 'last-modified']) { const v = obj.headers.get(k); if (v) h.set(k, v) }
  return new Response(obj.body, { status: obj.status === 206 ? 206 : 200, headers: h })
}
