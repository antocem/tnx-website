'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import type { Theme } from '@/types'

// Abstract Europe node network, stylized on purpose
const NODES = [
  { id: 'ro', label: 'Romania',  x: 56, y: 52, primary: true,  size: 16 },
  { id: 'bg', label: 'Bulgaria', x: 58, y: 62, primary: true,  size: 14 },
  { id: 'de', label: 'Germany',  x: 44, y: 28, primary: true,  size: 15 },
  { id: 'hu', label: 'Hungary',  x: 50, y: 40, primary: true,  size: 14 },
  // Secondary nodes (faint context)
  { id: 'fr', label: 'France',   x: 30, y: 35, primary: false, size: 8  },
  { id: 'pl', label: 'Poland',   x: 52, y: 22, primary: false, size: 9  },
  { id: 'at', label: 'Austria',  x: 47, y: 35, primary: false, size: 8  },
  { id: 'cz', label: 'CZ',       x: 49, y: 28, primary: false, size: 7  },
  { id: 'sk', label: 'Slovakia', x: 52, y: 34, primary: false, size: 7  },
  { id: 'nl', label: 'NL',       x: 36, y: 22, primary: false, size: 8  },
  { id: 'ch', label: 'CH',       x: 38, y: 38, primary: false, size: 7  },
  { id: 'rs', label: 'Serbia',   x: 54, y: 54, primary: false, size: 7  },
]

const CONNECTIONS = [
  ['ro', 'de'], ['ro', 'bg'], ['ro', 'hu'],
  ['de', 'hu'], ['bg', 'hu'], ['ro', 'pl'],
  ['de', 'nl'], ['de', 'fr'], ['de', 'at'],
  ['hu', 'at'], ['hu', 'sk'], ['ro', 'rs'],
  ['bg', 'rs'], ['de', 'ch'],
]

interface Scene09EuropeProps {
  theme: Theme
}

