// The upload script's folder check. Run: npm run test:3d
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { check } from './help-upload.mjs'

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'help-'))
fs.writeFileSync(path.join(dir, 'q1.json'), JSON.stringify({ steps: [{ dur: 5, caption: { title: 'a' } }, { dur: 5 }] }))
fs.writeFileSync(path.join(dir, 'p.jpg'), 'x')
fs.writeFileSync(path.join(dir, 'evil.js'), 'x')
const good = () => ({
  brand_slug: 'acme', brand_name: 'Acme', product_slug: 'w1', product_name: 'W1',
  videos: [{ title: 'V', model_id: 'washer', script: 'q1.json', parts: [{ title: 'P', start_s: 0, end_s: 10, keywords: ['x'], still: 'p.jpg' }] }],
})

test('a good folder passes and the length is the sum of the steps', () => {
  const h = good()
  assert.deepEqual(check(dir, h).errs, [])
  assert.equal(h.videos[0]._duration, 10)
})

test('bad folders are refused before anything is uploaded', () => {
  const cases = [
    h => { h.brand_slug = '../acme' },
    h => { h.product_slug = 'W1 Washer' },
    h => { h.videos[0].model_id = '../core' },
    h => { h.videos[0].parts[0].end_s = 11 },          // past the end of the video
    h => { h.videos[0].parts[0].end_s = 0 },           // end before start
    h => { h.videos[0].parts[0].still = 'evil.js' },   // a script is not a picture
    h => { h.videos[0].parts[0].still = '../../etc/passwd.jpg' },
    h => { h.videos[0].audio = 'q1.json' },
    h => { h.videos[0].script = 'missing.json' },
    h => { h.videos = [] },
    h => { h.order_id = 'nope' },
    h => { h.videos[0].parts[0].keywords = Array(41).fill('k') },
  ]
  for (const [i, f] of cases.entries()) { const h = good(); f(h); assert.ok(check(dir, h).errs.length, `case ${i} should fail`) }
})
