'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { Theme } from '@/types'
import { SITE } from '@/lib/site'

const EASE = [0.16, 1, 0.3, 1] as const

const JOURNEYS = [
  {
    id: 'grow',
    number: '01',
    title: 'I want to grow\nrevenue.',
    shortTitle: 'GROW REVENUE',
    color: 'var(--accent-cyan)',
    gradient: 'linear-gradient(135deg, #00E5FF 0%, #126BFF 100%)',
    description: 'We build your pipeline. We find the right companies at the right moment and open real conversations. You close.',
    deliverables: ['Qualified pipeline', 'Decision-maker access', 'Conversion-ready meetings'],
    cta: 'Start filling your pipeline',
    ctaHref: `mailto:${SITE.contactEmail}?subject=I want to grow revenue — TNX`,
  },
  {
    id: 'enter',
    number: '02',
    title: 'I want to enter\na new market.',
    shortTitle: 'ENTER A MARKET',
    color: 'var(--accent-violet)',
    gradient: 'linear-gradient(135deg, #7B2DFF 0%, #FF1EC8 100%)',
    description: 'New geography, new vertical, new segment. We map the territory, validate the demand, and execute the outbound before you commit headcount.',
    deliverables: ['Market mapping', 'Demand validation', 'First meetings in weeks'],
    cta: 'Enter the market with us',
    ctaHref: `mailto:${SITE.contactEmail}?subject=I want to enter a new market — TNX`,
  },
  {
    id: 'scale',
    number: '03',
    title: 'I want to scale\nwithout hiring.',
    shortTitle: 'SCALE THE TEAM',
    color: 'var(--accent-magenta)',
    gradient: 'linear-gradient(135deg, #FF1EC8 0%, #7B2DFF 100%)',
    description: 'Senior commercial talent, embedded in your operation. No onboarding months. No equity dilution. We move with you from week one.',
    deliverables: ['Embedded senior capacity', 'No long ramp time', 'Commercial team extension'],
    cta: 'Scale the team',
    ctaHref: `mailto:${SITE.contactEmail}?subject=I want to scale without hiring — TNX`,
  },
]

function JourneyCard({
  j,
  i,
  isActive,
  isHovered,
  inView,
  onClick,
  onHover,
}: {
  j: typeof JOURNEYS[0]
  i: number
  isActive: boolean
  isHovered: boolean
  inView: boolean
  onClick: () => void
  onHover: (hovered: boolean) => void
}) {
  const reduced = useReducedMotion()

  return (
    <motion.button
      className="relative w-full text-left group overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease: EASE }}
      onClick={onClick}
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
      data-cursor="hover"
      style={{ borderRadius: 0 }}
    >
      {/* Background fill on hover/active */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: j.gradient }}
        animate={{ opacity: isActive ? 0.08 : isHovered ? 0.04 : 0 }}
        transition={{ duration: 0.35 }}
      />

      {/* Left border line */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-px"
        style={{ background: j.gradient }}
        animate={{ scaleY: isActive || isHovered ? 1 : 0.3, opacity: isActive ? 1 : isHovered ? 0.6 : 0.2 }}
        transition={{ duration: 0.4, ease: EASE }}
      />

      <div className="pl-8 pr-6 py-8 lg:py-10">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            {/* Number + color accent */}
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-xs font-semibold tabular-nums"
                style={{ color: j.color, letterSpacing: '0.1em' }}
              >
                {j.number}
              </span>
              <motion.span
                className="h-px"
                style={{ background: j.gradient }}
                animate={{ width: isActive || isHovered ? '3rem' : '1.5rem' }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Title */}
            <h3
              className="font-bold leading-[1.05] tracking-[-0.04em] whitespace-pre-line"
              style={{
                fontSize: 'clamp(1.6rem, 3.2vw, 3rem)',
                color: 'var(--text-primary)',
              }}
            >
              {j.title}
            </h3>
          </div>

          {/* Arrow */}
          <motion.span
            className="mt-2 text-xl flex-shrink-0"
            style={{ color: j.color }}
            animate={{
              x: isActive || isHovered ? 4 : 0,
              opacity: isActive || isHovered ? 1 : 0.3,
            }}
            transition={{ duration: 0.3 }}
          >
            →
          </motion.span>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="pt-6 pb-2">
                <p
                  className="leading-relaxed mb-6"
                  style={{
                    fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                  }}
                >
                  {j.description}
                </p>

                {/* Deliverables */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {j.deliverables.map(d => (
                    <span
                      key={d}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium tracking-[0.1em] uppercase border"
                      style={{
                        color: j.color,
                        borderColor: j.color,
                        borderWidth: '1px',
                        opacity: 0.85,
                      }}
                    >
                      {d}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href={j.ctaHref}
                  className="inline-flex items-center gap-3 px-7 py-3.5 text-sm font-semibold tracking-[0.12em] uppercase text-white relative overflow-hidden group/cta"
                  style={{ background: j.gradient }}
                  onClick={e => e.stopPropagation()}
                >
                  <span className="absolute inset-0 bg-white/0 group-hover/cta:bg-white/10 transition-colors duration-300" />
                  <span className="relative">{j.cta}</span>
                  <span className="relative">→</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  )
}

export function Scene10bDirection({ theme }: { theme: Theme }) {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.15 })
  const [activeJourney, setActiveJourney] = useState<string | null>(null)
  const [hoveredJourney, setHoveredJourney] = useState<string | null>(null)

  return (
    <section
      ref={sectionRef}
      id="direction"
      className="relative"
      style={{
        background: 'var(--bg-primary)',
        paddingBlock: 'clamp(6rem, 12vw, 11rem)',
        borderTop: '1px solid var(--border)',
      }}
    >
      {/* Subtle ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(50% 60% at 50% 30%, rgba(123,45,255,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-[1440px] mx-auto px-5 lg:px-12">

        {/* Section header */}
        <div className="mb-16 lg:mb-20 max-w-[50ch]">
          <motion.p
            className="eyebrow mb-8"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="idx">10</span><span className="rule" />Your next move
          </motion.p>
          <motion.h2
            className="font-bold leading-[0.92] tracking-[-0.045em]"
            style={{ fontSize: 'clamp(2.8rem, 6.5vw, 7.5rem)', color: 'var(--text-primary)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
          >
            WHERE DO YOU WANT TO GO <span className="text-gradient-x">NEXT?</span>
          </motion.h2>
        </div>

        {/* Journey cards */}
        <div
          className="divide-y"
          style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', borderColor: 'var(--border)' }}
        >
          {JOURNEYS.map((j, i) => (
            <JourneyCard
              key={j.id}
              j={j}
              i={i}
              isActive={activeJourney === j.id}
              isHovered={hoveredJourney === j.id}
              inView={inView}
              onClick={() => setActiveJourney(prev => prev === j.id ? null : j.id)}
              onHover={(h) => setHoveredJourney(h ? j.id : null)}
            />
          ))}
        </div>

        {/* Bottom prompt */}
        <motion.div
          className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.7 }}
        >
          <p
            className="font-light"
            style={{
              fontSize: 'clamp(1rem, 1.6vw, 1.3rem)',
              color: 'var(--text-tertiary)',
              letterSpacing: '-0.01em',
            }}
          >
            Not sure? Tell us where you are and we&apos;ll map the path together.
          </p>
          <a
            href={`mailto:${SITE.contactEmail}?subject=TNX — let's talk`}
            className="inline-flex items-center gap-3 text-sm font-semibold tracking-[0.12em] uppercase transition-colors duration-300 flex-shrink-0"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Let&apos;s talk <span>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
