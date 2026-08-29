import { motion } from 'framer-motion'

const LINKS = ['WORK', 'ABOUT', 'EXPERIENCE', 'CONTACT']

export default function NavBar() {
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-[4vw] pt-[3.5vh]"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
    >
      <div className="flex items-center justify-between">
        {/* Top-Left Logo */}
        <a
          href="#home"
          className="font-display text-[1.4rem] leading-none tracking-[0.05em] text-[#eeeeec] transition-opacity hover:opacity-80"
        >
          SA.
        </a>

        {/* Top-Right Navigation & Dot */}
        <div className="flex items-center gap-10 sm:gap-14 lg:gap-20">
          <nav className="flex items-center gap-10 sm:gap-12 lg:gap-16">
            {LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-[0.7rem] font-medium tracking-[0.22em] text-[#a0a0a5] transition-colors duration-300 hover:text-white sm:text-[0.75rem]"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Tiny circular white indicator at extreme top right */}
          <span
            aria-hidden="true"
            className="h-[5px] w-[5px] rounded-full bg-white shadow-[0_0_6px_1px_rgba(255,255,255,0.7)]"
          />
        </div>
      </div>
    </motion.header>
  )
}

