'use client'

import { useContext } from 'react'
import { LenisContext } from '@/components/layout/SmoothScroll'

export function useLenis() {
  return useContext(LenisContext)
}
