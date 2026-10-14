'use client'

import { motion } from 'framer-motion'

interface XMarkProps {
  size?: number | string
  className?: string
  animated?: boolean
  gradientId?: string
}

export function XMark({
  size = 120,
  className = '',
  animated = false,
  gradientId = 'xGrad',
}: XMarkProps) {
  const gradId = `${gradientId}_${Math.random().toString(36).slice(2, 7)}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#00E5FF" />
          <stop offset="35%"  stopColor="#126BFF" />
          <stop offset="65%"  stopColor="#7B2DFF" />
          <stop offset="100%" stopColor="#FF1EC8" />
        </linearGradient>
      </defs>

      {/* Left arm of X (top-left to bottom-right diagonal) */}
      <motion.path
        d="M10 10 L110 110"
        stroke={`url(#${gradId})`}
        strokeWidth="18"
        strokeLinecap="round"
        initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
        animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Right arm of X (top-right to bottom-left diagonal) */}
      <motion.path
        d="M110 10 L10 110"
        stroke={`url(#${gradId})`}
        strokeWidth="18"
        strokeLinecap="round"
        initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
        animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      />
    </svg>
  )
}

// Filled X for larger display usage
export function XMarkFilled({
  size = 200,
  className = '',
}: { size?: number | string; className?: string }) {
  const gradId = `xFill_${Math.random().toString(36).slice(2, 7)}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#00E5FF" />
          <stop offset="35%"  stopColor="#126BFF" />
          <stop offset="65%"  stopColor="#7B2DFF" />
          <stop offset="100%" stopColor="#FF1EC8" />
        </linearGradient>
        <filter id="xGlow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Filled polygon X shape — thick, bold, like logo */}
      <polygon
        points="0,30 30,0 100,70 170,0 200,30 130,100 200,170 170,200 100,130 30,200 0,170 70,100"
        fill={`url(#${gradId})`}
        filter="url(#xGlow)"
      />
    </svg>
  )
}
