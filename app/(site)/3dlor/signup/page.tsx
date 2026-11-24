import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SUPPORT_EMAIL } from '@/site'
import { SignIn, Notice } from '@/components/v3d/SignIn'
import { OrderForm } from '@/components/v3d/OrderForm'
import { StepPage } from '@/components/v3d/Steps'
import { configured, dbJson, pendingFrom, sessionFrom } from '@/app/api/3dlor/_lib/server'

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

  if (session) {
    const open = await dbJson<{ id: string }[]>(
      `v3d_orders?select=id&user_id=eq.${session.uid}&payment_status=eq.unpaid&limit=1`).catch(() => [])
    if (open.length) redirect('/3dlor/account')
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
        <div className="su-sheet"><SignIn next="/3dlor/signup" pendingEmail={pendingFrom(h.get('cookie'))?.email} e={e} /></div>
      </StepPage>
    )
  }

  return (
    <OrderForm key={bad ?? ''} bad={bad} notice={<Notice e={e} />}
      closing={<p className="su-foot">{session.email} · <a href={`mailto:${SUPPORT_EMAIL}?subject=3Dlor%20Enterprise`}>Need more? Write to us</a></p>} />
  )
}
