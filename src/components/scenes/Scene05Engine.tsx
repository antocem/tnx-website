'use client'

import { useRef, Suspense, lazy } from 'react'
import { motion, useInView } from 'framer-motion'
import { XMarkGradient } from '@/components/ui/XMarkGradient'
import type { Theme } from '@/types'

const EngineXCanvas = lazy(() => import('@/components/three/EngineX').then(m => ({ default: m.EngineXCanvas })))

const SYSTEMS = [
  {
    n: '01', name: 'Intelligence', color: 'var(--accent-cyan)',
    line: 'We map the market before we touch it.',
    items: ['Market research', 'Audience understanding', 'Signals', 'Context'],
  },
  {
    n: '02', name: 'Execution', color: 'var(--accent-violet)',
    line: 'Every conversation is relevant before it starts.',
    items: ['Tailored messaging', 'Calling', 'LinkedIn', 'Follow up', 'Campaigns'],
  },
  {
    n: '03', name: 'Learning', color: 'var(--accent-magenta)',
    line: 'Every cycle makes the next one sharper.',
    items: ['Responses', 'Market feedback', 'Performance', 'Optimization'],
  },
]

const EASE = [0.16, 1, 0.3, 1] as const

function SystemBlock({ s, i, inView, align = 'left' }: { s: typeof SYSTEMS[0]; i: number; inView: boolean; align?: 'left' | 'right' }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === 'left' ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.9, delay: 0.25 + i * 0.15, ease: EASE }}
      className={`group relative ${align === 'right' ? 'lg:text-right' : ''}`}
      data-cursor="hover"
    >
      <div className={`flex items-center gap-3 mb-4 ${align === 'right' ? 'lg:flex-row-reverse' : ''}`}>
        <span className="tabular-nums text-xs font-medium" style={{ color: s.color }}>{s.n}</span>
        <span className="h-px w-10 transition-all duration-500 group-hover:w-16" style={{ background: s.color }} />
        <span className="label" style={{ color: 'var(--text-primary)' }}>{s.name}</span>
      </div>
      <p className="font-medium tracking-[-0.02em] mb-4" style={{ fontSize: 'clamp(1.2rem, 1.7vw, 1.6rem)', color: 'var(--text-primary)', lineHeight: 1.25 }}>
        {s.line}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {s.items.map((it, k) => (
          <span key={it}>
            {it}
            {k < s.items.length - 1 && <span className="mx-2" style={{ color: s.color, opacity: 0.6 }}>/</span>}
          </span>
        ))}
      </p>
    </motion.div>
  )
}

export function Scene05Engine({ theme }: { theme: Theme }) {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section
      ref={sectionRef}
      id="engine"
      className="relative overflow-hidden"
      style={{ background: 'var(--bg-secondary)', paddingBlock: 'clamp(6rem, 12vw, 11rem)' }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(45% 40% at 50% 58%, rgba(18,107,255,0.12) 0%, transparent 70%)' }} />

      <div className="relative max-w-[1440px] mx-auto px-5 lg:px-12">
        <div className="text-center mb-12 lg:mb-6">
          <motion.p className="eyebrow justify-center mb-6" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>
            <span className="idx">05</span><span className="rule" />The operating model
          </motion.p>
          <motion.h2
            className="font-bold leading-[0.9] tracking-[-0.045em]"
            style={{ fontSize: 'clamp(3rem, 8vw, 9rem)', color: 'var(--text-primary)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          >
            THE TNX <span className="text-gradient-x">ENGINE.</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-10 lg:gap-6 items-center">
          <div className="flex flex-col gap-12 order-2 lg:order-1">
            <SystemBlock s={SYSTEMS[0]} i={0} inView={inView} />
            <SystemBlock s={SYSTEMS[1]} i={1} inView={inView} />
          </div>

          <motion.div
            className="relative mx-auto order-1 lg:order-2"
            style={{ width: 'clamp(260px, 40vw, 560px)', aspectRatio: '1 / 1' }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center"><XMarkGradient id="engFallback" size="55%" opacity={0.7} /></div>}>
              <EngineXCanvas theme={theme} />
            </Suspense>
          </motion.div>

          <div className="order-3">
            <SystemBlock s={SYSTEMS[2]} i={2} inView={inView} align="right" />
          </div>
        </div>

        <motion.div
          className="mt-16 lg:mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
        >
          <p className="font-light" style={{ fontSize: 'clamp(1.2rem, 2.6vw, 2.25rem)', color: 'var(--text-secondary)', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
            Not a tool. Not a campaign.<br />
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>A complete commercial intelligence operation.</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
