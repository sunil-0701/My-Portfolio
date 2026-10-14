import { useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import PageLoader from './components/PageLoader'
import NavBar from './components/layout/NavBar'
import Landing from './sections/Landing'

function App() {
  const [loading, setLoading] = useState(true)

  // The hero holds its entry until the curtain lifts. Without this the whole
  // cascade plays out behind the loader and the page just appears, finished.
  const ready = !loading

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <AnimatePresence>
        {loading && <PageLoader onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <NavBar activeLink="HOME" ready={ready} />

      <main id="main" tabIndex={-1}>
        <Landing ready={ready} />
      </main>
    </MotionConfig>
  )
}

export default App
