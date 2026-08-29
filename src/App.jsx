import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import PageLoader from './components/PageLoader'
import NavBar from './components/layout/NavBar'
import Landing from './sections/Landing'

function App() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      <AnimatePresence>
        {loading && <PageLoader onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <NavBar activeLink="Home" />

      <main>
        <Landing />
      </main>
    </>
  )
}

export default App
