export default function ShineText({ children, delay = 0, className = '' }) {
  return (
    <span
      className={`shine-text-vertical font-light uppercase tracking-[0.24em] text-[#909095] ${className}`}
      data-text={children}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </span>
  )
}

