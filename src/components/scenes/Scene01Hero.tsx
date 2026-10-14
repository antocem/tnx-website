'use client'

import { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { motion, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Theme } from '@/types'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

// ─── X shape points (same coordinate space as brand reference, 200x200) ───────
const X_PTS: [number, number][] = [
  [28, 8], [72, 8], [110, 52], [148, 8], [192, 8],
  [140, 78], [196, 152], [192, 160], [148, 160], [110, 116],
  [58, 172], [44, 188], [22, 196], [8, 196], [8, 180],
  [18, 178], [32, 170], [42, 158], [80, 110], [28, 38],
]

const EASE_ENTER: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ─── Gradient stops ────────────────────────────────────────────────────────────
function getGradientStops(theme: Theme): THREE.Color[] {
  const cols = theme === 'dark'
    ? ['#00E8FF', '#0055FF', '#3300CC', '#CC0099']
    : ['#00AACC', '#0044EE', '#2200AA', '#AA0077']
  return cols.map(c => new THREE.Color(c))
}

function lerpGradient(stops: THREE.Color[], t: number, out: THREE.Color) {
  const n = stops.length - 1
  const seg = Math.min(n - 1, Math.floor(t * n))
  out.copy(stops[seg]).lerp(stops[seg + 1], t * n - seg)
}

// ─── X 3D Mesh ────────────────────────────────────────────────────────────────
function HeroX({ theme, scrollT }: { theme: Theme; scrollT: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)

  const geometry = useMemo(() => {
    const scale = 4.2 / 200
    const shape = new THREE.Shape()
    X_PTS.forEach(([x, y], i) => {
      const px = (x - 110) * scale
      const py = -(y - 100) * scale
      i === 0 ? shape.moveTo(px, py) : shape.lineTo(px, py)
    })
    shape.closePath()
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.55,
      bevelEnabled: true,
      bevelSize: 0.055,
      bevelThickness: 0.055,
      bevelSegments: 4,
    })
    geo.center()
    return geo
  }, [])

  // Vertex colors from brand gradient
  useEffect(() => {
    const stops = getGradientStops(theme)
    const pos = geometry.attributes.position
    const colors = new Float32Array(pos.count * 3)
    const tmp = new THREE.Color()
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i)
      const t = THREE.MathUtils.clamp((x - y + 3) / 6, 0, 1)
      lerpGradient(stops, t, tmp)
      colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }, [geometry, theme])

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return
    const t = state.clock.elapsedTime
    const st = scrollT.current

    // Idle breathing
    meshRef.current.rotation.y = Math.sin(t * 0.18) * 0.12
    meshRef.current.rotation.x = Math.sin(t * 0.11) * 0.06

    // Scroll: camera approaches, X scales up and rotates
    const approachScale = 1 + st * 8
    const approachZ = st * 6
    groupRef.current.position.z = approachZ
    groupRef.current.scale.setScalar(approachScale)
  })

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} geometry={geometry} castShadow>
        <meshStandardMaterial
          vertexColors
          metalness={theme === 'dark' ? 0.85 : 0.6}
          roughness={theme === 'dark' ? 0.12 : 0.2}
          envMapIntensity={1.8}
        />
      </mesh>
      {/* Cyan edge glow */}
      <mesh geometry={geometry} scale={1.012}>
        <meshBasicMaterial
          color={theme === 'dark' ? '#00C8FF' : '#0088CC'}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

