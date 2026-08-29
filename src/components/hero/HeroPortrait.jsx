import { motion } from 'framer-motion'
import portrait from '../../assets/profile-portrait.jpg'

export default function HeroPortrait() {
  return (
    <motion.div
      className="absolute bottom-0 right-0 z-0 h-full w-[55%] lg:w-[50%] xl:w-[48%]"
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Outer silhouette atmospheric white aura glow behind the portrait */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[52%] top-[40%] h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-55 mix-blend-screen blur-[70px]"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.1) 45%, transparent 75%)',
        }}
      />

      {/* Main Portrait Image with radial mask to dissolve dark-gray photo background into #070708 */}
      <div className="relative h-full w-full">
        <img
          src={portrait}
          alt="Sunil Amarthya"
          className="h-full w-full object-cover object-[48%_20%] filter brightness-[1.02] contrast-[1.06]"
          style={{
            maskImage:
              'radial-gradient(ellipse 68% 85% at 55% 45%, black 35%, transparent 72%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 68% 85% at 55% 45%, black 35%, transparent 72%)',
          }}
        />
      </div>

      {/* Soft rim illumination overlay around silhouette head */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle at 58% 30%, rgba(255,255,255,0.15), transparent 42%)',
        }}
      />

      {/* Dark floor fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%]"
        style={{
          background: 'linear-gradient(to top, #070708 0%, rgba(7,7,8,0.85) 60%, transparent 100%)',
        }}
      />
    </motion.div>
  )
}


