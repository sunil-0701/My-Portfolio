export default function ScrollIndicator() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-4"
    >
      <span className="block h-10 w-px bg-white/15" />

      <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-faint">
        Scroll
      </span>
    </div>
  )
}
