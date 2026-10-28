import { useEffect, useRef } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

const nodes = [[20, 44], [148, 18], [148, 70], [328, 44], [500, 44]]
const connections = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]]

export default function HeroNetwork({ active = true }) {
  const containerRef = useRef(null)
  const edgesRef = useRef([])
  const nodesRef = useRef([])
  const pulseRef = useRef(null)
  const positionsRef = useRef(nodes.map(([x, y]) => [x, y]))
  const pointerRef = useRef(null)
  const elapsedRef = useRef(0)
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
        const positions = positionsRef.current

        nodes.forEach(([x, y], index) => {
          const influence = pointer ? Math.exp(-Math.pow((pointer.x - x) / 160, 2)) : 0
          const targetX = x + (pointer ? (pointer.x - x) * 0.035 * influence : 0)
          const targetY = y + (pointer ? (pointer.y - y) * 0.12 * influence : 0)
          positions[index][0] += (targetX - positions[index][0]) * 0.12
          positions[index][1] += (targetY - positions[index][1]) * 0.12
          nodesRef.current[index].setAttribute('cx', positions[index][0])
          nodesRef.current[index].setAttribute('cy', positions[index][1])
        })

        connections.forEach(([start, end], index) => {
          const edge = edgesRef.current[index]
          edge.setAttribute('x1', positions[start][0])
          edge.setAttribute('y1', positions[start][1])
          edge.setAttribute('x2', positions[end][0])
          edge.setAttribute('y2', positions[end][1])
        })

        const cycle = elapsedRef.current / 6800
        const phase = cycle % 1
        const route = [0, Math.floor(cycle) % 2 === 0 ? 1 : 2, 3, 4]
        const lengths = route.slice(1).map((node, index) => Math.hypot(
          positions[node][0] - positions[route[index]][0],
          positions[node][1] - positions[route[index]][1],
        ))
        let distance = Math.min(phase / 0.85, 1) * lengths.reduce((sum, length) => sum + length, 0)

        for (let index = 0; index < lengths.length; index++) {
          if (distance <= lengths[index] || index === lengths.length - 1) {
            const progress = Math.min(distance / lengths[index], 1)
            const start = positions[route[index]]
            const end = positions[route[index + 1]]
            pulseRef.current.setAttribute('cx', start[0] + (end[0] - start[0]) * progress)
            pulseRef.current.setAttribute('cy', start[1] + (end[1] - start[1]) * progress)
            break
          }
          distance -= lengths[index]
        }

        pulseRef.current.setAttribute('opacity', phase < 0.85 ? '0.9' : '0')
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
        }
      }}
      onPointerLeave={() => { pointerRef.current = null }}
    >
      <svg viewBox="0 0 520 88" preserveAspectRatio="none" className="h-full w-full" fill="none">
        {connections.map(([start, end], index) => (
          <line key={index} ref={(element) => { edgesRef.current[index] = element }} x1={nodes[start][0]} y1={nodes[start][1]} x2={nodes[end][0]} y2={nodes[end][1]} stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        ))}
        {nodes.map(([x, y], index) => (
          <circle key={index} ref={(element) => { nodesRef.current[index] = element }} cx={x} cy={y} r="3" className="fill-ink" stroke="currentColor" strokeOpacity="0.6" strokeWidth="0.9" vectorEffect="non-scaling-stroke" />
        ))}
        <circle ref={pulseRef} cx="20" cy="44" r="2" fill="currentColor" opacity="0.9" />
      </svg>
    </div>
  )
}
