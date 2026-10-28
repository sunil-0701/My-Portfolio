import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import portrait from '../../assets/profile-portrait.jpg'
import { SITE } from '../../config/site'

const MASK =
  'radial-gradient(ellipse 60% 78% at 52% 54%, #000 36%, rgba(0,0,0,0.8) 58%, transparent 83%)'

export default function HeroPortrait({ ready = true }) {
  const [failed, setFailed] = useState(false)
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className="hero-portrait pointer-events-none absolute inset-y-0 right-0 z-[var(--z-behind)] w-full md:right-[7%] md:w-[51%]"
      initial={{ opacity: 0, y: reduceMotion ? '0%' : '100%' }}
      animate={{ opacity: ready ? 1 : 0, y: ready || reduceMotion ? '0%' : '100%' }}
      // Rise alongside the loading screen's exit, without an extra delay.
      transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        aria-hidden="true"
        className="absolute left-[52%] top-[40%] h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            'radial-gradient(ellipse, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 45%, transparent 75%)',
        }}
      />

      <div className="relative h-full w-full">
        {failed ? (
          <div className="portrait-fallback flex h-full flex-col items-center justify-center gap-4">
            <span role="img" aria-label={`${SITE.name} — portrait unavailable`} data-portrait-initials className="font-display text-6xl text-faint/40">{SITE.firstName[0]}{SITE.lastName[0]}</span>
            <button type="button" onClick={() => setFailed(false)} className="pointer-events-auto relative z-10 min-h-11 border border-paper/30 px-4 font-mono text-xs text-muted hover:text-paper">Retry portrait</button>
          </div>
        ) : <img
          src={portrait}
          width="1100"
          height="979"
          alt={`${SITE.name}, photographed in profile`}
          fetchPriority="high"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover object-[52%_20%] opacity-15 md:opacity-85 lg:opacity-100"
          style={{ maskImage: MASK, WebkitMaskImage: MASK }}
        />}
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 58% 30%, rgba(255,255,255,0.13), transparent 42%)',
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-[18%]"
        style={{
          background: 'linear-gradient(to left, #0b0c0a 0%, rgba(11,12,10,0.55) 45%, transparent 100%)',
        }}
      />

    </motion.div>
  )
}
