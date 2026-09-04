import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SECTIONS, SITE } from '../../config/site'

const easeOutExpo = [0.16, 1, 0.3, 1]

function Wordmark({ onClick }) {
  return (
    <a
      href="#home"
      onClick={onClick}
      aria-label={`${SITE.name} — back to top`}
      className="group inline-flex items-baseline gap-[0.1em] font-display text-[1.35rem] tracking-[0.16em] text-paper transition-opacity duration-300 hover:opacity-70"
    >
      SA
      <span
        aria-hidden="true"
        className="animate-blink-period inline-block h-[0.16em] w-[0.16em] translate-y-[-0.02em] rounded-full bg-signal"
      />
    </a>
  )
}

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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock the page behind the mobile sheet, and close it on Escape.
  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const isActive = (section) => section.label === activeLink.toUpperCase()

  return (
    <>
      <motion.header
        className={`glass-bar fixed inset-x-0 top-0 z-[var(--z-nav)] transition-[background-color,box-shadow] duration-500 ${
          scrolled ? 'shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(2,3,4,0.6),0_20px_50px_-20px_rgba(2,3,4,0.95)]' : ''
        }`}
        initial={{ opacity: 0, y: -26 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -26 }}
        transition={{ duration: 1.1, delay: 0.25, ease: easeOutExpo }}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 sm:px-10 lg:px-16 xl:px-20">
          <Wordmark onClick={() => setMenuOpen(false)} />

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

      {/* The sheet is a SIBLING of the header on purpose. Nested inside it, the
          header's transform/backdrop-filter becomes the containing block for
          position: fixed and the overlay collapses to the height of the bar.
          It also sits below the bar in z order so the wordmark and the close
          control stay visible and clickable on top of it. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Primary mobile"
            className="fixed inset-0 z-[var(--z-sheet)] flex flex-col gap-1 overflow-y-auto bg-ink/[0.97] px-6 pt-28 pb-12 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
          >
            {SECTIONS.map((section, i) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 + i * 0.05, ease: easeOutExpo }}
                className="border-b border-white/[0.07] py-5"
              >
                <div className="text-[1.05rem]">
                  <NavItem
                    section={section}
                    isActive={isActive(section)}
                    onNavigate={() => setMenuOpen(false)}
                  />
                </div>
              </motion.div>
            ))}

            <a
              href={`mailto:${SITE.email}`}
              className="mt-8 font-mono text-[0.72rem] tracking-[0.08em] text-muted transition-colors duration-300 hover:text-paper"
            >
              {SITE.email}
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
