import { motion } from 'framer-motion'
import Button, { ArrowRight } from '../ui/Button'
import ConnectionNotice from '../ConnectionNotice'
import HeroRoles from './HeroRoles'
import HeroPlayground from './HeroPlayground'
import usePageVisible from '../../hooks/usePageVisible'
import { SITE } from '../../config/site'

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
        tabIndex={-1}
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
            data-blinking={ready && pageVisible}
          >.</span>
        </span>
      </motion.h1>

      <motion.div
        variants={rise}
        className="my-6 font-mono text-[0.65rem] uppercase tracking-[0.06em] sm:text-[0.8rem]"
      >
        <HeroRoles ready={ready} active={ready && pageVisible} />
      </motion.div>

      <motion.div variants={rise} className="mb-9 xl:mb-10">
        <HeroPlayground active={ready && pageVisible} />
      </motion.div>

      <motion.div variants={rise} className="flex flex-wrap items-center gap-4 lg:gap-6">
        <Button href="#work" variant="outline" icon={<ArrowRight />}>
          View work
        </Button>
        <Button href="#contact" variant="outline" icon={<ArrowRight />}>
          Get in touch
        </Button>
      </motion.div>
      <ConnectionNotice />
    </motion.div>
  )
}
