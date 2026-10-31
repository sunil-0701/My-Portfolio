export default function ContentSection({ id, number, title, intro, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="content-section border-t border-paper/15 bg-ink text-paper">
      <div className="section-inner mx-auto max-w-[1800px]">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-muted"><span aria-hidden="true">{number} // </span>{id}</p>
        <div className="flex items-start gap-3">
          <h2 id={`${id}-heading`} tabIndex={-1} className="section-heading min-w-0 font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-tight">{title}</h2>
          <a href={`#${id}`} aria-label={`Link to ${id} section`} className="section-permalink inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center font-mono text-sm text-faint hover:text-paper">#</a>
        </div>
        {intro && <p className="mt-6 max-w-[65ch] text-sm leading-8 text-muted">{intro}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  )
}
