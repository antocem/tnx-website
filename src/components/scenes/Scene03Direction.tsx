'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { Theme } from '@/types'
import { SITE } from '@/lib/site'

const EASE = [0.16, 1, 0.3, 1] as const

// ─── JOURNEY DEFINITIONS ───────────────────────────────────────────────────

const JOURNEYS = [
  {
    id: 'markets',
    number: '01',
    shortLabel: 'ENTER NEW MARKETS',
    headline: 'YOUR NEXT\nMARKET IS\nCLOSER THAN\nYOU THINK.',
    description: 'We map the territory before you commit a single headcount. Romania, Bulgaria, Germany, Hungary — markets where we already have native language execution and local intelligence.',
    deliverables: ['Market mapping', 'Local expertise', 'Target accounts', 'Native conversations'],
    ctaText: 'Enter a new market',
    ctaHref: `mailto:${SITE.contactEmail}?subject=Enter new markets — TNX`,
    colorPrimary: '#00E5FF',
    colorSecondary: '#126BFF',
    gradient: 'linear-gradient(135deg, #00E5FF 0%, #126BFF 60%, #2732D9 100%)',
    journeyHeadline: 'ENTER\nNEW MARKETS',
    journeyFull: `Take your business beyond borders.\n\nWe do the heavy lifting: market research, local language outreach, decision-maker mapping, and first qualified meetings — before you commit budget.`,
  },
  {
    id: 'revenue',
    number: '02',
    shortLabel: 'GENERATE MORE REVENUE',
    headline: 'OPPORTUNITY\nIS EVERYWHERE.\nRELEVANCE\nISN\'T.',
    description: 'We turn market noise into a qualified pipeline. Our intelligence layer reads signals, finds the right moment, and opens conversations that actually convert.',
    deliverables: ['Signal intelligence', 'Qualified pipeline', 'Decision-maker access', 'Conversion-ready meetings'],
    ctaText: 'Fill your pipeline',
    ctaHref: `mailto:${SITE.contactEmail}?subject=Generate more revenue — TNX`,
    colorPrimary: '#126BFF',
    colorSecondary: '#7B2DFF',
    gradient: 'linear-gradient(135deg, #126BFF 0%, #7B2DFF 60%, #9B2DFF 100%)',
    journeyHeadline: 'GENERATE\nMORE REVENUE',
    journeyFull: `Build a stronger, more predictable pipeline.\n\nWe find companies at the right moment — funding rounds, leadership changes, market expansions — and open the conversation before your competitors do.`,
  },
  {
    id: 'people',
    number: '03',
    shortLabel: 'REACH THE RIGHT PEOPLE',
    headline: 'THE RIGHT\nCONVERSATION\nCHANGES\nEVERYTHING.',
    description: 'One target company has multiple decision makers. We map the relationships, understand the context, and craft outreach that resonates at each level.',
    deliverables: ['Stakeholder mapping', 'Contextual outreach', 'Multi-thread access', 'Relationship entry'],
    ctaText: 'Start the right conversation',
    ctaHref: `mailto:${SITE.contactEmail}?subject=Reach the right people — TNX`,
    colorPrimary: '#7B2DFF',
    colorSecondary: '#FF1EC8',
    gradient: 'linear-gradient(135deg, #7B2DFF 0%, #C020D8 60%, #FF1EC8 100%)',
    journeyHeadline: 'REACH THE\nRIGHT PEOPLE',
    journeyFull: `The right person at the right company at the right time.\n\nWe don't spray messages. We build a contextual picture of each target, understand who matters, and open conversations that feel relevant — not intrusive.`,
  },
  {
    id: 'engine',
    number: '04',
    shortLabel: 'BUILD YOUR SALES ENGINE',
    headline: 'GROWTH\nSHOULD BE\nA SYSTEM,\nNOT A SPRINT.',
    description: 'Senior commercial talent embedded in your operation. No ramp months. No equity. We plug into your team from week one and build a repeatable revenue machine.',
    deliverables: ['Embedded senior capacity', 'Process architecture', 'TNX OS integration', 'Repeatable operation'],
    ctaText: 'Build the engine',
    ctaHref: `mailto:${SITE.contactEmail}?subject=Build sales engine — TNX`,
    colorPrimary: '#FF1EC8',
    colorSecondary: '#7B2DFF',
    gradient: 'linear-gradient(135deg, #FF1EC8 0%, #7B2DFF 60%, #126BFF 100%)',
    journeyHeadline: 'BUILD YOUR\nSALES ENGINE',
    journeyFull: `Scale your commercial operations without scaling headcount.\n\nStrategy, intelligence, execution, learning — four layers that compound. We embed inside your operation and build the system that generates revenue on repeat.`,
  },
]

