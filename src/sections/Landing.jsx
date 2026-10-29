import { motion } from 'framer-motion'
import HeroBackground from '../components/hero/HeroBackground'
import HeroPortrait from '../components/hero/HeroPortrait'
import HeroContent from '../components/hero/HeroContent'
import HeroLinework from '../components/hero/HeroLinework'
import { SITE } from '../config/site'
import ExternalLink from '../components/ui/ExternalLink'

export default function Landing({ ready = true }) {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative min-h-dvh w-full overflow-hidden bg-ink text-paper"
    >
      <HeroBackground />
      <HeroPortrait ready={ready} />

      <HeroLinework ready={ready} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[var(--z-behind)] h-[42%]"
        style={{
          background:
            'radial-gradient(ellipse 120% 100% at 62% 125%, #0b0c0a 25%, rgba(11,12,10,0.6) 55%, transparent 82%)',
        }}
      />

      <div className="hero-shell relative z-[var(--z-content)] mx-auto flex min-h-dvh max-w-[1800px] flex-col px-6 sm:px-10 lg:pr-20">
        <div className="flex flex-1 items-center">
          <HeroContent ready={ready} />
        </div>

        <motion.footer
          aria-label="Profile links"
          className="hero-rail flex flex-wrap items-center gap-6 font-mono text-[0.6rem] uppercase tracking-[0.13em] text-muted sm:text-[0.65rem]"
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <ExternalLink href={SITE.github}>GitHub</ExternalLink>
          <ExternalLink href={SITE.linkedin}>LinkedIn</ExternalLink>
        </motion.footer>
      </div>
    </section>
  )
}
