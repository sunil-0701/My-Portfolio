import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import usePageVisible from '../../hooks/usePageVisible'

const WIDTH = 480
const HEIGHT = 132
const GROUND = 110
const DINO_X = 30
const BEST_KEY = 'portfolio:dino-best'
const bitmap = [
  '000000111111', '000000110111', '000000111111', '000000111100',
  '100001111100', '110011111000', '111111111100', '011111110100',
  '001111100000', '000111100000',
]

const newRun = () => ({ y: 0, velocity: 0, distance: 0, elapsed: 0, nextSpawn: 1.1, obstacles: [] })
const scoreOf = (game) => Math.min(99999, Math.floor(game.distance / 12))
const digits = (score) => String(score).padStart(5, '0')

function readBest() {
  try {
    const value = Number(localStorage.getItem(BEST_KEY))
    return Number.isInteger(value) && value >= 0 && value <= 99999 ? value : 0
  } catch {
    return 0
  }
}

function draw(context, game, color, reducedMotion) {
  context.clearRect(0, 0, WIDTH, HEIGHT)
  context.fillStyle = color
  context.strokeStyle = color
  context.globalAlpha = 0.25
  context.lineWidth = 1
  context.beginPath()
  context.moveTo(0, GROUND + 0.5)
  context.lineTo(WIDTH, GROUND + 0.5)
  context.stroke()
  if (!reducedMotion) {
    for (let x = -56; x < WIDTH; x += 56) {
      context.fillRect(Math.round(x - game.distance % 56), GROUND + 7, 9, 1)
    }
  }
  context.globalAlpha = 0.85
  const y = Math.round(GROUND - 26 + game.y)
  bitmap.forEach((row, rowIndex) => {
    for (let column = 0; column < row.length; column++) {
      if (row[column] === '1') context.fillRect(DINO_X + column * 2, y + rowIndex * 2, 2, 2)
    }
  })
  const stride = game.y < 0 || reducedMotion ? 0 : Math.floor(game.elapsed * 10) % 2
  context.fillRect(DINO_X + 8, y + 20, 2, stride ? 3 : 6)
  context.fillRect(DINO_X + 8, y + (stride ? 22 : 25), 5, 1)
  context.fillRect(DINO_X + 14, y + 20, 2, stride ? 6 : 3)
  context.fillRect(DINO_X + 14, y + (stride ? 25 : 22), 5, 1)
  game.obstacles.forEach((obstacle) => {
    const x = Math.round(obstacle.x)
    const top = GROUND - obstacle.height
    const middle = x + Math.floor(obstacle.width / 2) - 2
    context.fillRect(middle, top, 4, obstacle.height)
    context.fillRect(x, top + 7, 3, 8)
    context.fillRect(x, top + 12, middle - x + 2, 3)
    context.fillRect(x + obstacle.width - 3, top + 4, 3, 8)
    context.fillRect(middle, top + 9, obstacle.width / 2, 3)
  })
  context.globalAlpha = 1
}

