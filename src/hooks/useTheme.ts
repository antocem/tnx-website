'use client'

// Single source of truth for theme lives in ThemeProvider.
// Every component reading the theme gets the same state.
export { useThemeContext as useTheme } from '@/components/layout/ThemeProvider'
