'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'

import { Navigation } from '@/components/layout/Navigation'
import { SceneRail } from '@/components/layout/SceneRail'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { XMarkGradient } from '@/components/ui/XMarkGradient'
import { useTheme } from '@/hooks/useTheme'

import { Scene02Signal } from '@/components/scenes/Scene02Signal'
import { Scene03Audience } from '@/components/scenes/Scene03Audience'
import { Scene04Context } from '@/components/scenes/Scene04Context'
import { Scene05Engine } from '@/components/scenes/Scene05Engine'
import { Scene06Human } from '@/components/scenes/Scene06Human'
import { Scene07Ecosystem } from '@/components/scenes/Scene07Ecosystem'
import { Scene08Watch } from '@/components/scenes/Scene08Watch'
import { Scene09Europe } from '@/components/scenes/Scene09Europe'
import { Scene10Proof } from '@/components/scenes/Scene10Proof'

// WebGL scenes render on the client only
const Scene01Noise = dynamic(() => import('@/components/scenes/Scene01Hero').then(m => m.Scene01Hero), { ssr: false })
const Scene11End = dynamic(() => import('@/components/scenes/Scene11End').then(m => m.Scene11End), { ssr: false })

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
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      aria-label="Loading"
      role="status"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <XMarkGradient id="loaderX" size={56} glow />
      </motion.div>
      <div className="mt-10 w-40 h-px relative overflow-hidden" style={{ background: 'var(--border)' }}>
        <div className="absolute inset-y-0 left-0" style={{ width: `${progress}%`, background: 'var(--x-gradient)' }} />
      </div>
      <p className="mt-4 label tabular-nums">{String(progress).padStart(3, '0')}</p>
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
    // Always start the journey at the top on load
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
        <Scene01Noise theme={theme} introDone={loaded} />
        <Scene02Signal theme={theme} />
        <Scene03Audience theme={theme} />
        <Scene04Context theme={theme} />
        <Scene05Engine theme={theme} />
        <Scene06Human theme={theme} />
        <Scene07Ecosystem theme={theme} />
        <Scene08Watch theme={theme} />
        <Scene09Europe theme={theme} />
        <Scene10Proof theme={theme} />
        <Scene11End theme={theme} />
      </main>
    </>
  )
}
