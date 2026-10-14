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
  // Noise returns, then aligns into the X, then steps back so the message can lead
  const formation = useTransform(scrollYProgress, [0.05, 0.45], [0, 1])
  const fieldScale = useTransform(scrollYProgress, [0.45, 0.7], [1, 0.7])
  const fieldY = useTransform(scrollYProgress, [0.45, 0.7], ['0%', '-24%'])
  const fieldOpacity = useTransform(scrollYProgress, [0.45, 0.75], [1, 0.9])
  const msgOpacity = useTransform(scrollYProgress, [0.5, 0.68], [0, 1])
  const msgY = useTransform(scrollYProgress, [0.5, 0.7], [40, 0])

  return (
    <section ref={sectionRef} id="end" className="relative" style={{ height: reduced ? 'auto' : '240svh' }}>
      <div className={`${reduced ? 'py-28' : 'sticky top-0 h-[100svh]'} overflow-hidden flex flex-col`}>
        {!reduced && (
          <motion.div className="absolute inset-0" style={{ scale: fieldScale, y: fieldY, opacity: fieldOpacity }}>
            <NoiseCanvas theme={theme} progress={formation} />
          </motion.div>
        )}

        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(80% 70% at 50% 45%, transparent 40%, var(--bg-primary) 100%)',
        }} />

        <motion.div
          ref={contentRef}
          className="relative z-10 flex-1 flex flex-col items-center justify-end pb-[14vh] text-center px-5"
          style={reduced ? undefined : { opacity: msgOpacity, y: msgY }}
        >
          <p className="eyebrow justify-center mb-8"><span className="idx">11</span><span className="rule" />Listen</p>

          <h2
            className="font-bold leading-[0.95] tracking-[-0.045em] max-w-[15ch] sm:max-w-none"
            style={{ fontSize: 'clamp(2.2rem, 6.2vw, 7.5rem)', color: 'var(--text-primary)' }}
          >
            THE MARKET ISN&apos;T QUIET.
          </h2>
          <p
            className="mt-4 font-semibold leading-[1.05] tracking-[-0.035em] max-w-[22ch] sm:max-w-[28ch]"
            style={{ fontSize: 'clamp(1.4rem, 3.2vw, 3.25rem)', color: 'var(--text-secondary)' }}
          >
            You just need to know <span className="text-gradient-x">what to listen for.</span>
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <a
              href={`mailto:${SITE.contactEmail}?subject=${encodeURIComponent('Entering the market with TNX')}`}
              className="group relative inline-flex w-full sm:w-auto justify-center items-center gap-3 px-10 py-5 font-medium tracking-[0.14em] uppercase text-sm text-white overflow-hidden"
              style={{ background: 'var(--x-gradient)' }}
            >
              <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
              <span className="relative">Enter the market</span>
              <span className="relative transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </a>
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="inline-flex w-full sm:w-auto justify-center items-center px-8 py-5 font-medium tracking-[0.1em] uppercase text-sm border transition-colors duration-300 hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)]"
              style={{ borderColor: 'var(--border-strong)', color: 'var(--text-secondary)' }}
            >
              {SITE.contactEmail}
            </a>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="relative z-10 max-w-[1440px] w-full mx-auto px-5 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid var(--border)', ...(reduced ? {} : { opacity: msgOpacity }) }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div className="flex items-center gap-3">
            <XMarkGradient id="footX" size={14} />
            <p className="label">© {new Date().getFullYear()} TNX Group</p>
          </div>
          <div className="flex items-center gap-6">
            <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="label hover:text-[var(--text-primary)] transition-colors">LinkedIn</a>
            <a href={`mailto:${SITE.contactEmail}`} className="label hover:text-[var(--text-primary)] transition-colors">Contact</a>
          </div>
        </motion.footer>
      </div>
    </section>
  )
}
