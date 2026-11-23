import { Spinner } from './Spinner'

/** The screen between a click and a 3Dlor page that needs the server (sign-up, account). */
export function PageLoading({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16" aria-busy="true">
      <p className="font-display text-4xl sm:text-5xl leading-tight">{title}</p>
      <p role="status" className="mt-8 flex items-center gap-3 text-muted"><Spinner className="size-5" />Loading, one moment…</p>
    </section>
  )
}
