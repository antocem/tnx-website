'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { NoiseCanvas } from '@/components/three/NoiseParticles'
import type { Theme } from '@/types'

const EASE = [0.16, 1, 0.3, 1] as const

interface Scene01HeroProps {
  theme: Theme
  introDone?: boolean
}

export function Scene01Hero({ theme, introDone = true }: Scene01HeroProps) {
  const containerRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  const headOpacity = useTransform(scrollYProgress, [0, 0.22, 0.38], [1, 1, 0])
  const headY       = useTransform(scrollYProgress, [0, 0.38], [0, -80])
  const headBlur    = useTransform(scrollYProgress, [0.18, 0.38], ['blur(0px)', 'blur(16px)'])
  const bgOpacity   = useTransform(scrollYProgress, [0.30, 0.65], [1, 0])
  const formation   = useTransform(scrollYProgress, [0.20, 0.65], [0, 1])

  return (
    <section ref={containerRef} id="hero" className="relative" style={{ height: reduced ? '100svh' : '280svh' }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">

        {/* Atmospheric background glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            opacity: bgOpacity,
            background: theme === 'dark'
              ? 'radial-gradient(70% 60% at 50% 55%, rgba(18,107,255,0.14) 0%, rgba(123,45,255,0.06) 45%, transparent 70%)'
              : 'radial-gradient(70% 60% at 50% 55%, rgba(0,190,220,0.12) 0%, rgba(0,100,240,0.05) 45%, transparent 70%)',
          }}
        />

        {/* Particle field — subtle, atmospheric */}
        {!reduced && (
          <motion.div className="absolute inset-0 z-0" style={{ opacity: bgOpacity }}>
            <NoiseCanvas theme={theme} progress={formation} />
          </motion.div>
        )}

        {/* Grid lines — architectural feel */}
        {!reduced && (
          <motion.svg
            className="absolute inset-0 w-full h-full z-[1] pointer-events-none"
            style={{ opacity: useTransform(scrollYProgress, [0, 0.05, 0.30], [0, 0.4, 0]) }}
            aria-hidden="true"
          >
            {/* Vertical center line */}
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="var(--border)" strokeWidth="1" strokeDasharray="1 12" />
            {/* Horizontal thirds */}
            <line x1="0" y1="33.3%" x2="100%" y2="33.3%" stroke="var(--border)" strokeWidth="1" strokeDasharray="1 12" />
            <line x1="0" y1="66.6%" x2="100%" y2="66.6%" stroke="var(--border)" strokeWidth="1" strokeDasharray="1 12" />
          </motion.svg>
        )}

        {/* Main content */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5"
          style={reduced ? undefined : { opacity: headOpacity, y: headY, filter: headBlur }}
        >
          {/* Eyebrow */}
          <motion.div
            className="mb-12 flex items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.1, ease: EASE }}
          >
            <span className="h-px w-12" style={{ background: 'var(--x-gradient)' }} />
            <span
              style={{
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
              }}
            >
              TNX · Always In Motion
            </span>
            <span className="h-px w-12" style={{ background: 'var(--x-gradient)' }} />
          </motion.div>

          {/* Main headline — cinematic, architectural */}
          <h1
            className="text-center font-bold leading-[0.86] tracking-[-0.05em]"
            style={{ fontSize: 'clamp(2.8rem, 10vw, 10.5rem)', color: 'var(--text-primary)' }}
          >
            {['MARKETS', 'ARE MOVING.'].map((line, i) => (
              <span key={line} className="block overflow-hidden" style={{ paddingBottom: '0.04em' }}>
                <motion.span
                  className="block"
                  initial={{ y: '105%', opacity: 0 }}
                  animate={introDone ? { y: '0%', opacity: 1 } : {}}
                  transition={{ duration: 1.2, delay: 0.08 + i * 0.12, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden mt-2" style={{ paddingBottom: '0.04em' }}>
              <motion.span
                className="block text-gradient-x"
                initial={{ y: '105%', opacity: 0 }}
                animate={introDone ? { y: '0%', opacity: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.34, ease: EASE }}
              >
                SO ARE WE.
              </motion.span>
            </span>
          </h1>

          {/* Subline — restrained */}
          <motion.p
            className="mt-10 text-center max-w-[34ch] font-light"
            style={{
              fontSize: 'clamp(0.95rem, 1.6vw, 1.35rem)',
              color: 'var(--text-secondary)',
              letterSpacing: '-0.01em',
              lineHeight: 1.55,
            }}
            initial={{ opacity: 0 }}
            animate={introDone ? { opacity: 1 } : {}}
            transition={{ duration: 1.0, delay: 0.72, ease: EASE }}
          >
            B2B Sales-as-a-Service. We find the signal,
            open the conversation, and move.
          </motion.p>

          {/* CTA — editorial, minimal */}
          <motion.div
            className="mt-12 flex flex-col sm:flex-row items-center gap-6"
            initial={{ opacity: 0 }}
            animate={introDone ? { opacity: 1 } : {}}
            transition={{ duration: 1.0, delay: 0.96, ease: EASE }}
          >
            {/* Primary: editorial text link */}
            <a
              href="#direction"
              onClick={e => {
                e.preventDefault()
                document.getElementById('direction')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="group flex items-center gap-3"
              style={{
                fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
              }}
            >
              <span>Explore what&apos;s next</span>
              <motion.span
                style={{ display: 'inline-block' }}
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                ↗
              </motion.span>
              {/* Underline that grows on hover */}
              <span
                className="absolute -bottom-1 left-0 h-px transition-all duration-500"
                style={{ background: 'var(--x-gradient)', width: '0', }}
              />
            </a>

            {/* Divider */}
            <span
              className="hidden sm:block h-4 w-px"
              style={{ background: 'var(--border-strong)' }}
            />

            {/* Secondary: scroll hint */}
            <button
              onClick={() => document.getElementById('world')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                fontSize: '0.65rem',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
              }}
            >
              See how it works ↓
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator — bottom */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]) }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={introDone ? { opacity: 1 } : {}}
            transition={{ delay: 1.6 }}
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
            }}
          >
            Scroll
          </motion.span>
          <span className="relative block w-px h-10 overflow-hidden" style={{ background: 'var(--border-strong)' }}>
            <motion.span
              className="absolute left-0 top-0 w-px h-5"
              style={{ background: 'var(--accent-cyan)' }}
              animate={{ y: [-20, 42] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </motion.div>

        {/* Bottom fade into next scene */}
        <div
          className="absolute bottom-0 inset-x-0 h-48 z-20 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-primary))' }}
        />
      </div>
    </section>
  )
}
