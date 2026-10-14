'use client'

/**
 * TNX Brand X — geometry derivata din referinta de brand.
 * Asimetric: bratul stang mai lat cu sweep curbat la baza,
 * terminatie ascutita jos-dreapta, margini cyan, corp albastru electric,
 * zona violet/magenta jos-dreapta, finish metalic/glass.
 */

interface TNXBrandXProps {
  size?: number | string
  id: string
  glow?: boolean
  opacity?: number
  className?: string
  animated?: boolean
}

export function TNXBrandX({ size = 120, id, glow = false, opacity = 1, className = '', animated = false }: TNXBrandXProps) {
  return (
    <svg
      viewBox="0 0 220 220"
      className={className}
      style={{ width: size, height: size, overflow: 'visible', opacity }}
      aria-hidden="true"
    >
      <defs>
        {/* Corp principal: albastru electric spre cyan pe muchii superioare */}
        <linearGradient id={`${id}-body`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00C8FF" stopOpacity="0.95" />
          <stop offset="25%" stopColor="#0066FF" />
          <stop offset="60%" stopColor="#0044CC" />
          <stop offset="80%" stopColor="#5500CC" />
          <stop offset="100%" stopColor="#CC00AA" />
        </linearGradient>

        {/* Highlight cyan pentru muchiile superioare */}
        <linearGradient id={`${id}-edge-top`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00EEFF" />
          <stop offset="100%" stopColor="#0088FF" />
        </linearGradient>

        {/* Gradient pentru zona jos-dreapta: violet spre magenta */}
        <linearGradient id={`${id}-magenta`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6600FF" />
          <stop offset="100%" stopColor="#FF00AA" />
        </linearGradient>

        {/* Efect 3D: fata superioara mai deschisa */}
        <linearGradient id={`${id}-bevel`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
        </linearGradient>

        {glow && (
          <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}

        {/* Clip path pentru forma X */}
        <clipPath id={`${id}-clip`}>
          {/*
            Geometria X asimetrica derivata din referinta:
            - Bratul stang-sus: mai lat, cu sweep curbat la baza stanga
            - Bratul drept-sus: mai subtire, ascutit
            - Zona centrala: intersectie diagonala
            - Bratul stang-jos: curba larga in jos-stanga
            - Bratul drept-jos: terminatie ascutita, unghi mai abrupt
          */}
          <path d="
            M 28 8
            L 72 8
            L 110 52
            L 148 8
            L 192 8
            L 140 78
            L 196 152
            L 192 160
            L 148 160
            L 110 116
            L 58 172
            C 44 188 22 196 8 196
            L 8 180
            C 18 178 32 170 42 158
            L 80 110
            L 28 38
            Z
          " />
        </clipPath>
      </defs>

      <g filter={glow ? `url(#${id}-glow)` : undefined}>
        {/* Layer 1: Corp principal cu gradient */}
        <path
          d="
            M 28 8
            L 72 8
            L 110 52
            L 148 8
            L 192 8
            L 140 78
            L 196 152
            L 192 160
            L 148 160
            L 110 116
            L 58 172
            C 44 188 22 196 8 196
            L 8 180
            C 18 178 32 170 42 158
            L 80 110
            L 28 38
            Z
          "
          fill={`url(#${id}-body)`}
        />

        {/* Layer 2: Zona magenta jos-dreapta */}
        <path
          d="
            M 140 100
            L 196 152
            L 192 160
            L 148 160
            L 110 120
            Z
          "
          fill={`url(#${id}-magenta)`}
          opacity="0.85"
        />

        {/* Layer 3: Highlight bevel per efect 3D */}
        <path
          d="
            M 28 8
            L 72 8
            L 110 52
            L 148 8
            L 192 8
            L 140 78
            L 196 152
            L 192 160
            L 148 160
            L 110 116
            L 58 172
            C 44 188 22 196 8 196
            L 8 180
            C 18 178 32 170 42 158
            L 80 110
            L 28 38
            Z
          "
          fill={`url(#${id}-bevel)`}
        />

        {/* Layer 4: Muchii cyan superioare (efect de depth/extruziune) */}
        {/* Muchia stanga-sus */}
        <path
          d="M 28 8 L 72 8 L 75 12 L 31 12 Z"
          fill={`url(#${id}-edge-top)`}
          opacity="0.9"
        />
        {/* Muchia dreapta-sus */}
        <path
          d="M 148 8 L 192 8 L 189 12 L 151 12 Z"
          fill={`url(#${id}-edge-top)`}
          opacity="0.9"
        />
        {/* Highlight pe diagonala principala */}
        <path
          d="M 70 8 L 110 50 L 106 54 L 66 10 Z"
          fill="#00EEFF"
          opacity="0.4"
        />
        <path
          d="M 150 8 L 110 50 L 114 54 L 154 10 Z"
          fill="#00EEFF"
          opacity="0.25"
        />

        {/* Layer 5: Stralucire interna (glass effect) */}
        <path
          d="
            M 35 8
            L 68 8
            L 100 42
            L 80 42
            Z
          "
          fill="white"
          opacity="0.12"
        />
        <path
          d="
            M 155 8
            L 185 8
            L 155 42
            L 140 42
            Z
          "
          fill="white"
          opacity="0.08"
        />
      </g>
    </svg>
  )
}

// Re-export cu numele vechi pentru compatibilitate backward
export { TNXBrandX as XMarkGradient }

// Export punctele X pentru compatibilitate (aproximat din noua geometrie)
export const X_POINTS = '28,8 72,8 110,52 148,8 192,8 140,78 196,160 148,160 110,116 42,158 8,196 8,180 80,110 28,38'
