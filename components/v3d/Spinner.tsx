/** A small turning ring that shows "working". It stays still for people who turn motion off. */
export function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block size-4 shrink-0 rounded-full border-2 border-current border-r-transparent align-[-0.15em] motion-safe:animate-spin ${className}`}
    />
  )
}