export function Scene09Europe({ theme }: Scene09EuropeProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const inView     = useInView(sectionRef, { once: true, amount: 0.2 })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // Spread the cluster so the network fills the stage instead of huddling in one corner
  const getCoords = (node: typeof NODES[0], w: number, h: number) => ({
    x: ((6 + ((node.x - 28) / 32) * 86) / 100) * w,
    y: ((8 + ((node.y - 20) / 44) * 80) / 100) * h,
  })

  const W = 700
  const H = 500

  return (
    <section
      ref={sectionRef}
      id="europe"
      className="scene relative overflow-hidden"
      style={{
        background: 'var(--bg-primary)',
        paddingBlock: 'clamp(6rem, 12vw, 11rem)',
      }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(ellipse at 60% 50%, rgba(18,107,255,0.07) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at 60% 50%, rgba(0,190,220,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1440px] mx-auto px-5 lg:px-12">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center">

          {/* Left: Copy */}
          <div>
            <motion.p
              className="eyebrow mb-6"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
            >
              <span className="idx">09</span><span className="rule" />European coverage
            </motion.p>

            <motion.h2
              className="font-bold leading-none tracking-[-0.035em] mb-8"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 6.5rem)', color: 'var(--text-primary)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              LOCAL<br />
              CONVERSATIONS.<br />
              <span className="text-gradient-x">EUROPEAN SCALE.</span>
            </motion.h2>

            <motion.div
              className="space-y-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {[
                { label: 'Native language', desc: 'We speak to prospects in their language, with cultural fluency.' },
                { label: 'Local context',   desc: 'We understand the business environment in each market.' },
                { label: 'One model',       desc: 'One operating model across Romania, Bulgaria, Germany, Hungary.' },
              ].map(({ label, desc }) => (
                <div key={label}>
                  <p
                    className="font-medium mb-1"
                    style={{ fontSize: '0.85rem', letterSpacing: '0.08em', color: 'var(--text-primary)' }}
                  >
                    {label.toUpperCase()}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {desc}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Market pills */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              {NODES.filter(n => n.primary).map(node => (
                <span
                  key={node.id}
                  className="px-4 py-2 text-xs font-medium tracking-wider"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,229,255,0.1), rgba(123,45,255,0.08))',
                    border: '1px solid rgba(0,229,255,0.25)',
                    color: 'var(--accent-cyan)',
                  }}
                >
                  {node.label.toUpperCase()}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: Node network SVG */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              style={{ filter: 'drop-shadow(0 0 40px rgba(18,107,255,0.08))' }}
            >
              <defs>
                <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="euroXGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5FF" />
                  <stop offset="100%" stopColor="#FF1EC8" />
                </linearGradient>
              </defs>

              {/* Connection lines */}
              {inView && CONNECTIONS.map(([a, b], i) => {
                const nodeA = NODES.find(n => n.id === a)!
                const nodeB = NODES.find(n => n.id === b)!
                const posA = getCoords(nodeA, W, H)
                const posB = getCoords(nodeB, W, H)
                const isPrimary = nodeA.primary && nodeB.primary
                const isHovered = hoveredNode === a || hoveredNode === b

                return (
                  <motion.line
                    key={`${a}-${b}`}
                    x1={posA.x} y1={posA.y}
                    x2={posB.x} y2={posB.y}
                    stroke={
                      isHovered
                        ? '#00E5FF'
                        : isPrimary
                        ? (theme === 'dark' ? 'rgba(0,229,255,0.35)' : 'rgba(0,190,220,0.3)')
                        : (theme === 'dark' ? 'rgba(184,188,195,0.1)' : 'rgba(82,86,94,0.08)')
                    }
                    strokeWidth={isHovered ? 1.5 : isPrimary ? 1 : 0.6}
                    strokeDasharray={isPrimary ? 'none' : '4 8'}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.05 }}
                    style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
                  />
                )
              })}

              {/* Signals travelling between the four core markets */}
              {inView && CONNECTIONS.filter(([a, b]) => NODES.find(n => n.id === a)!.primary && NODES.find(n => n.id === b)!.primary).map(([a, b], i) => {
                const A = getCoords(NODES.find(n => n.id === a)!, W, H)
                const B = getCoords(NODES.find(n => n.id === b)!, W, H)
                return (
                  <motion.circle
                    key={`p-${a}-${b}`}
                    r={2.5}
                    fill={theme === 'dark' ? '#00E5FF' : '#00BEDC'}
                    initial={{ cx: A.x, cy: A.y, opacity: 0 }}
                    animate={{ cx: [A.x, B.x], cy: [A.y, B.y], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2.4, delay: 1.2 + i * 0.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
                    style={{ filter: 'drop-shadow(0 0 6px rgba(0,229,255,0.9))' }}
                  />
                )
              })}

              {/* Nodes */}
              {NODES.map((node, i) => {
                const pos = getCoords(node, W, H)
                const isHovered = hoveredNode === node.id
                const isActive  = node.primary

                return (
                  <g
                    key={node.id}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ cursor: 'none' }}
                  >
                    {/* Glow for primary nodes */}
                    {isActive && (
                      <motion.circle
                        cx={pos.x} cy={pos.y}
                        r={isHovered ? 36 : 26}
                        fill="url(#nodeGlow)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + i * 0.07 }}
                        style={{ transition: 'r 0.3s' }}
                      />
                    )}

                    {/* Node circle */}
                    <motion.circle
                      cx={pos.x} cy={pos.y}
                      r={isHovered ? node.size * 1.35 : node.size}
                      fill={
                        isActive
                          ? (theme === 'dark' ? '#05070A' : '#F7F8FA')
                          : (theme === 'dark' ? '#14171C' : '#EDEEF2')
                      }
                      stroke={
                        isHovered
                          ? '#00E5FF'
                          : isActive
                          ? (theme === 'dark' ? 'rgba(0,229,255,0.6)' : 'rgba(0,190,220,0.5)')
                          : (theme === 'dark' ? 'rgba(184,188,195,0.2)' : 'rgba(82,86,94,0.15)')
                      }
                      strokeWidth={isActive ? 1.5 : 0.8}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.07 }}
                      style={{ transition: 'stroke 0.2s' }}
                    />

                    {/* Node pulse for primary */}
                    {isActive && (
                      <motion.circle
                        cx={pos.x} cy={pos.y}
                        r={node.size}
                        fill="none"
                        stroke={theme === 'dark' ? '#00E5FF' : '#00BEDC'}
                        strokeWidth="0.8"
                        animate={{ r: [node.size, node.size + 20], opacity: [0.5, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
                      />
                    )}

                    {/* Label */}
                    <text
                      x={pos.x}
                      y={pos.y + node.size + 16}
                      textAnchor="middle"
                      fontSize={isActive ? '11' : '8'}
                      fontWeight={isActive ? '600' : '400'}
                      letterSpacing="1.5"
                      fill={
                        isHovered
                          ? '#00E5FF'
                          : isActive
                          ? (theme === 'dark' ? '#F7F8FA' : '#05070A')
                          : (theme === 'dark' ? '#52565E' : '#8C9099')
                      }
                      fontFamily="Inter Tight, system-ui"
                      style={{ transition: 'fill 0.2s', textTransform: 'uppercase' }}
                    >
                      {node.label}
                    </text>
                  </g>
                )
              })}
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
