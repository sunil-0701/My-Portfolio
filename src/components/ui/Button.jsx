export default function Button({
  icon,
  children,
  className = '',
  ...props
}) {
  return (
    <button
      className={`group inline-flex items-center gap-6 border border-white/20 bg-transparent px-7 py-3.5 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[#eeeeec] transition-all duration-300 ease-out hover:border-white/45 hover:bg-white/[0.03] ${className}`}
      {...props}
    >
      <span>{children}</span>
      {icon && (
        <span className="inline-flex transition-transform duration-300 ease-out group-hover:translate-x-1.5">
          {icon}
        </span>
      )}
    </button>
  )
}

