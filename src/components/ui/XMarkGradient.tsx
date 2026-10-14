'use client'

/**
 * The TNX X, as one reusable, theme aware mark.
 * Colors come from CSS variables, so dark and light are art directed automatically.
 * Pass a stable `id` (gradient ids must be unique per page and stable across renders).
 */
interface XMarkGradientProps {
  size?: number | string
  id: string
  glow?: boolean
  opacity?: number
  className?: string
}

export const X_POINTS = '0,30 30,0 100,70 170,0 200,30 130,100 200,170 170,200 100,130 30,200 0,170 70,100'

export function XMarkGradient({ size = 120, id, glow = false, opacity = 1, className = '' }: XMarkGradientProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={{ width: size, height: size, overflow: 'visible', opacity }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'var(--accent-cyan)' }} />
          <stop offset="35%" style={{ stopColor: 'var(--accent-blue)' }} />
          <stop offset="65%" style={{ stopColor: 'var(--accent-violet)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--accent-magenta)' }} />
        </linearGradient>
        {glow && (
          <filter id={`${id}-f`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>
      <polygon points={X_POINTS} fill={`url(#${id}-g)`} filter={glow ? `url(#${id}-f)` : undefined} />
    </svg>
  )
}
