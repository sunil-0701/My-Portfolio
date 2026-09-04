import { motion } from 'framer-motion'
import HeroBackground from '../components/hero/HeroBackground'
import HeroPortrait from '../components/hero/HeroPortrait'
import HeroContent from '../components/hero/HeroContent'
import ScrollIndicator from '../components/hero/ScrollIndicator'
import SocialLinks from '../components/layout/SocialLinks'

export default function Landing({ ready = true }) {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative min-h-dvh w-full overflow-hidden bg-ink text-paper"
    >
      <HeroBackground />
      <HeroPortrait ready={ready} />

      {/* Floor fade. Full-bleed and elliptical on purpose: boxed to the
          portrait it read as a rectangular shadow slab under the photo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[var(--z-behind)] h-[42%]"
        style={{
          background:
            'radial-gradient(ellipse 120% 100% at 62% 118%, #020304 30%, rgba(2,3,4,0.72) 58%, transparent 82%)',
        }}
      />

      {/* Constrained container so the layout stops stretching on wide screens.
          Bottom padding runs heavier than top — optical, not mathematical. */}
      <div className="hero-shell relative z-[var(--z-content)] mx-auto flex min-h-dvh max-w-[1440px] flex-col px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="flex flex-1 items-center">
          <HeroContent ready={ready} />
        </div>

        {/* Baseline rail — fills the frame instead of leaving a dead band */}
        <motion.div
          className="hero-rail flex items-end justify-between gap-6"
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <ScrollIndicator />
          <SocialLinks orientation="horizontal" />
        </motion.div>
      </div>
    </section>
  )
}
