import { motion } from 'framer-motion'
import portrait from '../../assets/profile-portrait.jpg'
import { SITE } from '../../config/site'

// Fades on all four edges so the photo dissolves into the background instead of
// being hard-cropped at the viewport edge.
const MASK =
  'radial-gradient(ellipse 60% 78% at 52% 54%, #000 36%, rgba(0,0,0,0.8) 58%, transparent 83%)'

export default function HeroPortrait({ ready = true }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-y-0 right-0 z-[var(--z-behind)] w-full md:right-[7%] md:w-[51%]"
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* A naturally soft gradient replaces the animated, blurred aura. */}
      <div
        aria-hidden="true"
        className="absolute left-[52%] top-[40%] h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            'radial-gradient(ellipse, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 45%, transparent 75%)',
        }}
      />

      <div className="relative h-full w-full">
        <img
          src={portrait}
          width="1100"
          height="979"
          alt={`${SITE.name}, photographed in profile`}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[52%_20%] opacity-15 md:opacity-85 lg:opacity-100"
          style={{ maskImage: MASK, WebkitMaskImage: MASK }}
        />
      </div>

      {/* Soft rim light on the head. Deliberately NOT mix-blend-screen: the
          animated wrapper isolates the blend group, which made the layer's own
          box edge show up as a vertical seam down the middle of the hero. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 58% 30%, rgba(255,255,255,0.13), transparent 42%)',
        }}
      />

      {/* Right-edge scrim — kills the vertical hard cut at the viewport boundary */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-[18%]"
        style={{
          background: 'linear-gradient(to left, #0b0c0a 0%, rgba(11,12,10,0.55) 45%, transparent 100%)',
        }}
      />

      {/* The floor fade lives in Landing, spanning the whole section. Boxed to
          this container it read as a rectangular shadow under the photo. */}
    </motion.div>
  )
}
