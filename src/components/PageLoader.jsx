import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SITE } from '../config/site'

const DURATION = 2600

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
  const reduceMotion = useReducedMotion()
  const countRef = useRef(null)
  const progressRef = useRef(null)
  const pointRef = useRef(null)

  const onDoneRef = useRef(onDone)
  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    if (reduceMotion) {
      const id = setTimeout(() => onDoneRef.current(), 120)
      return () => clearTimeout(id)
    }

    const start = performance.now()
    let frame
    let timeout
    let failsafe
    let completed = false
    let lastPercent = -1

    const update = (progress) => {
      const percent = Math.round(progress * 100)
      if (percent !== lastPercent) {
        countRef.current.textContent = String(percent).padStart(3, '0')
        lastPercent = percent
      }
      progressRef.current.style.transform = `scaleX(${progress})`
      pointRef.current.style.transform = `translateX(${(progress - 1) * 100}%)`
    }

    const finish = () => {
      if (completed) return
      completed = true
      cancelAnimationFrame(frame)
      clearTimeout(timeout)
      clearTimeout(failsafe)
      update(1)
      onDoneRef.current()
    }

    failsafe = setTimeout(finish, DURATION + 900)

    const tick = (now) => {
      const raw = Math.min(1, (now - start) / DURATION)
      const eased = 1 - Math.pow(1 - raw, 2.8)
      update(eased)

      if (raw < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        timeout = setTimeout(finish, 220)
      }
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timeout)
      clearTimeout(failsafe)
    }
  }, [reduceMotion])

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[var(--z-loader)] overflow-hidden bg-ink-2 font-mono text-paper"
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.76, 0, 0.24, 1] }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70vw 60vh at 28% 55%, rgba(255,255,255,0.06), transparent 72%)',
        }}
      />
      <CornerTicks />

      <button
        type="button"
        onClick={() => onDone({ focusContent: true })}
        className="absolute top-6 right-6 z-10 min-h-11 px-3 text-[0.7rem] uppercase tracking-[0.15em] text-muted hover:text-paper sm:top-8 sm:right-10"
      >
        Skip intro
      </button>

      <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-20">
        <motion.div
          aria-hidden="true"
          className="mb-8 text-paper"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
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

        <motion.div
          aria-hidden="true"
          className="flex items-baseline gap-4"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span ref={countRef} className="tabular font-display text-[clamp(4.5rem,14vw,11rem)] leading-[0.8] tracking-[0.04em] text-paper">
            {reduceMotion ? '100' : '000'}
          </span>
          <span className="font-mono text-[0.8rem] text-faint">%</span>
        </motion.div>

        <motion.div
          className="mt-7 flex items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-signal"
          />
          <span className="text-[0.66rem] uppercase tracking-[0.3em] text-muted">
            Initializing system
          </span>
        </motion.div>
      </div>

      <motion.div
        className="absolute inset-x-0 bottom-0 flex items-end justify-end px-6 pb-8 sm:px-10 lg:px-16 xl:px-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.5 }}
      >
        <span className="tabular text-[0.6rem] uppercase tracking-[0.2em] text-faint">
          {SITE.timezone}
        </span>
      </motion.div>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/[0.08]">
        <div
          ref={progressRef}
          className="absolute inset-0 origin-left bg-paper"
          style={{ transform: reduceMotion ? 'scaleX(1)' : 'scaleX(0)' }}
        />
        <div
          ref={pointRef}
          className="absolute inset-0"
          style={{ transform: reduceMotion ? 'translateX(0%)' : 'translateX(-100%)' }}
        >
          <span className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-signal shadow-[0_0_14px_4px_rgba(143,179,163,0.5)]" />
        </div>
      </div>
    </motion.div>
  )
}
