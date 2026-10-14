'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import Image from 'next/image'
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher'
import { useTheme } from '@/hooks/useTheme'
import { useScrollTo, useLenis } from '@/components/layout/SmoothScroll'

const NAV_LINKS = [
  { label: 'WHAT WE DO',   href: '#signal',    watch: ['signal', 'audience', 'context'] },
  { label: 'HOW IT WORKS', href: '#engine',    watch: ['engine', 'human', 'ecosystem', 'watch'] },
  { label: 'MARKETS',      href: '#europe',    watch: ['europe'] },
  { label: 'RESULTS',      href: '#proof',     watch: ['proof'] },
  { label: 'COMPANY',      href: '#end',       watch: ['end'] },
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
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Urmareste ce scena e in viewport
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
        transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] transition-[background-color,border-color] duration-500"
        style={{
          background: scrolled || menuOpen
            ? 'var(--nav-bg)'
            : 'transparent',
          borderBottom: `1px solid ${scrolled ? 'var(--nav-border)' : 'transparent'}`,
          backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
        }}
      >
        <div className="max-w-[1440px] mx-auto px-5 lg:px-12 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a
            href="#"
            aria-label="TNX, inapoi sus"
            className="flex items-center"
            onClick={e => { e.preventDefault(); setMenuOpen(false); scrollTo(0) }}
          >
            <Image
              src="/logo/tnx-logo.png"
              alt="TNX"
              width={80}
              height={32}
              className="h-7 w-auto object-contain"
              priority
            />
          </a>

          {/* Navigatie desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(link => {
              const isActive = active === link.href
              return (
                <button
                  key={link.href}
                  onClick={() => go(link.href)}
                  className="relative py-2 transition-colors duration-300"
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  }}
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

          {/* Dreapta: theme toggle + mobile menu */}
          <div className="flex items-center gap-5 lg:gap-6">
            <ThemeSwitcher theme={theme} onToggle={toggleTheme} mounted={mounted} />

            <button
              className="lg:hidden relative w-10 h-10 -mr-2 flex flex-col items-center justify-center gap-[5px]"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Inchide meniu' : 'Deschide meniu'}
              aria-expanded={menuOpen}
            >
              <motion.span
                className="block w-5 h-px bg-[var(--text-primary)]"
                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 5 : 0 }}
                transition={{ duration: 0.25 }}
              />
              <motion.span
                className="block w-5 h-px bg-[var(--text-primary)]"
                animate={{ opacity: menuOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block w-5 h-px bg-[var(--text-primary)]"
                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -5 : 0 }}
                transition={{ duration: 0.25 }}
              />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <motion.div
          className="absolute left-0 right-0 bottom-0 h-px origin-left"
          style={{ scaleX: progress, background: 'var(--x-gradient)', opacity: scrolled ? 1 : 0 }}
          aria-hidden="true"
        />
      </motion.nav>

      {/* Meniu mobil */}
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
            <div className="flex-1 flex flex-col justify-center px-6 pt-20 gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => go(link.href)}
                  className="flex items-baseline gap-5 py-3 text-left border-b"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <span
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      letterSpacing: '0.15em',
                      color: 'var(--accent-cyan)',
                      minWidth: '1.8rem',
                    }}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className="font-semibold tracking-[-0.02em]"
                    style={{
                      fontSize: 'clamp(1.8rem, 6vw, 2.5rem)',
                      color: active === link.href ? 'var(--text-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    {link.label}
                  </span>
                </motion.button>
              ))}
            </div>

            <motion.div
              className="px-6 pb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                }}
              >
                TNX · Commercial Intelligence
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
