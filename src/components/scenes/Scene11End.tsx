'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { NoiseCanvas } from '@/components/three/NoiseParticles'
import { XMarkGradient } from '@/components/ui/XMarkGradient'
import { SITE } from '@/lib/site'
import type { Theme } from '@/types'

const EASE = [0.16, 1, 0.3, 1] as const

export function Scene11End({ theme }: { theme: Theme }) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const inView = useInView(contentRef, { once: true, amount: 0.3 })

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const formation    = useTransform(scrollYProgress, [0.05, 0.45], [0, 1])
  const fieldScale   = useTransform(scrollYProgress, [0.45, 0.7], [1, 0.72])
  const fieldY       = useTransform(scrollYProgress, [0.45, 0.7], ['0%', '-22%'])
  const fieldOpacity = useTransform(scrollYProgress, [0.45, 0.75], [1, 0.85])
  const msgOpacity   = useTransform(scrollYProgress, [0.5, 0.68], [0, 1])
  const msgY         = useTransform(scrollYProgress, [0.5, 0.7], [50, 0])

  return (
    <section ref={sectionRef} id="end" className="relative" style={{ height: reduced ? 'auto' : '260svh' }}>
      <div className={`${reduced ? 'py-28' : 'sticky top-0 h-[100svh]'} overflow-hidden flex flex-col`}>

        {/* Particle field */}
        {!reduced && (
          <motion.div
            className="absolute inset-0"
            style={{ scale: fieldScale, y: fieldY, opacity: fieldOpacity }}
          >
            <NoiseCanvas theme={theme} progress={formation} />
          </motion.div>
        )}

        {/* Radial vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(80% 75% at 50% 50%, transparent 35%, var(--bg-primary) 100%)',
          }}
        />

        {/* Main content */}
        <motion.div
          ref={contentRef}
          className="relative z-10 flex-1 flex flex-col items-center justify-end pb-[12vh] text-center px-5"
          style={reduced ? undefined : { opacity: msgOpacity, y: msgY }}
        >
          <motion.p
            className="eyebrow justify-center mb-10"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="idx">11</span><span className="rule" />Always in motion
          </motion.p>

          <h2
            className="font-bold leading-[0.9] tracking-[-0.048em] max-w-[14ch] sm:max-w-none"
            style={{ fontSize: 'clamp(2.4rem, 6.5vw, 8rem)', color: 'var(--text-primary)' }}
          >
            THE MARKET IS MOVING.
          </h2>

          <p
            className="mt-3 font-bold leading-[0.9] tracking-[-0.048em] max-w-[14ch] sm:max-w-none"
            style={{ fontSize: 'clamp(2.4rem, 6.5vw, 8rem)' }}
          >
            <span className="text-gradient-x">ARE YOU?</span>
          </p>

          <p
            className="mt-8 font-light max-w-[40ch] text-center"
            style={{
              fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              letterSpacing: '-0.01em',
            }}
          >
            We find the signal. We open the conversation.<br />
            You focus on closing.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a
              href={`mailto:${SITE.contactEmail}?subject=${encodeURIComponent('Enter the market with TNX')}`}
              className="group relative inline-flex w-full sm:w-auto justify-center items-center gap-3 px-10 py-5 font-semibold tracking-[0.14em] uppercase text-sm text-white overflow-hidden"
              style={{ background: 'var(--x-gradient)' }}
            >
              <span className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.08] transition-colors duration-300" />
              <span className="relative">Enter the market</span>
              <motion.span
                className="relative"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              >
                →
              </motion.span>
            </a>
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="group inline-flex w-full sm:w-auto justify-center items-center px-8 py-5 font-medium tracking-[0.1em] uppercase text-sm border transition-all duration-300"
              style={{ borderColor: 'var(--border-strong)', color: 'var(--text-secondary)' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent-cyan)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-strong)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              {SITE.contactEmail}
            </a>
          </div>

          {/* Trust line */}
          <motion.p
            className="mt-8 label"
            style={{ color: 'var(--text-tertiary)' }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Bucharest · Europe · Remote-ready
          </motion.p>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="relative z-10 max-w-[1440px] w-full mx-auto px-5 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid var(--border)', ...(reduced ? {} : { opacity: msgOpacity }) } as React.CSSProperties}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div className="flex items-center gap-3">
            <XMarkGradient id="footX" size={14} />
            <p className="label">© {new Date().getFullYear()} TNX Group · Always In Motion</p>
          </div>
          <div className="flex items-center gap-6">
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noreferrer"
              className="label transition-colors duration-300"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="label transition-colors duration-300"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
            >
              Contact
            </a>
          </div>
        </motion.footer>
      </div>
    </section>
  )
}
