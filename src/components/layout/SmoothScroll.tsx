'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface LenisContextValue {
  lenis: Lenis | null
}

export const LenisContext = createContext<LenisContextValue>({ lenis: null })

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const instance = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
    })

    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)

    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={{ lenis }}>{children}</LenisContext.Provider>
}

export function useLenis() {
  return useContext(LenisContext)
}

/** Scroll to a section id with Lenis when available, native otherwise. */
export function useScrollTo() {
  const { lenis } = useLenis()
  return (target: string | number) => {
    if (lenis) {
      lenis.scrollTo(target as never, { offset: 0, duration: 1.6 })
      return
    }
    if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' })
    else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }
}
