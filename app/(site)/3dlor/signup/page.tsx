import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SUPPORT_EMAIL, V3D_NAME } from '@/site'
import { SignIn, Notice } from '@/components/v3d/SignIn'
import { PendingButton } from '@/components/v3d/PendingButton'
import { PLANS, PLAN_KEYS, FREE_MONTHS, depositCents, usd } from '@/app/api/3dlor/_lib/plans'
import { FIELDS } from '@/app/api/3dlor/_lib/validate'
import { configured, dbJson, pendingFrom, sessionFrom } from '@/app/api/3dlor/_lib/server'

export const metadata: Metadata = {
  title: 'Start your 3D video library',
  description: 'Sign up for a 3D how-to and support video library: tell us about your product, send photos and pick a package.',
  alternates: { canonical: '/3dlor/signup' },
  robots: { index: false, follow: false },
}

const input = 'mt-2 w-full rounded-lg border border-line bg-surface px-4 py-3 text-foreground'
const label = 'block text-sm text-muted'

function Field({ name, title, hint, area, type = 'text', bad }: {
  name: keyof typeof FIELDS; title: string; hint?: string; area?: boolean; type?: string; bad?: boolean
}) {
  const f = FIELDS[name]
  const common = { name, required: f.required, maxLength: f.max, 'aria-invalid': bad || undefined,
    className: `${input} ${bad ? 'border-accent' : ''}` }
  return (
    <label className={label}>
      <span className="text-foreground">{title}{f.required ? '' : ' (optional)'}</span>
      {hint && <span className="block">{hint}</span>}
      {area ? <textarea rows={6} {...common} /> : <input type={type} {...common} />}
    </label>
  )
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

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm uppercase tracking-[0.18em] text-accent font-medium">{V3D_NAME}</p>
      <h1 className="font-display text-4xl sm:text-5xl leading-tight mt-3">Start your 3D video library</h1>
      <p className="mt-5 text-lg text-muted leading-relaxed">
        Tell us about your product and send your photos. Our own 3D system turns them into how-to, setup and
        support videos. You approve every script before we make a video.
      </p>

      {!ok ? (
        <p className="mt-8 rounded-lg border border-line px-4 py-3">
          Sign-up is not open yet. Write to <a className="rl-link text-accent" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> and
          we will set you up.
        </p>
      ) : !session ? (
        <>
          <h2 className="mt-12 text-2xl font-display">1. Sign in with your email</h2>
          <p className="mt-2 text-muted">We email you a code. No password. You use the same email later to see your order.</p>
          <SignIn next="/3dlor/signup" pendingEmail={pendingFrom(h.get('cookie'))?.email} e={e} />
        </>
      ) : (
        <form method="post" action="/api/3dlor/order" className="mt-10 grid gap-6">
          <Notice e={e} />
          <p className="text-sm text-muted">Signed in as {session.email}.</p>

          <fieldset className="grid gap-4">
            <legend className="text-2xl font-display mb-2">2. Pick a package</legend>
            {PLAN_KEYS.map((k, i) => {
              const p = PLANS[k]
              return (
                <label key={k} className="flex gap-4 rounded-xl border border-line p-5 has-[:checked]:border-accent">
                  <input type="radio" name="plan" value={k} required defaultChecked={i === 1} className="mt-1 accent-[var(--accent)]" />
                  <span>
                    <span className="block font-medium text-lg">{p.name}: {usd(p.buildCents)} library build</span>
                    <span className="block text-muted text-sm mt-1">
                      {p.products}, {p.videos} videos, {p.languages === 1 ? 'English' : `${p.languages} languages`}. Voice-over,
                      captions and all formats (9:16, 16:9, 1:1). 2 change rounds a video.
                    </span>
                    <span className="block text-sm mt-2">
                      Today: {usd(depositCents(k))} (half the build). The other half at delivery.
                      Care plan: free for {FREE_MONTHS} months, then {usd(p.careCents)} a month ({p.careVideos}). Cancel any time.
                    </span>
                  </span>
                </label>
              )
            })}
            <p className="text-sm text-muted">
              More products, CAD import or staff training? <a className="rl-link text-accent" href={`mailto:${SUPPORT_EMAIL}?subject=3Dlor%20Enterprise`}>Contact us</a> for an Enterprise plan.
              Fixed prices. No interest and no late fees.
            </p>
          </fieldset>

          <fieldset className="grid gap-4">
            <legend className="text-2xl font-display mb-2">3. About you</legend>
            <Field name="company" title="Company or brand" bad={bad === 'company'} />
            <Field name="contact_name" title="Your name" bad={bad === 'contact_name'} />
            <Field name="phone" title="Phone" type="tel" bad={bad === 'phone'} />
            <Field name="website" title="Website" type="url" hint="Starts with https://" bad={bad === 'website'} />
          </fieldset>

          <fieldset className="grid gap-4">
            <legend className="text-2xl font-display mb-2">4. About the product</legend>
            <Field name="product_name" title="Product name and model" hint="For Growth and Pro, list each product." bad={bad === 'product_name'} />
            <Field name="product_url" title="Product page link" type="url" hint="Your store, Amazon or another shop." bad={bad === 'product_url'} />
            <Field name="languages" title="Languages" hint="For example: English, Spanish. Your package sets how many." bad={bad === 'languages'} />
            <Field name="files_link" title="Link to large files" type="url"
              hint="CAD files, or photos and PDFs over 4 MB: a Google Drive, Dropbox or WeTransfer link." bad={bad === 'files_link'} />
            <p className="text-sm text-muted">
              You do not need to list the videos. In the next step you upload your manual. We read it and send you the
              list of videos we will make. Your package sets how many; if your manual has more topics, you can move to a
              bigger package.
            </p>
          </fieldset>

          <label className={`flex gap-3 text-sm ${bad === 'terms' ? 'text-accent' : 'text-muted'}`}>
            <input type="checkbox" name="terms" value="yes" required className="mt-1" />
            <span>I have the right to share these files with Radlor.</span>
          </label>

          <div>
            <PendingButton className="rl-cta rounded-full bg-accent px-6 py-3 text-on-accent font-medium hover:opacity-90" pending="Saving…">Save and continue</PendingButton>
            <p className="mt-3 text-sm text-muted">Next you upload your photos and files, then pay the first half of the build.</p>
          </div>
        </form>
      )}
    </section>
  )
}
