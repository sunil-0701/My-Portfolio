import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function PageLoader({ onDone }) {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const duration = 500

    let frame
    const tick = (now) => {
      const elapsed = now - start
      const next = Math.min(100, Math.round((elapsed / duration) * 100))
      setPercent(next)

      if (next < 100) {
        frame = requestAnimationFrame(tick)
      } else {
        setTimeout(onDone, 150)
      }
    }
    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-ink font-mono text-paper"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 620px 420px at 50% 45%, rgba(255,255,255,0.05), transparent 70%)',
        }}
      />

      <div className="absolute left-8 top-8 text-[13px] font-medium tracking-[0.06em] text-faint sm:left-12 sm:top-10">
        {String(percent).padStart(2, '0')}%
      </div>

      <div className="relative z-10 flex flex-col items-center gap-[30px]">
        <motion.div
          className="text-paper"
          animate={{ opacity: [0.55, 1, 0.55], scale: [0.97, 1, 0.97] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex items-center gap-4">
            <svg width="22" height="36" viewBox="0 0 40 60" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M30 8 L6 30 L30 52" />
            </svg>
            <svg width="14" height="36" viewBox="0 0 24 60" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
              <path d="M18 4 L6 56" />
            </svg>
            <svg width="22" height="36" viewBox="0 0 40 60" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 8 L34 30 L10 52" />
            </svg>
          </div>
        </motion.div>

        <div className="flex items-center text-[13px] font-medium uppercase tracking-[0.32em] text-[#b0b0b4]">
          Loading Code
          {[0, 0.2, 0.4].map((delay) => (
            <motion.span
              key={delay}
              className="inline-block"
              animate={{ opacity: [0.15, 1, 0.15] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay }}
            >
              .
            </motion.span>
          ))}
        </div>

        <div className="relative h-px w-[300px] bg-hairline">
          <div
            className="absolute left-0 top-0 h-full bg-paper"
            style={{ width: `${percent}%` }}
          />
          <div
            className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5f5f3] shadow-[0_0_0_4px_rgba(242,242,240,0.16),0_0_10px_rgba(242,242,240,0.5)]"
            style={{ left: `${percent}%` }}
          />
        </div>
      </div>
    </motion.div>
  )
}
