// A static print-like texture keeps the reference's atmosphere without adding
// pointer listeners, animated noise, filters, or full-screen compositing work.
export default function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="technical-surface pointer-events-none absolute inset-0 z-[var(--z-behind)] overflow-hidden bg-ink"
    >
      <div className="absolute inset-x-0 top-[22%] h-px bg-paper/[0.025]" />
      <div className="absolute inset-x-0 bottom-[18%] h-px bg-paper/[0.025]" />
    </div>
  )
}
