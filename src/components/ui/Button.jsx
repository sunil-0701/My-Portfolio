const VARIANTS = {
  // Solid — the one primary action on the page
  solid:
    'border border-paper bg-paper text-ink hover:bg-white hover:border-white hover:-translate-y-0.5 shadow-[0_18px_40px_-24px_rgba(143,179,163,0.55)] hover:shadow-[0_26px_54px_-24px_rgba(143,179,163,0.75)]',
  // Outline — secondary weight
  outline:
    'border border-white/20 bg-transparent text-paper hover:border-white/45 hover:bg-white/[0.04] hover:-translate-y-0.5',
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
  ...props
}) {
  const Tag = href ? 'a' : 'button'
  const padding = variant === 'quiet' ? 'py-2' : 'px-7 py-3.5'

  return (
    <Tag
      href={href}
      className={`group relative inline-flex items-center gap-4 ${padding} font-sans text-[0.7rem] font-medium uppercase tracking-[0.2em] transition-[background-color,border-color,color,transform,box-shadow] duration-300 ease-[var(--ease-spring)] will-change-transform active:translate-y-0 active:scale-[0.98] ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      <span className="relative">
        {children}
        {variant === 'quiet' && (
          <span
            aria-hidden="true"
            className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-[var(--ease-spring)] group-hover:scale-x-100"
          />
        )}
      </span>
      {icon && (
        <span className="inline-flex transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-1.5">
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
