'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion'
import { TNXBrandX } from '@/components/ui/TNXBrandX'
import type { Theme } from '@/types'

const EASE = [0.16, 1, 0.3, 1] as const

interface Scene01HeroProps {
  theme: Theme
  introDone?: boolean
}

export function Scene01Hero({ theme, introDone = true }: Scene01HeroProps) {
  const containerRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState(0) // 0=dark, 1=markets, 2=sowe, 3=alive

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const headOpacity  = useTransform(scrollYProgress, [0, 0.22, 0.35], [1, 1, 0])
  const headY        = useTransform(scrollYProgress, [0, 0.35], [0, -60])
  const headBlur     = useTransform(scrollYProgress, [0.18, 0.35], ['blur(0px)', 'blur(8px)'])
  const xOpacity     = useTransform(scrollYProgress, [0.12, 0.25, 0.85, 1], [0, 1, 1, 0])
  const xScale       = useTransform(scrollYProgress, [0.85, 1], [1, 14])
  const cueOpacity   = useTransform(scrollYProgress, [0, 0.07], [1, 0])
  const bgParallax   = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  // Secventa de intro bazata pe timp
  useEffect(() => {
    if (!introDone) return
    const timers = [
      setTimeout(() => setPhase(1), 2200),
      setTimeout(() => setPhase(2), 4400),
      setTimeout(() => setPhase(3), 6200),
    ]
    return () => timers.forEach(clearTimeout)
  }, [introDone])

  const isDark = theme === 'dark'

  return (
    <section
      ref={containerRef}
      id="noise"
      className="relative"
      style={{ height: reduced ? '100svh' : '340svh' }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">

        {/* Fundal ambiental */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: bgParallax }}
        >
          {/* Gradient de profunzime */}
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? 'radial-gradient(ellipse 80% 60% at 50% 30%, #040C1A 0%, #020608 60%, #000000 100%)'
                : 'radial-gradient(ellipse 80% 60% at 50% 30%, #F0F4FF 0%, #E8EDF5 60%, #D8E0EE 100%)',
            }}
          />
          {/* Lumini de profunzime */}
          <div
            className="absolute"
            style={{
              top: '15%',
              left: '20%',
              width: '40%',
              height: '35%',
              background: isDark
                ? 'radial-gradient(ellipse, rgba(0,100,255,0.08) 0%, transparent 70%)'
                : 'radial-gradient(ellipse, rgba(0,100,255,0.05) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
          <div
            className="absolute"
            style={{
              top: '25%',
              right: '15%',
              width: '30%',
              height: '30%',
              background: isDark
                ? 'radial-gradient(ellipse, rgba(0,200,255,0.05) 0%, transparent 70%)'
                : 'radial-gradient(ellipse, rgba(0,200,255,0.03) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />
        </motion.div>

        {/* Semnale de piata in fundal - puncte luminoase */}
        {!reduced && phase >= 1 && (
          <MarketSignals theme={theme} />
        )}

        {/* X-ul brand — apare in spate, arhitectural */}
        {!reduced && (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
            style={{ opacity: xOpacity }}
            aria-hidden="true"
          >
            <motion.div
              style={{ scale: xScale, transformOrigin: 'center center' }}
            >
              <TNXBrandX
                size="min(55vw, 55vh)"
                id="heroX-main"
                glow={isDark}
                opacity={isDark ? 0.22 : 0.12}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Headline principal */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-5"
          style={reduced ? undefined : { opacity: headOpacity, y: headY, filter: headBlur }}
        >
          {/* Eyebrow */}
          <motion.p
            className="eyebrow mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          >
            <span className="rule" />TNX · Commercial Intelligence<span className="rule" />
          </motion.p>

          {/* MARKETS ARE MOVING. */}
          <h1
            className="text-center font-bold leading-[0.88] tracking-[-0.045em]"
            style={{ fontSize: 'clamp(3rem, 10vw, 11rem)', color: 'var(--text-primary)' }}
          >
            {['MARKETS ARE', 'MOVING.'].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.05em]">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={phase >= 1 ? { y: '0%' } : {}}
                  transition={{ duration: 1.2, delay: i * 0.14, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}

            {/* SO ARE WE. — apare cu gradient */}
            <span className="block overflow-hidden pb-[0.05em] mt-[0.04em]">
              <motion.span
                className="block text-gradient-x"
                initial={{ y: '110%' }}
                animate={phase >= 2 ? { y: '0%' } : {}}
                transition={{ duration: 1.2, delay: 0, ease: EASE }}
              >
                SO ARE WE.
              </motion.span>
            </span>
          </h1>

          {/* CTA editorial */}
          <motion.div
            className="mt-14 flex flex-col items-center gap-6"
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : {}}
            transition={{ duration: 1, ease: EASE }}
          >
            <EditorialCTA />
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3"
          style={{ opacity: cueOpacity }}
        >
          <motion.span
            className="label"
            initial={{ opacity: 0 }}
            animate={introDone ? { opacity: 0.6 } : {}}
            transition={{ delay: 1.8 }}
            style={{ letterSpacing: '0.2em', fontSize: '0.65rem' }}
          >
            SCROLL TO EXPLORE ↓
          </motion.span>
          <span
            className="relative block w-px h-10 overflow-hidden"
            style={{ background: 'var(--border-strong)' }}
          >
            <motion.span
              className="absolute left-0 top-0 w-px h-4"
              style={{ background: 'var(--accent-cyan)' }}
              animate={{ y: [-16, 40] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </motion.div>

        {/* Fade-out spre sectiunea urmatoare */}
        <div
          className="absolute bottom-0 inset-x-0 h-40 z-30 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-primary))' }}
        />
      </div>
    </section>
  )
}

// Semnale de piata: puncte luminoase care plutesc in fundal
function MarketSignals({ theme }: { theme: Theme }) {
  const isDark = theme === 'dark'

  const signals = [
    { x: '12%', y: '22%', size: 2, delay: 0, label: 'New market' },
    { x: '82%', y: '18%', size: 3, delay: 0.4, label: 'Series B' },
    { x: '25%', y: '72%', size: 2, delay: 0.8, label: 'Expansion' },
    { x: '76%', y: '65%', size: 2.5, delay: 1.2, label: 'Key hire' },
    { x: '45%', y: '15%', size: 2, delay: 0.2, label: 'IPO' },
    { x: '88%', y: '45%', size: 3, delay: 0.6, label: 'Funding' },
    { x: '8%', y: '55%', size: 2, delay: 1.0, label: 'M&A' },
    { x: '60%', y: '80%', size: 2.5, delay: 0.3, label: 'Product launch' },
    { x: '35%', y: '30%', size: 1.5, delay: 0.9, label: 'Partnership' },
    { x: '70%', y: '32%', size: 2, delay: 0.5, label: 'Market entry' },
    { x: '18%', y: '42%', size: 1.5, delay: 1.4, label: 'Revenue' },
    { x: '55%', y: '60%', size: 2, delay: 0.7, label: 'Hiring' },
  ]

  return (
    <div className="absolute inset-0 z-5 pointer-events-none" aria-hidden="true">
      {signals.map((sig, i) => (
        <motion.div
          key={i}
          className="absolute flex items-center gap-2"
          style={{ left: sig.x, top: sig.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.7, 0.3, 0.6, 0.2], scale: [0, 1, 0.8, 1, 0.9] }}
          transition={{
            duration: 8 + i * 0.7,
            delay: sig.delay,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        >
          {/* Punct luminos */}
          <div
            style={{
              width: sig.size * 2,
              height: sig.size * 2,
              borderRadius: '50%',
              background: isDark
                ? i % 3 === 0 ? '#00C8FF' : i % 3 === 1 ? '#0066FF' : '#CC00AA'
                : i % 3 === 0 ? '#0088CC' : i % 3 === 1 ? '#0044AA' : '#880077',
              boxShadow: isDark ? `0 0 ${sig.size * 4}px currentColor` : 'none',
            }}
          />
          {/* Label */}
          <span
            className="hidden lg:block"
            style={{
              fontSize: '0.55rem',
              letterSpacing: '0.15em',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)',
              whiteSpace: 'nowrap',
            }}
          >
            {sig.label}
          </span>
        </motion.div>
      ))}

      {/* Linii de conexiune subtile */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <motion.line
          x1="12%" y1="22%" x2="35%" y2="30%"
          stroke={isDark ? '#0066FF' : '#0044AA'}
          strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: 6, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.line
          x1="82%" y1="18%" x2="70%" y2="32%"
          stroke={isDark ? '#00C8FF' : '#0066AA'}
          strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.4, 0] }}
          transition={{ duration: 7, delay: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.line
          x1="45%" y1="15%" x2="60%" y2="80%"
          stroke={isDark ? '#5500CC' : '#440099'}
          strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.3, 0] }}
          transition={{ duration: 9, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  )
}

// CTA editorial — fara buton dreptunghic
function EditorialCTA() {
  const [hovered, setHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLButtonElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setMousePos({ x: x * 0.3, y: y * 0.3 })
  }

  const handleMouseLeave = () => {
    setHovered(false)
    setMousePos({ x: 0, y: 0 })
  }

  return (
    <motion.button
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      animate={{ x: mousePos.x, y: mousePos.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="group relative flex items-center gap-3 py-2"
      style={{ cursor: 'none' }}
      onClick={() => {
        const el = document.getElementById('signal')
        el?.scrollIntoView({ behavior: 'smooth' })
      }}
    >
      <span
        className="relative font-medium tracking-[0.06em] uppercase"
        style={{
          fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
          color: hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
          transition: 'color 0.3s ease',
        }}
      >
        EXPLORE WHAT&apos;S NEXT
      </span>

      <motion.span
        animate={{ x: hovered ? 3 : 0, opacity: hovered ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
        style={{
          fontSize: '1rem',
          color: 'var(--accent-cyan)',
        }}
      >
        ↗
      </motion.span>

      {/* Underline animat */}
      <motion.span
        className="absolute left-0 right-0 bottom-0 h-px"
        style={{ background: 'var(--x-gradient)', transformOrigin: 'left' }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.button>
  )
}
