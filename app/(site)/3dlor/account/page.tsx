import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { SUPPORT_EMAIL, V3D_NAME } from '@/site'
import { SignIn, Notice } from '@/components/v3d/SignIn'
import { StripeButton } from '@/components/v3d/StripeButton'
import { Uploader } from '@/components/v3d/Uploader'
import { PendingButton } from '@/components/v3d/PendingButton'
import { PaymentWait } from '@/components/v3d/PaymentWait'
import { PLANS, isPlan, depositCents, balanceCents, FREE_MONTHS, usd } from '@/app/api/3dlor/_lib/plans'
import { configured, dbJson, pendingFrom, sessionFrom } from '@/app/api/3dlor/_lib/server'

export const metadata: Metadata = {
  title: `Your ${V3D_NAME} order`,
  description: 'The status of your 3D video library order with 3Dlor: payment, videos in work and delivered, and what we still need from you.',
  alternates: { canonical: '/3dlor/account' },
  robots: { index: false, follow: false },
}

type Order = {
  id: string; created_at: string; company: string; product_name: string; plan: string
  payment_status: 'unpaid' | 'paid' | 'refunded'; amount_paid_cents: number | null; build_price_cents: number | null
  balance_paid: boolean; stripe_customer_id: string | null; care_status: string | null; care_starts_at: string | null
  videos_ordered: number; videos_in_work: number; videos_delivered: number
  waiting_on_customer: string | null; status_note: string | null
}
type FileRow = { id: string; order_id: string; kind: string; name: string; size_bytes: number; created_at: string }

const date = (iso: string) => new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
const CARE: Record<string, string> = {
  trialing: 'free months', active: 'active, month to month', past_due: 'card payment failed, please update your card',
  canceled: 'canceled', unpaid: 'card payment failed, please update your card', paused: 'paused',
}

/** One plain sentence: what the customer does now, so nobody has to guess. */
function nextStep(payment: Order['payment_status'], hasManual: boolean): string {
  if (payment === 'refunded') return 'nothing. This order was refunded.'
  if (payment === 'unpaid') {
    return hasManual
      ? 'pay the first half below to start. You can add more files at any time.'
      : 'upload your manual, photos and logo at the bottom of this page, then pay the first half to start.'
  }
  return hasManual
    ? 'nothing for you right now. We read your manual and email you the list of videos we will make. You approve each script before we make a video.'
    : 'upload your manual at the bottom of this page. We read it and email you the list of videos we will make.'
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-xl border border-line p-4">
      <p className="text-3xl font-display">{n}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  )
}