// ─── VISUAL ENVIRONMENTS ───────────────────────────────────────────────────

function seededRand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

// Visual: European network (markets)
function EnvMarkets({ theme, active }: { theme: Theme; active: boolean }) {
  const isDark = theme === 'dark'
  const countries = [
    { x: 55, y: 28, label: 'DE', size: 8 },
    { x: 68, y: 42, label: 'PL', size: 6 },
    { x: 62, y: 58, label: 'HU', size: 6 },
    { x: 45, y: 65, label: 'RO', size: 9, primary: true },
    { x: 47, y: 78, label: 'BG', size: 6 },
    { x: 38, y: 35, label: 'FR', size: 7 },
    { x: 75, y: 25, label: 'SE', size: 5 },
    { x: 30, y: 50, label: 'ES', size: 5 },
  ]
  const connections = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 2], [0, 5], [1, 3], [5, 7]]

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="env-m-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity={active ? 0.15 : 0.05} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#env-m-glow)" />
      {connections.map(([a, b], i) => {
        const n1 = countries[a]
        const n2 = countries[b]
        return (
          <motion.line
            key={i}
            x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
            stroke="#00E5FF"
            strokeWidth="0.4"
            strokeDasharray="2 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: active ? 1 : 0, opacity: active ? 0.3 : 0 }}
            transition={{ duration: 1.2, delay: i * 0.12, ease: EASE }}
          />
        )
      })}
      {countries.map((c, i) => (
        <g key={c.label}>
          <motion.circle
            cx={c.x} cy={c.y} r={c.size / 2}
            fill={c.primary ? '#00E5FF' : '#126BFF'}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: active ? 1 : 0, opacity: active ? (c.primary ? 0.9 : 0.55) : 0 }}
            transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: EASE }}
          />
          <motion.text
            x={c.x} y={c.y - c.size / 2 - 1.5}
            textAnchor="middle"
            fontSize="3.5"
            fill={isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)'}
            fontFamily="sans-serif"
            fontWeight="700"
            letterSpacing="0.3"
            initial={{ opacity: 0 }}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.08 }}
          >
            {c.label}
          </motion.text>
        </g>
      ))}
    </svg>
  )
}

