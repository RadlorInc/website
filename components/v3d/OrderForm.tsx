'use client'

import { useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from 'react'
import { CONFIRM_FROM, depositCents, payable, quote, usd } from '@/app/api/3dlor/_lib/plans'
import { FIELDS, languagesIn } from '@/app/api/3dlor/_lib/validate'
import { PickVideos } from './PickVideos'
import { PendingButton } from './PendingButton'
import { StepPage } from './Steps'

type Name = keyof typeof FIELDS
const PAGE: Record<string, number> = { videos: 0, products: 0, languages: 0, company: 1, contact_name: 1 }
const TITLES = ['How many videos?', 'About you']

function Field({ name, title, hint, type = 'text', bad, auto }: { name: Name; title: string; hint?: string; type?: string; bad?: boolean; auto?: string }) {
  const f = FIELDS[name]
  return (
    <label className="su-field">
      <span>{title}{!f.required && <small> optional</small>}</span>
      <input name={name} type={type} required={f.required} maxLength={f.max} placeholder={hint} autoComplete={auto} aria-invalid={bad || undefined}
        onInput={e => e.currentTarget.setCustomValidity('')} />
    </label>
  )
}

/**
 * The order form as two sheets (steps 2–3 of 5). One plain form: it posts to /api/3dlor/order as before and the server
 * checks everything again. Without JavaScript both sheets show and it still posts.
 */
export function OrderForm({ bad, notice, closing }: { bad?: string; notice: ReactNode; closing: ReactNode }) {
  const form = useRef<HTMLFormElement>(null)
  const live = useSyncExternalStore(() => () => {}, () => true, () => false)
  const dialog = useRef<HTMLDialogElement>(null)
  const [ask, setAsk] = useState<{ videos: number; text: string } | null>(null)
  const sure = useRef(0) // the number of videos the customer said yes to
  const [at, setAt] = useState(bad && Object.hasOwn(PAGE, bad) ? PAGE[bad] : 0)
  // Not fieldset.checkValidity(): the browser always calls a fieldset valid.
  const badIn = (s: Element) => s.querySelector<HTMLInputElement>('input:invalid')
  const sizeNow = () => {
    const d = new FormData(form.current!)
    return { videos: Number(d.get('videos')), products: Number(d.get('products')), languages: Math.max(1, languagesIn(String(d.get('languages') ?? '')).length) }
  }
  const sheets = () => Array.from(form.current!.querySelectorAll('fieldset'))

  /** The first sheet with something wrong, with the browser's own message on the field. -1 when all good. */
  function wrong(upTo: number) {
    const f = form.current!
    const langs = f.elements.namedItem('languages') as HTMLInputElement
    const n = languagesIn(langs.value).length
    langs.setCustomValidity(n < 1 ? 'Write a language, or leave it empty.' : '')
    const size = sizeNow()
    const videos = f.elements.namedItem('videos') as HTMLInputElement
    videos.setCustomValidity(payable(quote(size).buildCents) ? '' : 'Stripe cannot take one card payment this large. Please write to us.')
    return sheets().findIndex((s, i) => i <= upTo && badIn(s))
  }
  function go(to: number) {
    setAt(to)
    requestAnimationFrame(() => { sheets()[to].querySelector('legend')!.focus(); scrollTo({ top: 0 }) })
  }
  function submit(e: FormEvent) {
    if (!live) return
    const w = wrong(at)
    if (w >= 0) {
      e.preventDefault()
      if (w !== at) setAt(w)
      requestAnimationFrame(() => badIn(sheets()[w])?.reportValidity())
    } else if (at < TITLES.length - 1) {
      e.preventDefault()
      const size = sizeNow()
      if (at === 0 && size.videos >= CONFIRM_FROM && sure.current !== size.videos) {
        const { buildCents } = quote(size)
        setAsk({ videos: size.videos, text: `${usd(buildCents)} in total. ${usd(depositCents(buildCents))} today.` })
        dialog.current!.showModal()
      } else go(at + 1)
    }
  }

  return (
    <StepPage step={at + 2} title="Start your library">
      {notice}
      <form ref={form} method="post" action="/api/3dlor/order" noValidate={live} onSubmit={submit} className="su-form">
        {[<PickVideos key="videos" bad={bad} />,
          <div key="you" className="su-fields">
            <Field name="company" title="Company or brand" auto="organization" bad={bad === 'company'} />
            <Field name="contact_name" title="Your name" auto="name" bad={bad === 'contact_name'} />
          </div>,
        ].map((body, i) => (
          <fieldset key={TITLES[i]} className="su-sheet" hidden={live && i !== at}>
            <legend tabIndex={-1}>{TITLES[i]}</legend>
            {body}
          </fieldset>
        ))}
        <div className="su-nav">
          {live && at > 0 && <button type="button" className="su-back" onClick={() => go(at - 1)}>Back</button>}
          {live && at < TITLES.length - 1
            ? <button key="next" className="su-next">Next</button>
            : <PendingButton key="save" className="su-next" pending="Saving…">Save and add files</PendingButton>}
        </div>
      </form>
      <dialog ref={dialog} className="su-ask" aria-labelledby="su-ask-title">
        <h2 id="su-ask-title">Do you want {ask?.videos.toLocaleString('en-US')} videos?</h2>
        <p>{ask?.text}</p>
        <form method="dialog">
          <button className="su-back">Change</button>
          <button className="su-next" onClick={() => { sure.current = ask!.videos; go(1) }}>Yes, {ask?.videos.toLocaleString('en-US')} videos</button>
        </form>
      </dialog>
      {closing}
    </StepPage>
  )
}
