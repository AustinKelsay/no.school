/**
 * @fileoverview Root layout component for the PlebDevs application
 * @author PlebDevs Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PlebDevs - Bitcoin & Lightning Development Education',
    template: '%s | PlebDevs',
  },
  description:
    'Learn Bitcoin, Lightning Network, and Nostr protocol development from industry experts. Build the decentralized future with hands-on courses and real-world projects.',
  keywords: [
    'Bitcoin',
    'Lightning Network',
    'Nostr',
    'Development',
    'Education',
    'Courses',
    'Programming',
  ],
  authors: [{ name: 'PlebDevs Team' }],
  creator: 'PlebDevs',
  metadataBase: new URL('https://plebdevs.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://plebdevs.com',
    title: 'PlebDevs - Bitcoin & Lightning Development Education',
    description:
      'Learn Bitcoin, Lightning Network, and Nostr protocol development from industry experts.',
    siteName: 'PlebDevs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PlebDevs - Bitcoin & Lightning Development Education',
    description:
      'Learn Bitcoin, Lightning Network, and Nostr protocol development from industry experts.',
    creator: '@plebdevs',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-primary antialiased`}>
        {children}
      </body>
    </html>
  );
}
