import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PATIKS',
  description: 'Made for Pharma World with Love.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Core Favicons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="icon" href="/favicon/favicon.ico" />
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon-180x180.png" />
        {/* Android / PWA */}
        <link rel="manifest" href="/favicon/manifest.json" />
        <meta name="theme-color" content="#2081E2" />
        {/* Safari pinned tab (if provided) */}
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#2081E2" />
        {/* Windows tiles */}
        <meta name="msapplication-TileColor" content="#2081E2" />
        <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
        {/* SEO / Brand */}
        <meta name="application-name" content="PATIKS" />
        <meta name="apple-mobile-web-app-title" content="PATIKS" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
