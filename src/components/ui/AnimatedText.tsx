'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedTextProps {
  children: string | ReactNode
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  splitLines?: boolean
  inView?: boolean
}

export function AnimatedText({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
  inView = true,
}: AnimatedTextProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Word-by-word split animation
export function SplitText({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
  inView = true,
  stagger = 0.06,
}: {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  inView?: boolean
  stagger?: number
}) {
  const prefersReducedMotion = useReducedMotion()
  const words = text.split(' ')

  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className={`inline-block ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className={`inline-block ${wordClassName}`}
            initial={{ y: '110%', opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: 0.7,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