// Visual: Pipeline / revenue signals
function EnvRevenue({ theme, active }: { theme: Theme; active: boolean }) {
  const isDark = theme === 'dark'
  const companies = Array.from({ length: 20 }, (_, i) => ({
    x: 8 + seededRand(i * 7 + 1) * 84,
    y: 8 + seededRand(i * 7 + 2) * 84,
    r: 1.5 + seededRand(i * 7 + 3) * 3,
    isSignal: i < 5,
  }))

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="env-r-pipe" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#126BFF" stopOpacity="0" />
          <stop offset="40%" stopColor="#126BFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#7B2DFF" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Background companies */}
      {companies.map((c, i) => (
        <motion.circle
          key={i}
          cx={c.x} cy={c.y} r={c.r}
          fill={c.isSignal ? '#126BFF' : isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: active ? (c.isSignal ? 0.9 : 0.3) : 0, scale: active ? 1 : 0 }}
          transition={{ duration: 0.6, delay: i * 0.04, ease: EASE }}
        />
      ))}

      {/* Pipeline lines converging */}
      {companies.slice(0, 5).map((c, i) => (
        <motion.line
          key={i}
          x1={c.x} y1={c.y} x2={85} y2={50}
          stroke="url(#env-r-pipe)"
          strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: active ? 1 : 0, opacity: active ? 0.6 : 0 }}
          transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: EASE }}
        />
      ))}

      {/* Pipeline endpoint */}
      <motion.circle
        cx={85} cy={50} r={7}
        fill="#126BFF"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: active ? 1 : 0, opacity: active ? 0.8 : 0 }}
        transition={{ duration: 0.8, delay: 1, ease: EASE }}
      />
      <motion.text
        x={85} y={53.5}
        textAnchor="middle"
        fontSize="4"
        fill="white"
        fontFamily="sans-serif"
        fontWeight="700"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ delay: 1.2 }}
      >
        ✓
      </motion.text>
    </svg>
  )
}

// Visual: Decision makers network
function EnvPeople({ theme, active }: { theme: Theme; active: boolean }) {
  const isDark = theme === 'dark'
  const center = { x: 50, y: 50 }
  const people = [
    { x: 50, y: 20, label: 'CEO', r: 6 },
    { x: 78, y: 38, label: 'CRO', r: 5 },
    { x: 78, y: 62, label: 'VP Sales', r: 5 },
    { x: 50, y: 78, label: 'CFO', r: 4.5 },
    { x: 22, y: 62, label: 'CMO', r: 4.5 },
    { x: 22, y: 38, label: 'CTO', r: 4.5 },
  ]

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      {/* Company node */}
      <motion.circle
        cx={center.x} cy={center.y} r={10}
        fill={isDark ? 'rgba(123,45,255,0.15)' : 'rgba(99,32,224,0.12)'}
        stroke="#7B2DFF"
        strokeWidth="0.5"
        initial={{ scale: 0 }}
        animate={{ scale: active ? 1 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      />
      <motion.text
        x={center.x} y={center.y + 1.5}
        textAnchor="middle"
        fontSize="3.5"
        fill={isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'}
        fontFamily="sans-serif"
        fontWeight="700"
        letterSpacing="0.3"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ delay: 0.4 }}
      >
        TARGET
      </motion.text>

      {/* Decision maker nodes */}
      {people.map((p, i) => (
        <g key={p.label}>
          <motion.line
            x1={center.x} y1={center.y}
            x2={p.x} y2={p.y}
            stroke="#7B2DFF"
            strokeWidth="0.4"
            strokeDasharray="1.5 3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: active ? 1 : 0, opacity: active ? 0.3 : 0 }}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
          />
          <motion.circle
            cx={p.x} cy={p.y} r={p.r}
            fill="#7B2DFF"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: active ? 1 : 0, opacity: active ? 0.8 : 0 }}
            transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: EASE }}
          />
          <motion.text
            x={p.x} y={p.y + 1.2}
            textAnchor="middle"
            fontSize="2.8"
            fill="white"
            fontFamily="sans-serif"
            fontWeight="700"
            initial={{ opacity: 0 }}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ delay: 0.7 + i * 0.1 }}
          >
            {p.label}
          </motion.text>
        </g>
      ))}
    </svg>
  )
}

