'use client'

import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: () => void
  href?: string
  variant?: 'primary' | 'ghost' | 'outline'
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  onClick,
  href,
  variant = 'primary',
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setPos({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    })
  }, [strength])

  const handleMouseLeave = useCallback(() => {
    setPos({ x: 0, y: 0 })
  }, [])

  const baseStyles = {
    primary: 'bg-[var(--accent-blue)] text-white hover:bg-[var(--accent-indigo)]',
    ghost:   'bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] border border-[var(--border)]',
    outline: 'border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[var(--accent-cyan)]',
  }

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`
        inline-flex items-center justify-center gap-2
        px-6 py-3 rounded-none text-sm font-medium tracking-[0.08em] uppercase
        transition-colors duration-200 cursor-none
        ${baseStyles[variant]}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )

  if (href) {
    return <a href={href}>{inner}</a>
  }

  return inner
}
