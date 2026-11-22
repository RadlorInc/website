// Uploads one product's help videos to the radlor-site Supabase project, for its page at /help/<brand>/<product>.
//
//   node --env-file=.env.local scripts/help-upload.mjs <folder>            upload (needs SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
//   node scripts/help-upload.mjs <folder> --check                          only check the folder, upload nothing
//
// <folder>/help.json (paths are relative to the folder):
//   { "brand_slug": "acme", "brand_name": "Acme", "product_slug": "w1-washer", "product_name": "W1 Washer",
//     "order_id": "<optional v3d_orders id>",
//     "engine": "<folder with core.js, run.js and <model_id>.js, from the player's shipped copy>",
//     "videos": [ { "title": "Clean the pump filter", "model_id": "washer", "script": "q1.json", "audio": "q1.mp3",
//                   "parts": [ { "title": "Open the cover", "start_s": 0, "end_s": 6, "keywords": ["cover"], "still": "p1.webp" } ] } ] }
// A script file is the lesson format: { "steps": [ { "dur", "view", "cut", "xray", "explode", "mt", "speed", "hi", "labels",
// "caption": { "title", "body" } } ] }. The video's length is the sum of the step durations.
//
// Run it again to replace the product's videos. It never sets `published`: a new product stays a draft until the founder
// sets published = true in the Supabase table editor. ⚠️ While it runs, the page of a published product is empty for a few seconds.
import fs from 'node:fs'
import path from 'node:path'

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/, MODEL = /^[a-z0-9]{1,40}$/, UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
const MIME = { '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.js': 'text/javascript' }
const MAX_FILE = 20 * 1024 * 1024
const text = (v, max) => typeof v === 'string' && v.trim().length >= 1 && v.length <= max
const num = v => typeof v === 'number' && Number.isFinite(v)

/** Every problem in the folder, as plain lines. Nothing is uploaded unless this is empty. */
export function check(dir, h) {
  const errs = [], file = (rel, kinds, where) => {
    const p = path.resolve(dir, String(rel))
    if (!MIME[path.extname(p).toLowerCase()] || !kinds.includes(path.extname(p).toLowerCase())) errs.push(`${where}: ${rel} must be ${kinds.join(' or ')}`)
    else if (!fs.existsSync(p)) errs.push(`${where}: ${rel} not found`)
    else if (fs.statSync(p).size > MAX_FILE) errs.push(`${where}: ${rel} is over 20 MB`)
    return p
  }
  if (!SLUG.test(h.brand_slug ?? '') || h.brand_slug.length > 60) errs.push('brand_slug: lower-case letters, digits and dashes')
  if (!SLUG.test(h.product_slug ?? '') || h.product_slug.length > 80) errs.push('product_slug: lower-case letters, digits and dashes')
  if (!text(h.brand_name, 120)) errs.push('brand_name: 1-120 characters')
  if (!text(h.product_name, 200)) errs.push('product_name: 1-200 characters')
  if (h.order_id !== undefined && !UUID.test(h.order_id)) errs.push('order_id: a v3d_orders id')
  if (!Array.isArray(h.videos) || !h.videos.length) errs.push('videos: at least one')
  const models = new Set()
  for (const [i, v] of (h.videos ?? []).entries()) {
    const at = `videos[${i}]`
    if (!text(v.title, 200)) errs.push(`${at}.title: 1-200 characters`)
    if (!MODEL.test(v.model_id ?? '')) errs.push(`${at}.model_id: lower-case letters and digits`)
    else models.add(v.model_id)
    let steps = []
    try { steps = JSON.parse(fs.readFileSync(path.resolve(dir, String(v.script)), 'utf8')).steps } catch { errs.push(`${at}.script: ${v.script} is not a readable JSON file`) }
    if (!Array.isArray(steps) || !steps.length) { errs.push(`${at}.script: needs steps`); steps = [] }
    for (const [k, s] of steps.entries()) if (!num(s?.dur) || s.dur <= 0) errs.push(`${at} step ${k}: dur must be a number over 0`)
    v._steps = steps
    v._duration = steps.reduce((n, s) => n + (num(s?.dur) ? s.dur : 0), 0)
    if (v._duration > 3600) errs.push(`${at}: longer than an hour`)
    if (v.audio !== undefined) v._audio = file(v.audio, ['.mp3', '.m4a'], `${at}.audio`)
    if (!Array.isArray(v.parts) || !v.parts.length) errs.push(`${at}.parts: at least one`)
    for (const [j, p] of (v.parts ?? []).entries()) {
      const pat = `${at}.parts[${j}]`
      if (!text(p.title, 200)) errs.push(`${pat}.title: 1-200 characters`)
      if (!num(p.start_s) || !num(p.end_s) || p.start_s < 0 || p.end_s <= p.start_s || p.end_s > v._duration + 0.001)
        errs.push(`${pat}: needs 0 <= start_s < end_s <= ${v._duration} (the video's length)`)
      if (p.keywords !== undefined && (!Array.isArray(p.keywords) || p.keywords.length > 40 || !p.keywords.every(k => text(k, 60))))
        errs.push(`${pat}.keywords: up to 40 words`)
      if (p.still !== undefined) p._still = file(p.still, ['.webp', '.jpg', '.jpeg', '.png'], `${pat}.still`)
    }
  }
  const engine = []
  if (h.engine !== undefined) for (const n of ['core', 'run', ...models]) engine.push([n, file(path.join(String(h.engine), `${n}.js`), ['.js'], 'engine')])
  return { errs, engine }
}

