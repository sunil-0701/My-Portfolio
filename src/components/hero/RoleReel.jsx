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
export default function RoleReel({ roles, ready = true, className = '' }) {
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!ready || reduceMotion || roles.length < 2) return

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
  }, [roles.length, ready, reduceMotion])

  // Anyone who asked for less motion gets a plain static line.
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
        style={{ height: `${WINDOW_EM}em` }}
      >
        <AnimatePresence initial={false}>
          <motion.span
            key={role}
            aria-hidden="true"
            className="absolute inset-0 flex items-center whitespace-nowrap text-paper"
            initial={{ y: '105%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-105%', opacity: 0 }}
            transition={{ type: 'tween', duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            {role}
          </motion.span>
        </AnimatePresence>
      </span>

      {/* Decorative rotation must not interrupt screen readers every cycle. */}
      <span className="sr-only">
        {roles.join(' · ')}
      </span>
    </span>
  )
}
