import { motion } from 'framer-motion'
import HeroBackground from '../components/hero/HeroBackground'
import HeroPortrait from '../components/hero/HeroPortrait'
import HeroContent from '../components/hero/HeroContent'
import { SITE } from '../config/site'

export default function Landing({ ready = true }) {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative min-h-dvh w-full overflow-hidden bg-ink text-paper"
    >
      <HeroBackground />
      <HeroPortrait ready={ready} />

      <div aria-hidden="true" className="pointer-events-none absolute top-[20%] right-[4.5%] bottom-[18%] hidden w-[10%] border-r border-paper/20 lg:block">
        <span className="absolute top-0 left-0 h-12 w-px bg-paper/30" />
        <p className="absolute top-[24%] left-4 font-mono text-[0.65rem] leading-6 tracking-[0.15em] text-faint">IDEAS<br />SYSTEMS<br />CODE<br />IMPACT</p>
        <span className="absolute top-[60%] right-0 h-px w-24 bg-paper/35" />
        <span className="absolute top-[60%] -right-1 h-2 w-2 -translate-y-1/2 border border-paper" />
      </div>

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

        <motion.div
          className="hero-rail flex flex-wrap items-center justify-between gap-4 font-mono text-[0.6rem] uppercase tracking-[0.13em] text-muted sm:text-[0.65rem]"
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <span>// Design &gt; Code &gt; Build &gt; Repeat</span>
          <span aria-hidden="true" className="hidden h-px flex-1 bg-paper/25 sm:block" />
          <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center hover:text-paper">
            GitHub <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center hover:text-paper">
            LinkedIn <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
          </a>
          <span>© {new Date().getFullYear()}</span>
        </motion.div>
      </div>
    </section>
  )
}