export default function DinoGame({ active = true, onClose }) {
  const [phase, setPhase] = useState('ready')
  const [best, setBest] = useState(readBest)
  const [finalScore, setFinalScore] = useState(0)
  const [canvasUnavailable, setCanvasUnavailable] = useState(false)
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const scoreRef = useRef(null)
  const gameRef = useRef(newRun())
  const bestRef = useRef(best)
  const fallbackButtonRef = useRef(null)
  const inView = useInView(containerRef)
  const pageVisible = usePageVisible()
  const gameActive = active && pageVisible
  const paused = phase === 'paused' || (phase === 'running' && (!gameActive || !inView))

  useEffect(() => { canvasRef.current?.focus({ preventScroll: true }) }, [])

  useEffect(() => {
    if (canvasUnavailable) fallbackButtonRef.current?.focus({ preventScroll: true })
  }, [canvasUnavailable])

  useEffect(() => {
    const syncBest = (event) => {
      if (event.key !== BEST_KEY && event.key !== null) return
      const saved = readBest()
      bestRef.current = saved
      setBest(saved)
    }
    window.addEventListener('storage', syncBest)
    return () => window.removeEventListener('storage', syncBest)
  }, [])

  useEffect(() => {
    if (canvasUnavailable) return
    const canvas = canvasRef.current
    let context
    try { context = canvas.getContext('2d') } catch { /* Some browsers disable canvas rendering. */ }
    if (!context) {
      setCanvasUnavailable(true)
      return
    }
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = WIDTH * ratio
    canvas.height = HEIGHT * ratio
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.imageSmoothingEnabled = false
    const color = getComputedStyle(canvas).color
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
    draw(context, gameRef.current, color, reducedMotion)
    if (phase !== 'running' || !gameActive || !inView) return
    let frame
    let previous = performance.now()

    const tick = (now) => {
      const delta = Math.min((now - previous) / 1000, 0.034)
      previous = now
      const game = gameRef.current
      const speed = 225 + Math.min(scoreOf(game) * 0.35, 195)
      game.elapsed += delta
      game.distance += speed * delta
      game.velocity += 1100 * delta
      game.y = Math.min(0, game.y + game.velocity * delta)
      if (game.y === 0) game.velocity = 0
      game.nextSpawn -= delta
      if (game.nextSpawn <= 0) {
        game.obstacles.push({ x: WIDTH + 20, width: 12 + Math.floor(Math.random() * 13), height: 22 + Math.floor(Math.random() * 13) })
        game.nextSpawn = 0.85 - Math.min(scoreOf(game) * 0.0004, 0.15) + Math.random() * 0.45
      }
      game.obstacles.forEach((obstacle) => { obstacle.x -= speed * delta })
      game.obstacles = game.obstacles.filter((obstacle) => obstacle.x + obstacle.width > 0)
      const score = scoreOf(game)
      scoreRef.current.textContent = digits(score)
      draw(context, game, color, reducedMotion)
      const collided = game.obstacles.some((obstacle) =>
        DINO_X + 20 > obstacle.x + 2 && DINO_X + 4 < obstacle.x + obstacle.width - 2 &&
        GROUND + game.y - 2 > GROUND - obstacle.height + 3,
      )
      if (collided) {
        const storedBest = readBest()
        const nextBest = Math.max(score, bestRef.current, storedBest)
        if (nextBest !== bestRef.current) {
          bestRef.current = nextBest
          setBest(nextBest)
        }
        if (nextBest > storedBest) {
          try { localStorage.setItem(BEST_KEY, String(nextBest)) } catch { /* Play still works without storage. */ }
        }
        setFinalScore(score)
        setPhase('over')
        return
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [gameActive, inView, phase, canvasUnavailable])

  const jump = () => {
    if (!gameActive || !inView || phase === 'paused') return
    if (phase === 'ready' || phase === 'over') {
      gameRef.current = newRun()
      scoreRef.current.textContent = digits(0)
      setPhase('running')
    }
    if (gameRef.current.y === 0) gameRef.current.velocity = -350
    canvasRef.current?.focus({ preventScroll: true })
  }

  const togglePause = () => {
    setPhase((current) => current === 'paused' ? 'running' : current === 'running' ? 'paused' : current)
    canvasRef.current?.focus({ preventScroll: true })
  }

  if (canvasUnavailable) {
    return (
      <div className="flex h-full items-center justify-between gap-3 font-mono text-xs text-muted">
        <p role="status">This browser can’t render the game.</p>
        <button ref={fallbackButtonRef} type="button" onClick={onClose} className="min-h-11 px-2 underline underline-offset-4">Back to contours</button>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full font-mono text-paper"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && !event.ctrlKey && !event.metaKey && !event.altKey) {
          event.stopPropagation()
          onClose()
        }
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex min-h-11 items-start justify-between gap-2 text-[0.6rem] uppercase tracking-[0.08em]">
        <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 tabular">
          <span><span className="sr-only">Score </span><span ref={scoreRef}>00000</span></span>
          <span className="text-muted">Best <span>{digits(best)}</span></span>
        </div>
        <div className="pointer-events-auto flex items-center">
          <button type="button" onClick={togglePause} disabled={phase === 'ready' || phase === 'over'} aria-label={paused ? 'Resume game' : 'Pause game'} className="inline-flex h-11 w-11 items-center justify-center text-muted hover:text-paper disabled:opacity-30">
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor">{paused ? <path d="M3 1L10 6L3 11V1Z" /> : <path d="M4 1V11M8 1V11" />}</svg>
          </button>
          <button type="button" onClick={onClose} aria-label="Close game and return to contours" className="inline-flex h-11 w-11 items-center justify-center text-muted hover:text-paper">
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" stroke="currentColor"><path d="M2 2L10 10M10 2L2 10" /></svg>
          </button>
        </div>
      </div>
      <div className="absolute inset-0">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          tabIndex={0}
          role="application"
          aria-label="Dino runner. Space or Arrow Up to jump. P to pause. Escape to close."
          className="dino-canvas block h-full w-full touch-manipulation object-contain"
          onPointerDown={(event) => {
            if (event.button !== 0 || !event.isPrimary) return
            event.preventDefault()
            jump()
          }}
          onBlur={(event) => {
            if (phase === 'running' && !containerRef.current.contains(event.relatedTarget)) setPhase('paused')
          }}
          onKeyDown={(event) => {
            if (event.ctrlKey || event.metaKey || event.altKey) return
            if (['Space', 'ArrowUp', 'KeyP', 'Escape'].includes(event.code)) event.preventDefault()
            if ((event.code === 'Space' || event.code === 'ArrowUp') && !event.repeat) {
              if (phase === 'paused') togglePause()
              else jump()
            }
            if (event.code === 'KeyP' && !event.repeat) togglePause()
          }}
        >Dino runner: jump over the cacti using Space, Arrow Up, or tap.</canvas>
        {(phase !== 'running' || paused) && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <button type="button" onClick={paused ? togglePause : jump} className="pointer-events-auto min-h-11 bg-ink/90 px-4 text-[0.65rem] uppercase tracking-[0.12em] text-paper">
              {paused ? 'Resume' : phase === 'over' ? 'Play again' : 'Start run'}
            </button>
          </div>
        )}
      </div>
      <p role="status" className="sr-only">{phase === 'over' ? `Game over. Score ${finalScore}. Best on this device ${best}.` : paused ? 'Game paused.' : phase === 'running' ? 'Run started.' : 'Ready to play.'}</p>
    </div>
  )
}
