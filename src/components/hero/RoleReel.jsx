import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const HOLD_MS = 2600
const WINDOW_EM = 1.55

// A single-word window where each role enters from below and the one it
// replaces leaves through the top.
//
// This deliberately avoids a shared translating track. A track has to wrap
// somewhere, and every wrap strategy either rewinds visibly or leans on an
// animation-complete callback that the next tick can interrupt. Here there is
// nothing to wrap: only one word is mounted at rest, motion is always upward,
// and the loop point is indistinguishable from any other change.
export default function RoleReel({ roles, className = '' }) {
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion || roles.length < 2) return

    // Exit animations are rAF-driven and freeze while the tab is hidden, but a
    // plain interval keeps firing there. Left running, every tick mounts a word
    // that can never leave, so the window quietly fills up with stalled nodes.
    let id = null

    const start = () => {
      if (id === null) {
        id = setInterval(() => setIndex((i) => (i + 1) % roles.length), HOLD_MS)
      }
    }

    const stop = () => {
      if (id !== null) {
        clearInterval(id)
        id = null
      }
    }

    const onVisibilityChange = () => (document.hidden ? stop() : start())

    onVisibilityChange()
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [roles.length, reduceMotion])

  // Framer's spring is JS-driven, so the reduced-motion CSS override never
  // reaches it. Anyone who asked for less motion gets the roles as a plain
  // static line instead of a rotation.
  if (reduceMotion) {
    return (
      <span className={`inline-block text-paper ${className}`}>
        {roles.join(' · ')}
      </span>
    )
  }

  const role = roles[index]
  const longest = roles.reduce((a, b) => (b.length > a.length ? b : a), '')

  return (
    <span className={`relative inline-flex flex-col ${className}`}>
      {/* Reserves the widest word so nothing to the right of the reel shifts */}
      <span aria-hidden="true" className="invisible block h-0 overflow-hidden whitespace-nowrap">
        {longest}
      </span>

      <span
        className="relative block overflow-hidden"
        style={{
          height: `${WINDOW_EM}em`,
          maskImage:
            'linear-gradient(to bottom, transparent 0%, #000 24%, #000 76%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, #000 24%, #000 76%, transparent 100%)',
        }}
      >
        <AnimatePresence initial={false}>
          <motion.span
            key={role}
            aria-hidden="true"
            className="absolute inset-0 flex items-center whitespace-nowrap text-paper"
            style={{ textShadow: '0 0 24px rgba(143,179,163,0.5)' }}
            initial={{ y: '105%', opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: '-105%', opacity: 0, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 200, damping: 24, mass: 0.8 }}
          >
            {/* Light sweeps across the word as it settles */}
            <span data-text={role} className="reel-sweep relative">
              {role}
            </span>
          </motion.span>
        </AnimatePresence>
      </span>

      {/* The rotation is decorative; assistive tech gets the plain current role */}
      <span className="sr-only" aria-live="polite">
        {role}
      </span>
    </span>
  )
}
