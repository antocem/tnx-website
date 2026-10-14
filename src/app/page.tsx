'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'

import { Navigation } from '@/components/layout/Navigation'
import { SceneRail } from '@/components/layout/SceneRail'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { XMarkGradient } from '@/components/ui/XMarkGradient'
import { useTheme } from '@/hooks/useTheme'

// NEW scene flow — brief-aligned
import { Scene02WorldWait } from '@/components/scenes/Scene02WorldWait'
import { Scene03Direction } from '@/components/scenes/Scene03Direction'
import { Scene05Engine } from '@/components/scenes/Scene05Engine'
import { Scene06Human } from '@/components/scenes/Scene06Human'
import { Scene09Europe } from '@/components/scenes/Scene09Europe'
import { Scene10Proof } from '@/components/scenes/Scene10Proof'

// WebGL scenes render on the client only
const Scene01Hero = dynamic(() => import('@/components/scenes/Scene01Hero').then(m => ({ default: m.Scene01Hero })), { ssr: false })
const Scene11End = dynamic(() => import('@/components/scenes/Scene11End').then(m => ({ default: m.Scene11End })), { ssr: false })

function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const duration = 1100
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
      else window.setTimeout(onDone, 150)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: 'var(--bg-primary)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      aria-label="Loading"
      role="status"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <XMarkGradient id="loaderX" size={60} glow />
      </motion.div>

      {/* Brand tagline in loader */}
      <motion.p
        className="mt-8 font-bold tracking-[-0.03em] text-center"
        style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', color: 'var(--text-primary)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        ALWAYS IN MOTION
      </motion.p>

      <div className="mt-8 w-44 h-px relative overflow-hidden" style={{ background: 'var(--border)' }}>
        <div
          className="absolute inset-y-0 left-0 transition-none"
          style={{ width: `${progress}%`, background: 'var(--x-gradient)' }}
        />
      </div>
      <p className="mt-4 label tabular-nums" style={{ color: 'var(--text-tertiary)' }}>
        {String(progress).padStart(3, '0')}
      </p>
    </motion.div>
  )
}

export default function HomePage() {
  const { theme } = useTheme()
  const [loaded, setLoaded] = useState(false)
  const [skipLoader, setSkipLoader] = useState<boolean | null>(null)

  useEffect(() => {
    let seen = false
    try { seen = sessionStorage.getItem('tnx-intro') === '1' } catch {}
    setSkipLoader(seen)
    if (seen) setLoaded(true)
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  const done = useCallback(() => {
    setLoaded(true)
    try { sessionStorage.setItem('tnx-intro', '1') } catch {}
  }, [])

  return (
    <>
      <CustomCursor />

      <AnimatePresence>
        {skipLoader === false && !loaded && <LoadingScreen key="loader" onDone={done} />}
      </AnimatePresence>

      <Navigation />
      <SceneRail />

      <main>
        {/* Scene 01 — MARKETS ARE MOVING. SO ARE WE. */}
        <Scene01Hero theme={theme} introDone={loaded} />

        {/* Scene 02 — THE WORLD DOESN'T WAIT */}
        <Scene02WorldWait theme={theme} />

        {/* Scene 03 — WHERE DO YOU WANT TO GO NEXT? */}
        <Scene03Direction theme={theme} />

        {/* Scene 05 — THE TNX ENGINE */}
        <Scene05Engine theme={theme} />

        {/* Scene 06 — PEOPLE BEHIND THE MOVEMENT */}
        <Scene06Human theme={theme} />

        {/* Scene 07 — EUROPEAN REACH & RESULTS */}
        <Scene09Europe theme={theme} />

        {/* Scene 08 — PROOF */}
        <Scene10Proof theme={theme} />

        {/* Scene 09 — LET'S MOVE. */}
        <Scene11End theme={theme} />
      </main>
    </>
  )
}
