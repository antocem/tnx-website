import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Brand palette from logo analysis
        tnx: {
          black:    '#05070A',
          graphite: '#14171C',
          dark:     '#1C2029',
          silver:   '#B8BCC3',
          grey:     '#8C9099',
          white:    '#F7F8FA',
          cyan:     '#00E5FF',
          blue:     '#126BFF',
          indigo:   '#2732D9',
          violet:   '#7B2DFF',
          magenta:  '#FF1EC8',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter-tight)', 'Inter Tight', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(5rem, 12vw, 14rem)', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(3.5rem, 8vw, 9rem)',  { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(2.5rem, 5vw, 6rem)',  { lineHeight: '0.95', letterSpacing: '-0.025em' }],
        'display-sm': ['clamp(1.5rem, 3vw, 3.5rem)',{ lineHeight: '1.0',  letterSpacing: '-0.02em' }],
        'label':      ['0.6875rem', { lineHeight: '1', letterSpacing: '0.15em' }],
      },
      animation: {
        'fade-in':       'fadeIn 0.8s ease forwards',
        'slide-up':      'slideUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-slow':    'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(2rem)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      backgroundImage: {
        'x-gradient': 'linear-gradient(135deg, #00E5FF 0%, #126BFF 35%, #7B2DFF 65%, #FF1EC8 100%)',
        'signal-dark': 'radial-gradient(ellipse at 50% 50%, rgba(18,107,255,0.15) 0%, transparent 70%)',
        'signal-light': 'radial-gradient(ellipse at 50% 50%, rgba(0,229,255,0.08) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
}

export default config
