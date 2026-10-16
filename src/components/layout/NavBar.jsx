import { useState } from 'react'
import { motion } from 'framer-motion'
import { SECTIONS, SITE } from '../../config/site'
import MobileMenu from './MobileMenu'

const easeOutExpo = [0.16, 1, 0.3, 1]

function NavItem({ section, isActive, onNavigate, number }) {
  const base = 'group relative inline-flex min-h-11 min-w-11 items-center font-mono text-[0.72rem] tracking-[0.12em] transition-colors duration-150'
  const content = number ? (
    <>
      <span aria-hidden="true" className={`px-0.5 ${isActive ? 'bg-paper text-ink' : ''}`}>{number}</span>
      <span className="sr-only">{section.label}</span>
    </>
  ) : section.label

  if (!section.ready) {
    return (
      <span
        aria-disabled="true"
        title={`${section.label} — section in progress`}
        className={`${base} cursor-default text-faint`}
      >
        {content}
      </span>
    )
  }

  return (
    <a
      href={`#${section.id}`}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      title={section.label}
      className={`${base} ${isActive ? 'text-paper' : 'text-muted hover:text-paper'}`}
    >
      {content}
    </a>
  )
}

export default function NavBar({ activeLink = 'HOME', ready = true }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (section) => section.label === activeLink.toUpperCase()

  return (
    <>
      <motion.header
        className="glass-bar fixed inset-x-0 top-0 z-[var(--z-nav)]"
        initial={{ opacity: 0, y: -26 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -26 }}
        transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
      >
        <div className="site-header mx-auto flex max-w-[1800px] items-start justify-between gap-4 px-6 py-6 sm:px-10 lg:px-20 lg:py-8">
          <div>
            <p className="mt-1 hidden border-b border-paper/20 pb-3 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-faint sm:block lg:min-w-72">
              {SITE.location} <span className="ml-4">{SITE.timezone}</span>
            </p>
          </div>

          {/* Mobile trigger — replaces the row that used to overflow the viewport */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-haspopup="dialog"
            className="flex h-11 w-11 items-center justify-center transition-transform duration-200 active:scale-95 md:hidden"
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span
                className={`absolute left-0 block h-px w-full bg-paper transition-transform duration-300 ease-out ${
                  menuOpen ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-full bg-paper transition-transform duration-300 ease-out ${
                  menuOpen ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </div>
      </motion.header>

      <nav
        aria-label="Primary"
        className="fixed top-[27%] left-6 z-[var(--z-nav)] hidden flex-col gap-5 border-l border-paper/20 pl-4 md:flex lg:left-[4.4%] lg:gap-7"
      >
        {SECTIONS.map((section, index) => (
          <NavItem
            key={section.id}
            section={section}
            number={String(index + 1).padStart(2, '0')}
            isActive={isActive(section)}
          />
        ))}
      </nav>

      {/* Native modal behavior traps focus and makes the background inert. */}
      {menuOpen && (
        <MobileMenu onClose={() => setMenuOpen(false)}>
          {SECTIONS.map((section) => (
            <div key={section.id} className="border-b border-white/[0.07] py-5">
              <div className="text-[1.05rem]">
                <NavItem
                  section={section}
                  isActive={isActive(section)}
                  onNavigate={() => setMenuOpen(false)}
                />
              </div>
            </div>
          ))}
        </MobileMenu>
      )}
    </>
  )
}