// Visual: TNX X architecture
function EnvEngine({ theme, active }: { theme: Theme; active: boolean }) {
  const isDark = theme === 'dark'
  const layers = [
    { label: 'STRATEGY', y: 18, color: '#FF1EC8' },
    { label: 'INTELLIGENCE', y: 38, color: '#C020D8' },
    { label: 'EXECUTION', y: 58, color: '#7B2DFF' },
    { label: 'LEARNING', y: 78, color: '#126BFF' },
  ]

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="env-e-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF1EC8" />
          <stop offset="100%" stopColor="#126BFF" />
        </linearGradient>
      </defs>

      {/* Central vertical spine */}
      <motion.line
        x1={50} y1={10} x2={50} y2={90}
        stroke="url(#env-e-line)"
        strokeWidth="0.8"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: active ? 1 : 0, opacity: active ? 0.5 : 0 }}
        transition={{ duration: 1.2, ease: EASE }}
      />

      {layers.map((l, i) => (
        <g key={l.label}>
          {/* Horizontal connector */}
          <motion.line
            x1={20} y1={l.y} x2={80} y2={l.y}
            stroke={l.color}
            strokeWidth="0.4"
            strokeDasharray="1 3"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: active ? 1 : 0, opacity: active ? 0.4 : 0 }}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.15 }}
          />
          {/* Node */}
          <motion.circle
            cx={50} cy={l.y} r={4}
            fill={l.color}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: active ? 1 : 0, opacity: active ? 0.85 : 0 }}
            transition={{ duration: 0.6, delay: 0.4 + i * 0.15, ease: EASE }}
          />
          {/* Label */}
          <motion.text
            x={56} y={l.y + 1.2}
            fontSize="3"
            fill={isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)'}
            fontFamily="sans-serif"
            fontWeight="700"
            letterSpacing="0.4"
            initial={{ opacity: 0, x: 58 }}
            animate={{ opacity: active ? 1 : 0, x: active ? 56 : 58 }}
            transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
          >
            {l.label}
          </motion.text>
          {/* Pulse on node */}
          {active && (
            <motion.circle
              cx={50} cy={l.y} r={4}
              stroke={l.color}
              strokeWidth="1"
              fill="none"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 1.8, delay: 0.8 + i * 0.2, repeat: Infinity, repeatDelay: 1 }}
            />
          )}
        </g>
      ))}
    </svg>
  )
}

// ─── DIRECTION CARD ────────────────────────────────────────────────────────

