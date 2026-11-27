import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SUPPORT_EMAIL, V3D_NAME, V3D_SIGNIN_PATH, V3D_SIGNUP_PATH } from '@/site'
import { Notice } from '@/components/v3d/SignIn'
import { Timeline } from '@/components/v3d/Timeline'
import { VideoCards } from '@/components/v3d/VideoCards'
import { DETAILS, type Detail } from '@/app/api/3dlor/_lib/validate'
import { timeline, type Video } from '@/app/api/3dlor/_lib/track'
import { Progress } from '@/components/v3d/Steps'
import { StripeButton } from '@/components/v3d/StripeButton'
import { Uploader } from '@/components/v3d/Uploader'
import { PendingButton } from '@/components/v3d/PendingButton'
import { PaymentWait } from '@/components/v3d/PaymentWait'
import { CARE as CARE_PLANS, isPlan, depositCents, balanceCents, FREE_MONTHS, usd } from '@/app/api/3dlor/_lib/plans'
import { configured, dbJson, sessionFrom } from '@/app/api/3dlor/_lib/server'

export const metadata: Metadata = {
  title: `Your ${V3D_NAME} account`,
  description: 'The status of your 3D video library order with 3Dlor: payment, videos in work and delivered, and what we still need from you.',
  alternates: { canonical: '/3dlor/account' },
  robots: { index: false, follow: false },
}

type Order = {
  id: string; created_at: string; paid_at: string | null; company: string; product_name: string; plan: string
  payment_status: 'unpaid' | 'paid' | 'refunded'; amount_paid_cents: number | null; build_price_cents: number | null
  balance_paid: boolean; stripe_customer_id: string | null; care_status: string | null; care_starts_at: string | null
  videos_ordered: number; videos_in_work: number; videos_delivered: number
  terms_accepted_at: string | null; product_url: string | null; files_link: string | null; website: string | null; phone: string | null
  waiting_on_customer: string | null; status_note: string | null
}
type FileRow = { id: string; order_id: string; kind: string; name: string; size_bytes: number; created_at: string }

const date = (iso: string) => new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
const CARE: Record<string, string> = {
  trialing: 'free months', active: 'active, month to month', past_due: 'card payment failed, please update your card',
  canceled: 'canceled', unpaid: 'card payment failed, please update your card', paused: 'paused',
}

const NEW_PRODUCT = 'Your product' // what the order route writes until the customer names it
const EXTRAS: { name: Detail; title: string; hint?: string; type: 'text' | 'url' | 'tel' }[] = [
  { name: 'product_name', title: 'Product and model', type: 'text' },
  { name: 'product_url', title: 'Product page', hint: 'your store or Amazon', type: 'url' },
  { name: 'files_link', title: 'CAD file link', hint: 'STEP, IGES, STL or SolidWorks, or photos over 4 MB, on Google Drive or Dropbox', type: 'url' },
  { name: 'website', title: 'Website', type: 'url' },
  { name: 'phone', title: 'Phone', type: 'tel' },
]

