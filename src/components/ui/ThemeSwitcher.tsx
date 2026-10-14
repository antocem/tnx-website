'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { Theme } from '@/types'

interface ThemeSwitcherProps {
  theme: Theme
  onToggle: () => void
  mounted: boolean
}

export function ThemeSwitcher({ theme, onToggle, mounted }: ThemeSwitcherProps) {
  if (!mounted) {
    return <div className="w-10 h-5" aria-hidden="true" />
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative flex items-center gap-2 group cursor-none"
    >
      {/* Track */}
      <div
        className="relative w-10 h-5 rounded-full border transition-colors duration-500"
        style={{
          background: isDark
            ? 'rgba(18,107,255,0.2)'
            : 'rgba(0,190,220,0.15)',
          borderColor: isDark
            ? 'rgba(18,107,255,0.4)'
            : 'rgba(0,190,220,0.35)',
        }}
      >
        {/* Thumb */}
        <motion.div
          className="absolute top-0.5 w-4 h-4 rounded-full"
          animate={{
            x: isDark ? 20 : 2,
            background: isDark
              ? 'linear-gradient(135deg, #126BFF, #7B2DFF)'
              : 'linear-gradient(135deg, #00BEDC, #0D5FE8)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        />
      </div>

      {/* Label */}
      <span className="label hidden sm:block transition-colors duration-300">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? 'DARK' : 'LIGHT'}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  )
}
