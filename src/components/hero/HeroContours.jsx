import { useEffect, useRef } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

function contourPath(row, time, pointer, energy) {
  const points = []
  for (let x = 0; x <= 520; x += 8) {
    const edge = Math.sin((x / 520) * Math.PI)
    const flow = Math.sin(x * 0.009 + time * 0.00022 + row * 0.14) * 11
    const proximity = Math.exp(-Math.pow((x - pointer.x) / 90, 2))
    const bend = ((pointer.y - 44) * 0.28 + Math.sin(row * 0.7 + time * 0.001) * 3) * proximity * energy
    const y = 44 + (row - 3) * 6 + (flow + bend) * edge
    points.push(`${x === 0 ? 'M' : 'L'}${x},${y.toFixed(2)}`)
  }
  return points.join(' ')
}

const restingPointer = { x: 260, y: 44, active: false }

export default function HeroContours({ active = true }) {
  const containerRef = useRef(null)
  const pathsRef = useRef([])
  const pointerRef = useRef({ ...restingPointer })
  const energyRef = useRef(0)
  const elapsedRef = useRef(0)
  const reduceMotion = useReducedMotion()
  const inView = useInView(containerRef)

  useEffect(() => {
    if (reduceMotion) {
      pointerRef.current = { ...restingPointer }
      energyRef.current = 0
      pathsRef.current.forEach((path, row) => {
        path?.setAttribute('d', contourPath(row, 0, restingPointer, 0))
      })
      return
    }
    if (!active || !inView) return
    let frame
    let previous = performance.now()
    let lastDraw = 0

    const animate = (now) => {
      elapsedRef.current += Math.min(now - previous, 64)
      previous = now
      if (now - lastDraw >= 1000 / 30) {
        const pointer = pointerRef.current
        energyRef.current += ((pointer.active ? 1 : 0) - energyRef.current) * 0.1
        pathsRef.current.forEach((path, row) => {
          path.setAttribute('d', contourPath(row, elapsedRef.current, pointer, energyRef.current))
        })
        lastDraw = now
      }
      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [active, reduceMotion, inView])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="h-20 w-full max-w-[28rem] text-paper"
      onPointerMove={(event) => {
        if (reduceMotion || event.pointerType === 'touch') return
        const bounds = event.currentTarget.getBoundingClientRect()
        pointerRef.current = {
          x: ((event.clientX - bounds.left) / bounds.width) * 520,
          y: ((event.clientY - bounds.top) / bounds.height) * 88,
          active: true,
        }
      }}
      onPointerLeave={() => { pointerRef.current.active = false }}
    >
      <svg viewBox="0 0 520 88" preserveAspectRatio="none" className="h-full w-full" fill="none">
        {Array.from({ length: 7 }, (_, row) => (
          <path
            key={row}
            ref={(element) => { pathsRef.current[row] = element }}
            d={contourPath(row, 0, restingPointer, 0)}
            stroke="currentColor"
            strokeWidth="0.75"
            strokeOpacity={0.5 - Math.abs(row - 3) * 0.11}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  )
}
