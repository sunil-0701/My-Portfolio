import { useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import PageLoader from './components/PageLoader'
import NavBar from './components/layout/NavBar'
import Landing from './sections/Landing'
import { rememberIntro, shouldShowIntro } from './utils/intro'

function App() {
  const [loading, setLoading] = useState(shouldShowIntro)

  const finishIntro = () => {
    rememberIntro()
    setLoading(false)
  }

  // The hero holds its entry until the curtain lifts. Without this the whole
  // cascade plays out behind the loader and the page just appears, finished.
  const ready = !loading

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {loading && <PageLoader onDone={finishIntro} />}
      </AnimatePresence>

      <div inert={loading}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <NavBar activeLink="HOME" ready={ready} />

        <main id="main" tabIndex={-1}>
          <Landing ready={ready} />
        </main>
      </div>
    </MotionConfig>
  )
}

export default App
