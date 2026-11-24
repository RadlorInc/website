import { LANGUAGES, MIN_VIDEOS, payable, quote } from './plans.ts'

/**
 * What we need from a brand to start a library (from video_ads/CLAUDE.md and PITCH-POINTS.md):
 * who they are, the product, the topics (from the instruction manual), languages, brand look,
 * and files: product photos from several sides, the manual, the logo. CAD and big files come as a link.
 */
export const FIELDS = {
  company: { max: 200, required: true },
  contact_name: { max: 200, required: true },
  languages: { max: 600, required: false },
} as const
/** Asked on the order page AFTER payment, all optional (founder, 24 Nov 2026: the sign-up asks as little as possible). */
export const DETAILS = {
  product_name: { max: 300, required: false },
  product_url: { max: 500, required: false, url: true },
  files_link: { max: 500, required: false, url: true },
  website: { max: 300, required: false, url: true },
  phone: { max: 40, required: false },
} as const
// Not asked any more (founder, 23 Nov 2026: "keep the form easy"): the video topics come from the manual, and the
// brand look from the logo. The columns `topics`, `brand_colors` and `notes` stay in the table, empty.
type Field = keyof typeof FIELDS
export type Detail = keyof typeof DETAILS
export type OrderInput = Record<Field, string | null>

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

/** The list the form sends, "Spanish, Tamil", as names. English is added, doubles go, and a name that is not on our list makes
 *  it null: the price counts these, so nothing may hide two languages in one name. */
export function languagesIn(v: string | null): string[] | null {
  const names = (v ?? '').split(',').map(s => s.trim()).filter(Boolean)
  if (names.some(n => n !== 'English' && !(LANGUAGES as readonly string[]).includes(n))) return null
  return ['English', ...new Set(names.filter(n => n !== 'English'))]
}

type Rule = { max: number; required: boolean; url?: boolean }
function readFields<K extends string>(form: FormData, rules: Record<K, Rule>): { ok: true; data: Record<K, string | null> } | { ok: false; error: K } {
  const data = {} as Record<K, string | null>
  for (const [name, rule] of Object.entries(rules) as [K, Rule][]) {
    const raw = form.get(name)
    if (raw !== null && typeof raw !== 'string') return { ok: false, error: name }
    const v = (raw ?? '').trim()
    if (!v) {
      if (rule.required) return { ok: false, error: name }
      data[name] = null
      continue
    }
    if (v.length > rule.max || CONTROL.test(v) || (rule.url && !isHttpUrl(v))) return { ok: false, error: name }
    data[name] = v
  }
  return { ok: true, data }
}

export const parseDetails = (form: FormData) => readFields<Detail>(form, DETAILS)

const whole = (v: unknown, min: number) => {
  const n = typeof v === 'string' && /^\d{1,7}$/.test(v.trim()) ? Number(v) : NaN
  return n >= min ? n : null
}

export function parseOrder(form: FormData): { ok: true; data: OrderInput; size: { videos: number; products: number; languages: number }; names: string[] } | { ok: false; error: string } {
  const videos = whole(form.get('videos'), MIN_VIDEOS)
  if (videos === null) return { ok: false, error: 'videos' }
  const products = whole(form.get('products'), 1)
  if (products === null) return { ok: false, error: 'products' }
  const read = readFields(form, FIELDS)
  if (!read.ok) return read
  const data: OrderInput = read.data
  const names = languagesIn(data.languages)
  if (!names) return { ok: false, error: 'languages' }
  const listed = names.join(', ')
  data.languages = listed.length <= 200 ? listed : `${names.length} languages (see notes)` // the column holds 200
  const languages = names.length
  if (!payable(quote({ videos, products, languages }).buildCents)) return { ok: false, error: 'videos' }
  return { ok: true, data, size: { videos, products, languages }, names }
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