export default async function Account({ searchParams }: PageProps<'/3dlor/account'>) {
  const sp = await searchParams
  const e = typeof sp.e === 'string' ? sp.e : undefined
  const bad = typeof sp.f === 'string' && Object.hasOwn(DETAILS, sp.f) ? sp.f : undefined
  const h = await headers()
  const ok = configured()
  const session = ok ? sessionFrom(h.get('cookie')) : null

  if (!ok) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl sm:text-5xl leading-tight">Your {V3D_NAME} account</h1>
        <p className="mt-8">Accounts are not open yet. Write to <a className="rl-link text-accent" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
      </section>
    )
  }
  // Signed out: the one sign-in page (founder, 2026-11-27). It comes back here after the code.
  if (!session) redirect(e ? `${V3D_SIGNIN_PATH}?e=${encodeURIComponent(e)}` : V3D_SIGNIN_PATH)

  const [orders, files, videos] = await Promise.all([
    dbJson<Order[]>(`v3d_orders?select=*&user_id=eq.${session.uid}&order=created_at.desc`),
    dbJson<FileRow[]>(`v3d_files?select=id,order_id,kind,name,size_bytes,created_at&user_id=eq.${session.uid}&order=created_at`),
    // The table comes with a hand-run migration: until then there are no videos to show.
    dbJson<Video[]>(`v3d_videos?select=id,order_id,position,title,status,script,video_path,final_path,rounds_used,customer_note,updated_at&user_id=eq.${session.uid}&order=position`).catch(() => [] as Video[]),
  ])

  // The database allows ONE unpaid order per customer (v3d_orders_one_unpaid_per_user). So "Start a new order" opens
  // that order when there is one, and says so, instead of a form that could only fail.
  const open = orders.find(o => o.payment_status === 'unpaid')
  const nameOf = (o: Order) => o.product_name === NEW_PRODUCT ? `Order of ${date(o.created_at)}` : o.product_name

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-4xl sm:text-5xl leading-tight">Your {V3D_NAME} account</h1>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
        <span className="break-all">Signed in as {session.email}</span>
        <form method="post" action="/api/3dlor/auth/signout"><PendingButton className="rl-link text-accent" pending="Signing out…">Sign out</PendingButton></form>
      </div>
      <Notice e={e} />
      {sp.saved === '1' && <p role="status" className="mt-6"><strong>Saved. Thank you.</strong></p>}
      {sp.paid === '1' && <PaymentWait waiting={orders.some(o => o.payment_status === 'unpaid')} />}

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
        <h2 className="text-2xl font-display">Your orders</h2>
        <Link href={open ? `${V3D_SIGNUP_PATH}?edit=1` : `${V3D_SIGNUP_PATH}?new=1`}
          className="rl-cta inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-on-accent hover:opacity-90">
          {open ? 'Finish your open order' : 'Start a new order'}
        </Link>
      </div>
      {open && <p className="mt-3 text-sm text-muted">You can have one unpaid order at a time. Pay or change it first, then start the next one.</p>}
      {orders.length === 0 ? (
        <p className="mt-6">You have no order yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {orders.map(o => (
            <li key={o.id}>
              <a href={`#order-${o.id}`} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3 hover:text-accent">
                <span className="font-medium">{nameOf(o)}</span>
                <span className="text-sm text-muted">{o.company} · {o.videos_ordered} videos · {
                  o.payment_status === 'unpaid' ? 'not paid yet' : o.payment_status === 'refunded' ? 'refunded'
                  : o.videos_delivered > 0 ? `${o.videos_delivered} of ${o.videos_ordered} delivered` : 'paid, in work'}</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {orders.map(o => {
        if (!isPlan(o.plan)) return null
        const build = o.build_price_cents ?? 0
        const careCents = CARE_PLANS[o.plan].cents
        const mine = files.filter(f => f.order_id === o.id)
        const waiting = (o.waiting_on_customer ?? '').split('\n').map(s => s.trim()).filter(Boolean)
        const vids = videos.filter(v => v.order_id === o.id)
        const filesBlock = (
          <>
            <h3 id={`files-${o.id}`} className="mt-8 scroll-mt-24 font-medium">Your files</h3>
            {mine.length > 0 ? (
              <ul className="mt-3 text-sm space-y-1">
                {mine.map(f => (
                  <li key={f.id}>
                    <a className="rl-link text-accent" href={`/api/3dlor/files/${f.id}`}>{f.name}</a>
                    <span className="text-muted"> · {f.kind} · {(f.size_bytes / 1024 / 1024).toFixed(1)} MB</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-muted text-sm">No files yet.</p>
            )}
            <div className="mt-4"><Uploader orderId={o.id} agreed={Boolean(o.terms_accepted_at)} /></div>
          </>
        )
        return (
          <article key={o.id} id={`order-${o.id}`} className="su-sheet scroll-mt-24">
            <h2 className="text-2xl font-display">{nameOf(o)}</h2>
            <p className="text-muted text-sm mt-1">{o.company} · {o.videos_ordered} videos · ordered {date(o.created_at)}</p>

            {/* Going back (founder, 2026-11-27): the finished steps in the bar are links, and "← Back" opens the
                order form again on this order. Step 1 (email) is "Sign out" at the top. */}
            {o.payment_status === 'unpaid' && <Progress step={mine.some(f => f.kind === 'manual') ? 5 : 4}
              go={{ 2: '/3dlor/signup?edit=1', 3: '/3dlor/signup?edit=1&at=you', 4: `#files-${o.id}` }} />}
            {o.payment_status === 'unpaid' && (
              <p className="mt-4"><Link className="su-back inline-flex items-center" href="/3dlor/signup?edit=1&at=you">← Back: change videos or details</Link></p>
            )}
            {o.payment_status === 'unpaid' && filesBlock}
            {o.payment_status === 'refunded' && <p className="mt-6">This order was refunded.</p>}
            {o.payment_status === 'paid' && (
              <>
                <Timeline stages={timeline(o, vids, mine.some(f => f.kind === 'manual'))} />
                {o.status_note && <p className="mt-6 whitespace-pre-line">{o.status_note}</p>}
                {waiting.length > 0 && vids.length === 0 && <p className="mt-6 text-sm text-muted">We still need: {waiting.join('. ')}.</p>}
                {vids.length > 0 && <><h3 className="mt-10 text-2xl font-semibold tracking-tight">Your videos</h3><VideoCards videos={vids} clean={o.balance_paid} /></>}
              </>
            )}

            <h3 className="mt-8 font-medium">Payment</h3>
            {o.payment_status === 'unpaid' ? (
              <div className="mt-3">
                <p className="text-muted">
                  <strong className="text-foreground">{usd(depositCents(build))}</strong> today, {usd(balanceCents(build))} at delivery.
                  Care plan: free for {FREE_MONTHS} months, then {usd(careCents)} a month. No interest and no late fees.
                </p>
                <div className="mt-4"><StripeButton orderId={o.id} kind="checkout" label={`Pay ${usd(depositCents(build))} with Stripe`} /></div>
              </div>
            ) : o.payment_status === 'refunded' ? (
              <p className="mt-3 text-muted">Refunded.</p>
            ) : (
              <ul className="mt-3 text-muted list-disc pl-5 space-y-1">
                <li>First half of the build: paid{o.amount_paid_cents != null ? ` (${usd(o.amount_paid_cents)})` : ''}.</li>
                <li>Second half: {o.balance_paid ? 'paid' : `${usd(balanceCents(build))}, due at delivery`}.</li>
                <li>Care plan: {o.care_status === 'trialing' && o.care_starts_at
                  ? `free until ${date(o.care_starts_at)}, then ${usd(careCents)} a month. Cancel any time`
                  : CARE[o.care_status ?? ''] ?? o.care_status ?? 'starting'}.</li>
              </ul>
            )}
            {o.stripe_customer_id && (
              <div className="mt-4"><StripeButton orderId={o.id} kind="portal" label="Invoices, card and care plan" /></div>
            )}

            {o.payment_status !== 'unpaid' && filesBlock}
            {o.payment_status === 'paid' && (
              <details className="su-extra" open={bad !== undefined || undefined}>
                <summary>Make your videos even better</summary>
                <p>All optional. Each one helps us match your product more closely.</p>
                <form method="post" action="/api/3dlor/details" className="su-fields">
                  <input type="hidden" name="order_id" value={o.id} />
                  {EXTRAS.map(x => (
                    <label key={x.name} className="su-field">
                      <span>{x.title}{x.hint && <small> {x.hint}</small>}</span>
                      <input name={x.name} type={x.type} maxLength={DETAILS[x.name].max} placeholder={x.type === 'url' ? 'https://' : undefined}
                        defaultValue={x.name === 'product_name' ? (o.product_name === NEW_PRODUCT ? '' : o.product_name) : o[x.name] ?? ''} aria-invalid={bad === x.name || undefined} />
                    </label>
                  ))}
                  <PendingButton className="su-next" pending="Saving…">Save</PendingButton>
                </form>
              </details>
            )}
          </article>
        )
      })}
      <p className="mt-10 text-sm text-muted">Questions? Write to <a className="rl-link text-accent" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
    </section>
  )
}
