import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'OroRound - Spare Change to Gold',
    template: '%s | OroRound',
  },
  description: 'Automatically convert spare change from everyday spending into GOLD on Solana',
  keywords: ['gold', 'solana', 'crypto', 'investment', 'spare change', 'defi'],
  authors: [{ name: 'Oro Finance' }],
  creator: 'Oro Finance',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://oro.finance',
    siteName: 'OroRound',
    title: 'OroRound - Spare Change to Gold',
    description: 'Automatically convert spare change from everyday spending into GOLD on Solana',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OroRound - Spare Change to Gold',
    description: 'Automatically convert spare change from everyday spending into GOLD on Solana',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}