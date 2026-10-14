'use client'

import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll } from 'framer-motion'
import type { Theme } from '@/types'

const COLS = 20
const ROWS = 9
const TOTAL = COLS * ROWS

function rand(s: number) { const x = Math.sin(s * 78.233 + 12.9898) * 43758.5453; return x - Math.floor(x) }

const WHY_NOW = [
  'Opened a new plant in Timisoara',
  'Hired a new CFO last month',
  'Announced ERP migration',
  'Expanding sales team in DACH',
  'Raised a Series B',
  'New Head of Operations',
  'Entering the Bulgarian market',
  'Public tender for CRM',
  'Leadership change in IT',
  'Doubling headcount this year',
  'Post about vendor consolidation',
  'New regional office in Budapest',
  'Migrating to cloud infrastructure',
  'Board approved digital budget',
]

const STAGES = [
  { n: TOTAL, label: 'Companies in the market' },
  { n: 0, label: 'Relevant to you' },
  { n: 0, label: 'Priority accounts, right now' },
]

export function Scene03Audience({ theme }: { theme: Theme }) {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.15 })
  const [stage, setStage] = useState(0)
  const [hover, setHover] = useState<number | null>(null)

  const companies = useMemo(() => {
    const list = Array.from({ length: TOTAL }, (_, i) => ({ i, r: rand(i + 1), tier: 0 as 0 | 1 | 2, why: '' }))
    // Spread tiers across the whole grid, deterministic
    let p = 0
    list.forEach(c => {
      if (c.r > 0.92 && p < WHY_NOW.length) { c.tier = 2; c.why = WHY_NOW[p++] }
      else if (c.r > 0.66) c.tier = 1
    })
    return list
  }, [])

  const counts = useMemo(() => ({
    relevant: companies.filter(c => c.tier >= 1).length,
    priority: companies.filter(c => c.tier === 2).length,
  }), [companies])
  STAGES[1].n = counts.relevant
  STAGES[2].n = counts.priority

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', v => {
    const s = v < 0.3 ? 0 : v < 0.6 ? 1 : 2
    setStage(prev => (prev === s ? prev : s))
  })

  const dotStyle = (tier: number) => {
    const cyan = 'var(--accent-cyan)'
    const violet = 'var(--accent-violet)'
    const grey = theme === 'dark' ? '#3A3F48' : '#C4C7CE'
    if (stage === 0) return { bg: theme === 'dark' ? '#6E737C' : '#9A9EA6', o: 0.55, s: 1 }
    if (stage === 1) return tier >= 1 ? { bg: violet, o: 0.9, s: 1.15 } : { bg: grey, o: 0.25, s: 0.7 }
    return tier === 2 ? { bg: cyan, o: 1, s: 1.9 } : tier === 1 ? { bg: violet, o: 0.3, s: 0.9 } : { bg: grey, o: 0.12, s: 0.6 }
  }

  const hovered = hover !== null ? companies[hover] : null

  return (
    <section ref={sectionRef} id="audience" className="relative" style={{ height: '260svh', background: 'var(--bg-secondary)' }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col justify-center">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--signal-glow)' }} />

        <div className="relative max-w-[1440px] w-full mx-auto px-5 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_auto] gap-6 lg:gap-16 items-end mb-8 lg:mb-12">
            <div>
              <motion.p className="eyebrow mb-5" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>
                <span className="idx">03</span><span className="rule" />Audience intelligence
              </motion.p>
              <motion.h2
                className="font-bold leading-[0.92] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(2.4rem, 5.8vw, 6.5rem)', color: 'var(--text-primary)' }}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                EVERY BUSINESS<br />HAS AN <span className="text-gradient-x">AUDIENCE.</span>
              </motion.h2>
              <motion.p
                className="mt-5 font-light max-w-lg"
                style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', color: 'var(--text-secondary)', lineHeight: 1.55 }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.25 }}
              >
                Finding companies is easy. Finding the right reason to speak to them isn&apos;t.
              </motion.p>
            </div>

            {/* Live funnel counter */}
            <div className="lg:text-right" aria-live="polite">
              <div className="font-bold tabular-nums leading-none tracking-[-0.05em] text-gradient-x" style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}>
                <AnimatePresence mode="wait">
                  <motion.span key={stage} className="inline-block"
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                    {STAGES[stage].n}
                  </motion.span>
                </AnimatePresence>
              </div>
              <p className="label mt-2" style={{ color: 'var(--text-primary)' }}>{STAGES[stage].label}</p>
              <div className="flex lg:justify-end gap-1.5 mt-3">
                {STAGES.map((_, i) => (
                  <span key={i} className="h-px transition-all duration-500" style={{ width: i === stage ? 28 : 10, background: i <= stage ? 'var(--accent-cyan)' : 'var(--border-strong)' }} />
                ))}
              </div>
            </div>
          </div>

          {/* Market grid */}
          <div className="relative" onMouseLeave={() => setHover(null)}>
            <div
              className="grid gap-y-3 sm:gap-y-4"
              style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
            >
              {companies.map((c, idx) => {
                const st = dotStyle(c.tier)
                const interactive = stage === 2 && c.tier === 2
                return (
                  <div key={c.i} className="flex items-center justify-center h-3 sm:h-4">
                    <motion.button
                      type="button"
                      tabIndex={interactive ? 0 : -1}
                      aria-label={interactive ? `Priority account: ${c.why}` : undefined}
                      onMouseEnter={() => interactive && setHover(idx)}
                      onFocus={() => interactive && setHover(idx)}
                      onClick={() => interactive && setHover(h => (h === idx ? null : idx))}
                      className="rounded-full"
                      style={{
                        width: 6, height: 6,
                        background: st.bg,
                        boxShadow: stage === 2 && c.tier === 2 ? '0 0 14px var(--accent-cyan)' : 'none',
                        pointerEvents: interactive ? 'auto' : 'none',
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={inView ? { opacity: st.o, scale: hover === idx ? st.s * 1.6 : st.s } : {}}
                      transition={{ duration: 0.6, delay: stage === 0 ? (idx % COLS) * 0.015 + Math.floor(idx / COLS) * 0.03 : rand(idx) * 0.25, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                )
              })}
            </div>

            {/* Why now tooltip */}
            <AnimatePresence>
              {hovered && stage === 2 && (
                <motion.div
                  key={hovered.i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute z-10 pointer-events-none px-4 py-3 min-w-[220px]"
                  style={{
                    left: `${Math.min(80, Math.max(0, ((hovered.i % COLS) / COLS) * 100 - 6))}%`,
                    top: `${(Math.floor(hovered.i / COLS) / ROWS) * 100 + 14}%`,
                    background: theme === 'dark' ? 'rgba(5,7,10,0.92)' : 'rgba(255,255,255,0.95)',
                    border: '1px solid var(--accent-cyan)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <p className="label mb-1" style={{ color: 'var(--accent-cyan)' }}>Why now</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{hovered.why}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              {[
                { l: 'Priority', c: 'var(--accent-cyan)' },
                { l: 'Relevant', c: 'var(--accent-violet)' },
                { l: 'Filtered out', c: theme === 'dark' ? '#3A3F48' : '#C4C7CE' },
              ].map(x => (
                <span key={x.l} className="flex items-center gap-2 label">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: x.c }} />{x.l}
                </span>
              ))}
            </div>
            <motion.p className="label" animate={{ opacity: stage === 2 ? 1 : 0 }} style={{ color: 'var(--text-secondary)' }}>
              Hover a priority account to see why now
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}
