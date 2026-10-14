'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import type { Theme } from '@/types'

const ECOSYSTEM_NODES = [
  { name: 'TNX',         isCenter: true,  angle: 0,   r: 0,   color: '#126BFF', size: 64 },
  { name: 'Lusha',       isCenter: false, angle: 0,   r: 190, color: '#00E5FF', size: 40 },
  { name: 'Monday.com',  isCenter: false, angle: 51,  r: 210, color: '#7B2DFF', size: 40 },
  { name: 'LinkedIn',    isCenter: false, angle: 103, r: 195, color: '#0D5FE8', size: 40 },
  { name: 'TNX OS',      isCenter: false, angle: 154, r: 200, color: '#FF1EC8', size: 40 },
  { name: 'CRM',         isCenter: false, angle: 205, r: 215, color: '#00E5FF', size: 40 },
  { name: 'Calling',     isCenter: false, angle: 257, r: 190, color: '#7B2DFF', size: 40 },
  { name: 'Data',        isCenter: false, angle: 308, r: 205, color: '#126BFF', size: 40 },
]

interface Scene07EcosystemProps {
  theme: Theme
}

export function Scene07Ecosystem({ theme }: Scene07EcosystemProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const inView     = useInView(sectionRef, { once: true, amount: 0.2 })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const cx = 300
  const cy = 260

  const getNodePos = (node: typeof ECOSYSTEM_NODES[0]) => {
    if (node.isCenter) return { x: cx, y: cy }
    const rad = (node.angle * Math.PI) / 180
    return {
      x: cx + Math.cos(rad) * node.r,
      y: cy + Math.sin(rad) * node.r * 0.65,
    }
  }

  return (
    <section
      ref={sectionRef}
      id="ecosystem"
      className="scene relative"
      style={{
        background: 'var(--bg-secondary)',
        paddingBlock: 'clamp(6rem, 12vw, 11rem)',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-5 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Copy */}
          <div>
            <motion.p
              className="eyebrow mb-6"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
            >
              <span className="idx">07</span><span className="rule" />Technology stack
            </motion.p>
            <motion.h2
              className="font-bold leading-none tracking-[-0.035em] mb-10"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 6rem)', color: 'var(--text-primary)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              BUILT WITH<br />
              THE BEST.<br />
              <span className="text-gradient-x">ORCHESTRATED BY TNX.</span>
            </motion.h2>
            <motion.p
              className="font-light max-w-md"
              style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              Industry-leading platforms working as one system.
              TNX ties together the tools, the data, and the people
              into a single operating model.
            </motion.p>

            {/* Node list */}
            <motion.div
              className="mt-10 flex flex-wrap gap-x-6 gap-y-3"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {ECOSYSTEM_NODES.filter(n => !n.isCenter).map(node => (
                <span
                  key={node.name}
                  className="py-1 text-sm font-medium tracking-wide border-b"
                  style={{
                    color: hoveredNode === node.name ? node.color : 'var(--text-secondary)',
                    borderColor: hoveredNode === node.name ? node.color : 'var(--border)',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={() => setHoveredNode(node.name)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {node.name}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: Orbit diagram */}
          <motion.div
            className="relative w-full"
            style={{ height: 'clamp(340px, 46vw, 620px)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <svg
              viewBox="0 0 600 520"
              className="w-full h-full"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#126BFF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#126BFF" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="ecosysXGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5FF" />
                  <stop offset="35%" stopColor="#126BFF" />
                  <stop offset="65%" stopColor="#7B2DFF" />
                  <stop offset="100%" stopColor="#FF1EC8" />
                </linearGradient>
              </defs>

              {/* Center glow */}
              <circle cx={cx} cy={cy} r="90" fill="url(#centerGlow)" />

              {/* Connection lines */}
              {ECOSYSTEM_NODES.filter(n => !n.isCenter).map(node => {
                const pos = getNodePos(node)
                const isHovered = hoveredNode === node.name
                return (
                  <line
                    key={node.name}
                    x1={cx} y1={cy}
                    x2={pos.x} y2={pos.y}
                    stroke={isHovered ? node.color : (theme === 'dark' ? 'rgba(184,188,195,0.15)' : 'rgba(82,86,94,0.12)')}
                    strokeWidth={isHovered ? 1.5 : 0.8}
                    strokeDasharray="4 8"
                    style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
                  />
                )
              })}

              {/* Orbit ellipses */}
              {[195, 220].map((r, i) => (
                <ellipse
                  key={i}
                  cx={cx} cy={cy}
                  rx={r} ry={r * 0.65}
                  fill="none"
                  stroke={theme === 'dark' ? 'rgba(18,107,255,0.08)' : 'rgba(13,95,232,0.06)'}
                  strokeWidth="0.8"
                />
              ))}

              {/* Peripheral nodes */}
              {ECOSYSTEM_NODES.filter(n => !n.isCenter).map((node, i) => {
                const pos = getNodePos(node)
                const isHovered = hoveredNode === node.name
                return (
                  <g
                    key={node.name}
                    onMouseEnter={() => setHoveredNode(node.name)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ cursor: 'none' }}
                  >
                    {/* Glow */}
                    {isHovered && (
                      <circle
                        cx={pos.x} cy={pos.y}
                        r="32"
                        fill={node.color}
                        opacity="0.15"
                      />
                    )}
                    {/* Dot */}
                    <circle
                      cx={pos.x} cy={pos.y}
                      r={isHovered ? 14 : 10}
                      fill={theme === 'dark' ? '#14171C' : '#EDEEF2'}
                      stroke={isHovered ? node.color : (theme === 'dark' ? 'rgba(184,188,195,0.3)' : 'rgba(82,86,94,0.25)')}
                      strokeWidth={isHovered ? 1.5 : 1}
                      style={{ transition: 'all 0.2s' }}
                    />
                    {/* Label */}
                    <text
                      x={pos.x}
                      y={pos.y + 30}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="500"
                      letterSpacing="1"
                      fill={isHovered ? node.color : (theme === 'dark' ? '#8C9099' : '#52565E')}
                      fontFamily="Inter Tight, system-ui"
                      style={{ transition: 'fill 0.2s', textTransform: 'uppercase' }}
                    >
                      {node.name}
                    </text>
                  </g>
                )
              })}

              {/* Center TNX node */}
              <g>
                <circle cx={cx} cy={cy} r="40" fill={theme === 'dark' ? '#14171C' : '#EDEEF2'} stroke="rgba(18,107,255,0.4)" strokeWidth="1" />
                {/* X mark */}
                <polygon
                  points={`${cx-18},${cy-25} ${cx-10},${cy-25} ${cx},${cy-8} ${cx+10},${cy-25} ${cx+18},${cy-25} ${cx+8},${cy} ${cx+18},${cy+25} ${cx+10},${cy+25} ${cx},${cy+8} ${cx-10},${cy+25} ${cx-18},${cy+25} ${cx-8},${cy}`}
                  fill="url(#ecosysXGrad)"
                />
              </g>
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
