export default function ExternalLink({ href, children, className = '', rel = '', ...props }) {
  const safeRel = [...new Set(`${rel} noopener noreferrer`.trim().split(/\s+/))].join(' ')
  return (
    <a {...props} href={href} target="_blank" rel={safeRel} className={`inline-flex min-h-11 items-center gap-1 hover:text-paper ${className}`}>
      {children}
      <span aria-hidden="true">↗</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