// ─── Market Globe ─────────────────────────────────────────────────────────────
function MarketGlobe({ theme }: { theme: Theme }) {
  const groupRef = useRef<THREE.Group>(null)
  const isDark = theme === 'dark'

  const { nodes, connections } = useMemo(() => {
    const rng = (s: number) => { const x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x) }
    const nodeList: THREE.Vector3[] = []
    for (let i = 0; i < 28; i++) {
      const phi = Math.acos(1 - 2 * rng(i))
      const theta = 2 * Math.PI * rng(i + 50)
      const r = 2.1
      nodeList.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      ))
    }
    // Connections between nearby nodes
    const connList: [THREE.Vector3, THREE.Vector3][] = []
    for (let i = 0; i < nodeList.length; i++) {
      for (let j = i + 1; j < nodeList.length; j++) {
        if (nodeList[i].distanceTo(nodeList[j]) < 1.6) {
          connList.push([nodeList[i], nodeList[j]])
        }
      }
    }
    return { nodes: nodeList, connections: connList }
  }, [])

  // Build line geometry
  const lineGeo = useMemo(() => {
    const pts: THREE.Vector3[] = []
    connections.forEach(([a, b]) => { pts.push(a); pts.push(b) })
    const geo = new THREE.BufferGeometry().setFromPoints(pts)
    return geo
  }, [connections])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = t * 0.055
    groupRef.current.rotation.x = Math.sin(t * 0.03) * 0.08
  })

  return (
    <group ref={groupRef} position={[0, 0, -0.5]}>
      {/* Globe wireframe sphere */}
      <mesh>
        <sphereGeometry args={[2.1, 32, 24]} />
        <meshBasicMaterial
          color={isDark ? '#0033AA' : '#0044BB'}
          wireframe
          transparent
          opacity={isDark ? 0.08 : 0.05}
        />
      </mesh>

      {/* Connection lines */}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial
          color={isDark ? '#0066FF' : '#0044CC'}
          transparent
          opacity={isDark ? 0.25 : 0.18}
          linewidth={1}
        />
      </lineSegments>

      {/* Market nodes */}
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.028, 8, 8]} />
          <meshBasicMaterial
            color={
              i % 4 === 0 ? (isDark ? '#00E8FF' : '#0088CC') :
              i % 4 === 1 ? (isDark ? '#0066FF' : '#0044AA') :
              i % 4 === 2 ? (isDark ? '#CC00AA' : '#990077') :
              (isDark ? '#5500FF' : '#3300AA')
            }
          />
        </mesh>
      ))}
    </group>
  )
}

// ─── Particles ────────────────────────────────────────────────────────────────
function Particles({ theme, count = 1400 }: { theme: Theme; count?: number }) {
  const meshRef = useRef<THREE.Points>(null)
  const isDark = theme === 'dark'

  const { positions, speeds } = useMemo(() => {
    const rng = (s: number) => { const x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x) }
    const pos = new Float32Array(count * 3)
    const sp = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const r = 1.5 + rng(i) * 4.5
      const phi = Math.acos(1 - 2 * rng(i + 100))
      const theta = 2 * Math.PI * rng(i + 200)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.cos(phi)
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 1
      sp[i] = 0.3 + rng(i + 300) * 0.7
    }
    return { positions: pos, speeds: sp }
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.y = t * 0.012
    meshRef.current.rotation.x = Math.sin(t * 0.008) * 0.04
  })

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [positions])

  return (
    <points ref={meshRef} geometry={geo}>
      <pointsMaterial
        color={isDark ? '#2266FF' : '#1144CC'}
        size={0.016}
        transparent
        opacity={isDark ? 0.55 : 0.35}
        sizeAttenuation
      />
    </points>
  )
}

// ─── Mouse-driven camera parallax ─────────────────────────────────────────────
function CameraRig({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3(0, 0, 6))
  const current = useRef(new THREE.Vector3(0, 0, 6))

  useFrame(() => {
    const [mx, my] = mouse.current
    target.current.set(mx * 0.4, my * 0.25, 6)
    current.current.lerp(target.current, 0.04)
    camera.position.copy(current.current)
    camera.lookAt(0, 0, 0)
  })
  return null
}

