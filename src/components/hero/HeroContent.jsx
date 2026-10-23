import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Button, { ArrowRight } from '../ui/Button'
import CopyEmail from '../ui/CopyEmail'
import usePageVisible from '../../hooks/usePageVisible'
import { SITE } from '../../config/site'
import { readBlinkPaused, saveBlinkPaused, watchBlinkPaused } from '../../utils/preferences'

const cubicEase = [0.16, 1, 0.3, 1]

const stack = {
  hidden: {},
  show: { transition: { delayChildren: 0.08, staggerChildren: 0.06 } },
}

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
  const pageVisible = usePageVisible()
  const [blinkPaused, setBlinkPaused] = useState(readBlinkPaused)
  useEffect(() => watchBlinkPaused(setBlinkPaused), [])
  const toggleBlink = () => {
    const paused = !blinkPaused
    saveBlinkPaused(paused)
    setBlinkPaused(paused)
  }
  return (
    <motion.div
      variants={stack}
      initial="hidden"
      animate={ready ? 'show' : 'hidden'}
      className="hero-copy flex w-full min-w-0 max-w-[44rem] flex-col"
    >
      <motion.p
        variants={rise}
        className="mb-4 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-paper sm:text-[0.85rem]"
      >
        <span aria-hidden="true" className="mr-3">&gt;</span>
        {SITE.greeting}
      </motion.p>

      <motion.h1
        variants={nameVariant}
        id="hero-heading"
        aria-label={SITE.name}
        className="hero-name font-display font-bold uppercase text-paper"
      >
        <span className="block">{SITE.firstName}</span>
        <span className="block whitespace-nowrap">
          {SITE.lastName}
          <span
            aria-hidden="true"
            className="name-period"
            id="name-period"
            data-blinking={ready && pageVisible && !blinkPaused}
          >.</span>
        </span>
      </motion.h1>

      <motion.div
        variants={rise}
        role="list"
        aria-label="Engineering specialties"
        className="mt-6 mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.65rem] uppercase tracking-[0.06em] sm:text-[0.8rem]"
      >
        <span aria-hidden="true" className="text-faint">[</span>
        {SITE.expertise.map((item, index) => (
          <span key={item} role="listitem" className="inline-flex items-center gap-3">
            {index > 0 && <span aria-hidden="true" className="text-faint">|</span>}
            {item}
          </span>
        ))}
        <span aria-hidden="true" className="text-faint">]</span>
      </motion.div>

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
        <button
          type="button"
          className="blink-toggle min-h-11 items-center px-2 text-[0.65rem] text-muted underline decoration-paper/30 underline-offset-4 hover:text-paper"
          aria-controls="name-period"
          aria-pressed={blinkPaused}
          onClick={toggleBlink}
        >
          Pause blinking dot
        </button>
      </motion.div>
      <motion.div variants={rise}>
        <CopyEmail />
      </motion.div>
    </motion.div>
  )
}
