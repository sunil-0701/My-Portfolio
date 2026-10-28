import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import HeroContours from './HeroContours'

function GameUnavailable({ onClose }) {
  return (
    <div className="flex min-h-20 items-center justify-between gap-3 font-mono text-xs text-muted">
      <span>The game couldn’t load.</span>
      <button type="button" onClick={onClose} className="min-h-11 px-2 underline underline-offset-4">Back</button>
    </div>
  )
}

const DinoGame = lazy(() => import('./DinoGame').catch(() => ({ default: GameUnavailable })))

export default function HeroPlayground({ active = true }) {
  const [playing, setPlaying] = useState(false)
  const playButtonRef = useRef(null)
  const openedRef = useRef(false)

  useEffect(() => {
    if (!playing && openedRef.current) playButtonRef.current?.focus({ preventScroll: true })
  }, [playing])

  const close = () => setPlaying(false)

  return (
    <div className="hero-playground relative w-full max-w-[28rem]">
      {playing ? (
        <Suspense fallback={
          <div className="flex min-h-20 items-center justify-between font-mono text-xs text-muted">
            <span role="status">Loading game…</span>
            <button type="button" onClick={close} className="min-h-11 px-2">Cancel</button>
          </div>
        }>
          <DinoGame active={active} onClose={close} />
        </Suspense>
      ) : (
        <>
          <HeroContours active={active} />
          <button
            ref={playButtonRef}
            type="button"
            aria-label="Play Dino"
            onClick={() => { openedRef.current = true; setPlaying(true) }}
            className="absolute -bottom-3 right-0 inline-flex min-h-11 items-center gap-2 px-2 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-muted transition-colors hover:text-paper"
          >
            <svg aria-hidden="true" width="9" height="10" viewBox="0 0 9 10" fill="none"><path d="M1 1L8 5L1 9V1Z" stroke="currentColor" strokeWidth="0.8" /></svg>
            Play
          </button>
        </>
      )}
    </div>
  )
}
