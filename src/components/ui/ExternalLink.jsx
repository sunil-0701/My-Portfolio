export default function ExternalLink({ href, children, className = '', rel = '', ...props }) {
  const safeRel = [...new Set(`${rel} noopener noreferrer`.trim().split(/\s+/))].join(' ')
  return (
    <a {...props} href={href} target="_blank" rel={safeRel} className={`group inline-flex min-h-11 items-center gap-1 transition-colors duration-150 hover:text-paper ${className}`}>
      {children}
      <span aria-hidden="true" className="shrink-0 transition-transform duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5 motion-safe:group-focus-visible:-translate-y-0.5 motion-safe:group-focus-visible:translate-x-0.5">↗</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
