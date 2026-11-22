'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const MAX = 4 * 1024 * 1024
const ROWS = [
  { kind: 'photo', label: 'Product photos', hint: 'Every side, plus close-ups of buttons, parts and labels. JPG, PNG or WebP.', accept: 'image/jpeg,image/png,image/webp', multiple: true },
  { kind: 'manual', label: 'Manual or instructions', hint: 'PDF.', accept: 'application/pdf', multiple: true },
  { kind: 'logo', label: 'Logo', hint: 'PNG, JPG, WebP or PDF.', accept: 'image/png,image/jpeg,image/webp,application/pdf', multiple: false },
] as const

const ERRORS: Record<string, string> = {
  too_big: 'is over 4 MB. Please send it as a link in the form, or make it smaller.',
  wrong_type: 'is not a JPG, PNG, WebP or PDF file.',
  too_many: 'did not upload: this order has the most files we take (40). Send the rest as a link.',
  wait: 'did not upload: too many uploads. Please wait and try again.',
}

/** One file per request, so each one stays small and the page talks only to radlor.com. */
export function Uploader({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [log, setLog] = useState<string[]>([])
  const [busy, setBusy] = useState(false)

  async function upload(kind: string, files: FileList | null) {
    if (!files?.length) return
    setBusy(true)
    const lines: string[] = []
    for (const file of Array.from(files)) {
      if (file.size > MAX) { lines.push(`${file.name} ${ERRORS.too_big}`); continue }
      const fd = new FormData()
      fd.set('order_id', orderId)
      fd.set('kind', kind)
      fd.set('file', file)
      const res = await fetch('/api/3dlor/files', { method: 'POST', body: fd }).catch(() => null)
      const body = await res?.json().catch(() => null)
      lines.push(res?.ok ? `${file.name}: uploaded.` : `${file.name} ${ERRORS[body?.code] ?? 'did not upload. Please try again.'}`)
      setLog([...lines])
    }
    setLog(lines)
    setBusy(false)
    router.refresh()
  }

  return (
    <div className="grid gap-4">
      {ROWS.map(r => (
        <label key={r.kind} className="block rounded-lg border border-line p-4">
          <span className="font-medium">{r.label}</span>
          <span className="block text-sm text-muted">{r.hint} Max 4 MB a file.</span>
          <input type="file" accept={r.accept} multiple={r.multiple} disabled={busy}
            onChange={e => { upload(r.kind, e.currentTarget.files); e.currentTarget.value = '' }}
            className="mt-3 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-on-accent" />
        </label>
      ))}
      {busy && <p className="text-sm text-muted">Uploading…</p>}
      {log.length > 0 && <ul aria-live="polite" className="text-sm text-muted list-disc pl-5">{log.map((l, i) => <li key={i}>{l}</li>)}</ul>}
    </div>
  )
}
