import { motion } from 'framer-motion'
import Button, { ArrowRight } from '../ui/Button'
import { SITE } from '../../config/site'

const cubicEase = [0.16, 1, 0.3, 1]

// One stack, one staggered cascade — nothing mounts all at once.
const stack = {
  hidden: {},
  show: { transition: { delayChildren: 0.08, staggerChildren: 0.06 } },
}

// Keep the staggered reveal, but only animate opacity and transform. Blurring
// the large heading on every entrance frame made the reveal much more costly.
const rise = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: cubicEase },
  },
}

const nameVariant = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: cubicEase },
  },
}

export default function HeroContent({ ready = true }) {
  return (
    <motion.div
      variants={stack}
      initial="hidden"
      animate={ready ? 'show' : 'hidden'}
      className="hero-copy flex w-full min-w-0 max-w-[44rem] flex-col"
    >
      {/* Greeting */}
      <motion.p
        variants={rise}
        className="mb-4 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-paper sm:text-[0.85rem]"
      >
        <span aria-hidden="true" className="mr-3">&gt;</span>
        {SITE.greeting}
      </motion.p>

      {/* The punctuation reserves its own space, so blinking cannot shift the name. */}
      <motion.h1
        variants={nameVariant}
        id="hero-heading"
        className="hero-name font-display font-bold uppercase text-paper"
      >
        <span className="block">{SITE.firstName}</span>
        <span className="block whitespace-nowrap">
          {SITE.lastName}
          <span
            aria-hidden="true"
            className="name-period"
            data-blinking={ready}
          >.</span>
        </span>
      </motion.h1>

      {/* Static expertise matches the reference and never rotates out of view. */}
      <motion.div
        variants={rise}
        className="mt-6 mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.65rem] uppercase tracking-[0.06em] sm:text-[0.8rem]"
      >
        <span aria-hidden="true" className="text-faint">[</span>
        {SITE.expertise.map((item, index) => (
          <span key={item} className="inline-flex items-center gap-3">
            {index > 0 && <span aria-hidden="true" className="text-faint">|</span>}
            {item}
          </span>
        ))}
        <span aria-hidden="true" className="text-faint">]</span>
      </motion.div>

      {/* Supporting sentence — sentence case, measured, readable */}
      <motion.p
        variants={rise}
        className="mb-9 max-w-[50ch] text-[0.85rem] font-normal leading-[1.8] tracking-[0.025em] text-paper/90 [text-wrap:pretty] sm:text-[0.9rem] xl:mb-10 xl:text-[0.95rem]"
      >
        {SITE.summary}
      </motion.p>

      <motion.div variants={rise} className="flex flex-wrap items-center gap-4 lg:gap-6">
        <Button href={SITE.github} target="_blank" rel="noreferrer" variant="outline" icon={<ArrowRight />}>
          View work
        </Button>
        <Button href={`mailto:${SITE.email}`} variant="outline" icon={<ArrowRight />}>
          Get in touch
        </Button>
      </motion.div>
    </motion.div>
  )
}
