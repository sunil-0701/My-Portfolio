import { useEffect, useRef } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

const vertices = [
  [-30, -30, -30], [30, -30, -30], [30, 30, -30], [-30, 30, -30],
  [-30, -30, 30], [30, -30, 30], [30, 30, 30], [-30, 30, 30],
]
const edges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]]

function project(yaw, pitch) {
  return vertices.map(([x, y, z]) => {
    const rotatedX = x * Math.cos(yaw) + z * Math.sin(yaw)
    const rotatedZ = z * Math.cos(yaw) - x * Math.sin(yaw)
    const rotatedY = y * Math.cos(pitch) - rotatedZ * Math.sin(pitch)
    const depth = y * Math.sin(pitch) + rotatedZ * Math.cos(pitch)
    const perspective = 320 / (320 + depth)
    return [260 + rotatedX * perspective, 56 + rotatedY * perspective, depth]
  })
}

const restingVertices = project(-0.55, 0.35)

export default function HeroWireframe({ active = true }) {
  const containerRef = useRef(null)
  const edgesRef = useRef([])
  const elapsedRef = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0 })
  const tiltRef = useRef({ x: 0, y: 0 })
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
        const tilt = tiltRef.current
        tilt.x += (pointerRef.current.x - tilt.x) * 0.08
        tilt.y += (pointerRef.current.y - tilt.y) * 0.08
        const points = project(-0.55 + elapsedRef.current * Math.PI * 2 / 26000 + tilt.x, 0.35 + tilt.y)

        edges.forEach(([start, end], index) => {
          const edge = edgesRef.current[index]
          edge.setAttribute('x1', points[start][0])
          edge.setAttribute('y1', points[start][1])
          edge.setAttribute('x2', points[end][0])
          edge.setAttribute('y2', points[end][1])
          edge.setAttribute('stroke-opacity', 0.38 - (points[start][2] + points[end][2]) / 300)
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
      className="h-28 w-full max-w-[28rem] text-paper"
      onPointerMove={(event) => {
        if (reduceMotion || event.pointerType === 'touch') return
        const bounds = event.currentTarget.getBoundingClientRect()
        pointerRef.current = {
          x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.8,
          y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.55,
        }
      }}
      onPointerLeave={() => { pointerRef.current = { x: 0, y: 0 } }}
    >
      <svg viewBox="0 0 520 112" className="h-full w-full overflow-visible" fill="none">
        {edges.map(([start, end], index) => (
          <line
            key={index}
            ref={(element) => { edgesRef.current[index] = element }}
            x1={restingVertices[start][0]}
            y1={restingVertices[start][1]}
            x2={restingVertices[end][0]}
            y2={restingVertices[end][1]}
            stroke="currentColor"
            strokeOpacity={0.38 - (restingVertices[start][2] + restingVertices[end][2]) / 300}
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  )
}
