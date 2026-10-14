'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import type { Theme } from '@/types'

/**
 * Drop real photos in /public/team/01.jpg ... 04.jpg and they replace the placeholders automatically.
 */
const PHOTOS = [
  { src: '/team/01.jpg', label: 'On a call',         span: 'lg:col-span-5 lg:row-span-2', ratio: '4 / 5' },
  { src: '/team/02.jpg', label: 'Research',          span: 'lg:col-span-4',               ratio: '16 / 10' },
  { src: '/team/03.jpg', label: 'Strategy session',  span: 'lg:col-span-3',               ratio: '1 / 1' },
  { src: '/team/04.jpg', label: 'The team',          span: 'lg:col-span-7',               ratio: '21 / 9' },
]

function PhotoSlot({ p, i, inView, theme }: { p: typeof PHOTOS[0]; i: number; inView: boolean; theme: Theme }) {
  // Only show the photo once it has actually loaded, so a missing file never flashes broken alt text
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const img = new window.Image()
    img.onload = () => setLoaded(true)
    img.src = p.src
  }, [p.src])
  const failed = !loaded
  return (
    <motion.figure
      className={`relative overflow-hidden group ${p.span}`}
      style={{ aspectRatio: p.ratio, background: 'var(--bg-tertiary)' }}
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      animate={inView ? { clipPath: 'inset(0% 0 0 0)' } : {}}
      transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: [0.76, 0, 0.24, 1] }}
      data-cursor="hover"
    >
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={p.src}
          alt={p.label}
          className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-[1200ms] ease-out"
        />
      ) : (
        <div className="absolute inset-0">
          {/* Designed placeholder: duotone light study, reads as intentional until photos arrive */}
          <div className="absolute inset-0" style={{
            background: theme === 'dark'
              ? `radial-gradient(70% 60% at ${30 + i * 15}% ${35 + (i % 2) * 20}%, rgba(18,107,255,0.22), transparent 70%), radial-gradient(50% 50% at 80% 90%, rgba(255,30,200,0.12), transparent 70%)`
              : `radial-gradient(70% 60% at ${30 + i * 15}% ${35 + (i % 2) * 20}%, rgba(0,190,220,0.18), transparent 70%), radial-gradient(50% 50% at 80% 90%, rgba(212,0,158,0.08), transparent 70%)`,
          }} />
          <div className="absolute inset-0 opacity-[0.07]" style={{
            backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
          <span className="absolute top-4 right-4 label tabular-nums">0{i + 1}</span>
        </div>
      )}
      <div className="absolute inset-0 pointer-events-none" style={{ background: theme === 'dark' || !failed ? 'linear-gradient(to top, rgba(5,7,10,0.55), transparent 45%)' : 'linear-gradient(to top, rgba(5,7,10,0.18), transparent 45%)' }} />
      <figcaption className="absolute bottom-4 left-4 flex items-center gap-2">
        <span className="w-4 h-px" style={{ background: 'var(--accent-cyan)' }} />
        <span className="label" style={{ color: theme === 'light' && failed ? 'var(--text-primary)' : '#F7F8FA' }}>{p.label}</span>
      </figcaption>
    </motion.figure>
  )
}

export function Scene06Human({ theme }: { theme: Theme }) {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.12 })
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const shift = useTransform(scrollYProgress, [0, 1], ['4%', '-6%'])

  return (
    <section
      ref={sectionRef}
      id="human"
      className="relative overflow-hidden"
      style={{ background: 'var(--bg-primary)', paddingBlock: 'clamp(6rem, 12vw, 11rem)' }}
    >
      <div className="max-w-[1440px] mx-auto px-5 lg:px-12">
        <motion.p className="eyebrow mb-8" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>
          <span className="idx">06</span><span className="rule" />The human layer
        </motion.p>

        <motion.h2
          className="font-bold leading-[0.88] tracking-[-0.05em] mb-16 lg:mb-24"
          style={{ fontSize: 'clamp(2.1rem, 9.2vw, 10.5rem)', color: 'var(--text-primary)', x: shift }}
        >
          {['TECHNOLOGY', "DOESN'T START", 'CONVERSATIONS.'].map((l, i) => (
            <span key={l} className="block overflow-hidden pb-[0.05em]">
              <motion.span
                className={`block ${i === 2 ? 'text-gradient-x' : ''}`}
                initial={{ y: '105%' }}
                animate={inView ? { y: '0%' } : {}}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {l}
              </motion.span>
            </span>
          ))}
          <span className="block overflow-hidden mt-3">
            <motion.span
              className="block"
              style={{ color: 'var(--text-secondary)' }}
              initial={{ y: '105%' }}
              animate={inView ? { y: '0%' } : {}}
              transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              PEOPLE DO.
            </motion.span>
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 lg:gap-4 mb-16 lg:mb-20">
          {PHOTOS.map((p, i) => <PhotoSlot key={p.src} p={p} i={i} inView={inView} theme={theme} />)}
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <motion.p
            className="lg:col-span-7 font-light"
            style={{ fontSize: 'clamp(1.15rem, 2vw, 1.75rem)', color: 'var(--text-secondary)', lineHeight: 1.45, letterSpacing: '-0.015em' }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We use technology to make those conversations better. The SDR speaking on your behalf is a real person.{' '}
            <span style={{ color: 'var(--text-primary)' }}>Trained, briefed, and equipped with the full context of your market.</span>
          </motion.p>

          <motion.div
            className="lg:col-span-4 lg:col-start-9 pl-6 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className="absolute left-0 top-0 bottom-0 w-px" style={{ background: 'var(--x-gradient)' }} />
            <p className="label mb-2">The TNX team</p>
            <p className="font-medium tracking-[-0.02em]" style={{ fontSize: 'clamp(1.25rem, 1.8vw, 1.6rem)', color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Commercial strategists.<br />Skilled communicators.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
