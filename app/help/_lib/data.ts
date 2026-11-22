import type { Product, Video } from './help.ts'

/**
 * Server-only reads for the help pages, with plain `fetch` (no supabase-js, like /api/3dlor).
 *
 * Reads use the ANON key, so RLS decides what is visible: a product with published = false does not exist here.
 * Only file bytes (voice, still pictures, player files) use the service key, in storage(), and only after a read
 * with the anon key has shown that the file belongs to a published product.
 */
const URL_ = process.env.SUPABASE_URL
const ANON = process.env.SUPABASE_ANON_KEY
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY
export const BUCKET = 'v3d-help'
export const configured = () => Boolean(URL_ && ANON && SERVICE)
// `npm run dev` with HELP_SHOW_DRAFTS=1 in .env.local shows draft products, so the founder can check a page before
// publishing it. A production build never reads drafts, whatever the env says.
const READ = process.env.NODE_ENV !== 'production' && process.env.HELP_SHOW_DRAFTS === '1' ? SERVICE : ANON

const keyHeaders = (key: string) => ({ apikey: key, ...(key.startsWith('eyJ') ? { Authorization: `Bearer ${key}` } : {}) })

/** A REST read as anon. Pages revalidate every 60 s, so a published change shows within a minute. */
export async function anon<T>(path: string): Promise<T> {
  const res = await fetch(`${URL_}/rest/v1/${path}`, { headers: keyHeaders(READ!), next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`help db ${res.status}`)
  return res.json() as Promise<T>
}

export function storage(path: string, init: RequestInit = {}) {
  return fetch(`${URL_}/storage/v1/object/${BUCKET}/${path}`, {
    ...init, cache: 'no-store', headers: { ...keyHeaders(SERVICE!), ...(init.headers ?? {}) },
  })
}

export const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
export const MODEL = /^[a-z0-9]{1,40}$/

type Row = Omit<Product, 'videos'> & { v3d_help_videos: (Omit<Video, 'parts'> & { v3d_help_parts: Video['parts'] })[] }

export async function getProduct(brand: string, product: string): Promise<Product | null> {
  if (!configured() || !SLUG.test(brand) || !SLUG.test(product) || brand.length > 60 || product.length > 80) return null
  const sel = 'id,brand_slug,product_slug,brand_name,product_name,' +
    'v3d_help_videos(id,position,title,model_id,duration_s,audio_path,script,' +
    'v3d_help_parts(id,position,title,start_s,end_s,keywords,still_path))'
  const [row] = await anon<Row[]>(`v3d_help_products?select=${sel}&brand_slug=eq.${brand}&product_slug=eq.${product}&limit=1`)
  if (!row) return null
  const { v3d_help_videos, ...rest } = row
  return {
    ...rest,
    videos: v3d_help_videos
      .map(({ v3d_help_parts, ...v }) => ({
        ...v, duration_s: Number(v.duration_s),
        parts: v3d_help_parts.map(p => ({ ...p, start_s: Number(p.start_s), end_s: Number(p.end_s) })).sort((a, b) => a.position - b.position),
      }))
      .sort((a, b) => a.position - b.position),
  }
}
