import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/components/AuthProvider'
import ChatButton from '@/components/ChatButton'

export const metadata: Metadata = {
  title: 'OmnIA - Agents IA Automatisés pour votre Business',
  description: 'Découvrez nos 8 agents IA spécialisés pour automatiser votre comptabilité, marketing, RH et support client.',
  keywords: 'IA, agents automatisés, comptabilité, marketing, RH, support client',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning data-theme="light">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('site2-theme');
                if (theme === 'dark') {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <ChatButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
