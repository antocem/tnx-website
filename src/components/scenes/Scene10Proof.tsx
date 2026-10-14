'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Theme } from '@/types'

const METRICS = [
  { value: 4,    suffix: '',   label: 'Markets',                  sublabel: 'Romania · Bulgaria · Germany · Hungary' },
  { value: 2400, suffix: '+',  label: 'Companies researched',     sublabel: 'before a single message is sent' },
  { value: 73,   suffix: '',   label: 'Signals per account',      sublabel: 'average contextual data points' },
  { value: 12,   suffix: 'M', label: 'Pipeline generated',       sublabel: 'in active programs, in €', valuePrefix: '€' },
]

function BigCounter({
  value,
  suffix,
  prefix = '',
  active,
  theme,
}: {
  value: number
  suffix: string
  prefix?: string
  active: boolean
  theme: Theme
}) {
  const [display, setDisplay] = useState(0)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (!active || shouldReduce) {
      setDisplay(value)
      return
    }
    const duration = 1400
    const steps = 60
    let frame = 0
    const tick = () => {
      frame++
      const progress = frame / steps
      const eased = 1 - Math.pow(1 - progress, 4)
      setDisplay(Math.round(eased * value))
      if (frame < steps) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, value, shouldReduce])

  const formatted = display >= 1000
    ? display.toLocaleString()
    : display.toString()

  return (
    <span
      className="tabular-nums font-bold leading-none tracking-[-0.05em]"
      style={{
        fontSize: 'clamp(6rem, 18vw, 22rem)',
        background: 'var(--x-gradient)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block',
      }}
    >
      {prefix}{formatted}{suffix}
    </span>
  )
}

interface Scene10ProofProps {
  theme: Theme
}

export function Scene10Proof({ theme }: Scene10ProofProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.05 })
  const [activeMetric, setActiveMetric] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const counterRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-cycle through metrics once in view
  useEffect(() => {
    if (!inView || hasStarted) return
    setHasStarted(true)

    const cycle = (index: number) => {
      setActiveMetric(index)
      counterRef.current = setTimeout(() => {
        if (index < METRICS.length - 1) {
          cycle(index + 1)
        }
      }, 3000)
    }
    cycle(0)
    return () => {
      if (counterRef.current) clearTimeout(counterRef.current)
    }
  }, [inView, hasStarted])

  const metric = METRICS[activeMetric]

  return (
    <section
      ref={sectionRef}
      id="proof"
      className="scene relative overflow-hidden flex flex-col justify-center"
      style={{
        background: 'var(--bg-primary)',
        minHeight: '100svh',
      }}
    >
      {/* Background X watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        style={{ opacity: theme === 'dark' ? 0.025 : 0.02 }}
      >
        <svg viewBox="0 0 200 200" width="80vw" height="80vw" style={{ maxWidth: 900 }}>
          <defs>
            <linearGradient id="proofXGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="35%" stopColor="#126BFF" />
              <stop offset="65%" stopColor="#7B2DFF" />
              <stop offset="100%" stopColor="#FF1EC8" />
            </linearGradient>
          </defs>
          <polygon
            points="0,30 30,0 100,70 170,0 200,30 130,100 200,170 170,200 100,130 30,200 0,170 70,100"
            fill="url(#proofXGrad)"
          />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 lg:px-12 w-full relative z-10 py-20">

        {/* Label */}
        <motion.p
          className="eyebrow mb-8 lg:mb-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
        >
          <span className="idx">10</span><span className="rule" />Proof of work
        </motion.p>

        {/* The big number */}
        <div className="mb-6 lg:mb-8 overflow-hidden">
          <motion.div
            key={activeMetric}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <BigCounter
              value={metric.value}
              suffix={metric.suffix}
              prefix={metric.valuePrefix ?? ''}
              active={hasStarted}
              theme={theme}
            />
          </motion.div>
        </div>

        {/* Metric label */}
        <motion.div
          key={`label-${activeMetric}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16 lg:mb-20"
        >
          <p
            className="font-medium mb-2"
            style={{
              fontSize: 'clamp(1.2rem, 3vw, 2.5rem)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            {metric.label}
          </p>
          <p
            className="label"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {metric.sublabel}
          </p>
        </motion.div>

        {/* Metric selector dots */}
        <div className="flex items-center gap-4 mb-4">
          {METRICS.map((m, i) => (
            <button
              key={i}
              onClick={() => {
                if (counterRef.current) clearTimeout(counterRef.current)
                setActiveMetric(i)
              }}
              className="group py-3"
              aria-label={m.label}
            >
              <div
                className="h-px transition-all duration-300"
                style={{
                  width: i === activeMetric ? '40px' : '16px',
                  background: i === activeMetric
                    ? 'var(--accent-cyan)'
                    : 'var(--border-strong)',
                }}
              />
            </button>
          ))}
        </div>

        {/* All metrics, clickable */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 lg:mt-24 border-t pt-10" style={{ borderColor: 'var(--border)' }}>
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="group text-left"
              role="button"
              tabIndex={0}
              onClick={() => {
                if (counterRef.current) clearTimeout(counterRef.current)
                setActiveMetric(i)
              }}
            >
              <p
                className="font-bold mb-1"
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                  color: i === activeMetric ? 'var(--accent-cyan)' : 'var(--text-primary)',
                  letterSpacing: '-0.04em',
                  transition: 'color 0.3s',
                }}
              >
                {m.valuePrefix ?? ''}{m.value.toLocaleString()}{m.suffix}
              </p>
              <p
                className="label"
                style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem' }}
              >
                {m.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
