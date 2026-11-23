// Unit tests for the help page logic. Run: npm run test:3d
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { index, partText, search, stepAt, timeline, words, MAX_QUERY, type Product } from './help.ts'

const steps = [
  { dur: 5, view: 'front', mt: 10, speed: 1, hi: ['door'], caption: { title: 'Open the door', body: 'Pull the handle toward you.' } },
  { dur: 4, speed: 0.5, caption: { title: 'Find the filter', body: 'The filter sits at the bottom left, behind a small cover.' } },
  { dur: 6, view: 'back', mt: 40, caption: { title: 'Rinse the filter', body: 'Hold it under warm running water until the lint is gone.' } },
  { dur: 5, caption: { title: 'Restart', body: 'Hold the power button for three seconds.' } },
]

test('timeline carries fields over and runs the model clock', () => {
  const tl = timeline(steps)
  assert.deepEqual(tl.map(s => s.t0), [0, 5, 9, 15])
  assert.equal(tl[1].view, 'front')              // carried over
  assert.deepEqual(tl[1].hi, ['door'])
  assert.equal(tl[1].mt0, 15)                    // 10 + 1 x 5
  assert.equal(tl[2].mt0, 40)                    // an explicit mt jumps
  assert.equal(tl[3].mt0, 40 + 0.5 * 6)          // speed carries over too
  assert.equal(tl[1].caption?.title, 'Find the filter')
})

test('stepAt picks the step playing at a time', () => {
  const tl = timeline(steps)
  assert.equal(stepAt(tl, 0), 0)
  assert.equal(stepAt(tl, 4.99), 0)
  assert.equal(stepAt(tl, 5), 1)
  assert.equal(stepAt(tl, 99), 3)
  assert.equal(stepAt(tl, -1), 0)
})

test('partText takes the captions that overlap the range only', () => {
  const tl = timeline(steps)
  const txt = partText(tl, 5, 15)
  assert.match(txt, /Find the filter/)
  assert.match(txt, /Rinse the filter/)
  assert.doesNotMatch(txt, /Open the door|Restart/)
})

test('words: stop words, endings, same-meaning words', () => {
  assert.deepEqual(words('How do I clean the filters?'), ['clean', 'filter'])
  assert.deepEqual(words('Washing it'), ['clean'])
  assert.deepEqual(words('stopped batteries glass'), ['stop', 'charge', 'glass'])
  assert.deepEqual(words('Café <script>'), ['cafe', 'script'])
  assert.deepEqual(words(''), [])
})

const product: Product = {
  id: 'p', brand_slug: 'acme', product_slug: 'w1', brand_name: 'Acme', product_name: 'W1',
  videos: [
    { id: 'v1', position: 0, title: 'Clean the lint filter', model_id: 'washer', duration_s: 20, audio_path: null, script: { steps },
      parts: [
        { id: 'a', position: 0, title: 'Open the door', start_s: 0, end_s: 5, keywords: ['door'], still_path: null },
        { id: 'b', position: 1, title: 'Take out the filter', start_s: 5, end_s: 15, keywords: ['lint', 'filter', 'trap'], still_path: null },
        { id: 'c', position: 2, title: 'Start again', start_s: 15, end_s: 20, keywords: ['reboot'], still_path: null },
      ] },
  ],
}

test('search finds the part that answers the question, best first', () => {
  const docs = index(product)
  assert.equal(search(docs, 'how do I clean the filter')[0].partId, 'b')
  assert.equal(search(docs, 'where is the lint trap?')[0].partId, 'b')
  assert.equal(search(docs, 'restart it')[0].partId, 'c')           // "restart" = "reboot" keyword
  assert.equal(search(docs, 'warm water')[0].partId, 'b')           // only in the spoken text
  assert.deepEqual(search(docs, 'how do I'), [])                    // nothing but small words
  assert.deepEqual(search(docs, 'xylophone'), [])
})

test('search is safe with junk and huge input', () => {
  const docs = index(product)
  assert.deepEqual(search(docs, '<img src=x onerror=alert(1)>'), [])
  const big = 'filter '.repeat(100_000)
  const t0 = performance.now()
  assert.equal(search(docs, big)[0].partId, 'b')
  assert.ok(performance.now() - t0 < 50, 'a huge query is cut, not scanned')
  assert.ok(MAX_QUERY <= 200)
  assert.ok(search(docs, 'filter', 1).length === 1)
})
