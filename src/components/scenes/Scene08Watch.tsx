'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import type { Theme } from '@/types'

const SIMULATION_STEPS = [
  { label: 'Companies identified',   value: 1842, delay: 0    },
  { label: 'Relevant',               value: 327,  delay: 600  },
  { label: 'Strong-fit accounts',    value: 91,   delay: 1200 },
  { label: 'Decision makers',        value: 216,  delay: 1800 },
  { label: 'Contextual signals',     value: 1903, delay: 2400 },
  { label: 'Priority conversations', value: 43,   delay: 3200 },
]

const EXAMPLE_PERSON = {
  name: 'CFO, automotive manufacturer, Germany',
  signals: [
    'Announced expansion into Eastern Europe Q1',
    'New ERP procurement cycle initiated',
    'LinkedIn post: "Evaluating implementation partners"',
    'Board approved €4M technology budget',
  ],
}

function AnimatedCounter({ target, running }: { target: number; running: boolean }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!running) { setValue(0); return }
    const duration = 1000
    const steps = Math.min(target, 50)
    let step = 0

    const interval = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (step >= steps) clearInterval(interval)
    }, duration / steps)

    return () => clearInterval(interval)
  }, [target, running])

  return (
    <span className="tabular-nums">{value.toLocaleString()}</span>
  )
}

interface Scene08WatchProps {
  theme: Theme
}

export function Scene08Watch({ theme }: Scene08WatchProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const inView     = useInView(sectionRef, { once: true, amount: 0.15 })
  const [started, setStarted] = useState(false)
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const [showPerson, setShowPerson] = useState(false)

  const runSimulation = useCallback(() => {
    setStarted(true)
    setVisibleSteps([])
    setShowPerson(false)

    SIMULATION_STEPS.forEach((step, i) => {
      setTimeout(() => {
        setVisibleSteps(prev => [...prev, i])
      }, step.delay)
    })

    setTimeout(() => {
      setShowPerson(true)
    }, SIMULATION_STEPS[SIMULATION_STEPS.length - 1].delay + 800)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="watch"
      className="scene relative"
      style={{
        background: 'var(--bg-primary)',
        paddingBlock: 'clamp(6rem, 12vw, 11rem)',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-5 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <motion.p
            className="eyebrow mb-6"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
          >
            <span className="idx">08</span><span className="rule" />Watch TNX work
          </motion.p>
          <motion.h2
            className="font-bold leading-none tracking-[-0.04em]"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 7.5rem)', color: 'var(--text-primary)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            ONE BRIEF.<br /><span className="text-gradient-x">FORTY THREE CONVERSATIONS.</span>
          </motion.h2>
          <motion.p
            className="mt-6 max-w-xl font-light"
            style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', color: 'var(--text-secondary)', lineHeight: 1.55 }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.25 }}
          >
            A simulation of what happens after you hand us a brief. Press start.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Brief */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div
              className="p-6 lg:p-8 border mb-8"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--surface)',
              }}
            >
              <p className="label mb-6" style={{ color: 'var(--text-tertiary)' }}>Brief</p>
              <div className="space-y-4">
                {[
                  { field: 'Company',  value: 'SAP implementation partner' },
                  { field: 'Market',   value: 'Germany' },
                  { field: 'Audience', value: 'Manufacturing CFOs' },
                ].map(({ field, value }) => (
                  <div key={field} className="grid grid-cols-2 gap-4">
                    <span className="label" style={{ color: 'var(--text-tertiary)' }}>{field}</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Start button */}
            {!started ? (
              <button
                onClick={runSimulation}
                className="group relative w-full py-5 font-medium tracking-[0.14em] uppercase text-sm text-white overflow-hidden"
                style={{ background: 'var(--accent-blue)' }}
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'var(--x-gradient)' }} />
                <span className="relative">Start engine <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span></span>
              </button>
            ) : (
              <button
                onClick={runSimulation}
                className="w-full py-4 font-medium tracking-[0.1em] uppercase text-sm cursor-none"
                style={{
                  background: 'var(--surface)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                Run again
              </button>
            )}
          </motion.div>

          {/* Right: Live output */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {/* Metrics stream */}
            <div
              className="p-6 lg:p-8 border mb-6"
              style={{
                borderColor: 'var(--border)',
                background: theme === 'dark' ? 'rgba(14,17,22,0.8)' : 'rgba(228,229,235,0.5)',
                minHeight: '280px',
              }}
            >
              {!started && (
                <div className="space-y-4" aria-hidden="true">
                  <p className="label flex items-center gap-2" style={{ color: 'var(--text-tertiary)' }}>
                    <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-cyan)' }}
                      animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.6, repeat: Infinity }} />
                    Engine ready
                  </p>
                  {SIMULATION_STEPS.map(s => (
                    <div key={s.label} className="flex items-baseline justify-between opacity-40">
                      <span className="label">{s.label}</span>
                      <span className="font-bold tabular-nums" style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)', color: 'var(--text-tertiary)' }}>000</span>
                    </div>
                  ))}
                </div>
              )}

              {started && (
                <div className="space-y-3">
                  {SIMULATION_STEPS.map((step, i) => (
                    <AnimatePresence key={i}>
                      {visibleSteps.includes(i) && (
                        <motion.div
                          className="flex items-baseline justify-between"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <span
                            className="label"
                            style={{ color: 'var(--text-tertiary)' }}
                          >
                            {step.label}
                          </span>
                          <span
                            className="font-bold"
                            style={{
                              fontSize: 'clamp(1.2rem, 3vw, 2rem)',
                              background: 'var(--x-gradient)',
                              WebkitBackgroundClip: 'text',
                              backgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              letterSpacing: '-0.03em',
                            }}
                          >
                            <AnimatedCounter target={step.value} running={visibleSteps.includes(i)} />
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  ))}
                </div>
              )}
            </div>

            {/* Person zoom */}
            <AnimatePresence>
              {showPerson && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="p-6 border"
                  style={{
                    borderColor: 'var(--accent-cyan)',
                    background: theme === 'dark'
                      ? 'rgba(0,229,255,0.04)'
                      : 'rgba(0,190,220,0.04)',
                  }}
                >
                  <p className="label mb-4" style={{ color: 'var(--accent-cyan)' }}>
                    Priority prospect
                  </p>
                  <p
                    className="font-medium mb-4"
                    style={{ fontSize: '1rem', color: 'var(--text-primary)' }}
                  >
                    {EXAMPLE_PERSON.name}
                  </p>
                  <p className="label mb-3" style={{ color: 'var(--text-tertiary)' }}>
                    Why TNX would approach them now:
                  </p>
                  <ul className="space-y-2">
                    {EXAMPLE_PERSON.signals.map((signal, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12 }}
                      >
                        <span style={{ color: 'var(--accent-cyan)', marginTop: '2px', fontSize: '0.8rem' }}>→</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {signal}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
