'use client'

import { useMemo, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { NoiseCanvas } from '@/components/three/NoiseParticles'
import { XMarkGradient } from '@/components/ui/XMarkGradient'
import type { Theme } from '@/types'

// Market signals floating in the background
const MARKET_SIGNALS = [
  'Series B closed', 'New CTO hired', 'Market entry', 'Tech stack change',
  'Funding round', 'Leadership shift', 'Product launch', 'Headcount +40%',
  'M&A signal', 'Board change', 'New office', 'Revenue milestone',
  'IPO filing', 'Restructuring', 'Key hire', 'Partnership signed',
  'Industry pivot', 'Expansion signal', 'LinkedIn spike', 'Hiring spree',
]

function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

const EASE = [0.16, 1, 0.3, 1] as const

interface Scene01HeroProps {
  theme: Theme
  introDone?: boolean
}

export function Scene01Hero({ theme, introDone = true }: Scene01HeroProps) {
  const containerRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  // Choreography
  const headOpacity  = useTransform(scrollYProgress, [0, 0.18, 0.30], [1, 1, 0])
  const headY        = useTransform(scrollYProgress, [0, 0.30], [0, -60])
  const headBlur     = useTransform(scrollYProgress, [0.14, 0.30], ['blur(0px)', 'blur(12px)'])
  const wordsOpacity = useTransform(scrollYProgress, [0, 0.22, 0.36], [1, 1, 0])
  const cueOpacity   = useTransform(scrollYProgress, [0, 0.06], [1, 0])
  const formation    = useTransform(scrollYProgress, [0.24, 0.64], [0, 1])

  const capAOpacity  = useTransform(scrollYProgress, [0.28, 0.36, 0.46, 0.52], [0, 1, 1, 0])
  const capBOpacity  = useTransform(scrollYProgress, [0.54, 0.62, 0.74, 0.78], [0, 1, 1, 0])
  const capBY        = useTransform(scrollYProgress, [0.54, 0.62], [20, 0])

  const portalOpacity = useTransform(scrollYProgress, [0.76, 0.82, 0.96, 1], [0, 1, 1, 0])
  const portalScale   = useTransform(scrollYProgress, [0.82, 1], [1, 18])
  const fieldOpacity  = useTransform(scrollYProgress, [0.80, 0.88], [1, 0])

  const signals = useMemo(
    () =>
      MARKET_SIGNALS.map((w, i) => ({
        w,
        top: 6 + rand(i + 1) * 82,
        left: 3 + rand(i + 31) * 88,
        dur: 8 + rand(i + 7) * 7,
        dx: rand(i + 3) * 28 - 14,
        dy: rand(i + 5) * 28 - 14,
        delay: rand(i + 9) * 2,
      })),
    []
  )

  return (
    <section ref={containerRef} id="noise" className="relative" style={{ height: reduced ? '100svh' : '340svh' }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">

        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              theme === 'dark'
                ? 'radial-gradient(65% 55% at 50% 52%, rgba(18,107,255,0.12) 0%, rgba(123,45,255,0.04) 50%, transparent 70%)'
                : 'radial-gradient(65% 55% at 50% 52%, rgba(0,190,220,0.10) 0%, rgba(0,100,240,0.04) 50%, transparent 70%)',
          }}
        />

        {/* Particle field */}
        <motion.div className="absolute inset-0 z-0" style={{ opacity: fieldOpacity }}>
          <NoiseCanvas theme={theme} progress={formation} />
        </motion.div>

        {/* Floating market signals */}
        {!reduced && (
          <motion.div
            className="absolute inset-0 z-[1] pointer-events-none select-none"
            style={{ opacity: wordsOpacity }}
            aria-hidden="true"
          >
            {signals.map(({ w, top, left, dur, dx, dy, delay }, i) => (
              <motion.span
                key={w}
                className="absolute hidden sm:block text-[0.6rem] font-medium tracking-[0.18em] uppercase"
                style={{ top: `${top}%`, left: `${left}%`, color: 'var(--text-tertiary)' }}
                initial={{ opacity: 0 }}
                animate={introDone ? {
                  opacity: [0, 0.55, 0.20, 0.50, 0],
                  x: [0, dx, -dx * 0.3, 0],
                  y: [0, dy, -dy * 0.3, 0],
                } : {}}
                transition={{ duration: dur, delay: delay + 0.5 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {w}
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* Main headline */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5"
          style={reduced ? undefined : { opacity: headOpacity, y: headY, filter: headBlur }}
        >
          {/* Eyebrow */}
          <motion.p
            className="eyebrow mb-10"
            initial={{ opacity: 0 }}
            animate={introDone ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            <span className="rule" />TNX · Always In Motion<span className="rule" />
          </motion.p>

          {/* V2 Headline: MARKETS ARE MOVING. SO ARE WE. */}
          <h1
            className="text-center font-bold leading-[0.88] tracking-[-0.048em]"
            style={{ fontSize: 'clamp(3rem, 10.2vw, 11rem)', color: 'var(--text-primary)' }}
          >
            {['MARKETS', 'ARE MOVING.'].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.05em]">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={introDone ? { y: '0%' } : {}}
                  transition={{ duration: 1.1, delay: 0.12 + i * 0.1, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden pb-[0.05em] mt-1">
              <motion.span
                className="block text-gradient-x"
                initial={{ y: '110%' }}
                animate={introDone ? { y: '0%' } : {}}
                transition={{ duration: 1.1, delay: 0.32, ease: EASE }}
              >
                SO ARE WE.
              </motion.span>
            </span>
          </h1>

          {/* Subline */}
          <motion.p
            className="mt-10 font-light text-center max-w-[38ch]"
            style={{
              fontSize: 'clamp(1rem, 1.7vw, 1.4rem)',
              color: 'var(--text-secondary)',
              letterSpacing: '-0.01em',
              lineHeight: 1.5,
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
          >
            B2B Sales-as-a-Service. We find the signal, we open the conversation, we move.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.82, ease: EASE }}
          >
            <a
              href="#end"
              onClick={e => { e.preventDefault(); document.getElementById('end')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="group relative inline-flex items-center gap-3 px-8 py-4 font-semibold tracking-[0.12em] uppercase text-sm overflow-hidden"
              style={{ background: 'var(--x-gradient)', color: '#fff' }}
            >
              <span className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.08] transition-colors duration-300" />
              <span className="relative">Enter the market</span>
              <motion.span
                className="relative"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
              >
                →
              </motion.span>
            </a>
            <button
              onClick={() => document.getElementById('signal')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-4 text-sm font-medium tracking-[0.1em] uppercase transition-colors duration-300"
              style={{ color: 'var(--text-tertiary)' }}
            >
              See how it works ↓
            </button>
          </motion.div>
        </motion.div>

        {/* Caption A: during convergence */}
        {!reduced && (
          <motion.div
            className="absolute inset-x-0 top-[13%] z-10 text-center px-5 pointer-events-none"
            style={{ opacity: capAOpacity }}
          >
            <p className="eyebrow justify-center mb-4">
              <span className="idx">01</span>The market never stops
            </p>
            <p
              className="font-semibold tracking-[-0.03em]"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2.6rem)', color: 'var(--text-primary)' }}
            >
              Every day there are companies ready to buy.<br />
              <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>Most teams never reach them in time.</span>
            </p>
          </motion.div>
        )}

        {/* Caption B: X formed */}
        {!reduced && (
          <motion.div
            className="absolute inset-x-0 bottom-[10%] z-10 text-center px-5 pointer-events-none"
            style={{ opacity: capBOpacity, y: capBY }}
          >
            <p
              className="font-semibold tracking-[-0.03em]"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2.6rem)', color: 'var(--text-primary)' }}
            >
              TNX moves <span className="text-gradient-x">before the window closes.</span>
            </p>
          </motion.div>
        )}

        {/* Portal X */}
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
          <motion.span
            className="label"
            initial={{ opacity: 0 }}
            animate={introDone ? { opacity: 1 } : {}}
            transition={{ delay: 1.4 }}
          >
            Scroll to explore
          </motion.span>
          <span className="relative block w-px h-10 overflow-hidden" style={{ background: 'var(--border-strong)' }}>
            <motion.span
              className="absolute left-0 top-0 w-px h-4"
              style={{ background: 'var(--accent-cyan)' }}
              animate={{ y: [-16, 40] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </motion.div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 inset-x-0 h-40 z-30 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-primary))' }}
        />
      </div>
    </section>
  )
}
