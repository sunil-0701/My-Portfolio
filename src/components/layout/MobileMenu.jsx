import { useEffect, useRef } from 'react'
import { SITE } from '../../config/site'

export default function MobileMenu({ children, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    const desktop = window.matchMedia('(min-width: 768px)')
    const closeOnDesktop = () => {
      if (desktop.matches) dialog.close()
    }

    dialog.showModal()
    document.body.style.overflow = 'hidden'
    closeOnDesktop()
    desktop.addEventListener('change', closeOnDesktop)

    return () => {
      desktop.removeEventListener('change', closeOnDesktop)
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus()
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      id="mobile-menu"
      aria-label="Navigation menu"
      onClose={(event) => {
        if (!event.currentTarget.open) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const controls = event.currentTarget.querySelectorAll('a[href], button:not([disabled])')
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }}
      className="mobile-menu fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto border-0 bg-ink px-6 pt-6 pb-12 text-paper backdrop:bg-ink"
    >
      <div className="flex justify-end">
        <button
          type="button"
          autoFocus
          onClick={() => dialogRef.current.close()}
          className="min-h-11 px-3 font-mono text-sm text-paper"
        >
          Close menu
        </button>
      </div>
      <nav aria-label="Primary mobile" className="mt-8 flex flex-col gap-1">
        {children}
        <a
          href={`mailto:${SITE.email}`}
          onClick={() => dialogRef.current.close()}
          className="mt-8 break-all py-3 font-mono text-[0.72rem] tracking-[0.08em] text-muted hover:text-paper"
        >
          {SITE.email}
        </a>
      </nav>
    </dialog>
  )
}
