import type { Metadata } from 'next'
import { PathRows, type PathRow } from '@/components/scroll/Scroll'
import { PageHero } from '@/components/scroll/PageHero'
import { ART } from '@/components/scroll/art'
import { APP_NAME, APP_URL, COMPANY, SUPPORT_EMAIL } from '@/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${COMPANY} — support, early access to ${APP_NAME}, schools, and press.`,
  alternates: { canonical: '/contact' },
}

// One picture and one line per reason to write, joined by a drawn path (G) under a circle-reveal top (F) (2026-09-29).
const ROWS: PathRow[] = [
  {
    ...ART.aboutWhere, title: 'Try it',
    body: <>Make a parent account and add your child. <a href={`${APP_URL}/auth`} className="rl-link text-accent">Try {APP_NAME} →</a></>,
  },
  { ...ART.schoolsHero, title: 'Schools', body: 'Classroom accounts are paused while we build school consent. Write and we will tell you when they open.' },
  { ...ART.contactSupport, title: 'Support', body: 'Something broken, a question about your account, or a request to delete your data. We answer each one ourselves.' },
  { ...ART.contactPress, title: 'Press and partnerships', body: 'Happy to talk about what we are building and what we have learned.' },
]

export default function Contact() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-20">
        <PageHero title="Contact" line="One address, read by the people who build the thing." pic={ART.contactHero}>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="rl-cta mt-8 inline-block rounded-full bg-accent px-6 py-3 text-on-accent font-medium hover:opacity-90"
          >
            {SUPPORT_EMAIL}
          </a>
        </PageHero>
        <PathRows rows={ROWS} />
      </div>
    </section>
  )
}
