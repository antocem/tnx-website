import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { ThemeProvider } from '@/components/layout/ThemeProvider'

export const metadata: Metadata = {
  title: 'TNX | Commercial Intelligence',
  description: 'TNX transforms market noise into relevant commercial conversations. There is always a signal.',
  icons: { icon: '/logo/tnx-logo.png' },
  openGraph: {
    title: 'TNX | Commercial Intelligence',
    description: 'We find the signal. We understand it. We act on it.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#05070A',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700;800&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var s=localStorage.getItem('tnx-theme');document.documentElement.setAttribute('data-theme',s||'dark');}catch(e){}`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}
