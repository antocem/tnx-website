export type Theme = 'dark' | 'light'

export interface MousePosition {
  x: number
  y: number
  normalizedX: number  // -1 to 1
  normalizedY: number  // -1 to 1
}

export interface SceneProps {
  theme: Theme
}

export interface Particle {
  id: number
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  size: number
  opacity: number
  color: string
}
