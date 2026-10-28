import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import usePageVisible from '../../hooks/usePageVisible'

export default function HeroLinework({ ready = true }) {
  const pageVisible = usePageVisible()
  const reduceMotion = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const crosshairX = useSpring(pointerX, { stiffness: 100, damping: 20 })
  const crosshairY = useSpring(pointerY, { stiffness: 100, damping: 20 })

  const followPointer = (event) => {
    if (reduceMotion || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 36)
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 36)
  }

  const resetPointer = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <div
      aria-hidden="true"
      data-ready={ready}
      data-active={ready && pageVisible}
      className="hero-linework pointer-events-none absolute top-[20%] right-[4.5%] bottom-[18%] z-[11] hidden w-[10%] lg:block"
    >
      <span className="hero-linework-vertical absolute inset-y-0 right-0 w-px origin-top bg-paper/20" />
      <div
        className="hero-linework-symbols pointer-events-auto absolute top-0 right-0 h-28 w-44"
        onPointerMove={followPointer}
        onPointerLeave={resetPointer}
      >
        <svg viewBox="0 0 160 96" className="h-full w-full overflow-visible text-paper" fill="none">
          <motion.g className="hero-detail-crosshair" style={{ x: crosshairX, y: crosshairY }}>
            <path d="M8 28H44 M26 10V46" stroke="currentColor" strokeWidth="0.85" />
          </motion.g>
          {Array.from({ length: 16 }, (_, index) => (
            <circle
              key={index}
              className="hero-detail-dot"
              cx={96 + (index % 4) * 12}
              cy={36 + Math.floor(index / 4) * 12}
              r="1"
              fill="currentColor"
              style={{
                '--dot-delay': `${((index % 4) + Math.floor(index / 4)) * 0.13}s`,
                transitionDelay: `${((index % 4) + Math.floor(index / 4)) * 35}ms`,
              }}
            />
          ))}
        </svg>
      </div>
      <div className="hero-linework-scan absolute top-[60%] right-0 h-px w-24">
        <span className="hero-linework-crossbar absolute inset-0 origin-right bg-paper/35" />
        <span className="absolute top-1/2 -right-1 h-2 w-2 -translate-y-1/2 border border-paper" />
      </div>
    </div>
  )
}