async function main() {
  const [dir, flag] = process.argv.slice(2)
  if (!dir) { console.error('usage: node --env-file=.env.local scripts/help-upload.mjs <folder> [--check]'); process.exit(2) }
  const h = JSON.parse(fs.readFileSync(path.join(dir, 'help.json'), 'utf8'))
  const { errs, engine } = check(dir, h)
  if (errs.length) { console.error(errs.map(e => `✗ ${e}`).join('\n')); process.exit(1) }
  console.log(`✓ ${h.videos.length} videos, ${h.videos.reduce((n, v) => n + v.parts.length, 0)} parts`)
  if (flag === '--check') return

  const URL_ = process.env.SUPABASE_URL, KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!URL_ || !KEY) { console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set'); process.exit(2) }
  const auth = { apikey: KEY, ...(KEY.startsWith('eyJ') ? { Authorization: `Bearer ${KEY}` } : {}) }
  const rest = async (p, method, body, prefer = 'return=representation') => {
    const r = await fetch(`${URL_}/rest/v1/${p}`, { method, headers: { ...auth, 'Content-Type': 'application/json', Prefer: prefer }, body: body && JSON.stringify(body) })
    if (!r.ok) throw new Error(`${method} ${p}: ${r.status} ${await r.text()}`)
    const out = await r.text()
    return out ? JSON.parse(out) : null
  }
  const put = async (key, file) => {
    const r = await fetch(`${URL_}/storage/v1/object/v3d-help/${key}`, {
      method: 'POST', headers: { ...auth, 'Content-Type': MIME[path.extname(file).toLowerCase()], 'x-upsert': 'true', 'Cache-Control': 'max-age=3600' },
      body: fs.readFileSync(file),
    })
    if (!r.ok) throw new Error(`upload ${key}: ${r.status} ${await r.text()}`)
    return key
  }

  for (const [n, f] of engine) await put(`engine/${n}.js`, f)
  const base = `${h.brand_slug}/${h.product_slug}`
  const [prod] = await rest('v3d_help_products?on_conflict=brand_slug,product_slug', 'POST', {
    brand_slug: h.brand_slug, product_slug: h.product_slug, brand_name: h.brand_name, product_name: h.product_name,
    ...(h.order_id ? { order_id: h.order_id } : {}),
  }, 'return=representation,resolution=merge-duplicates')
  await rest(`v3d_help_videos?product_id=eq.${prod.id}`, 'DELETE', undefined, 'return=minimal')
  for (const [i, v] of h.videos.entries()) {
    const audio = v._audio ? await put(`${base}/${i}-voice${path.extname(v._audio).toLowerCase()}`, v._audio) : null
    const [row] = await rest('v3d_help_videos', 'POST', {
      product_id: prod.id, position: i, title: v.title, model_id: v.model_id, script: { steps: v._steps }, duration_s: v._duration, audio_path: audio,
    })
    const parts = []
    for (const [j, p] of v.parts.entries()) parts.push({
      video_id: row.id, position: j, title: p.title, start_s: p.start_s, end_s: p.end_s, keywords: p.keywords ?? [],
      still_path: p._still ? await put(`${base}/${i}-${j}${path.extname(p._still).toLowerCase()}`, p._still) : null,
    })
    await rest('v3d_help_parts', 'POST', parts, 'return=minimal')
  }
  console.log(`✓ uploaded. Published: ${prod.published ? 'YES (live now)' : 'no (draft)'}`)
  console.log(`  Page: /help/${h.brand_slug}/${h.product_slug}\n  To check a draft first: put HELP_SHOW_DRAFTS=1 in .env.local, run npm run dev, open http://localhost:3021/help/${h.brand_slug}/${h.product_slug}\n  To publish: set published = true on its v3d_help_products row in the Supabase table editor.`)
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch(e => { console.error(`✗ ${e.message}`); process.exit(1) })
