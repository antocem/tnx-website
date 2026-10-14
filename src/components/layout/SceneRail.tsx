'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollTo } from '@/components/layout/SmoothScroll'

export const SCENES = [
  { id: 'noise',     name: 'Noise' },
  { id: 'signal',    name: 'Signal' },
  { id: 'audience',  name: 'Audience' },
  { id: 'context',   name: 'Context' },
  { id: 'engine',    name: 'Engine' },
  { id: 'human',     name: 'People' },
  { id: 'ecosystem', name: 'Ecosystem' },
  { id: 'watch',     name: 'Simulation' },
  { id: 'europe',    name: 'Europe' },
  { id: 'proof',     name: 'Proof' },
  { id: 'end',       name: 'Listen' },
]

/** Chapter navigation on the right edge. Desktop only. */
export function SceneRail() {
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState<number | null>(null)
  const scrollTo = useScrollTo()

  useEffect(() => {
    const observed = new Set<string>()
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          const i = SCENES.findIndex(s => s.id === e.target.id)
          if (i >= 0) setActive(i)
        }
      }),
      { rootMargin: '-50% 0px -50% 0px' }
    )
    // Some scenes mount lazily (WebGL), so keep attaching until all are found
    const attach = () => {
      SCENES.forEach(s => {
        const el = document.getElementById(s.id)
        if (el && !observed.has(s.id)) { io.observe(el); observed.add(s.id) }
      })
      return observed.size === SCENES.length
    }
    attach()
    const iv = window.setInterval(() => { if (attach()) window.clearInterval(iv) }, 400)
    return () => { io.disconnect(); window.clearInterval(iv) }
  }, [])

  return (
    <nav aria-label="Chapters" className="hidden lg:flex fixed right-3 xl:right-5 top-1/2 -translate-y-1/2 z-[90] flex-col items-end gap-3">
      {SCENES.map((s, i) => {
        const on = i === active
        return (
          <button
            key={s.id}
            onClick={() => scrollTo(`#${s.id}`)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            className="group relative flex items-center gap-3 py-0.5"
            aria-label={`${String(i + 1).padStart(2, '0')} ${s.name}`}
            aria-current={on ? 'step' : undefined}
          >
            <AnimatePresence>
              {hover === i && (
                <motion.span
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.25 }}
                  className="label whitespace-nowrap px-2 py-1"
                  style={{ color: 'var(--text-primary)', background: 'var(--nav-bg)', backdropFilter: 'blur(8px)' }}
                >
                  <span className="tabular-nums mr-2" style={{ color: 'var(--accent-cyan)' }}>{String(i + 1).padStart(2, '0')}</span>
                  {s.name}
                </motion.span>
              )}
            </AnimatePresence>
            <span
              className="block h-px transition-all duration-500"
              style={{
                width: on ? 28 : hover === i ? 18 : 10,
                background: on ? 'var(--x-gradient)' : 'var(--border-strong)',
              }}
            />
          </button>
        )
      })}
    </nav>
  )
}
