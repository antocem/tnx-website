'use client'

import { useMemo, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { NoiseCanvas } from '@/components/three/NoiseParticles'
import { XMarkGradient } from '@/components/ui/XMarkGradient'
import type { Theme } from '@/types'

const NOISE_WORDS = [
  'Expansion', 'New CTO', 'Hiring', 'Funding', 'New market',
  'Product launch', 'Leadership change', 'LinkedIn activity',
  'New office', 'Partnership', 'Tech adoption', 'Industry news',
  'Revenue growth', 'M&A', 'Series B', 'Market entry',
  'Board change', 'Restructuring', 'Key hire', 'IPO filing',
]

// Deterministic pseudo random so positions never jump on re-render or theme change
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

const EASE = [0.16, 1, 0.3, 1] as const

interface Scene01NoiseProps {
  theme: Theme
  introDone?: boolean
}

export function Scene01Noise({ theme, introDone = true }: Scene01NoiseProps) {
  const containerRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  // Choreography (0..1 across the pinned scene)
  const headOpacity  = useTransform(scrollYProgress, [0, 0.16, 0.28], [1, 1, 0])
  const headY        = useTransform(scrollYProgress, [0, 0.28], [0, -80])
  const headBlur     = useTransform(scrollYProgress, [0.12, 0.28], ['blur(0px)', 'blur(8px)'])
  const wordsOpacity = useTransform(scrollYProgress, [0, 0.2, 0.35], [1, 1, 0])
  const cueOpacity   = useTransform(scrollYProgress, [0, 0.06], [1, 0])
  const formation    = useTransform(scrollYProgress, [0.22, 0.62], [0, 1])

  const capAOpacity  = useTransform(scrollYProgress, [0.26, 0.33, 0.44, 0.5], [0, 1, 1, 0])
  const capBOpacity  = useTransform(scrollYProgress, [0.52, 0.6, 0.72, 0.76], [0, 1, 1, 0])
  const capBY        = useTransform(scrollYProgress, [0.52, 0.6], [20, 0])

  // The particle X hands over to a solid X, which then opens like a portal
  const portalOpacity = useTransform(scrollYProgress, [0.74, 0.8, 0.95, 1], [0, 1, 1, 0])
  const portalScale   = useTransform(scrollYProgress, [0.8, 1], [1, 16])
  const fieldOpacity  = useTransform(scrollYProgress, [0.78, 0.86], [1, 0])

  const words = useMemo(
    () =>
      NOISE_WORDS.map((w, i) => ({
        w,
        top: 8 + rand(i + 1) * 80,
        left: 4 + rand(i + 31) * 86,
        dur: 7 + rand(i + 7) * 6,
        dx: rand(i + 3) * 30 - 15,
        dy: rand(i + 5) * 30 - 15,
      })),
    []
  )

  return (
    <section ref={containerRef} id="noise" className="relative" style={{ height: reduced ? '100svh' : '320svh' }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              theme === 'dark'
                ? 'radial-gradient(60% 50% at 50% 55%, rgba(18,107,255,0.10) 0%, transparent 70%)'
                : 'radial-gradient(60% 50% at 50% 55%, rgba(0,190,220,0.10) 0%, transparent 70%)',
          }}
        />

        {/* Particle field */}
        <motion.div className="absolute inset-0 z-0" style={{ opacity: fieldOpacity }}>
          <NoiseCanvas theme={theme} progress={formation} />
        </motion.div>

        {/* Floating market noise */}
        {!reduced && (
          <motion.div className="absolute inset-0 z-[1] pointer-events-none select-none" style={{ opacity: wordsOpacity }} aria-hidden="true">
            {words.map(({ w, top, left, dur, dx, dy }, i) => (
              <motion.span
                key={w}
                className="absolute hidden sm:block text-[0.625rem] font-medium tracking-[0.2em] uppercase"
                style={{ top: `${top}%`, left: `${left}%`, color: 'var(--text-tertiary)' }}
                initial={{ opacity: 0 }}
                animate={introDone ? { opacity: [0, 0.7, 0.25, 0.6, 0], x: [0, dx, 0], y: [0, dy, 0] } : {}}
                transition={{ duration: dur, delay: 0.6 + i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
              >
                {w}
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* Headline */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5"
          style={reduced ? undefined : { opacity: headOpacity, y: headY, filter: headBlur }}
        >
          <motion.p
            className="eyebrow mb-8"
            initial={{ opacity: 0 }}
            animate={introDone ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="rule" />TNX · Commercial Intelligence<span className="rule" />
          </motion.p>

          <h1
            className="text-center font-bold leading-[0.9] tracking-[-0.045em]"
            style={{ fontSize: 'clamp(3.25rem, 10.5vw, 11.5rem)', color: 'var(--text-primary)' }}
          >
            {['THERE IS', 'ALWAYS A', 'SIGNAL.'].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={`block ${i === 2 ? 'text-gradient-x' : ''}`}
                  initial={{ y: '105%' }}
                  animate={introDone ? { y: '0%' } : {}}
                  transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-x-6 gap-y-1">
            {['We find it.', 'We understand it.', 'We act on it.'].map((line, i) => (
              <motion.p
                key={line}
                className="font-light text-center"
                style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.5rem)', color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}
                initial={{ opacity: 0, y: 14 }}
                animate={introDone ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.75 + i * 0.12, ease: EASE }}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </motion.div>

        {/* Caption A: during convergence */}
        {!reduced && (
          <motion.div
            className="absolute inset-x-0 top-[14%] z-10 text-center px-5 pointer-events-none"
            style={{ opacity: capAOpacity }}
          >
            <p className="eyebrow justify-center"><span className="idx">01</span>The market is loud</p>
            <p className="mt-4 font-semibold tracking-[-0.03em]" style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.75rem)', color: 'var(--text-primary)' }}>
              Thousands of data points. Most of it noise.
            </p>
          </motion.div>
        )}

        {/* Caption B: X formed */}
        {!reduced && (
          <motion.div
            className="absolute inset-x-0 bottom-[10%] z-10 text-center px-5 pointer-events-none"
            style={{ opacity: capBOpacity, y: capBY }}
          >
            <p className="font-semibold tracking-[-0.03em]" style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.75rem)', color: 'var(--text-primary)' }}>
              TNX hears <span className="text-gradient-x">what matters.</span>
            </p>
          </motion.div>
        )}

        {/* X portal into the journey */}
        {!reduced && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            style={{ opacity: portalOpacity, scale: portalScale }}
            aria-hidden="true"
          >
            <XMarkGradient size={'min(26vw, 26vh)'} id="heroX" />
          </motion.div>
        )}

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
          style={{ opacity: cueOpacity }}
        >
          <motion.span className="label" initial={{ opacity: 0 }} animate={introDone ? { opacity: 1 } : {}} transition={{ delay: 1.2 }}>
            Scroll to enter
          </motion.span>
          <span className="relative block w-px h-10 overflow-hidden" style={{ background: 'var(--border-strong)' }}>
            <motion.span
              className="absolute left-0 top-0 w-px h-4"
              style={{ background: 'var(--accent-cyan)' }}
              animate={{ y: [-16, 40] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </motion.div>

        <div
          className="absolute bottom-0 inset-x-0 h-40 z-30 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-primary))' }}
        />
      </div>
    </section>
  )
}
