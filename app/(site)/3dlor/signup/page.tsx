import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SUPPORT_EMAIL, V3D_ACCOUNT_PATH, V3D_SIGNIN_PATH } from '@/site'
import { SignIn, Notice } from '@/components/v3d/SignIn'
import Link from 'next/link'
import { OrderForm, type Saved } from '@/components/v3d/OrderForm'
import { languagesSaved, productsIn } from '@/app/api/3dlor/_lib/validate'
import { StepPage } from '@/components/v3d/Steps'
import { configured, dbJson, pendingFrom, sessionFrom, signupGo } from '@/app/api/3dlor/_lib/server'

export const metadata: Metadata = {
  title: 'Start your 3D video library',
  description: 'Sign up for a 3D how-to and support video library: tell us about your product, pick how many videos you need and send your manual.',
  alternates: { canonical: '/3dlor/signup' },
  robots: { index: false, follow: false },
}

export default async function Signup({ searchParams }: PageProps<'/3dlor/signup'>) {
  const sp = await searchParams
  const e = typeof sp.e === 'string' ? sp.e : undefined
  const bad = typeof sp.f === 'string' ? sp.f : undefined
  const h = await headers()
  const ok = configured()
  const session = ok ? sessionFrom(h.get('cookie')) : null

  // One open order per customer, and a returning customer's home is the account page (founder, 2026-11-27).
  // `?edit=1` (the account page's "← Back") opens the form on the open order, filled in; `&at=you` starts on step 3.
  // `?new=1` (the account page's "Start a new order") opens an empty form when no order is open. `signupGo` decides.
  let saved: Saved | undefined
  if (session) {
    const open = await dbJson<{ id: string; videos_ordered: number; languages: string | null; notes: string | null; company: string; contact_name: string }[]>(
      `v3d_orders?select=id,videos_ordered,languages,notes,company,contact_name&user_id=eq.${session.uid}&payment_status=eq.unpaid&limit=1`).catch(() => [])
    const any = open.length > 0 || (await dbJson<{ id: string }[]>(`v3d_orders?select=id&user_id=eq.${session.uid}&limit=1`).catch(() => [])).length > 0
    if (signupGo({ open: open.length > 0, any, edit: sp.edit === '1', fresh: sp.new === '1' }) === 'account') redirect(V3D_ACCOUNT_PATH)
    if (open.length) {
      const o = open[0]
      saved = { id: o.id, videos: o.videos_ordered, products: productsIn(o.notes), langs: languagesSaved(o.languages, o.notes), company: o.company, contact_name: o.contact_name }
    }
  }

  if (!ok) {
    return (
      <StepPage step={1} title="Start your library">
        <div className="su-sheet">
          <p>Sign-up is not open yet. Write to <a className="rl-link text-accent" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
        </div>
      </StepPage>
    )
  }
  if (!session) {
    return (
      <StepPage step={1} title="Start your library">
        <div className="su-sheet">
          <SignIn next="/3dlor/signup" pendingEmail={pendingFrom(h.get('cookie'))?.email} e={e} />
          <p className="su-foot">Already a customer? <Link href={V3D_SIGNIN_PATH}>Sign in</Link> with the same email and you go to your orders.</p>
        </div>
      </StepPage>
    )
  }

  return (
    <OrderForm key={bad ?? ''} bad={bad} notice={<Notice e={e} />} saved={saved} start={saved && sp.at === 'you' ? 1 : 0}
      closing={<p className="su-foot">{session.email} · <Link href={V3D_ACCOUNT_PATH}>{saved ? 'Keep my order as it is' : 'My orders'}</Link> · <a href={`mailto:${SUPPORT_EMAIL}?subject=3Dlor%20Enterprise`}>Need more? Write to us</a></p>} />
  )
}
