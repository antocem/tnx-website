'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { Theme } from '@/types'

const SIGNALS = [
  { label: 'New role',          c: 'cyan',    a: 0,   r: 0.78, sp: 1.0 },
  { label: 'Expansion',         c: 'blue',    a: 45,  r: 0.92, sp: 0.8 },
  { label: 'Hiring',            c: 'violet',  a: 90,  r: 0.70, sp: 1.25 },
  { label: 'LinkedIn post',     c: 'magenta', a: 135, r: 0.88, sp: 0.9 },
  { label: 'Company news',      c: 'cyan',    a: 180, r: 0.80, sp: 1.1 },
  { label: 'Tech stack',        c: 'blue',    a: 225, r: 0.96, sp: 0.7 },
  { label: 'Market shift',      c: 'violet',  a: 270, r: 0.72, sp: 1.0 },
  { label: 'Leadership change', c: 'magenta', a: 315, r: 0.86, sp: 0.85 },
] as const

const LAYERS = [
  { title: 'The company', body: 'Their business, their market, their moment.' },
  { title: 'The person',  body: 'Their role, their priorities, their context.' },
  { title: 'The moment',  body: 'Why now is the right time to start the conversation.' },
]

export function Scene04Context({ theme }: { theme: Theme }) {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const lineRefs = useRef<(SVGLineElement | null)[]>([])
  const collapseRef = useRef(0)
  const reduced = useReducedMotion()
  const [layer, setLayer] = useState(0)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const collapse = useTransform(scrollYProgress, [0.35, 0.75], [0, 1])
  const msgOpacity = useTransform(scrollYProgress, [0.72, 0.8], [0, 1])
  const msgScale = useTransform(scrollYProgress, [0.72, 0.85], [0.94, 1])
  const ringsOpacity = useTransform(scrollYProgress, [0.4, 0.75], [1, 0.15])
  const coreScale = useTransform(scrollYProgress, [0.35, 0.78], [1, 2.2])

  useMotionValueEvent(collapse, 'change', v => { collapseRef.current = v })
  useMotionValueEvent(scrollYProgress, 'change', v => {
    const l = v < 0.3 ? 0 : v < 0.55 ? 1 : 2
    setLayer(p => (p === l ? p : l))
  })

  // One rAF loop drives all eight signals through direct DOM writes
  useEffect(() => {
    if (reduced) return
    let raf = 0
    let running = true
    const angles = SIGNALS.map(s => (s.a * Math.PI) / 180)
    let last = performance.now()

    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting
      if (running) { last = performance.now(); raf = requestAnimationFrame(loop) }
    })
    if (stageRef.current) io.observe(stageRef.current)

    function loop(now: number) {
      if (!running) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const stage = stageRef.current
      if (stage) {
        const w = stage.clientWidth, h = stage.clientHeight
        const R = Math.min(w * (w < 640 ? 0.36 : 0.46), h * 0.62)
        const c = collapseRef.current
        const e = c * c * (3 - 2 * c)
        SIGNALS.forEach((s, i) => {
          angles[i] += dt * 0.35 * s.sp * (1 + e * 2.5)
          const r = R * s.r * (1 - e)
          const x = Math.cos(angles[i]) * r
          const y = Math.sin(angles[i]) * r * 0.58
          const el = itemRefs.current[i]
          if (el) {
            el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${1 - e * 0.5})`
            el.style.opacity = String(Math.max(0, 1 - Math.max(0, e - 0.6) / 0.4))
          }
          const ln = lineRefs.current[i]
          if (ln) {
            ln.setAttribute('x2', String(x))
            ln.setAttribute('y2', String(y))
            ln.style.opacity = String(0.15 + e * 0.6 * (1 - Math.max(0, e - 0.7) / 0.3))
          }
        })
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); io.disconnect() }
  }, [reduced])

  const colorVar = (c: string) => `var(--accent-${c})`

  return (
    <section ref={sectionRef} id="context" className="relative" style={{ height: reduced ? 'auto' : '300svh' }}>
      <div className={`${reduced ? '' : 'sticky top-0 h-[100svh]'} overflow-hidden flex flex-col`}>
        <div className="max-w-[1440px] w-full mx-auto px-5 lg:px-12 pt-24 lg:pt-28 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 relative z-10">
          <div>
            <p className="eyebrow mb-5"><span className="idx">04</span><span className="rule" />Context engine</p>
            <h2 className="font-bold leading-[0.92] tracking-[-0.04em]" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 6rem)', color: 'var(--text-primary)' }}>
              WE UNDERSTAND<br /><span className="text-gradient-x">THE MOMENT.</span>
            </h2>
          </div>

          {/* Three layers of understanding, revealed in sequence */}
          <div className="hidden md:grid grid-cols-3 gap-6 lg:max-w-[46%]">
            {LAYERS.map((l, i) => (
              <div key={l.title} className="relative pt-4">
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'var(--border-strong)' }} />
                <motion.div
                  className="absolute top-0 left-0 right-0 h-px origin-left"
                  style={{ background: 'var(--x-gradient)' }}
                  animate={{ scaleX: i <= layer ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
                <p className="label mb-2" style={{ color: i <= layer ? 'var(--text-primary)' : 'var(--text-tertiary)', transition: 'color 0.4s' }}>{l.title}</p>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--text-secondary)', opacity: i <= layer ? 1 : 0.45, transition: 'opacity 0.4s' }}>{l.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Orbit stage */}
        <div ref={stageRef} className="relative flex-1 min-h-[360px]">
          <motion.svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: ringsOpacity }}
            aria-hidden="true"
          >
            {[0.7, 0.84, 0.98].map(k => (
              <ellipse key={k} cx="50%" cy="50%" rx={`${k * 46}%`} ry={`${k * 46 * 0.58 * 1.0}%`}
                fill="none" stroke={theme === 'dark' ? 'rgba(18,107,255,0.14)' : 'rgba(13,95,232,0.12)'} strokeDasharray="2 6" />
            ))}
          </motion.svg>

          {/* Lines from signals to the core */}
          <svg className="absolute left-1/2 top-1/2 overflow-visible pointer-events-none" width="1" height="1" aria-hidden="true">
            {SIGNALS.map((s, i) => (
              <line key={s.label} ref={el => { lineRefs.current[i] = el }} x1="0" y1="0" x2="0" y2="0"
                stroke={colorVar(s.c)} strokeWidth="1" style={{ opacity: 0.15 }} />
            ))}
          </svg>

          {/* Core: the decision maker */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <motion.div style={{ scale: coreScale }} className="relative flex items-center justify-center">
              <div className="absolute w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(18,107,255,0.28) 0%, transparent 65%)' }} />
              <motion.div
                className="absolute w-12 h-12 rounded-full border"
                style={{ borderColor: 'var(--accent-cyan)' }}
                animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
              />
              <div className="w-4 h-4 rounded-full" style={{ background: 'var(--x-gradient)', boxShadow: '0 0 24px rgba(18,107,255,0.7)' }} />
            </motion.div>
            <p className="label absolute left-1/2 -translate-x-1/2 top-8 whitespace-nowrap" style={{ color: 'var(--accent-cyan)' }}>Decision maker</p>
          </div>

          {/* Orbiting signals */}
          {SIGNALS.map((s, i) => (
            <div
              key={s.label}
              ref={el => { itemRefs.current[i] = el }}
              className="absolute left-1/2 top-1/2 will-change-transform pointer-events-none"
              style={{ transform: 'translate(-50%,-50%)' }}
            >
              <div
                className="flex items-center gap-2 px-3 py-1.5 whitespace-nowrap"
                style={{
                  background: theme === 'dark' ? 'rgba(5,7,10,0.7)' : 'rgba(247,248,250,0.8)',
                  border: `1px solid color-mix(in srgb, ${colorVar(s.c)} 40%, transparent)`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: colorVar(s.c), boxShadow: `0 0 10px ${colorVar(s.c)}` }} />
                <span className="text-[0.625rem] sm:text-[0.6875rem] font-medium tracking-[0.14em] uppercase" style={{ color: 'var(--text-primary)' }}>
                  {s.label}
                </span>
              </div>
            </div>
          ))}

          {/* Result */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
            style={reduced ? undefined : { opacity: msgOpacity, scale: msgScale }}
          >
            <div className="absolute inset-0" style={{ background: 'radial-gradient(50% 45% at 50% 50%, var(--bg-primary) 30%, transparent 100%)' }} />
            <p className="relative eyebrow justify-center mb-5"><span className="rule" />Signals collapsed<span className="rule" /></p>
            <h3 className="relative font-bold leading-[0.95] tracking-[-0.035em]" style={{ fontSize: 'clamp(1.9rem, 4.6vw, 4.5rem)', color: 'var(--text-primary)' }}>
              NOW WE HAVE SOMETHING<br /><span className="text-gradient-x">RELEVANT TO TALK ABOUT.</span>
            </h3>
            <p className="relative mt-5" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', color: 'var(--text-secondary)' }}>
              This is what tailored actually means.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
