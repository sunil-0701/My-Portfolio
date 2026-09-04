import { motion } from 'framer-motion'
import RoleReel from './RoleReel'
import Button, { ArrowRight } from '../ui/Button'
import { SITE } from '../../config/site'

const cubicEase = [0.16, 1, 0.3, 1]

// One stack, one staggered cascade — nothing mounts all at once.
const stack = {
  hidden: {},
  show: { transition: { delayChildren: 0.12, staggerChildren: 0.1 } },
}

// Entries resolve out of a blur rather than simply sliding, which reads as
// depth of field settling instead of a panel moving.
const rise = {
  hidden: { opacity: 0, y: 26, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.1, ease: cubicEase },
  },
}

const nameVariant = {
  hidden: { opacity: 0, y: 40, filter: 'blur(14px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.35, ease: cubicEase },
  },
}

function StatusBadge() {
  return (
    <span className="inline-flex items-center gap-2.5 border border-white/[0.13] bg-white/[0.03] px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${
          SITE.available ? 'animate-signal bg-signal' : 'bg-faint'
        }`}
      />
      <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
        {SITE.available ? SITE.availableLabel : 'Not currently available'}
      </span>
    </span>
  )
}

export default function HeroContent({ ready = true }) {
  return (
    <motion.div
      variants={stack}
      initial="hidden"
      animate={ready ? 'show' : 'hidden'}
      className="flex max-w-[46rem] flex-col"
    >
      {/* Greeting */}
      <motion.p
        variants={rise}
        className="mb-5 font-mono text-[0.68rem] uppercase tracking-[0.26em] text-muted sm:text-[0.72rem]"
      >
        {SITE.greeting}
      </motion.p>

      {/* Name. The size is capped by viewport height as well as width so the
          hero still resolves in one screen on a short laptop viewport. */}
      <motion.h1
        variants={nameVariant}
        id="hero-heading"
        className="font-display text-[clamp(3.4rem,min(10.5vw,17vh),9.5rem)] font-normal uppercase leading-[0.86] text-[#eeeeec] [text-shadow:0_0_44px_rgba(255,255,255,0.13)] [text-wrap:balance]"
      >
        <span className="block tracking-[0.11em]">{SITE.firstName}</span>
        <span className="block tracking-[0.11em]">
          {SITE.lastName}
          <span
            aria-hidden="true"
            className="animate-blink-period ml-[0.08em] inline-block h-[0.1em] w-[0.1em] rounded-full bg-signal align-baseline shadow-[0_0_14px_rgba(143,179,163,0.55)]"
          />
        </span>
      </motion.h1>

      {/* Role reel. Separated by space rather than a rule — the reel is the
          punctuation between the name and the sentence. */}
      <motion.div
        variants={rise}
        className="mt-9 mb-6 font-mono text-[0.72rem] uppercase tracking-[0.26em] sm:text-[0.78rem]"
      >
        <RoleReel roles={SITE.roles} />
      </motion.div>

      {/* Supporting sentence — sentence case, measured, readable */}
      <motion.p
        variants={rise}
        className="mb-9 max-w-[46ch] text-[0.95rem] font-normal leading-[1.75] text-[#a8a8ad] [text-wrap:pretty] sm:text-[1rem]"
      >
        {SITE.summary}
      </motion.p>

      {/* Actions — one solid, one quiet text link. Both go somewhere real. */}
      <motion.div variants={rise} className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <Button href={`mailto:${SITE.email}`} variant="solid" icon={<ArrowRight />}>
          Get in touch
        </Button>
        <Button href={SITE.github} target="_blank" rel="noreferrer" variant="quiet">
          View GitHub
        </Button>
      </motion.div>

      {/* Status + place */}
      <motion.div
        variants={rise}
        className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3"
      >
        <StatusBadge />
        <span className="tabular font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
          {SITE.location} · {SITE.timezone}
        </span>
      </motion.div>
    </motion.div>
  )
}
