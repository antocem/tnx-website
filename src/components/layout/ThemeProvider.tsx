'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Theme } from '@/types'

interface ThemeCtx {
  theme: Theme
  toggleTheme: () => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeCtx>({
  theme: 'dark',
  toggleTheme: () => {},
  mounted: false,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    let initial: Theme = 'dark'
    try {
      const saved = localStorage.getItem('tnx-theme') as Theme | null
      const attr = document.documentElement.getAttribute('data-theme') as Theme | null
      initial = saved ?? attr ?? 'dark'
    } catch {}
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
    setMounted(true)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      const root = document.documentElement
      root.classList.add('theme-transition')
      root.setAttribute('data-theme', next)
      window.setTimeout(() => root.classList.remove('theme-transition'), 700)
      try { localStorage.setItem('tnx-theme', next) } catch {}
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  return useContext(ThemeContext)
}
