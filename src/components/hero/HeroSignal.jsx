import { useEffect, useRef } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

const WIDTH = 520
const CENTER = 36

function signalPath(time, cursor, energy) {
  const pulse = -80 + ((time % 7200) / 7200) * (WIDTH + 160)
  const points = []

  for (let x = 0; x <= WIDTH; x += 4) {
    const distance = x - pulse
    const envelope = Math.exp(-Math.pow(distance / 34, 2))
    const idle = Math.sin(x * 0.055 - time * 0.00065) * 0.65
    const wave = Math.sin(distance * 0.24) * envelope * 15
    const proximity = Math.exp(-Math.pow((x - cursor) / 48, 2))
    const disturbance = Math.sin((x - cursor) * 0.18 - time * 0.003) * proximity * energy * 12
    const edge = Math.min(1, x / 32, (WIDTH - x) / 32)
    const y = CENTER + (idle + wave + disturbance) * edge
    points.push(`${x === 0 ? 'M' : 'L'}${x},${y.toFixed(2)}`)
  }

  return points.join(' ')
}

const restingSignal = signalPath(3600, WIDTH / 2, 0)

export default function HeroSignal({ active = true }) {
  const containerRef = useRef(null)
  const pathRef = useRef(null)
  const elapsedRef = useRef(3600)
  const pointerRef = useRef({ x: WIDTH / 2, active: false })
  const energyRef = useRef(0)
  const reduceMotion = useReducedMotion()
  const inView = useInView(containerRef)

  useEffect(() => {
    if (!active || reduceMotion || !inView) return
    let frame
    let previous = performance.now()
    let lastDraw = 0

    const animate = (now) => {
      elapsedRef.current += Math.min(now - previous, 64)
      previous = now

      if (now - lastDraw >= 1000 / 30) {
        const pointer = pointerRef.current
        energyRef.current += ((pointer.active ? 1 : 0) - energyRef.current) * 0.12
        pathRef.current.setAttribute('d', signalPath(elapsedRef.current, pointer.x, energyRef.current))
        lastDraw = now
      }

      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [active, reduceMotion, inView])

  const disturbSignal = (event) => {
    if (reduceMotion || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerRef.current = { x: ((event.clientX - bounds.left) / bounds.width) * WIDTH, active: true }
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="hero-signal h-16 w-full max-w-[28rem] text-paper"
      onPointerMove={disturbSignal}
      onPointerLeave={() => { pointerRef.current.active = false }}
    >
      <svg viewBox="0 0 520 72" preserveAspectRatio="none" className="h-full w-full" fill="none">
        <path d="M0 36H520" stroke="currentColor" strokeOpacity="0.1" vectorEffect="non-scaling-stroke" />
        <path ref={pathRef} d={restingSignal} stroke="currentColor" strokeOpacity="0.7" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  )
}