// ─── Lighting ─────────────────────────────────────────────────────────────────
function Lights({ theme }: { theme: Theme }) {
  const isDark = theme === 'dark'
  return (
    <>
      <ambientLight intensity={isDark ? 0.15 : 0.5} />
      {/* Key: cyan from upper-left */}
      <directionalLight
        position={[-4, 5, 3]}
        intensity={isDark ? 3.5 : 2.0}
        color={isDark ? '#00CCFF' : '#AACCFF'}
        castShadow
      />
      {/* Fill: magenta from right */}
      <directionalLight
        position={[5, -2, 2]}
        intensity={isDark ? 1.8 : 0.8}
        color={isDark ? '#CC0099' : '#997799'}
      />
      {/* Rim from behind */}
      <directionalLight
        position={[0, 0, -5]}
        intensity={isDark ? 0.6 : 0.3}
        color={isDark ? '#0044FF' : '#8899CC'}
      />
      {/* Point inside globe */}
      <pointLight position={[0, 0, -0.5]} intensity={isDark ? 0.8 : 0.4} color={isDark ? '#0044FF' : '#5577CC'} distance={6} />
    </>
  )
}

// ─── Full 3D Scene ─────────────────────────────────────────────────────────────
function HeroScene({ theme, scrollT }: { theme: Theme; scrollT: React.MutableRefObject<number> }) {
  const mouse = useRef<[number, number]>([0, 0])

  return (
    <div
      className="absolute inset-0"
      onMouseMove={e => {
        mouse.current = [
          (e.clientX / window.innerWidth) * 2 - 1,
          -((e.clientY / window.innerHeight) * 2 - 1),
        ]
      }}
      onMouseLeave={() => { mouse.current = [0, 0] }}
    >
      <Canvas
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 6], fov: 52 }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Lights theme={theme} />
        <CameraRig mouse={mouse} />
        <Particles theme={theme} count={1200} />
        <MarketGlobe theme={theme} />
        <HeroX theme={theme} scrollT={scrollT} />
      </Canvas>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
interface Scene01HeroProps {
  theme: Theme
  introDone?: boolean
}

