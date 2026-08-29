import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import portrait from '../assets/profile-portrait.jpg'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
}

const ArrowIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M17 7H8M17 7V16" />
  </svg>
)

export default function Landing() {
  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-ink text-paper"
    >
      {/* Portrait panel */}
      <div className="absolute inset-y-0 right-0 w-full sm:w-[64%] lg:w-[52%]">
        <img
          src={portrait}
          alt="Portrait of Sunil Amarthya"
          className="h-full w-full object-cover object-[center_top] grayscale-[8%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, #0a0a0b 0%, rgba(10,10,11,0.88) 12%, rgba(10,10,11,0.4) 32%, transparent 56%)',
          }}
        />
        <div className="absolute inset-0 bg-ink/55 sm:hidden" />
      </div>

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex min-h-screen max-w-[520px] flex-col justify-center gap-7 px-6 pb-24 pt-28 sm:px-10 sm:pt-0 lg:px-16"
      >
        <motion.div variants={fadeUp} className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          Hello, I'm
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-display text-6xl font-normal uppercase leading-[1.05] tracking-[0.08em] text-paper sm:text-7xl lg:text-[84px]"
        >
          Sunil
          <br />
          Amarthya.
        </motion.h1>

        <motion.span variants={fadeUp} className="h-px w-12 bg-white/25" />

        <motion.div
          variants={fadeUp}
          className="flex flex-col gap-1.5 font-display text-[13px] font-normal uppercase tracking-[0.12em] text-muted"
        >
          <span>Backend Engineer</span>
          <span>Building Scalable Systems</span>
          <span>That Solve Real Problems.</span>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-2">
          <Button variant="secondary" icon={ArrowIcon}>
            Explore My Work
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="absolute bottom-10 left-6 z-10 flex items-end gap-3 sm:left-10 lg:left-16"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-paper" />
          <span className="h-9 w-px bg-white/30" />
        </div>
        <span className="pb-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-faint">
          Scroll Down
        </span>
      </motion.div>
    </section>
  )
}
