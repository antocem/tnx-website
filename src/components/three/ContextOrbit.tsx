'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Line } from '@react-three/drei'
import * as THREE from 'three'
import { useReducedMotion } from 'framer-motion'

const SIGNALS = [
  { label: 'NEW ROLE',         angle: 0,    radius: 3.2, speed: 0.3  },
  { label: 'EXPANSION',        angle: 45,   radius: 3.6, speed: 0.25 },
  { label: 'HIRING',           angle: 90,   radius: 3.0, speed: 0.35 },
  { label: 'LINKEDIN POST',    angle: 135,  radius: 3.8, speed: 0.28 },
  { label: 'COMPANY NEWS',     angle: 180,  radius: 3.3, speed: 0.32 },
  { label: 'TECH STACK',       angle: 225,  radius: 3.7, speed: 0.22 },
  { label: 'MARKET SHIFT',     angle: 270,  radius: 3.1, speed: 0.38 },
  { label: 'LEADERSHIP CHANGE',angle: 315,  radius: 3.5, speed: 0.27 },
]

function OrbitingSignal({
  label, angle, radius, speed, collapsed, collapseProgress,
}: {
  label: string; angle: number; radius: number; speed: number
  collapsed: boolean; collapseProgress: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const startAngle = (angle * Math.PI) / 180

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const currentAngle = startAngle + t * speed * (1 - collapseProgress * 0.8)
    const r = radius * (1 - collapseProgress * 0.85)

    groupRef.current.position.x = Math.cos(currentAngle) * r
    groupRef.current.position.y = Math.sin(currentAngle) * r * 0.5
    groupRef.current.position.z = Math.sin(currentAngle * 1.5) * 0.8
    groupRef.current.lookAt(0, 0, 5)
  })

  return (
    <group ref={groupRef}>
      {/* Signal dot */}
      <mesh>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial
          color={collapsed ? '#126BFF' : '#00E5FF'}
          transparent
          opacity={0.9 - collapseProgress * 0.5}
        />
      </mesh>
      {/* Label */}
      <Text
        fontSize={0.18}
        color="#B8BCC3"
        anchorX="center"
        anchorY="middle"
        position={[0, -0.22, 0]}
        font="/fonts/InterTight-Medium.woff"
      >
        {label}
      </Text>
    </group>
  )
}

function CenterEntity() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.08
  })

  return (
    <group>
      {/* Abstract entity — stylized X shape */}
      <mesh ref={meshRef}>
        <torusGeometry args={[0.5, 0.04, 8, 40]} />
        <meshBasicMaterial color="#126BFF" transparent opacity={0.4} />
      </mesh>
      {/* Center glow */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.6} />
      </mesh>
      {/* Outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.015, 6, 60]} />
        <meshBasicMaterial color="#7B2DFF" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

function OrbitsScene({ collapseProgress }: { collapseProgress: number }) {
  const collapsed = collapseProgress > 0.5

  return (
    <>
      <ambientLight intensity={0.2} />
      <CenterEntity />
      {SIGNALS.map((s) => (
        <OrbitingSignal
          key={s.label}
          {...s}
          collapsed={collapsed}
          collapseProgress={collapseProgress}
        />
      ))}
    </>
  )
}

export function ContextOrbitCanvas({
  collapseProgress = 0,
}: { collapseProgress?: number }) {
  const prefersReduced = useReducedMotion()
  if (prefersReduced) return null

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <OrbitsScene collapseProgress={collapseProgress} />
    </Canvas>
  )
}
