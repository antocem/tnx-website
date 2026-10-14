'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import Image from 'next/image'
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher'
import { useTheme } from '@/hooks/useTheme'
import { useScrollTo, useLenis } from '@/components/layout/SmoothScroll'

const NAV_LINKS = [
  { label: 'What we do',   href: '#signal',  watch: ['signal', 'audience', 'context'] },
  { label: 'How it works', href: '#engine',  watch: ['engine', 'human', 'ecosystem', 'watch'] },
  { label: 'Markets',      href: '#europe',  watch: ['europe'] },
  { label: 'Results',      href: '#proof',   watch: ['proof', 'end'] },
]

export function Navigation() {
  const { theme, toggleTheme, mounted } = useTheme()
  const scrollTo = useScrollTo()
  const { lenis } = useLenis()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Track which scene is in the middle of the viewport
  useEffect(() => {
    const ids = NAV_LINKS.flatMap(l => l.watch)
    const observed = new Set<string>()
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const link = NAV_LINKS.find(l => l.watch.includes(e.target.id))
            setActive(link?.href ?? null)
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    const attach = () => {
      ids.forEach(id => {
        const el = document.getElementById(id)
        if (el && !observed.has(id)) { io.observe(el); observed.add(id) }
      })
      return observed.size === ids.length
    }
    attach()
    const iv = window.setInterval(() => { if (attach()) window.clearInterval(iv) }, 400)
    const top = () => { if (window.scrollY < window.innerHeight * 0.8) setActive(null) }
    window.addEventListener('scroll', top, { passive: true })
    return () => { io.disconnect(); window.clearInterval(iv); window.removeEventListener('scroll', top) }
  }, [])

  // Lock page scroll behind the mobile menu
  useEffect(() => {
    if (menuOpen) { lenis?.stop(); document.body.style.overflow = 'hidden' }
    else { lenis?.start(); document.body.style.overflow = '' }
  }, [menuOpen, lenis])

  const go = (href: string) => {
    setMenuOpen(false)
    window.setTimeout(() => scrollTo(href), menuOpen ? 250 : 0)
  }

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] transition-[background-color,border-color] duration-500"
        style={{
          background: scrolled || menuOpen ? 'var(--nav-bg)' : 'transparent',
          borderBottom: `1px solid ${scrolled ? 'var(--nav-border)' : 'transparent'}`,
          backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
        }}
      >
        <div className="max-w-[1440px] mx-auto px-5 lg:px-12 flex items-center justify-between h-16 lg:h-20">
          <a
            href="#"
            aria-label="TNX, back to top"
            className="flex items-center"
            onClick={e => { e.preventDefault(); setMenuOpen(false); scrollTo(0) }}
          >
            <Image src="/logo/tnx-logo.png" alt="TNX" width={80} height={32} className="h-7 w-auto object-contain" priority />
          </a>

          <div className="hidden lg:flex items-center gap-9">
            {NAV_LINKS.map(link => {
              const isActive = active === link.href
              return (
                <button
                  key={link.href}
                  onClick={() => go(link.href)}
                  className="label relative py-2 transition-colors duration-300 hover:!text-[var(--text-primary)]"
                  style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute left-0 right-0 -bottom-0.5 h-px"
                      style={{ background: 'var(--x-gradient)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-5 lg:gap-6">
            <ThemeSwitcher theme={theme} onToggle={toggleTheme} mounted={mounted} />

            <button
              onClick={() => go('#end')}
              className="group hidden lg:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium tracking-[0.12em] uppercase text-white relative overflow-hidden"
              style={{ background: 'var(--accent-blue)' }}
            >
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'var(--x-gradient)' }}
              />
              <span className="relative">Enter the market</span>
              <span className="relative transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>

            <button
              className="lg:hidden relative w-10 h-10 -mr-2 flex flex-col items-center justify-center gap-[5px]"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <motion.span className="block w-6 h-px bg-[var(--text-primary)]"
                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }} transition={{ duration: 0.25 }} />
              <motion.span className="block w-6 h-px bg-[var(--text-primary)]"
                animate={{ opacity: menuOpen ? 0 : 1 }} transition={{ duration: 0.2 }} />
              <motion.span className="block w-6 h-px bg-[var(--text-primary)]"
                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }} transition={{ duration: 0.25 }} />
            </button>
          </div>
        </div>

        {/* Journey progress */}
        <motion.div
          className="absolute left-0 right-0 bottom-0 h-px origin-left"
          style={{ scaleX: progress, background: 'var(--x-gradient)', opacity: scrolled ? 1 : 0 }}
          aria-hidden="true"
        />
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[99] lg:hidden flex flex-col"
            style={{ background: 'var(--bg-primary)' }}
          >
            <div className="flex-1 flex flex-col justify-center px-6 pt-20 gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => go(link.href)}
                  className="flex items-baseline gap-4 py-3 text-left"
                >
                  <span className="label tabular-nums" style={{ color: 'var(--accent-cyan)' }}>0{i + 1}</span>
                  <span className="text-4xl font-semibold tracking-[-0.03em]"
                    style={{ color: active === link.href ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {link.label}
                  </span>
                </motion.button>
              ))}
            </div>
            <motion.div
              className="px-6 pb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <button
                onClick={() => go('#end')}
                className="w-full py-5 text-sm font-medium tracking-[0.12em] uppercase text-white"
                style={{ background: 'var(--x-gradient)' }}
              >
                Enter the market →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
