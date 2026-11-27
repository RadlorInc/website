import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SUPPORT_EMAIL, V3D_ACCOUNT_PATH, V3D_NAME, V3D_SIGNIN_PATH, V3D_SIGNUP_PATH } from '@/site'
import { SignIn } from '@/components/v3d/SignIn'
import { configured, pendingFrom, sessionFrom } from '@/app/api/3dlor/_lib/server'

export const metadata: Metadata = {
  title: `Sign in to ${V3D_NAME}`,
  description: `Sign in to your ${V3D_NAME} account with a one-time code by email, then see your orders and start a new one.`,
  alternates: { canonical: V3D_SIGNIN_PATH },
}

/**
 * Sign-in for returning customers (founder, 2026-11-27). The same email code and session cookie as sign-up
 * (`/api/3dlor/auth/*`), with `next` = this page, so a wrong code comes back here; signed in, this page sends the
 * customer to the account page.
 */
export default async function SignInPage({ searchParams }: PageProps<'/3dlor/signin'>) {
  const sp = await searchParams
  const e = typeof sp.e === 'string' ? sp.e : undefined
  const h = await headers()
  const ok = configured()
  if (ok && sessionFrom(h.get('cookie'))) redirect(V3D_ACCOUNT_PATH)

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl sm:text-5xl leading-tight">Sign in to {V3D_NAME}</h1>
      {!ok ? (
        <p className="mt-8">Accounts are not open yet. Write to <a className="rl-link text-accent" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
      ) : (
        <>
          <p className="mt-5 text-lg text-muted">Use the email of your order. We send you a code; you go to your orders.</p>
          <div className="mt-6"><SignIn next={V3D_SIGNIN_PATH} pendingEmail={pendingFrom(h.get('cookie'))?.email} e={e} /></div>
          <p className="mt-8 text-sm text-muted">New to {V3D_NAME}? <Link className="rl-link text-accent" href={V3D_SIGNUP_PATH}>Start your library</Link></p>
        </>
      )}
    </section>
  )
}
