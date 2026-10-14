'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Mesh, Group } from 'three'

// ─── X GEOMETRY ────────────────────────────────────────────────────────────
// Based on the exact TNX logo silhouette:
// - Asymmetric wide arms with diagonally-cut ends
// - Bottom-left arm has a subtle curved sweep
// - Overall wider than a symmetric X
// Shape defined in a 0-to-1 coordinate space, scaled at render time

function buildXShape(): THREE.Shape {
  const s = new THREE.Shape()

  // The X is built as two overlapping diagonal bars
  // We trace the outer silhouette clockwise

  // Stroke width ratio (how thick each arm is relative to the bounding box)
  const sw = 0.22

  // Top-left arm: goes from top-left corner diagonally to center
  // Bottom-right arm: continues to bottom-right corner
  // The diagonal cut ends and curved bottom-left sweep define the character

  // Using explicit polygon points matching logo geometry
  // Coordinate system: center at (0,0), range roughly -1 to 1

  const pts: [number, number][] = [
    // Top of left arm (top-left entry, diagonal cut going right)
    [-0.62, 0.90],
    [-0.35, 0.90],
    // Cross to center-top-right (diagonal cut)
    [0.62,  0.90],
    [0.90,  0.62],
    // Right arm top, diagonal into center
    [0.14,  0.0],
    // Right arm bottom, diagonal out
    [0.90, -0.62],
    [0.62, -0.90],
    // Bottom-right of bottom-right arm
    [0.35, -0.90],
    // Back toward center bottom — slight curve on bottom-left
    [-0.05, -0.12],
    // Bottom-left arm: curved sweep (3 points for smooth curve)
    [-0.52, -0.90],
    [-0.90, -0.68],
    // Left sweep end
    [-0.90, -0.50],
    // Back up the left side
    [-0.14,  0.0],
    // Top-left arm diagonal cut
    [-0.90,  0.50],
    [-0.90,  0.68],
    [-0.62,  0.90],
  ]

  s.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) {
    s.lineTo(pts[i][0], pts[i][1])
  }
  s.closePath()

  return s
}

// ─── GRADIENT TEXTURE ──────────────────────────────────────────────────────

function createGradientTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  // Diagonal gradient: cyan top-left → blue center → violet → magenta bottom-right
  const grad = ctx.createLinearGradient(0, 0, 512, 512)
  grad.addColorStop(0.00, '#00E5FF')  // cyan
  grad.addColorStop(0.25, '#126BFF')  // electric blue
  grad.addColorStop(0.55, '#7B2DFF')  // violet
  grad.addColorStop(0.80, '#CC18E8')  // indigo-magenta
  grad.addColorStop(1.00, '#FF1EC8')  // magenta

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 512)

  // Add subtle luminous center highlight
  const centerGlow = ctx.createRadialGradient(256, 256, 0, 256, 256, 180)
  centerGlow.addColorStop(0, 'rgba(255,255,255,0.22)')
  centerGlow.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = centerGlow
  ctx.fillRect(0, 0, 512, 512)

  return new THREE.CanvasTexture(canvas)
}

// ─── COMPONENT ─────────────────────────────────────────────────────────────

interface TNX3DXProps {
  /** Scale of the X — default 1.0 */
  scale?: number
  /** Depth of extrusion — default 0.18 */
  depth?: number
  /** Rotation speed (radians/sec) — 0 to disable */
  rotateSpeed?: number
  /** Auto breathing animation */
  breathe?: boolean
  /** Camera-driven slight tilt (x/y in radians) */
  tiltX?: number
  tiltY?: number
}

export function TNX3DX({
  scale = 1,
  depth = 0.18,
  rotateSpeed = 0.3,
  breathe = true,
  tiltX = 0,
  tiltY = 0,
}: TNX3DXProps) {
  const groupRef = useRef<Group>(null)
  const meshRef = useRef<Mesh>(null)

  // Build geometry once
  const { geometry, material } = useMemo(() => {
    const shape = buildXShape()

    const extrudeSettings = {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.035,
      bevelSegments: 8,
      curveSegments: 24,
    }

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)

    // Center the geometry
    geo.computeBoundingBox()
    const box = geo.boundingBox!
    const center = new THREE.Vector3()
    box.getCenter(center)
    geo.translate(-center.x, -center.y, -center.z)

    // Gradient texture mapped onto the X face
    const tex = createGradientTexture()
    tex.needsUpdate = true

    // Metallic material with gradient color map + iridescent reflections
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      metalness: 0.72,
      roughness: 0.18,
      envMapIntensity: 1.4,
      // Subtle emissive glow at intersection (cyan tint)
      emissive: new THREE.Color('#003a4a'),
      emissiveIntensity: 0.15,
    })

    return { geometry: geo, material: mat }
  }, [depth])

  // Animation loop
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    // Cinematic slow rotation around Y
    if (rotateSpeed > 0) {
      groupRef.current.rotation.y = t * rotateSpeed
    }

    // Target static tilt
    groupRef.current.rotation.x += (tiltX - groupRef.current.rotation.x) * 0.08
    groupRef.current.rotation.z += (tiltY - groupRef.current.rotation.z) * 0.08

    // Subtle breathing scale
    if (breathe && meshRef.current) {
      const breath = 1 + Math.sin(t * 0.8) * 0.018
      meshRef.current.scale.setScalar(breath)
    }
  })

  return (
    <group ref={groupRef} scale={scale}>
      {/* Primary X mesh */}
      <mesh ref={meshRef} geometry={geometry} material={material} castShadow />

      {/* Rim light — cyan from top-left */}
      <pointLight
        position={[-3, 3, 2]}
        color="#00E5FF"
        intensity={2.5}
        distance={8}
      />

      {/* Fill light — magenta from bottom-right */}
      <pointLight
        position={[3, -3, 1.5]}
        color="#FF1EC8"
        intensity={1.8}
        distance={8}
      />

      {/* Key light — blue-white from front */}
      <directionalLight
        position={[0, 0, 4]}
        color="#8BB8FF"
        intensity={1.2}
      />

      {/* Subtle violet back light for depth */}
      <pointLight
        position={[0, 0, -3]}
        color="#7B2DFF"
        intensity={0.8}
        distance={6}
      />
    </group>
  )
}

// ─── CANVAS WRAPPER ────────────────────────────────────────────────────────
// Self-contained canvas for use outside of an existing R3F context

import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'

interface TNX3DXCanvasProps {
  size?: number
  className?: string
  interactive?: boolean
  rotateSpeed?: number
}

export function TNX3DXCanvas({
  size = 300,
  className,
  interactive = false,
  rotateSpeed = 0.28,
}: TNX3DXCanvasProps) {
  return (
    <div
      className={className}
      style={{ width: size, height: size, display: 'inline-block' }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />

        <TNX3DX
          scale={0.9}
          depth={0.2}
          rotateSpeed={interactive ? 0 : rotateSpeed}
          breathe={!interactive}
        />

        {/* HDR-style environment for metallic reflections */}
        <Environment preset="city" />

        {interactive && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
        )}
      </Canvas>
    </div>
  )
}
