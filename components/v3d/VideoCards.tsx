'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { NOTE_MAX, ROUNDS, STATUS_WORDS, waitsForCustomer, type Video } from '@/app/api/3dlor/_lib/track'
import { SUPPORT_EMAIL } from '@/site'
import { Spinner } from './Spinner'

const ERRORS: Record<string, string> = {
  moved: 'This video has moved on. The page is up to date now.', wait: 'Too many tries. Please wait a few minutes.',
  note: 'Please write what to change.', signin: 'Please sign in again.',
}

function Card({ v, clean }: { v: Video; clean: boolean }) {
  const router = useRouter()
  const [asking, setAsking] = useState(false)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [refreshing, refresh] = useTransition()
  const mine = waitsForCustomer(v)
  const script = v.status === 'script_review'
  const left = ROUNDS - v.rounds_used

  async function answer(action: 'approve' | 'change') {
    setBusy(true)
    setError('')
    const res = await fetch('/api/3dlor/videos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: v.id, action, note: action === 'change' ? note : '' }) }).catch(() => null)
    const body = await res?.json().catch(() => null)
    setBusy(false)
    if (!res?.ok) setError(ERRORS[body?.code] ?? 'That did not work. Please try again.')
    else { setAsking(false); setNote('') }
    if (res?.ok || body?.code === 'moved') refresh(() => router.refresh())
  }

  const wait = busy || refreshing
  return (
    <li className="tl-sheet vc" data-you={mine || undefined}>
      <div className="vc-head"><h3>{v.title}</h3><span>{STATUS_WORDS[v.status]}</span></div>
      {script && v.script && <p className="vc-script">{v.script}</p>}
      {v.video_path && ['video_review', 'video_changes', 'approved'].includes(v.status) && (
        <video controls playsInline preload="none" src={`/api/3dlor/videos/${v.id}`} aria-label={v.title} />
      )}
      {v.customer_note && ['script_changes', 'video_changes'].includes(v.status) && <p className="vc-note">You asked: {v.customer_note}</p>}
      {clean && v.final_path && <a className="su-next vc-dl" href={`/api/3dlor/videos/${v.id}?final=1`}>Download</a>}
      {mine && !asking && (
        <div className="su-nav">
          <button type="button" className="su-next" disabled={wait} onClick={() => answer('approve')}>{wait ? <Spinner /> : script ? 'Approve script' : 'Approve video'}</button>
          {script || left > 0
            ? <button type="button" className="su-back" disabled={wait} onClick={() => setAsking(true)}>Ask for a change{script ? '' : ` (${left} left)`}</button>
            : <a className="su-back" href={`mailto:${SUPPORT_EMAIL}`}>Both change rounds are used. Write to us</a>}
        </div>
      )}
      {mine && asking && (
        <form className="vc-ask" onSubmit={e => { e.preventDefault(); answer('change') }}>
          <label>What to change?<textarea required autoFocus rows={3} maxLength={NOTE_MAX} value={note} onChange={e => setNote(e.target.value)} /></label>
          <div className="su-nav">
            <button className="su-next" disabled={wait}>{wait ? <Spinner /> : 'Send'}</button>
            <button type="button" className="su-back" onClick={() => setAsking(false)}>Cancel</button>
          </div>
        </form>
      )}
      <p role="status" className="vc-error">{error}</p>
    </li>
  )
}

/** The customer's videos: the ones that wait for them come first. */
export function VideoCards({ videos, clean }: { videos: Video[]; clean: boolean }) {
  const list = [...videos].sort((a, b) => Number(waitsForCustomer(b)) - Number(waitsForCustomer(a)) || a.position - b.position)
  return <ul className="vcs">{list.map(v => <Card key={v.id} v={v} clean={clean} />)}</ul>
}
