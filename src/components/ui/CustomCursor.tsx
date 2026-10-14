'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

const INTERACTIVE = 'a, button, [role="button"], [data-cursor="hover"], input, label'

export function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pressed, setPressed] = useState(false)

  const dotX = useSpring(cursorX, { stiffness: 900, damping: 50, mass: 0.3 })
  const dotY = useSpring(cursorY, { stiffness: 900, damping: 50, mass: 0.3 })
  const ringX = useSpring(cursorX, { stiffness: 180, damping: 22 })
  const ringY = useSpring(cursorY, { stiffness: 180, damping: 22 })

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) {
      // Give the native cursor back when we can't do the custom one well
      document.body.style.cursor = 'auto'
      return
    }
    setEnabled(true)

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setVisible(true)
    }
    // Event delegation: works for elements mounted later (menus, reveals, simulation)
    const over = (e: MouseEvent) => {
      const t = e.target as Element | null
      setHovering(!!t?.closest?.(INTERACTIVE))
    }
    const leaveWindow = () => setVisible(false)
    const down = () => setPressed(true)
    const up = () => setPressed(false)

    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseover', over, { passive: true })
    document.documentElement.addEventListener('mouseleave', leaveWindow)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.documentElement.removeEventListener('mouseleave', leaveWindow)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
    }
  }, [cursorX, cursorY])

  if (!enabled) return null

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        aria-hidden="true"
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{
            width: hovering ? 10 : 6,
            height: hovering ? 10 : 6,
            opacity: visible ? 1 : 0,
            scale: pressed ? 0.6 : 1,
          }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        aria-hidden="true"
      >
        <motion.div
          className="rounded-full"
          style={{ border: '1px solid rgba(255,255,255,0.9)' }}
          animate={{
            width: hovering ? 52 : 30,
            height: hovering ? 52 : 30,
            opacity: visible ? (hovering ? 0.9 : 0.35) : 0,
            scale: pressed ? 0.85 : 1,
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
    </>
  )
}