export default async function Account({ searchParams }: PageProps<'/3dlor/account'>) {
  const sp = await searchParams
  const e = typeof sp.e === 'string' ? sp.e : undefined
  const h = await headers()
  const ok = configured()
  const session = ok ? sessionFrom(h.get('cookie')) : null

  if (!ok || !session) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl sm:text-5xl leading-tight">Your {V3D_NAME} order</h1>
        {!ok ? (
          <p className="mt-8">Accounts are not open yet. Write to <a className="rl-link text-accent" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
        ) : (
          <>
            <p className="mt-5 text-lg text-muted">Sign in with the email you used for your order.</p>
            <SignIn next="/3dlor/account" pendingEmail={pendingFrom(h.get('cookie'))?.email} e={e} />
          </>
        )}
      </section>
    )
  }

  const [orders, files] = await Promise.all([
    dbJson<Order[]>(`v3d_orders?select=*&user_id=eq.${session.uid}&order=created_at.desc`),
    dbJson<FileRow[]>(`v3d_files?select=id,order_id,kind,name,size_bytes,created_at&user_id=eq.${session.uid}&order=created_at`),
  ])

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl sm:text-5xl leading-tight">Your {V3D_NAME} order</h1>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
        <span>Signed in as {session.email}</span>
        <form method="post" action="/api/3dlor/auth/signout"><PendingButton className="rl-link text-accent" pending="Signing out…">Sign out</PendingButton></form>
      </div>
      <Notice e={e} />
      {sp.paid === '1' && <PaymentWait waiting={orders.some(o => o.payment_status === 'unpaid')} />}

      {orders.length === 0 && (
        <p className="mt-10">You have no order yet. <Link className="rl-link text-accent" href="/3dlor/signup">Start your library →</Link></p>
      )}

      {orders.map(o => {
        if (!isPlan(o.plan)) return null
        const p = PLANS[o.plan]
        const mine = files.filter(f => f.order_id === o.id)
        const waiting = (o.waiting_on_customer ?? '').split('\n').map(s => s.trim()).filter(Boolean)
        const open = Math.max(0, o.videos_ordered - o.videos_in_work - o.videos_delivered)
        return (
          <article key={o.id} className="mt-12 rounded-2xl border border-line p-6">
            <h2 className="text-2xl font-display">{o.product_name}</h2>
            <p className="text-muted text-sm mt-1">{o.company} · {p.name} package · ordered {date(o.created_at)}</p>

            <p className="mt-6 rounded-lg border border-accent/50 bg-accent-soft px-4 py-3">
              <strong>Next step: </strong>
              {nextStep(o.payment_status, mine.some(f => f.kind === 'manual'))}
            </p>

            <h3 className="mt-8 font-medium">Payment</h3>
            {o.payment_status === 'unpaid' ? (
              <div className="mt-3">
                <p className="text-muted">
                  To start, pay the first half of the build: <strong className="text-foreground">{usd(depositCents(o.plan))}</strong>.
                  The other half ({usd(balanceCents(o.plan))}) is due at delivery. The care plan is free for {FREE_MONTHS} months,
                  then {usd(p.careCents)} a month. Fixed prices, no interest and no late fees.
                </p>
                <div className="mt-4"><StripeButton orderId={o.id} kind="checkout" label={`Pay ${usd(depositCents(o.plan))} with Stripe`} /></div>
              </div>
            ) : o.payment_status === 'refunded' ? (
              <p className="mt-3 text-muted">Refunded.</p>
            ) : (
              <ul className="mt-3 text-muted list-disc pl-5 space-y-1">
                <li>First half of the build: paid{o.amount_paid_cents != null ? ` (${usd(o.amount_paid_cents)})` : ''}.</li>
                <li>Second half: {o.balance_paid ? 'paid' : `${usd((o.build_price_cents ?? p.buildCents) - depositCents(o.plan))}, due at delivery`}.</li>
                <li>Care plan: {o.care_status === 'trialing' && o.care_starts_at
                  ? `free until ${date(o.care_starts_at)}, then ${usd(p.careCents)} a month. Cancel any time`
                  : CARE[o.care_status ?? ''] ?? o.care_status ?? 'starting'}.</li>
              </ul>
            )}
            {o.stripe_customer_id && (
              <div className="mt-4"><StripeButton orderId={o.id} kind="portal" label="Invoices, card and care plan" /></div>
            )}

            <h3 className="mt-8 font-medium">Videos</h3>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Stat n={o.videos_ordered} label="in your package" />
              <Stat n={open} label="not started" />
              <Stat n={o.videos_in_work} label="in work" />
              <Stat n={o.videos_delivered} label="delivered" />
            </div>
            {o.status_note && <p className="mt-4 whitespace-pre-line">{o.status_note}</p>}

            <h3 className="mt-8 font-medium">What we still need from you</h3>
            {waiting.length ? (
              <ul className="mt-3 list-disc pl-5 space-y-1">{waiting.map((w, i) => <li key={i}>{w}</li>)}</ul>
            ) : (
              <p className="mt-3 text-muted">Nothing right now. Thank you.</p>
            )}

            <h3 className="mt-8 font-medium">Your files</h3>
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
            <div className="mt-4"><Uploader orderId={o.id} /></div>
          </article>
        )
      })}
      <p className="mt-10 text-sm text-muted">Questions? Write to <a className="rl-link text-accent" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
    </section>
  )
}
