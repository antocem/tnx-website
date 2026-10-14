'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from 'framer-motion'
import type { Theme } from '@/types'

// Same geometry as the logo mark (200x200 space), centered and scaled to ~5 units
const PTS: [number, number][] = [
  [0, 30], [30, 0], [100, 70], [170, 0], [200, 30], [130, 100],
  [200, 170], [170, 200], [100, 130], [30, 200], [0, 170], [70, 100],
]
const GRAD = {
  dark:  ['#00E5FF', '#126BFF', '#7B2DFF', '#FF1EC8'],
  light: ['#00BEDC', '#0D5FE8', '#6320E0', '#D4009E'],
}

function gradientAt(stops: THREE.Color[], t: number, out: THREE.Color) {
  const seg = Math.min(stops.length - 2, Math.floor(t * (stops.length - 1)))
  return out.copy(stops[seg]).lerp(stops[seg + 1], t * (stops.length - 1) - seg)
}

function XSolid({ theme, mouse }: { theme: Theme; mouse: React.MutableRefObject<[number, number]> }) {
  const group = useRef<THREE.Group>(null)

  const geometry = useMemo(() => {
    const s = 5 / 200
    const shape = new THREE.Shape()
    PTS.forEach(([x, y], i) => {
      const px = (x - 100) * s
      const py = -(y - 100) * s
      if (i === 0) shape.moveTo(px, py)
      else shape.lineTo(px, py)
    })
    shape.closePath()
    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.35, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 2 })
    g.center()
    return g
  }, [])

  // Diagonal brand gradient painted into vertex colors
  useEffect(() => {
    const stops = GRAD[theme].map(c => new THREE.Color(c))
    const pos = geometry.attributes.position
    const colors = new Float32Array(pos.count * 3)
    const tmp = new THREE.Color()
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i)
      const t = THREE.MathUtils.clamp((x - y + 3.6) / 7.2, 0, 1)
      gradientAt(stops, t, tmp)
      colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }, [geometry, theme])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    const [mx, my] = mouse.current
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, mx * 0.35 + Math.sin(t * 0.3) * 0.12, 3, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -my * 0.25, 3, delta)
    g.position.y = Math.sin(t * 0.6) * 0.06
  })

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <meshBasicMaterial vertexColors transparent opacity={theme === 'dark' ? 0.92 : 1} />
      </mesh>
      {/* Wireframe echo, gives the "engine" a technical layer */}
      <mesh geometry={geometry} scale={1.06} position={[0, 0, -0.25]}>
        <meshBasicMaterial color={theme === 'dark' ? '#126BFF' : '#0D5FE8'} wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  )
}

/* Particles travelling along the X arms: intelligence in, execution out, learning looping back */
function Flow({ kind, theme }: { kind: 'intelligence' | 'execution' | 'learning'; theme: Theme }) {
  const ref = useRef<THREE.Points>(null)
  const count = 90
  const color = {
    intelligence: theme === 'dark' ? '#00E5FF' : '#00BEDC',
    execution:    theme === 'dark' ? '#7B2DFF' : '#6320E0',
    learning:     theme === 'dark' ? '#FF1EC8' : '#D4009E',
  }[kind]
  const dir = kind === 'execution' ? [0.7071, -0.7071] : [0.7071, 0.7071]
  const speed = kind === 'intelligence' ? 0.09 : kind === 'execution' ? 0.12 : -0.07
  const z = kind === 'learning' ? -0.35 : 0.35

  const { positions, offs } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const offs = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) { offs[i * 2] = Math.random(); offs[i * 2 + 1] = (Math.random() - 0.5) * 0.35 }
    return { positions, offs }
  }, [])

  useFrame(state => {
    const p = ref.current
    if (!p) return
    const arr = p.geometry.attributes.position.array as Float32Array
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const u = (((offs[i * 2] + t * speed) % 1) + 1) % 1
      const along = (u - 0.5) * 6.4
      const across = offs[i * 2 + 1]
      arr[i * 3] = dir[0] * along - dir[1] * across
      arr[i * 3 + 1] = dir[1] * along + dir[0] * across
      arr[i * 3 + 2] = z
    }
    p.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.06} transparent opacity={0.9} sizeAttenuation depthWrite={false}
        blending={theme === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending} />
    </points>
  )
}

export function EngineXCanvas({ theme = 'dark' }: { theme?: Theme }) {
  const reduced = useReducedMotion()
  const wrap = useRef<HTMLDivElement>(null)
  const mouse = useRef<[number, number]>([0, 0])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = [(e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1]
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '150px' })
    if (wrap.current) io.observe(wrap.current)
    return () => { window.removeEventListener('mousemove', onMove); io.disconnect() }
  }, [])

  if (reduced) return null

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.75]}
        frameloop={visible ? 'always' : 'never'}
        style={{ position: 'absolute', inset: 0 }}
      >
        <XSolid theme={theme} mouse={mouse} />
        <Flow kind="intelligence" theme={theme} />
        <Flow kind="execution" theme={theme} />
        <Flow kind="learning" theme={theme} />
      </Canvas>
    </div>
  )
}
