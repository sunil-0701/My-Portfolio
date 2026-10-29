import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import HeroContours from './HeroContours'

function GameUnavailable({ onClose }) {
  return (
    <div className="flex h-full items-center justify-between gap-3 font-mono text-xs text-muted">
      <span>The game couldn’t load.</span>
      <button type="button" onClick={onClose} className="min-h-11 px-2 underline underline-offset-4">Back</button>
    </div>
  )
}

let gameModule
const loadGame = () => {
  gameModule ??= import('./DinoGame').catch(() => ({ default: GameUnavailable }))
  return gameModule
}
const DinoGame = lazy(loadGame)

export default function HeroPlayground({ active = true }) {
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const reduceMotion = useReducedMotion()
  const playButtonRef = useRef(null)
  const openedRef = useRef(false)
  const requestRef = useRef(0)
  const pendingRef = useRef(false)

  useEffect(() => () => { requestRef.current += 1 }, [])

  useEffect(() => {
    if (!playing && openedRef.current) playButtonRef.current?.focus({ preventScroll: true })
  }, [playing])

  const close = () => setPlaying(false)
  const open = async () => {
    if (pendingRef.current) return
    pendingRef.current = true
    const request = ++requestRef.current
    setLoading(true)
    await loadGame()
    if (request !== requestRef.current) return
    pendingRef.current = false
    openedRef.current = true
    setPlaying(true)
    setLoading(false)
  }
  const transition = { duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }

  return (
    <div className="hero-playground relative h-20 w-full max-w-[28rem]">
      <motion.div
        className="absolute inset-0 flex items-center"
        initial={false}
        animate={{ opacity: playing ? 0 : 1, y: playing ? -4 : 0 }}
        transition={transition}
        inert={playing}
        aria-hidden={playing}
        style={{ pointerEvents: playing ? 'none' : 'auto' }}
      >
        <HeroContours active={active && !playing} />
        <button
          ref={playButtonRef}
          type="button"
          aria-label="Play Dino"
          onClick={open}
          disabled={loading}
          aria-busy={loading}
          className="absolute -bottom-3 right-0 inline-flex min-h-11 items-center gap-2 px-2 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-muted transition-colors hover:text-paper disabled:opacity-50"
        >
          <svg aria-hidden="true" width="9" height="10" viewBox="0 0 9 10" fill="none"><path d="M1 1L8 5L1 9V1Z" stroke="currentColor" strokeWidth="0.8" /></svg>
          Play
        </button>
        {loading && <span role="status" className="sr-only">Loading game…</span>}
      </motion.div>
      <AnimatePresence initial={false}>
        {playing && (
          <motion.div
            key="game"
            className="absolute inset-0"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6, pointerEvents: 'none' }}
            transition={transition}
          >
            <Suspense fallback={null}>
              <DinoGame active={active} onClose={close} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