export function Scene01Hero({ theme, introDone = true }: Scene01HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const scrollT = useRef(0)
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState(0)
  const isDark = theme === 'dark'

  // Timing intro
  useEffect(() => {
    if (!introDone) return
    const t1 = setTimeout(() => setPhase(1), 800)
    const t2 = setTimeout(() => setPhase(2), 2000)
    const t3 = setTimeout(() => setPhase(3), 3400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [introDone])

  // GSAP ScrollTrigger
  useEffect(() => {
    if (reduced || !sectionRef.current) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          scrollT.current = self.progress
          // Headline parallax
          if (headlineRef.current) {
            const p = self.progress
            const yOff = p < 0.25 ? 0 : Math.min(1, (p - 0.25) / 0.35) * -90
            const op = p < 0.25 ? 1 : Math.max(0, 1 - (p - 0.25) / 0.25)
            gsap.set(headlineRef.current, { y: `${yOff}vh`, opacity: op })
          }
        },
      })
    })
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="noise"
      className="relative"
      style={{ height: reduced ? '100svh' : '380svh' }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">

        {/* Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #040810 0%, #060C18 40%, #040810 100%)'
              : 'linear-gradient(135deg, #F0F2F8 0%, #E8EDF6 40%, #EEF1F8 100%)',
          }}
        />

        {/* Atmospheric glow behind canvas */}
        <div
          className="absolute z-0 pointer-events-none"
          style={{
            right: '-5%',
            top: '5%',
            width: '70%',
            height: '90%',
            background: isDark
              ? 'radial-gradient(ellipse at 60% 40%, rgba(0,60,180,0.18) 0%, rgba(80,0,140,0.08) 50%, transparent 70%)'
              : 'radial-gradient(ellipse at 60% 40%, rgba(0,80,200,0.08) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />

        {/* 3D Canvas — dreapta */}
        {!reduced && (
          <div className="absolute inset-0 z-10">
            <HeroScene theme={theme} scrollT={scrollT} />
          </div>
        )}

        {/* Overlay gradient stanga pentru a separa textul de canvas */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: isDark
              ? 'linear-gradient(to right, rgba(4,8,16,0.95) 0%, rgba(4,8,16,0.75) 35%, rgba(4,8,16,0.1) 60%, transparent 100%)'
              : 'linear-gradient(to right, rgba(240,242,248,0.96) 0%, rgba(240,242,248,0.78) 35%, rgba(240,242,248,0.1) 60%, transparent 100%)',
          }}
        />

        {/* Headline — stanga, asimetric */}
        <div
          ref={headlineRef}
          className="absolute inset-0 z-30 flex items-center pointer-events-none"
          style={{ padding: '0 5vw' }}
        >
          <div style={{ maxWidth: '42vw' }}>

            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: EASE_ENTER }}
              style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: isDark ? 'rgba(0,200,255,0.7)' : 'rgba(0,80,180,0.6)',
                marginBottom: '1.8rem',
              }}
            >
              TNX · COMMERCIAL INTELLIGENCE
            </motion.p>

            {/* MARKETS ARE MOVING. */}
            <h1
              style={{
                fontSize: 'clamp(2.8rem, 5.5vw, 6.5rem)',
                fontWeight: 800,
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                color: isDark ? '#FFFFFF' : '#0A0E1A',
                margin: 0,
              }}
            >
              {['MARKETS ARE', 'MOVING.'].map((line, i) => (
                <span key={line} style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.06em' }}>
                  <motion.span
                    style={{ display: 'block' }}
                    initial={{ y: '110%' }}
                    animate={phase >= 1 ? { y: '0%' } : {}}
                    transition={{ duration: 1.1, delay: i * 0.1, ease: EASE_ENTER }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}

              {/* SO ARE WE. — cu gradient */}
              <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.06em', marginTop: '0.08em' }}>
                <motion.span
                  className="text-gradient-x"
                  style={{ display: 'block' }}
                  initial={{ y: '110%' }}
                  animate={phase >= 2 ? { y: '0%' } : {}}
                  transition={{ duration: 1.1, ease: EASE_ENTER }}
                >
                  SO ARE WE.
                </motion.span>
              </span>
            </h1>

            {/* Subtitlu */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE_ENTER }}
              style={{
                fontSize: 'clamp(0.85rem, 1.1vw, 1.1rem)',
                fontWeight: 400,
                lineHeight: 1.6,
                color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(10,14,26,0.5)',
                marginTop: '2rem',
                maxWidth: '32ch',
              }}
            >
              We turn market intelligence into meaningful commercial conversations.
            </motion.p>

            {/* CTA editorial */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={phase >= 3 ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE_ENTER }}
              style={{ marginTop: '2.8rem', pointerEvents: 'auto' }}
            >
              <EditorialCTA isDark={isDark} />
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-[5vw] z-30 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 0.5 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <span
            style={{
              display: 'block',
              width: 1,
              height: 40,
              background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.span
              style={{
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0,
                width: 1,
                height: 14,
                background: 'var(--accent-cyan)',
              }}
              animate={{ y: [-14, 54] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
          <span
            style={{
              fontSize: '0.58rem',
              letterSpacing: '0.2em',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
            }}
          >
            SCROLL TO EXPLORE
          </span>
        </motion.div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 inset-x-0 h-48 z-40 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, transparent, ${isDark ? '#040810' : '#F0F2F8'})` }}
        />
      </div>
    </section>
  )
}

// ─── CTA Editorial ─────────────────────────────────────────────────────────────
function EditorialCTA({ isDark }: { isDark: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        document.getElementById('signal')?.scrollIntoView({ behavior: 'smooth' })
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.5rem 0',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      <span
        style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: hovered
            ? (isDark ? '#FFFFFF' : '#0A0E1A')
            : (isDark ? 'rgba(255,255,255,0.65)' : 'rgba(10,14,26,0.55)'),
          transition: 'color 0.3s ease',
        }}
      >
        EXPLORE WHAT&apos;S NEXT
      </span>
      <motion.span
        animate={{ x: hovered ? 3 : 0, opacity: hovered ? 1 : 0.5 }}
        transition={{ duration: 0.25 }}
        style={{
          fontSize: '0.9rem',
          color: '#00C8FF',
          lineHeight: 1,
        }}
      >
        ↗
      </motion.span>
      {/* Underline */}
      <motion.span
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'var(--x-gradient)',
          transformOrigin: 'left',
          scaleX: hovered ? 1 : 0,
        }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
    </button>
  )
}
