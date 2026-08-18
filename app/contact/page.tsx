import type { Metadata } from 'next'
import { APP_NAME, COMPANY, SUPPORT_EMAIL } from '@/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${COMPANY} — support, early access to ${APP_NAME}, schools, and press.`,
  alternates: { canonical: '/contact' },
}

const REASONS = [
  { h: 'Early access', p: `Ask for an ${APP_NAME} account for your child. Tell us their age and we will set the placement check up for the right band.` },
  { h: 'Schools', p: 'We can create a class, add children to it and choose which chapters they see. Say roughly how many children and what year group.' },
  { h: 'Support', p: 'Something broken, a question about your account, or a request to delete your data. We answer every one of these ourselves.' },
  { h: 'Press and partnerships', p: 'Happy to talk about what we are building and what we have learned doing it.' },
]

export default function Contact() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-20">
      <h1 className="font-display text-5xl">Contact</h1>
      <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">
        One address, read by the people who build the thing.
      </p>
      <a
        href={`mailto:${SUPPORT_EMAIL}`}
        className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-white font-medium hover:opacity-90 transition-opacity"
      >
        {SUPPORT_EMAIL}
      </a>

      <div className="mt-16 grid gap-10 sm:grid-cols-2 border-t border-line pt-10">
        {REASONS.map(r => (
          <div key={r.h}>
            <h2 className="font-medium text-lg">{r.h}</h2>
            <p className="mt-2 text-muted leading-relaxed">{r.p}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