function DirectionCard({
  j,
  index,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  theme,
}: {
  j: typeof JOURNEYS[0]
  index: number
  isSelected: boolean
  isHovered: boolean
  onSelect: () => void
  onHover: (h: boolean) => void
  theme: Theme
}) {
  const active = isSelected || isHovered

  return (
    <motion.button
      className="relative w-full text-left overflow-hidden"
      onClick={onSelect}
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
      data-cursor="hover"
      style={{ borderRadius: 0 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.1 + index * 0.1, ease: EASE }}
    >
      {/* Background fill */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: j.gradient }}
        animate={{ opacity: active ? (isSelected ? 0.1 : 0.05) : 0 }}
        transition={{ duration: 0.35 }}
      />

      {/* Left accent bar */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[2px]"
        style={{ background: j.gradient }}
        animate={{
          scaleY: active ? 1 : 0.2,
          opacity: isSelected ? 1 : isHovered ? 0.7 : 0.2,
        }}
        transition={{ duration: 0.4, ease: EASE }}
      />

      <div className="pl-7 pr-5 py-6 lg:py-7 flex items-center gap-6">
        {/* Number */}
        <span
          className="font-semibold tabular-nums flex-shrink-0"
          style={{
            fontSize: 'clamp(0.65rem, 0.9vw, 0.8rem)',
            letterSpacing: '0.1em',
            color: j.colorPrimary,
          }}
        >
          {j.number}
        </span>

        {/* Label */}
        <span
          className="font-bold tracking-[-0.02em] flex-1 text-left"
          style={{
            fontSize: 'clamp(0.85rem, 1.5vw, 1.2rem)',
            color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
            transition: 'color 0.3s',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {j.shortLabel}
        </span>

        {/* Arrow */}
        <motion.span
          className="flex-shrink-0 text-base"
          style={{ color: j.colorPrimary }}
          animate={{
            x: active ? 4 : 0,
            opacity: active ? 1 : 0.3,
          }}
          transition={{ duration: 0.3 }}
        >
          →
        </motion.span>
      </div>
    </motion.button>
  )
}

// ─── JOURNEY DETAIL PANEL ────────────────────────────────────────────────

function JourneyPanel({
  j,
  onBack,
  theme,
}: {
  j: typeof JOURNEYS[0]
  onBack: () => void
  theme: Theme
}) {
  const Env = j.id === 'markets' ? EnvMarkets
    : j.id === 'revenue' ? EnvRevenue
    : j.id === 'people' ? EnvPeople
    : EnvEngine

  return (
    <motion.div
      key={j.id}
      className="w-full h-full flex flex-col lg:flex-row"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {/* Left: content */}
      <div className="flex-1 flex flex-col justify-center px-5 lg:px-12 py-10 lg:py-0">
        {/* Back */}
        <motion.button
          className="flex items-center gap-2 mb-10 self-start"
          onClick={onBack}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary)',
          }}
        >
          ← Back to directions
        </motion.button>

        {/* Number + label */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', color: j.colorPrimary }}>
            {j.number}
          </span>
          <span className="h-px w-8" style={{ background: j.gradient }} />
          <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
            {j.shortLabel}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="font-bold leading-[0.88] tracking-[-0.048em] mb-8 whitespace-pre-line"
          style={{ fontSize: 'clamp(2rem, 5vw, 5rem)', color: 'var(--text-primary)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: EASE }}
        >
          {j.journeyHeadline}
        </motion.h2>

        {/* Description */}
        <motion.p
          className="font-light max-w-[42ch] mb-8"
          style={{
            fontSize: 'clamp(0.9rem, 1.4vw, 1.15rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            whiteSpace: 'pre-line',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {j.journeyFull}
        </motion.p>

        {/* Deliverables */}
        <motion.div
          className="flex flex-wrap gap-2 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          {j.deliverables.map(d => (
            <span
              key={d}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold tracking-[0.1em] uppercase"
              style={{
                color: j.colorPrimary,
                border: `1px solid ${j.colorPrimary}`,
                opacity: 0.85,
              }}
            >
              {d}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.a
          href={j.ctaHref}
          className="inline-flex items-center gap-3 px-7 py-3.5 text-sm font-semibold tracking-[0.12em] uppercase text-white self-start relative overflow-hidden group"
          style={{ background: j.gradient }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
          <span className="relative">{j.ctaText}</span>
          <span className="relative">→</span>
        </motion.a>
      </div>

      {/* Right: visual */}
      <motion.div
        className="hidden lg:flex flex-shrink-0 items-center justify-center"
        style={{ width: '40%', padding: '3rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div
          className="w-full relative"
          style={{
            aspectRatio: '1',
            border: '1px solid var(--border)',
          }}
        >
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
                borderTop: i < 2 ? `2px solid ${j.colorPrimary}` : undefined,
                borderBottom: i >= 2 ? `2px solid ${j.colorPrimary}` : undefined,
                borderLeft: i % 2 === 0 ? `2px solid ${j.colorPrimary}` : undefined,
                borderRight: i % 2 === 1 ? `2px solid ${j.colorPrimary}` : undefined,
                opacity: 0.6,
              }}
            />
          ))}

          <div className="absolute inset-0 p-6">
            <Env theme={theme} active={true} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── MAIN SCENE ────────────────────────────────────────────────────────────

interface Scene03DirectionProps {
  theme: Theme
}

export function Scene03Direction({ theme }: Scene03DirectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [selectedJourney, setSelectedJourney] = useState<string | null>(null)
  const [hoveredJourney, setHoveredJourney] = useState<string | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!sectionRef.current) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.1 }
    )
    io.observe(sectionRef.current)
    return () => io.disconnect()
  }, [])

  const handleBack = useCallback(() => setSelectedJourney(null), [])

  const selectedData = selectedJourney ? JOURNEYS.find(j => j.id === selectedJourney) : null

  return (
    <section
      ref={sectionRef}
      id="direction"
      className="relative min-h-screen"
      style={{
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border)',
      }}
    >
      {/* Background ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(55% 50% at 50% 30%, rgba(18,107,255,0.05) 0%, transparent 70%)',
        }}
      />

      <AnimatePresence mode="wait">
        {!selectedJourney ? (
          /* ── DIRECTION SELECTOR VIEW ── */
          <motion.div
            key="selector"
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-[1440px] mx-auto px-5 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-20">

                {/* Left: headline */}
                <div
                  className="py-20 lg:py-28 flex flex-col justify-center"
                  style={{ borderRight: '1px solid var(--border)' }}
                >
                  <motion.p
                    className="eyebrow mb-10"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.8 }}
                  >
                    <span className="idx">03</span><span className="rule" />Choose your direction
                  </motion.p>

                  <div style={{ paddingRight: 'clamp(0rem, 4vw, 3rem)' }}>
                    <motion.p
                      className="font-light tracking-[-0.02em] mb-4"
                      style={{
                        fontSize: 'clamp(1rem, 1.8vw, 1.5rem)',
                        color: 'var(--text-tertiary)',
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
                    >
                      Every business is going somewhere.
                    </motion.p>

                    <motion.h2
                      className="font-bold leading-[0.88] tracking-[-0.048em]"
                      style={{
                        fontSize: 'clamp(2.8rem, 6.5vw, 7rem)',
                        color: 'var(--text-primary)',
                      }}
                      initial={{ opacity: 0, y: 24 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.9, delay: 0.14, ease: EASE }}
                    >
                      WHERE DO YOU<br />
                      WANT TO GO<br />
                      <span className="text-gradient-x">NEXT?</span>
                    </motion.h2>

                    <motion.p
                      className="mt-10 font-light max-w-[34ch]"
                      style={{
                        fontSize: 'clamp(0.85rem, 1.3vw, 1.05rem)',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.65,
                      }}
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.9, delay: 0.32 }}
                    >
                      Select a direction to explore how TNX supports your goal.
                      Each path is different. Each delivers results.
                    </motion.p>
                  </div>
                </div>

                {/* Right: direction list */}
                <div className="py-20 lg:py-28 flex flex-col justify-center">
                  <div
                    style={{
                      borderTop: '1px solid var(--border)',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    {JOURNEYS.map((j, i) => (
                      <div
                        key={j.id}
                        style={{ borderBottom: i < JOURNEYS.length - 1 ? '1px solid var(--border)' : undefined }}
                      >
                        <DirectionCard
                          j={j}
                          index={i}
                          isSelected={selectedJourney === j.id}
                          isHovered={hoveredJourney === j.id}
                          onSelect={() => setSelectedJourney(j.id)}
                          onHover={h => setHoveredJourney(h ? j.id : null)}
                          theme={theme}
                        />
                      </div>
                    ))}
                  </div>

                  <motion.p
                    className="mt-8"
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 500,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--text-tertiary)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.7 }}
                  >
                    Not sure?{' '}
                    <a
                      href={`mailto:${SITE.contactEmail}?subject=TNX — let's talk`}
                      style={{ color: 'var(--text-secondary)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
                    >
                      Tell us where you are and we map the path together.
                    </a>
                  </motion.p>
                </div>

              </div>
            </div>
          </motion.div>
        ) : (
          /* ── JOURNEY DETAIL VIEW ── */
          <motion.div
            key={`journey-${selectedJourney}`}
            className="min-h-screen"
            style={{ padding: 'clamp(2rem, 6vw, 5rem) 0' }}
          >
            {selectedData && (
              <JourneyPanel j={selectedData} onBack={handleBack} theme={theme} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
