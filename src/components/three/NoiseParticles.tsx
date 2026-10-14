'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion, type MotionValue } from 'framer-motion'
import type { Theme } from '@/types'

/* Brand palettes. Light theme uses deeper tones because it renders with normal blending. */
const PALETTE = {
  dark:  ['#00E5FF', '#126BFF', '#7B2DFF', '#FF1EC8', '#B8BCC3', '#B8BCC3'],
  light: ['#00BEDC', '#0D5FE8', '#6320E0', '#D4009E', '#8C9099', '#52565E'],
}
const X_GRADIENT = {
  dark:  ['#00E5FF', '#126BFF', '#7B2DFF', '#FF1EC8'],
  light: ['#00BEDC', '#0D5FE8', '#6320E0', '#D4009E'],
}

function sampleGradient(stops: THREE.Color[], t: number, out: THREE.Color) {
  const seg = Math.min(stops.length - 2, Math.floor(t * (stops.length - 1)))
  const local = t * (stops.length - 1) - seg
  return out.copy(stops[seg]).lerp(stops[seg + 1], local)
}

/** Soft round sprite so points read as light, not squares. */
function useDotTexture() {
  return useMemo(() => {
    const size = 64
    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.35, 'rgba(255,255,255,0.85)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(c)
    tex.needsUpdate = true
    return tex
  }, [])
}

interface FieldProps {
  count: number
  theme: Theme
  mouse: React.MutableRefObject<[number, number]>
  progress?: MotionValue<number>
}

