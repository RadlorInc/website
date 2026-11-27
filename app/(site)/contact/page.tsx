import type { Metadata } from 'next'
import Link from 'next/link'
import { Pile } from '@/components/scroll/Pile'
import type { PathRow } from '@/components/scroll/Scroll'
import { PageHero } from '@/components/scroll/PageHero'
import { ART } from '@/components/scroll/art'
import { COMPANY, SUPPORT_EMAIL, SUPPORT_PHONE, SUPPORT_TEL, V3D_CTA, V3D_NAME, V3D_SIGNUP_PATH } from '@/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${COMPANY}: ${V3D_NAME} for your product, support, partnerships and press.`,
  alternates: { canonical: '/contact' },
}

// One picture and one line per reason to write, on paper sheets that pile up (2026-11-24).
const ROWS: PathRow[] = [
  {
    ...ART.fanOpen, title: `Start with ${V3D_NAME}`,
    body: <>Tell us about one product. <Link href={V3D_SIGNUP_PATH} className="rl-link text-accent">{V3D_CTA} →</Link></>,
  },
  { ...ART.contactSupport, title: 'Support', body: 'Something broken, a question about your account, or a request to delete your data. We answer each one ourselves.' },
  { ...ART.contactPress, title: 'Press and partnerships', body: 'Happy to talk about what we are building.' },
]

export default function Contact() {
  return (
    <section className="relative isolate overflow-x-clip">
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-20">
        <PageHero title="Contact" line="One address, read by the people who build the thing." pic={ART.contactPhoto}>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="rl-cta mt-8 inline-block rounded-full bg-accent px-6 py-3 text-on-accent font-medium hover:opacity-90"
          >
            {SUPPORT_EMAIL}
          </a>
          <p className="mt-4">
            or call{' '}
            <a href={`tel:${SUPPORT_TEL}`} className="rl-link text-accent">
              {SUPPORT_PHONE}
            </a>
          </p>
        </PageHero>
        <Pile rows={ROWS} />
      </div>
    </section>
  )
}
