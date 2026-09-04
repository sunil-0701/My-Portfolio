import { useEffect } from 'react'
import { motion } from 'framer-motion'

// Sparse field of tiny distant star dust points
const STAR_DUST = [
  { cx: 8, cy: 15, r: 0.5, group: 1 }, { cx: 14, cy: 42, r: 0.6, group: 2 },
  { cx: 22, cy: 78, r: 0.4, group: 3 }, { cx: 31, cy: 12, r: 0.7, group: 1 },
  { cx: 38, cy: 88, r: 0.5, group: 2 }, { cx: 45, cy: 26, r: 0.6, group: 3 },
  { cx: 52, cy: 64, r: 0.4, group: 1 }, { cx: 61, cy: 18, r: 0.5, group: 2 },
  { cx: 68, cy: 92, r: 0.6, group: 3 }, { cx: 76, cy: 14, r: 0.5, group: 1 },
  { cx: 84, cy: 82, r: 0.4, group: 2 }, { cx: 91, cy: 35, r: 0.6, group: 3 },
  { cx: 5, cy: 68, r: 0.5, group: 2 }, { cx: 18, cy: 24, r: 0.4, group: 1 },
  { cx: 27, cy: 55, r: 0.6, group: 3 }, { cx: 35, cy: 34, r: 0.5, group: 2 },
  { cx: 42, cy: 72, r: 0.4, group: 1 }, { cx: 49, cy: 10, r: 0.6, group: 3 },
  { cx: 58, cy: 84, r: 0.5, group: 2 }, { cx: 65, cy: 38, r: 0.4, group: 1 },
  { cx: 73, cy: 60, r: 0.6, group: 3 }, { cx: 81, cy: 22, r: 0.5, group: 2 },
  { cx: 89, cy: 75, r: 0.4, group: 1 }, { cx: 96, cy: 12, r: 0.6, group: 3 },
  { cx: 11, cy: 85, r: 0.5, group: 1 }, { cx: 25, cy: 40, r: 0.4, group: 2 },
  { cx: 40, cy: 6, r: 0.6, group: 3 }, { cx: 55, cy: 48, r: 0.5, group: 1 },
  { cx: 70, cy: 4, r: 0.4, group: 2 }, { cx: 86, cy: 45, r: 0.6, group: 3 },
  { cx: 16, cy: 94, r: 0.5, group: 2 }, { cx: 47, cy: 92, r: 0.4, group: 1 },
  { cx: 63, cy: 70, r: 0.6, group: 3 }, { cx: 78, cy: 96, r: 0.5, group: 2 },
  { cx: 93, cy: 58, r: 0.4, group: 1 }, { cx: 29, cy: 90, r: 0.5, group: 3 },
]

// Publishes pointer position as --px / --py on :root. The layers read those
// through CSS, so moving the mouse never triggers a React render.
function usePointerParallax() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const root = document.documentElement
    let frame = null
    let nextX = 0
    let nextY = 0

    const apply = () => {
      frame = null
      root.style.setProperty('--px', nextX.toFixed(3))
      root.style.setProperty('--py', nextY.toFixed(3))
    }

    const onMove = (e) => {
      nextX = (e.clientX / window.innerWidth) * 2 - 1
      nextY = (e.clientY / window.innerHeight) * 2 - 1
      if (frame === null) frame = requestAnimationFrame(apply)
    }

    const onLeave = () => {
      nextX = 0
      nextY = 0
      if (frame === null) frame = requestAnimationFrame(apply)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      if (frame !== null) cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      root.style.setProperty('--px', '0')
      root.style.setProperty('--py', '0')
    }
  }, [])
}

function Streak({ className, style }) {
  return (
    <span
      className={`absolute block h-px w-[180px] ${className}`}
      style={{
        background:
          'linear-gradient(to left, rgba(255,255,255,0.85), rgba(255,255,255,0))',
        ...style,
      }}
    />
  )
}

export default function HeroBackground() {
  usePointerParallax()

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[var(--z-behind)] overflow-hidden bg-ink"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* Drifting light masses. Each is a soft radial on its own slow cycle,
          so the field never resolves to the same frame twice. */}
      <div className="parallax parallax-far absolute inset-0">
        <div
          className="animate-drift-a absolute left-[58%] top-[18%] h-[70vw] max-h-[900px] w-[70vw] max-w-[900px]"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.035) 42%, transparent 70%)',
          }}
        />
        <div
          className="animate-drift-b absolute -left-[12%] top-[42%] h-[60vw] max-h-[820px] w-[60vw] max-w-[820px]"
          style={{
            background:
              'radial-gradient(circle, rgba(143,179,163,0.075) 0%, rgba(143,179,163,0.02) 45%, transparent 72%)',
          }}
        />
        <div
          className="animate-drift-c absolute left-[24%] -top-[18%] h-[55vw] max-h-[760px] w-[55vw] max-w-[760px]"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.055) 0%, transparent 68%)',
          }}
        />
      </div>

      {/* Floor haze */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 85vw 40vh at 50% 98%, rgba(255,255,255,0.04), transparent 75%)',
        }}
      />

      {/* Distant star dust */}
      <div className="parallax parallax-mid absolute inset-0">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {STAR_DUST.map((star) => (
            <circle
              key={`${star.cx}-${star.cy}`}
              cx={star.cx}
              cy={star.cy}
              r={star.r * 0.12}
              fill="#ffffff"
              className={`animate-star-twinkle-${star.group}`}
            />
          ))}
        </svg>
      </div>

      {/* Streaks crossing the field on long, offset cycles */}
      <div className="absolute inset-0 overflow-hidden">
        <Streak className="animate-shooting-1" style={{ left: '78%', top: '12%', transform: 'rotate(30deg)' }} />
        <Streak className="animate-shooting-2" style={{ left: '92%', top: '38%', transform: 'rotate(30deg)' }} />
      </div>

      {/* Sweeping orbital arc, left */}
      <div className="parallax parallax-far absolute -left-[28vw] -top-[18vh] h-[130vw] max-h-[1700px] w-[130vw] max-w-[1700px]">
        <svg className="animate-orbit-reverse h-full w-full" viewBox="0 0 1000 1000" fill="none">
          <circle cx="500" cy="500" r="460" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <circle cx="500" cy="40" r="2" fill="rgba(143,179,163,0.8)" />
        </svg>
      </div>

      {/* Concentric portrait rings + slow travelling light point */}
      <div className="parallax parallax-near absolute left-[72%] top-[42%] h-[75vw] max-h-[1100px] w-[75vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2">
        <svg className="animate-single-orbit h-full w-full" viewBox="0 0 1000 1000" fill="none">
          <circle cx="500" cy="500" r="500" stroke="rgba(255,255,255,0.035)" strokeWidth="0.8" />
          <circle cx="500" cy="500" r="440" stroke="rgba(255,255,255,0.075)" strokeWidth="1" />
          <circle cx="500" cy="500" r="360" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />
          <circle cx="940" cy="500" r="2.5" fill="#ffffff" />
        </svg>
      </div>

      {/* Vignette — softened, tinted to the background hue rather than flat black */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 110% 105% at 50% 45%, transparent 42%, rgba(2,3,4,0.55) 78%, rgba(2,3,4,0.9) 100%)',
        }}
      />
    </motion.div>
  )
}
