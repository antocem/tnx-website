'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion'
import type { Theme } from '@/types'

const EASE = [0.16, 1, 0.3, 1] as const

const STATEMENTS = [
  { id: 'expand',    text: 'Markets expand.',            sub: 'New territories open every quarter.' },
  { id: 'evolve',   text: 'Companies evolve.',           sub: 'Leadership, strategy, priorities shift.' },
  { id: 'change',   text: 'Decision makers change.',     sub: 'The contact you had last year may be gone.' },
  { id: 'appear',   text: 'Opportunities appear.',       sub: 'Funding rounds. Headcount surges. Tech changes.' },
  { id: 'disappear',text: 'And disappear.',              sub: 'The window is narrow. Timing matters.' },
]

// Deterministic "random" for node positions
function seededRand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

interface NetworkNode {
  id: number
  x: number
  y: number
  r: number
  type: 'company' | 'person' | 'market' | 'signal'
  label?: string
}

interface NetworkEdge {
  from: number
  to: number
}

const COMPANY_LABELS = ['Vestas', 'N26', 'Bolt', 'Glovo', 'Personio', 'Scalable', 'Tier', 'Trade Rep']
const COUNTRY_LABELS = ['DE', 'RO', 'FR', 'PL', 'HU', 'BG', 'NL', 'SE']

function buildNetwork(phase: number): { nodes: NetworkNode[]; edges: NetworkEdge[] } {
  const nodes: NetworkNode[] = []
  const edges: NetworkEdge[] = []

  if (phase === 0) {
    // Phase 0: geographic market network — nodes as country clusters
    for (let i = 0; i < 8; i++) {
      nodes.push({
        id: i,
        x: 10 + seededRand(i * 3 + 1) * 80,
        y: 10 + seededRand(i * 3 + 2) * 80,
        r: 6 + seededRand(i * 3 + 3) * 8,
        type: 'market',
        label: COUNTRY_LABELS[i],
      })
    }
    edges.push({ from: 0, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 4 }, { from: 3, to: 5 }, { from: 4, to: 6 }, { from: 0, to: 7 })
  } else if (phase === 1) {
    // Phase 1: company nodes transforming
    for (let i = 0; i < 8; i++) {
      nodes.push({
        id: i,
        x: 15 + seededRand(i * 7 + 11) * 70,
        y: 15 + seededRand(i * 7 + 12) * 70,
        r: 5 + seededRand(i * 7 + 13) * 6,
        type: 'company',
        label: COMPANY_LABELS[i],
      })
    }
    edges.push({ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 3, to: 7 })
  } else if (phase === 2) {
    // Phase 2: people nodes with shifting connections
    for (let i = 0; i < 10; i++) {
      nodes.push({
        id: i,
        x: 10 + seededRand(i * 5 + 21) * 80,
        y: 10 + seededRand(i * 5 + 22) * 80,
        r: 4,
        type: 'person',
      })
    }
    edges.push(
      { from: 0, to: 4 }, { from: 1, to: 5 }, { from: 2, to: 6 },
      { from: 3, to: 7 }, { from: 4, to: 8 }, { from: 5, to: 9 },
      { from: 0, to: 8 }, { from: 2, to: 9 },
    )
  } else if (phase === 3) {
    // Phase 3: signals emerging — bright points
    for (let i = 0; i < 12; i++) {
      nodes.push({
        id: i,
        x: 8 + seededRand(i * 11 + 31) * 84,
        y: 8 + seededRand(i * 11 + 32) * 84,
        r: i < 5 ? 7 : 3,
        type: 'signal',
      })
    }
    edges.push({ from: 0, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 4 }, { from: 3, to: 5 }, { from: 4, to: 6 })
  } else {
    // Phase 4: signals fading — same positions, smaller/dimmer
    for (let i = 0; i < 12; i++) {
      nodes.push({
        id: i,
        x: 8 + seededRand(i * 11 + 31) * 84,
        y: 8 + seededRand(i * 11 + 32) * 84,
        r: i < 5 ? 3 : 1.5,
        type: 'signal',
      })
    }
  }

  return { nodes, edges }
}

