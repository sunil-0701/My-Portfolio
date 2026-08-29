const VARIANT_CLASSES = {
  primary: 'bg-paper text-ink hover:scale-[1.03]',
  secondary:
    'border border-white/25 bg-ink/35 text-paper backdrop-blur-md hover:bg-white/5',
}

export default function Button({
  variant = 'primary',
  icon,
  children,
  className = '',
  ...props
}) {
  return (
    <button
      className={`flex items-center gap-2 rounded-[3px] px-5 py-3 text-xs font-semibold uppercase tracking-[0.06em] transition-all ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {children}
      {icon}
    </button>
  )
}
