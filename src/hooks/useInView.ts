'use client'

import { useState, useEffect, useRef, RefObject } from 'react'

export function useInView<T extends Element>(
  options: IntersectionObserverInit = { threshold: 0.1 }
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        // Once triggered, no need to keep observing for reveal animations
        observer.disconnect()
      }
    }, options)

    observer.observe(el)
    return () => observer.disconnect()
  }, [options])

  return [ref, inView]
}
