import { useState } from 'react'
import { motion } from 'framer-motion'
import { SECTIONS } from '../../config/site'
import MobileMenu from './MobileMenu'

const easeOutExpo = [0.16, 1, 0.3, 1]

function NavItem({ section, isActive, onNavigate }) {
  const base =
    'group relative inline-flex items-center py-1 font-sans text-[0.7rem] font-medium tracking-[0.22em] transition-colors duration-300 sm:text-[0.72rem]'

  if (!section.ready) {
    return (
      <span
        aria-disabled="true"
        title="Section in progress"
        className={`${base} cursor-default text-faint`}
      >
        {section.label}
        <span className="ml-2 font-mono text-[0.55rem] tracking-[0.1em] text-faint/0 transition-colors duration-300 group-hover:text-faint">
          soon
        </span>
      </span>
    )
  }

  return (
    <a
      href={`#${section.id}`}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      className={`${base} ${isActive ? 'text-paper' : 'text-muted hover:text-paper'}`}
    >
      {section.label}
      {/* Active + hover rule, animated with transform only */}
      <span
        aria-hidden="true"
        className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-paper transition-transform duration-300 ease-out ${
          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />
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
        <div className="mx-auto flex min-h-20 max-w-[1440px] items-center justify-end px-6 py-6 sm:px-10 lg:px-16 xl:px-20">
          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex lg:gap-11">
            {SECTIONS.map((section) => (
              <NavItem key={section.id} section={section} isActive={isActive(section)} />
            ))}
          </nav>

          {/* Mobile trigger — replaces the row that used to overflow the viewport */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-haspopup="dialog"
            className="flex h-9 w-9 items-center justify-center transition-transform duration-200 active:scale-95 md:hidden"
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
