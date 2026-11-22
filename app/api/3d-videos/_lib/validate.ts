import { isPlan, PLANS, type PlanKey } from './plans.ts'

/**
 * What we need from a brand to start a library (from video_ads/CLAUDE.md and PITCH-POINTS.md):
 * who they are, the product, the topics (from reviews and support tickets), languages, brand look,
 * and files: product photos from several sides, the manual, the logo. CAD and big files come as a link.
 */
export const FIELDS = {
  company: { max: 200, required: true },
  contact_name: { max: 200, required: true },
  phone: { max: 40, required: false },
  website: { max: 300, required: false, url: true },
  product_name: { max: 300, required: true },
  product_url: { max: 500, required: false, url: true },
  topics: { max: 5000, required: true },
  languages: { max: 200, required: false },
  brand_colors: { max: 200, required: false },
  files_link: { max: 500, required: false, url: true },
  notes: { max: 5000, required: false },
} as const
type Field = keyof typeof FIELDS
export type OrderInput = Record<Field, string | null> & { plan: PlanKey }

const isHttpUrl = (s: string) => {
  try {
    const u = new URL(s)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}
// Control characters other than tab and newline.
const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/

export function parseOrder(form: FormData): { ok: true; data: OrderInput } | { ok: false; error: string } {
  const plan = String(form.get('plan') ?? '')
  if (!isPlan(plan)) return { ok: false, error: 'plan' }
  if (form.get('terms') !== 'yes') return { ok: false, error: 'terms' }
  const data = { plan } as OrderInput
  for (const [name, rule] of Object.entries(FIELDS) as [Field, (typeof FIELDS)[Field]][]) {
    const raw = form.get(name)
    if (raw !== null && typeof raw !== 'string') return { ok: false, error: name }
    const v = (raw ?? '').trim()
    if (!v) {
      if (rule.required) return { ok: false, error: name }
      data[name] = null
      continue
    }
    if (v.length > rule.max || CONTROL.test(v)) return { ok: false, error: name }
    if ('url' in rule && !isHttpUrl(v)) return { ok: false, error: name }
    data[name] = v
  }
  const langs = (data.languages ?? 'English').split(/[,/]| and /).map(s => s.trim()).filter(Boolean)
  if (langs.length > PLANS[plan].languages) return { ok: false, error: 'languages' }
  return { ok: true, data }
}

/** Upload rules. 4 MB keeps one file under Vercel's 4.5 MB request limit. */
export const MAX_FILE_BYTES = 4 * 1024 * 1024
export const MAX_FILES_PER_ORDER = 40
export type FileKind = 'photo' | 'manual' | 'logo'
export const KIND_MIMES: Record<FileKind, string[]> = {
  photo: ['image/jpeg', 'image/png', 'image/webp'],
  manual: ['application/pdf'],
  logo: ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'],
}
export const isKind = (v: unknown): v is FileKind => typeof v === 'string' && v in KIND_MIMES
export const EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'application/pdf': 'pdf' }

/** The real type from the first bytes. The browser's `type` and the file name are not trusted. */
export function sniffMime(b: Uint8Array): string | null {
  const ascii = (from: number, to: number) => String.fromCharCode(...b.subarray(from, to))
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg'
  if (b.length >= 8 && ascii(1, 4) === 'PNG' && b[0] === 0x89 && b[4] === 0x0d && b[5] === 0x0a) return 'image/png'
  if (b.length >= 12 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp'
  if (b.length >= 5 && ascii(0, 5) === '%PDF-') return 'application/pdf'
  return null
}

/** A display name only (storage paths are random ids): no folders, no control characters, max 200. */
export function cleanName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? ''
  const clean = base.replace(/[\u0000-\u001f\u007f"<>]/g, '').trim().slice(0, 200)
  return clean || 'file'
}

export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
export const isEmail = (s: string) => s.length <= 254 && EMAIL_RE.test(s)
