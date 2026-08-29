const LINKS = ['Work', 'About', 'Experience', 'Contact']

export default function NavBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(10,10,11,0.6) 0%, transparent 100%)',
        }}
      />

      <div className="relative flex items-center justify-between gap-6 px-6 py-8 sm:px-10 lg:px-16">
        <a href="#home" className="font-display text-xl font-normal uppercase tracking-[0.1em] text-paper">
          SA.
        </a>

        <div className="flex items-center gap-10">
          <nav className="hidden items-center gap-9 sm:flex">
            {LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-[13px] font-medium uppercase tracking-[0.1em] text-white/85 transition-colors hover:text-paper"
              >
                {link}
              </a>
            ))}
          </nav>

          <span className="h-2 w-2 shrink-0 rounded-full bg-paper" />
        </div>
      </div>
    </header>
  )
}
