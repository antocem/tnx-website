'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import type { Theme } from '@/types'

const STEPS = [
  { value: 1,  label: 'Company',                   note: 'It starts with one account worth understanding.' },
  { value: 73, label: 'Signals identified',        note: 'Hiring, funding, leadership moves, tech changes, public statements.' },
  { value: 12, label: 'Relevant moments',          note: 'Most signals are noise. Twelve of them actually matter.' },
  { value: 4,  label: 'Decision makers',           note: 'The people who own the problem, mapped and understood.' },
  { value: 1,  label: 'Conversation worth having', note: 'One clear reason to talk. Right person, right moment.' },
]

const N = 73
function rand(s: number) { const x = Math.sin(s * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x) }

/* Canvas 2D: cheap, crisp, and fully driven by refs (no React re-render per frame) */
function SignalViz({ step, theme }: { step: number; theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stepRef = useRef(step)
  const themeRef = useRef(theme)
  stepRef.current = step
  themeRef.current = theme

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let raf = 0
    let w = 0, h = 0, dpr = 1
    let running = true

    const nodes = Array.from({ length: N }, (_, i) => {
      const a = rand(i + 1) * Math.PI * 2
      const r = 0.28 + rand(i + 101) * 0.68
      return { a, r, x: 0, y: 0, alpha: 0, size: 1, seed: rand(i + 7) * 10 }
    })
    // Highlight sets: first 12 are "moments", first 4 are "decision makers"
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width; h = rect.height
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting
      if (running) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw) }
    })
    io.observe(canvas)

    let coreGlow = 0
    let convo = 0

    function draw(now: number) {
      if (!running) return
      const t = now / 1000
      const s = stepRef.current
      const dark = themeRef.current === 'dark'
      const cx = w / 2, cy = h / 2
      const R = Math.min(w, h) * 0.46

      ctx.clearRect(0, 0, w, h)

      // Orbit guides
      ctx.lineWidth = 1
      for (const k of [0.35, 0.65, 0.95]) {
        ctx.beginPath()
        ctx.ellipse(cx, cy, R * k, R * k, 0, 0, Math.PI * 2)
        ctx.strokeStyle = dark ? 'rgba(255,255,255,0.05)' : 'rgba(5,7,10,0.06)'
        ctx.stroke()
      }

      coreGlow += ((s >= 4 ? 1 : 0.4) - coreGlow) * 0.06
      convo += ((s >= 4 ? 1 : 0) - convo) * 0.05

      for (let i = 0; i < N; i++) {
        const n = nodes[i]
        const isMoment = i < 12
        const isDM = i < 4

        let targetAlpha = 0, targetR = n.r, targetSize = 1.6
        if (s >= 1) targetAlpha = 0.85
        if (s >= 2) targetAlpha = isMoment ? 1 : 0.12
        if (s >= 2 && isMoment) { targetSize = 3; targetR = n.r * 0.75 }
        if (s >= 3) { targetAlpha = isDM ? 1 : isMoment ? 0.25 : 0.06; if (isDM) { targetSize = 5; targetR = 0.42 } }
        if (s >= 4) { targetR = isDM ? 0.16 : n.r * 0.2; targetAlpha = isDM ? 1 : 0; targetSize = isDM ? 4 : 1 }

        n.alpha += (targetAlpha - n.alpha) * 0.07
        n.size += (targetSize - n.size) * 0.07
        n.r += (targetR - n.r) * 0.05

        const ang = n.a + t * 0.04 * (isDM ? 0.5 : 1) + Math.sin(t * 0.5 + n.seed) * 0.02
        // Decision makers distribute evenly so they read as four people
        const a2 = isDM && s >= 3 ? (i / 4) * Math.PI * 2 + t * 0.15 : ang
        n.x = cx + Math.cos(a2) * R * n.r
        n.y = cy + Math.sin(a2) * R * n.r

        if (n.alpha < 0.01) continue

        // Connection lines to core for highlighted nodes
        if ((s >= 2 && isMoment) || (s >= 3 && isDM)) {
          const g = ctx.createLinearGradient(cx, cy, n.x, n.y)
          g.addColorStop(0, dark ? 'rgba(0,229,255,0.0)' : 'rgba(0,190,220,0.0)')
          g.addColorStop(1, isDM ? (dark ? 'rgba(255,30,200,0.55)' : 'rgba(212,0,158,0.5)') : (dark ? 'rgba(0,229,255,0.35)' : 'rgba(0,190,220,0.35)'))
          ctx.strokeStyle = g
          ctx.globalAlpha = n.alpha
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(n.x, n.y); ctx.stroke()
        }

        ctx.globalAlpha = n.alpha
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2)
        ctx.fillStyle = isDM && s >= 3
          ? (dark ? '#FF1EC8' : '#D4009E')
          : isMoment && s >= 2
          ? (dark ? '#00E5FF' : '#00BEDC')
          : (dark ? '#B8BCC3' : '#8C9099')
        ctx.fill()
        if (isDM && s >= 3) {
          ctx.globalAlpha = n.alpha * 0.25
          ctx.beginPath(); ctx.arc(n.x, n.y, n.size * 3.2, 0, Math.PI * 2); ctx.fill()
        }
      }
      ctx.globalAlpha = 1

      // Core: the company
      const coreR = 7 + coreGlow * 5
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 7)
      glow.addColorStop(0, dark ? 'rgba(18,107,255,0.45)' : 'rgba(13,95,232,0.25)')
      glow.addColorStop(1, 'rgba(18,107,255,0)')
      ctx.fillStyle = glow
      ctx.beginPath(); ctx.arc(cx, cy, coreR * 7, 0, Math.PI * 2); ctx.fill()
      const cg = ctx.createLinearGradient(cx - coreR, cy - coreR, cx + coreR, cy + coreR)
      cg.addColorStop(0, dark ? '#00E5FF' : '#00BEDC'); cg.addColorStop(1, dark ? '#7B2DFF' : '#6320E0')
      ctx.fillStyle = cg
      ctx.beginPath(); ctx.arc(cx, cy, coreR, 0, Math.PI * 2); ctx.fill()

      // Final step: one conversation, drawn as a single bright line leaving the core
      if (convo > 0.01) {
        const len = R * 1.05 * convo
        const lg = ctx.createLinearGradient(cx, cy, cx + len, cy)
        lg.addColorStop(0, dark ? '#00E5FF' : '#00BEDC')
        lg.addColorStop(0.5, dark ? '#7B2DFF' : '#6320E0')
        lg.addColorStop(1, dark ? '#FF1EC8' : '#D4009E')
        ctx.strokeStyle = lg
        ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + len, cy); ctx.stroke()
        ctx.lineWidth = 1
        ctx.fillStyle = dark ? '#FF1EC8' : '#D4009E'
        ctx.beginPath(); ctx.arc(cx + len, cy, 4, 0, Math.PI * 2); ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect() }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
}

