'use client'

import { useState } from 'react'
import { FREE_MONTHS, LANGUAGES, EXTRA_LANGUAGE_CENTS, EXTRA_PRODUCT_CENTS, MIN_VIDEOS, RATES, START_VIDEOS, cheaperAt, depositCents, payable, quote, usd } from '@/app/api/3dlor/_lib/plans'

function Count({ name, title, note, value, set, min }: { name: string; title: string; note?: string; value: string; set: (v: string) => void; min: number }) {
  const step = (d: number) => set(String(Math.max(min, (Number(value) || min) + d)))
  return (
    <div className="su-count">
      <label htmlFor={name}>{title}{note && <small>{note}</small>}</label>
      <button type="button" aria-label={`Fewer: ${title}`} onClick={() => step(-1)}>−</button>
      <input id={name} name={name} type="number" inputMode="numeric" min={min} step={1} required value={value} onChange={e => { e.target.setCustomValidity(''); set(e.target.value) }} />
      <button type="button" aria-label={`More: ${title}`} onClick={() => step(1)}>+</button>
    </div>
  )
}

/** The rate card under the visitor's hand. The browser only shows the sum; the order route works it out again and saves it. */
export function PickVideos({ bad }: { bad?: string }) {
  const [videos, setVideos] = useState(String(START_VIDEOS))
  const [products, setProducts] = useState('1')
  const [langs, setLangs] = useState<string[]>([])
  const clamp = (v: string, min: number) => Math.max(min, Math.floor(Number(v)) || min)
  const order = { videos: clamp(videos, MIN_VIDEOS), products: clamp(products, 1), languages: 1 + langs.length }
  const q = quote(order)
  const better = cheaperAt(order)
  return (
    <div className="su-pick">
      <Count name="videos" title="Videos" value={videos} set={setVideos} min={MIN_VIDEOS} />
      <table className="su-rates">
        <caption className="sr-only">Price of one video by the size of the order</caption>
        <tbody>
          {RATES.map((r, i) => (
            <tr key={r.from} data-on={r.from === q.rateFrom || undefined}>
              <th scope="row">{RATES[i + 1] ? `${r.from}–${RATES[i + 1].from - 1}` : `${r.from}+`} videos</th>
              <td>{usd(r.cents)} each</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Count name="products" title="Products" note={`${q.included} included, then ${usd(EXTRA_PRODUCT_CENTS)} each`} value={products} set={setProducts} min={1} />
      <div className="su-langs">
        <p id="su-langs">Languages <small>English included, then {usd(EXTRA_LANGUAGE_CENTS)} a video each</small></p>
        <ul aria-labelledby="su-langs">
          <li>English</li>
          {langs.map(l => (
            <li key={l}>{l}<button type="button" aria-label={`Remove ${l}`} onClick={() => setLangs(x => x.filter(y => y !== l))}>×</button></li>
          ))}
          <li className="su-add">
            <select aria-label="Add a language" value="" aria-invalid={bad === 'languages' || undefined} onChange={e => { const v = e.target.value; if (v) setLangs(x => [...x, v]) }}>
              <option value="">+ Add a language</option>
              {LANGUAGES.filter(l => !langs.includes(l)).map(l => <option key={l}>{l}</option>)}
            </select>
          </li>
        </ul>
        <input type="hidden" name="languages" value={langs.join(', ')} />
        {langs.length > 0 && <p className="su-sum">{langs.length} extra × {order.videos} videos × {usd(EXTRA_LANGUAGE_CENTS)} = <strong>{usd(langs.length * order.videos * EXTRA_LANGUAGE_CENTS)}</strong></p>}
      </div>
      <div className="su-total" aria-live="polite">
        <p><span>Total</span><strong>{usd(q.buildCents)}</strong></p>
        <p>{usd(depositCents(q.buildCents))} today, the other half at delivery. Care plan: free for {FREE_MONTHS} months, then {usd(q.careCents)} a month. Cancel any time.</p>
        {!payable(q.buildCents) && <p role="alert"><strong>Stripe cannot take one card payment this large. Please write to us.</strong></p>}
        {better && <button type="button" onClick={() => setVideos(String(better))}>{better} videos cost {usd(quote({ ...order, videos: better }).buildCents)}. Switch</button>}
      </div>
      <details>
        <summary>What is included?</summary>
        <p>3D video, voice-over, captions, all formats and 2 change rounds. You approve every script. The care plan keeps your help page live and adds new videos. No interest and no late fees.</p>
      </details>
    </div>
  )
}