function ParticleField({ count, theme, mouse, progress }: FieldProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()
  const tex = useDotTexture()
  const mix = useRef(0)

  // Geometry is created once per count, independent of theme, so toggling theme never reshuffles.
  const data = useMemo(() => {
    const home    = new Float32Array(count * 3)
    const target  = new Float32Array(count * 3)
    const seed    = new Float32Array(count)
    const t       = new Float32Array(count) // position along the X diagonal (0..1) for gradient
    const palIdx  = new Uint8Array(count)

    for (let i = 0; i < count; i++) {
      home[i * 3]     = (Math.random() - 0.5)
      home[i * 3 + 1] = (Math.random() - 0.5)
      home[i * 3 + 2] = (Math.random() - 0.5) * 3
      seed[i] = Math.random() * Math.PI * 2
      palIdx[i] = Math.floor(Math.random() * 6)

      // X target: two bars, filled with thickness, like the logo mark
      const arm = i % 2
      const along = Math.random() * 2 - 1                 // -1..1 along the bar
      const across = (Math.random() - 0.5) * 0.22          // bar thickness
      const dir = arm === 0 ? [0.7071, 0.7071] : [0.7071, -0.7071]
      const nrm = arm === 0 ? [-0.7071, 0.7071] : [0.7071, 0.7071]
      target[i * 3]     = dir[0] * along + nrm[0] * across
      target[i * 3 + 1] = dir[1] * along + nrm[1] * across
      target[i * 3 + 2] = (Math.random() - 0.5) * 0.15
      // gradient runs top left (cyan) to bottom right (magenta)
      t[i] = THREE.MathUtils.clamp((target[i * 3] - target[i * 3 + 1] + 1.414) / 2.828, 0, 1)
    }
    return {
      home, target, seed, t, palIdx,
      positions: new Float32Array(count * 3),
      colors: new Float32Array(count * 3),
      base: new Float32Array(count * 3),
      xcol: new Float32Array(count * 3),
    }
  }, [count])

  // Colors depend on theme only
  useEffect(() => {
    const pal = PALETTE[theme].map(c => new THREE.Color(c))
    const grad = X_GRADIENT[theme].map(c => new THREE.Color(c))
    const tmp = new THREE.Color()
    for (let i = 0; i < count; i++) {
      const c = pal[data.palIdx[i]]
      data.base[i * 3] = c.r; data.base[i * 3 + 1] = c.g; data.base[i * 3 + 2] = c.b
      sampleGradient(grad, data.t[i], tmp)
      data.xcol[i * 3] = tmp.r; data.xcol[i * 3 + 1] = tmp.g; data.xcol[i * 3 + 2] = tmp.b
    }
  }, [theme, count, data])

  useFrame((state, delta) => {
    const pts = pointsRef.current
    if (!pts) return
    const geo = pts.geometry
    const pos = geo.attributes.position.array as Float32Array
    const col = geo.attributes.color.array as Float32Array
    const time = state.clock.elapsedTime
    const [mx, my] = mouse.current

    // Ease toward scroll progress so the formation feels physical, not linear
    const goal = progress ? THREE.MathUtils.clamp(progress.get(), 0, 1) : 0
    mix.current = THREE.MathUtils.damp(mix.current, goal, 4, delta)
    const m = mix.current
    const e = m * m * (3 - 2 * m) // smoothstep

    const w = viewport.width * 1.15
    const h = viewport.height * 1.15
    const xs = Math.min(viewport.width, viewport.height) * 0.36 // X size fits any aspect ratio

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const s = data.seed[i]
      // Each particle arrives at a slightly different time: reads as "signal finding its place"
      const local = THREE.MathUtils.clamp((e - (s / (Math.PI * 2)) * 0.35) / 0.65, 0, 1)

      const nx = data.home[i3] * w + Math.sin(time * 0.25 + s) * 0.12 + mx * 0.25 * (data.home[i3 + 2])
      const ny = data.home[i3 + 1] * h + Math.cos(time * 0.2 + s) * 0.1 + my * 0.25 * (data.home[i3 + 2])
      const nz = data.home[i3 + 2]

      const tx = data.target[i3] * xs + Math.sin(time * 1.2 + s) * 0.015
      const ty = data.target[i3 + 1] * xs + Math.cos(time * 1.1 + s) * 0.015
      const tz = data.target[i3 + 2]

      pos[i3]     = nx + (tx - nx) * local
      pos[i3 + 1] = ny + (ty - ny) * local
      pos[i3 + 2] = nz + (tz - nz) * local

      col[i3]     = data.base[i3]     + (data.xcol[i3]     - data.base[i3])     * local
      col[i3 + 1] = data.base[i3 + 1] + (data.xcol[i3 + 1] - data.base[i3 + 1]) * local
      col[i3 + 2] = data.base[i3 + 2] + (data.xcol[i3 + 2] - data.base[i3 + 2]) * local
    }
    geo.attributes.position.needsUpdate = true
    geo.attributes.color.needsUpdate = true

    const mat = pts.material as THREE.PointsMaterial
    mat.size = 0.05 + e * 0.03
    mat.opacity = (theme === 'dark' ? 0.75 : 0.65) + e * 0.25
    pts.rotation.z = Math.sin(time * 0.05) * 0.02 * (1 - e)
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[data.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        key={theme}
        map={tex}
        alphaMap={tex}
        size={0.05}
        vertexColors
        transparent
        sizeAttenuation
        depthWrite={false}
        blending={theme === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  )
}

interface NoiseCanvasProps {
  theme: Theme
  /** 0 = noise field, 1 = fully formed TNX X. Read every frame, no re-renders. */
  progress?: MotionValue<number>
}

export function NoiseCanvas({ theme, progress }: NoiseCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef<[number, number]>([0, 0])
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(true)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const w = window.innerWidth
    const cores = navigator.hardwareConcurrency || 4
    let n = w < 768 ? 700 : w < 1280 ? 1400 : 2400
    if (cores <= 4) n = Math.round(n * 0.6)
    setCount(n)

    const onMove = (e: MouseEvent) => {
      mouseRef.current = [(e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1]
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    // Stop rendering when off screen: saves battery and keeps other scenes at 60fps
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px' })
    if (wrapRef.current) io.observe(wrapRef.current)
    return () => { window.removeEventListener('mousemove', onMove); io.disconnect() }
  }, [])

  if (reduced) return null

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {count > 0 && (
        <Canvas
          camera={{ position: [0, 0, 6], fov: 60 }}
          gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
          frameloop={visible ? 'always' : 'never'}
          style={{ position: 'absolute', inset: 0 }}
        >
          <ParticleField count={count} theme={theme} mouse={mouseRef} progress={progress} />
        </Canvas>
      )}
    </div>
  )
}
