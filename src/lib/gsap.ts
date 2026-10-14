'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin)

  // Integrate GSAP with Lenis smooth scroll
  ScrollTrigger.defaults({
    markers: false,
  })
}

export { gsap, ScrollTrigger }