function NetworkViz({ phase, theme }: { phase: number; theme: Theme }) {
  const { nodes, edges } = buildNetwork(phase)
  const isDark = theme === 'dark'

  const nodeColor = {
    market: isDark ? '#00E5FF' : '#00BEDC',
    company: isDark ? '#126BFF' : '#0D5FE8',
    person: isDark ? '#7B2DFF' : '#6320E0',
    signal: isDark ? '#00E5FF' : '#00BEDC',
  }

  const edgeOpacity = phase === 4 ? 0.08 : 0.25

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      <defs>
        <filter id="node-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {edges.map((e, i) => {
        const from = nodes[e.from]
        const to = nodes[e.to]
        if (!from || !to) return null
        return (
          <line
            key={i}
            x1={from.x} y1={from.y}
            x2={to.x} y2={to.y}
            stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'}
            strokeWidth="0.4"
            strokeDasharray="1.5 3"
            opacity={edgeOpacity}
          />
        )
      })}

      {/* Nodes */}
      {nodes.map(n => (
        <g key={n.id} filter={n.type === 'signal' && phase === 3 ? 'url(#node-glow)' : undefined}>
          <circle
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={nodeColor[n.type]}
            opacity={phase === 4 ? (n.id < 5 ? 0.25 : 0.12) : 0.85}
          />
          {n.label && (
            <text
              x={n.x}
              y={n.y - n.r - 1.5}
              textAnchor="middle"
              fontSize="4"
              fill={isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)'}
              fontFamily="sans-serif"
              fontWeight="600"
              letterSpacing="0.5"
            >
              {n.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}

interface Scene02WorldWaitProps {
  theme: Theme
}

export function Scene02WorldWait({ theme }: Scene02WorldWaitProps) {
  const containerRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  // Map scroll to statement index (0-4) plus final state (5)
  const rawIndex = useTransform(scrollYProgress, [0.05, 0.75], [0, STATEMENTS.length - 0.01])

  const [activeIndex, setActiveIndex] = useState(0)
  const [showFinal, setShowFinal] = useState(false)

  useEffect(() => {
    const unsub1 = rawIndex.on('change', v => {
      setActiveIndex(Math.floor(Math.min(v, STATEMENTS.length - 1)))
    })
    const unsub2 = scrollYProgress.on('change', v => {
      setShowFinal(v > 0.78)
    })
    return () => { unsub1(); unsub2() }
  }, [rawIndex, scrollYProgress])

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.04, 0.90, 1], [0, 1, 1, 0])

  return (
    <section
      ref={containerRef}
      id="world"
      className="relative"
      style={{ height: reduced ? 'auto' : '450svh' }}
    >
      {/* Reduced motion: static layout */}
      {reduced ? (
        <div className="py-32 px-5 max-w-[1440px] mx-auto">
          <h2
            className="font-bold tracking-[-0.045em] mb-12"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 6rem)', color: 'var(--text-primary)' }}
          >
            THE WORLD DOESN&apos;T WAIT.
          </h2>
          {STATEMENTS.map(s => (
            <p key={s.id} className="mb-4 text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>
              {s.text}
            </p>
          ))}
          <p className="mt-12 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            GROWTH BELONGS TO THOSE WHO MOVE.
          </p>
        </div>
      ) : (
        <motion.div
          className="sticky top-0 h-[100svh] overflow-hidden"
          style={{ opacity: sectionOpacity }}
        >
          {/* Ambient background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: theme === 'dark'
                ? 'radial-gradient(60% 50% at 75% 50%, rgba(123,45,255,0.07) 0%, transparent 70%)'
                : 'radial-gradient(60% 50% at 75% 50%, rgba(99,32,224,0.05) 0%, transparent 70%)',
            }}
          />

          <div className="relative h-full max-w-[1440px] mx-auto px-5 lg:px-12 flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 w-full">

              {/* Left: text content */}
              <div className="flex flex-col justify-center">
                {/* Main headline */}
                <AnimatePresence mode="wait">
                  {!showFinal ? (
                    <motion.div
                      key="statements"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.p
                        className="eyebrow mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                      >
                        <span className="idx">02</span>
                        <span className="rule" />
                        Why TNX exists
                      </motion.p>

                      <h2
                        className="font-bold leading-[0.88] tracking-[-0.048em] mb-12"
                        style={{
                          fontSize: 'clamp(2.4rem, 6.5vw, 6.5rem)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        THE WORLD<br />
                        <span className="text-gradient-x">DOESN&apos;T</span><br />
                        WAIT.
                      </h2>

                      {/* Progressive statements */}
                      <div className="space-y-6">
                        {STATEMENTS.map((s, i) => (
                          <motion.div
                            key={s.id}
                            animate={{
                              opacity: i <= activeIndex ? (i === activeIndex ? 1 : 0.35) : 0.12,
                            }}
                            transition={{ duration: 0.6, ease: EASE }}
                          >
                            <p
                              className="font-semibold tracking-[-0.02em]"
                              style={{
                                fontSize: 'clamp(1.1rem, 2.2vw, 1.9rem)',
                                color: i === activeIndex ? 'var(--text-primary)' : 'var(--text-secondary)',
                                transition: 'color 0.4s',
                              }}
                            >
                              {i === activeIndex && (
                                <motion.span
                                  className="inline-block mr-3"
                                  style={{ color: 'var(--accent-cyan)', fontSize: '0.7em' }}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.4 }}
                                >
                                  →
                                </motion.span>
                              )}
                              {s.text}
                            </p>
                            <AnimatePresence>
                              {i === activeIndex && (
                                <motion.p
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.4 }}
                                  style={{
                                    fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
                                    color: 'var(--text-tertiary)',
                                    marginTop: '0.4rem',
                                    paddingLeft: '1.6rem',
                                  }}
                                >
                                  {s.sub}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="final"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.9, ease: EASE }}
                    >
                      <h2
                        className="font-bold leading-[0.88] tracking-[-0.048em] mb-8"
                        style={{
                          fontSize: 'clamp(2.2rem, 6vw, 5.5rem)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        GROWTH BELONGS<br />
                        TO THOSE WHO<br />
                        <span className="text-gradient-x">MOVE.</span>
                      </h2>
                      <p
                        className="font-light max-w-[40ch]"
                        style={{
                          fontSize: 'clamp(0.95rem, 1.5vw, 1.2rem)',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.65,
                        }}
                      >
                        TNX helps businesses identify opportunities, reach the right people
                        and build commercial momentum across markets.
                      </p>

                      <motion.div
                        className="mt-10 flex items-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: 'var(--text-tertiary)',
                          }}
                        >
                          Continue scrolling
                        </span>
                        <motion.span
                          style={{ color: 'var(--accent-cyan)' }}
                          animate={{ y: [0, 4, 0] }}
                          transition={{ duration: 1.4, repeat: Infinity }}
                        >
                          ↓
                        </motion.span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right: network visualization */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative w-full" style={{ maxWidth: 440, aspectRatio: '1' }}>

                  {/* Border frame — architectural */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      border: '1px solid var(--border)',
                    }}
                  />
                  <div
                    className="absolute top-3 left-3 right-3 bottom-3 pointer-events-none"
                    style={{ border: '1px solid var(--border)' }}
                  />

                  {/* Corner accents */}
                  {[
                    { top: 0, left: 0 },
                    { top: 0, right: 0 },
                    { bottom: 0, left: 0 },
                    { bottom: 0, right: 0 },
                  ].map((pos, i) => (
                    <span
                      key={i}
                      className="absolute w-3 h-3"
                      style={{
                        ...pos,
                        borderTop: i < 2 ? '2px solid var(--accent-cyan)' : undefined,
                        borderBottom: i >= 2 ? '2px solid var(--accent-cyan)' : undefined,
                        borderLeft: i % 2 === 0 ? '2px solid var(--accent-cyan)' : undefined,
                        borderRight: i % 2 === 1 ? '2px solid var(--accent-cyan)' : undefined,
                        opacity: 0.6,
                      }}
                    />
                  ))}

                  {/* Phase label */}
                  <div
                    className="absolute top-5 left-5 z-10"
                    style={{
                      fontSize: '0.55rem',
                      fontWeight: 600,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--accent-cyan)',
                    }}
                  >
                    {['MARKET NETWORK', 'COMPANY ECOSYSTEM', 'DECISION LAYER', 'SIGNAL FIELD', 'WINDOW CLOSING'][Math.min(activeIndex, 4)]}
                  </div>

                  {/* Visualization */}
                  <div className="absolute inset-0 p-6 pt-10">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeIndex}
                        className="w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <NetworkViz phase={activeIndex} theme={theme} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom fade */}
          <div
            className="absolute bottom-0 inset-x-0 h-40 z-20 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-primary))' }}
          />
        </motion.div>
      )}
    </section>
  )
}
