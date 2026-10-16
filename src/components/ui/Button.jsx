const VARIANTS = {
  // Solid — the one primary action on the page
  solid:
    'border border-paper bg-paper text-ink hover:bg-white hover:border-white hover:-translate-y-0.5 shadow-[0_18px_40px_-24px_rgba(143,179,163,0.55)] hover:shadow-[0_26px_54px_-24px_rgba(143,179,163,0.75)]',
  // Outline — secondary weight
  outline:
    'terminal-button border border-paper/50 bg-transparent text-paper hover:border-paper hover:bg-paper/[0.06] hover:-translate-y-0.5',
  // Quiet — a text link with a rule that draws in on hover, not a third button
  quiet:
    'border border-transparent bg-transparent px-0 text-muted hover:text-paper',
}

export default function Button({
  href,
  variant = 'solid',
  icon,
  children,
  className = '',
  disabled = false,
  target,
  rel,
  type = 'button',
  onClick,
  ...props
}) {
  const Tag = href ? 'a' : 'button'
  const resolvedVariant = Object.hasOwn(VARIANTS, variant) ? variant : 'solid'
  const padding = resolvedVariant === 'quiet' ? 'py-3' : 'px-6 py-5'
  const safeRel = target === '_blank'
    ? [...new Set(`${rel ?? ''} noopener noreferrer`.trim().split(/\s+/))].join(' ')
    : rel

  return (
    <Tag
      {...props}
      href={disabled ? undefined : href}
      type={href ? undefined : type}
      target={href ? target : undefined}
      rel={href ? safeRel : undefined}
      disabled={href ? undefined : disabled}
      role={href && disabled ? 'link' : props.role}
      aria-disabled={disabled || undefined}
      tabIndex={href && disabled ? -1 : props.tabIndex}
      onClick={disabled ? (event) => event.preventDefault() : onClick}
      className={`group relative inline-flex min-h-11 items-center justify-between gap-8 ${padding} font-sans text-[0.7rem] font-medium uppercase tracking-[0.12em] transition-[background-color,border-color,color,transform,box-shadow] duration-150 ease-out active:translate-y-0 active:scale-[0.98] ${VARIANTS[resolvedVariant]} ${disabled ? 'pointer-events-none cursor-not-allowed opacity-50' : ''} ${className}`}
    >
      <span className="relative">
        {children}
        {resolvedVariant === 'quiet' && (
          <span
            aria-hidden="true"
            className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-150 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
          />
        )}
      </span>
      {icon && (
        <span aria-hidden="true" className="inline-flex transition-transform duration-150 ease-out group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </Tag>
  )
}

export function ArrowRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h13M12 5l7 7-7 7" />
    </svg>
  )
}
