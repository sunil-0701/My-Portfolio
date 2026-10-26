export default function ContentSection({ id, number, title, intro, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="content-section border-t border-paper/15 bg-ink text-paper">
      <div className="section-inner mx-auto max-w-[1800px]">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-muted"><span aria-hidden="true">{number} // </span>{id}</p>
        <h2 id={`${id}-heading`} tabIndex={-1} className="section-heading font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-tight">{title}</h2>
        {intro && <p className="mt-6 max-w-[65ch] text-sm leading-8 text-muted">{intro}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  )
}