function RollingNumber({ value }: { value: number }) {
  return (
    <span className="relative inline-flex overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="block text-gradient-x tabular-nums"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export function Scene02Signal({ theme }: { theme: Theme }) {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [step, setStep] = useState(0)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', v => {
    const s = Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length * 1.02)))
    setStep(prev => (prev === s ? prev : s))
  })

  if (reduced) {
    return (
      <section id="signal" className="relative py-28 px-5 lg:px-12 max-w-[1440px] mx-auto">
        <p className="eyebrow mb-8"><span className="idx">02</span><span className="rule" />How TNX reads a market</p>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
          {STEPS.map(s => (
            <div key={s.label}>
              <p className="text-6xl font-bold text-gradient-x">{s.value}</p>
              <p className="label mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  const current = STEPS[step]

  return (
    <section ref={sectionRef} id="signal" className="relative" style={{ height: '420svh' }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden flex items-center">
        <div className="w-full max-w-[1440px] mx-auto px-5 lg:px-12 grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-16 items-center pt-16 lg:pt-0">

          {/* Visualization */}
          <div className="relative aspect-square w-full max-w-[min(88vw,46vh)] lg:max-w-[min(42vw,78vh)] mx-auto">
            <SignalViz step={step} theme={theme} />
          </div>

          {/* Copy */}
          <div className="relative">
            <p className="eyebrow mb-6 lg:mb-10"><span className="idx">02</span><span className="rule" />How TNX reads a market</p>

            <div
              className="font-bold leading-[0.85] tracking-[-0.06em]"
              style={{ fontSize: 'clamp(5.5rem, 16vw, 14rem)' }}
              aria-live="polite"
            >
              <RollingNumber value={current.value} />
            </div>

            <div className="relative h-[7.5rem] lg:h-[8.5rem] mt-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <p className="font-semibold tracking-[-0.02em]" style={{ fontSize: 'clamp(1.35rem, 2.6vw, 2.25rem)', color: 'var(--text-primary)' }}>
                    {current.label}
                  </p>
                  <p className="mt-2 max-w-md" style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {current.note}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Step track */}
            <div className="mt-6 lg:mt-10 grid grid-cols-5 gap-2 max-w-md">
              {STEPS.map((s, i) => (
                <div key={i}>
                  <div className="h-px w-full relative overflow-hidden" style={{ background: 'var(--border-strong)' }}>
                    <motion.div
                      className="absolute inset-0 origin-left"
                      style={{ background: 'var(--x-gradient)' }}
                      animate={{ scaleX: i <= step ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <p className="mt-2 tabular-nums text-[0.7rem] font-medium" style={{ color: i === step ? 'var(--text-primary)' : 'var(--text-tertiary)', transition: 'color 0.3s' }}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <AnimatePresence>
              {step === STEPS.length - 1 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-8 font-light hidden sm:block"
                  style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.35rem)', color: 'var(--text-secondary)' }}
                >
                  Chaos becomes clarity. <span style={{ color: 'var(--text-primary)' }}>Noise becomes conversation.</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
