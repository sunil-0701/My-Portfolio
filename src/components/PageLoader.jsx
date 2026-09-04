import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SITE } from '../config/site'

const DURATION = 2600

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Corner ticks — the technical-drawing register the rest of the page uses
function CornerTicks() {
  const base = 'absolute h-3 w-3 border-paper/20'
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-5 sm:inset-8">
      <span className={`${base} left-0 top-0 border-l border-t`} />
      <span className={`${base} right-0 top-0 border-r border-t`} />
      <span className={`${base} bottom-0 left-0 border-b border-l`} />
      <span className={`${base} bottom-0 right-0 border-b border-r`} />
    </div>
  )
}

export default function PageLoader({ onDone }) {
  const [percent, setPercent] = useState(() => (prefersReducedMotion() ? 100 : 0))

  // Keep the callback in a ref so the timeline effect runs exactly once,
  // even though the parent passes a fresh arrow on every render.
  const onDoneRef = useRef(onDone)
  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    // Anyone who asked for reduced motion gets the page, not the show.
    if (prefersReducedMotion()) {
      const id = setTimeout(() => onDoneRef.current(), 120)
      return () => clearTimeout(id)
    }

    const start = performance.now()
    let frame
    let timeout

    // rAF is paused while the tab is backgrounded. Without a wall-clock
    // fallback the intro would never hand over, and the page would sit
    // behind a frozen loader.
    const failsafe = setTimeout(() => {
      setPercent(100)
      onDoneRef.current()
    }, DURATION + 900)

    const tick = (now) => {
      const raw = Math.min(1, (now - start) / DURATION)
      const eased = 1 - Math.pow(1 - raw, 2.8)
      setPercent(Math.min(100, Math.round(eased * 100)))

      if (raw < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        timeout = setTimeout(() => onDoneRef.current(), 220)
      }
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timeout)
      clearTimeout(failsafe)
    }
  }, [])

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[var(--z-loader)] overflow-hidden bg-ink-2 font-mono text-paper"
      initial={{ y: 0 }}
      // Lifts like a curtain instead of dissolving, so the hero underneath is
      // revealed rather than cross-faded into.
      exit={{ y: '-100%' }}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70vw 60vh at 28% 55%, rgba(255,255,255,0.06), transparent 72%)',
        }}
      />
      <div className="bg-grain pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light" />

      <CornerTicks />

      {/* Left-aligned on the hero's own gutter, so when the curtain lifts the
          eye is already parked where the name lands. */}
      <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Bracket mark */}
        <motion.div
          aria-hidden="true"
          className="mb-8 text-paper"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3">
            <svg width="17" height="27" viewBox="0 0 40 60" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M30 8 L6 30 L30 52" />
            </svg>
            <svg width="11" height="27" viewBox="0 0 24 60" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round">
              <path d="M18 4 L6 56" />
            </svg>
            <svg width="17" height="27" viewBox="0 0 40 60" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 8 L34 30 L10 52" />
            </svg>
          </div>
        </motion.div>

        {/* The count is the hero of this screen */}
        <motion.div
          className="flex items-baseline gap-4"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="tabular font-display text-[clamp(4.5rem,14vw,11rem)] leading-[0.8] tracking-[0.04em] text-paper">
            {String(percent).padStart(3, '0')}
          </span>
          <span className="font-mono text-[0.8rem] text-faint">%</span>
        </motion.div>

        <motion.div
          className="mt-7 flex items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            aria-hidden="true"
            className="animate-signal h-1.5 w-1.5 rounded-full bg-signal"
          />
          <span className="text-[0.66rem] uppercase tracking-[0.3em] text-muted">
            Initializing system
          </span>
        </motion.div>
      </div>

      {/* Identity + place, held in the corners */}
      <motion.div
        className="absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-8 sm:px-10 lg:px-16 xl:px-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.35 }}
      >
        <span className="font-display text-[1.1rem] tracking-[0.16em] text-paper/70">
          SA<span className="text-signal">.</span>
        </span>
        <span className="tabular text-[0.6rem] uppercase tracking-[0.2em] text-faint">
          {SITE.timezone}
        </span>
      </motion.div>

      {/* Full-bleed rail pinned to the very edge of the screen */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/[0.08]">
        <div
          className="absolute inset-0 origin-left bg-paper transition-transform duration-100 ease-out"
          style={{ transform: `scaleX(${percent / 100})` }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 transition-transform duration-100 ease-out"
          style={{ transform: `translateX(${percent - 100}%)` }}
        >
          <span className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-signal shadow-[0_0_14px_4px_rgba(143,179,163,0.5)]" />
        </div>
      </div>
    </motion.div>
  )
}
