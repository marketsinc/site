import type { Metadata } from 'next';
import './globals.css';

const siteTitle = 'Markets, Inc.';
const siteDescription = 'Markets, Inc. is a research-driven investment firm dedicated to crypto markets and the emergence of real, functional on-chain economies.';
const siteUrl = 'https://markets.inc';
const ogImage = `${siteUrl}/assets/images/favicon/og-image.png`;

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  robots: 'index, follow',
  authors: [{ name: siteTitle }],
  openGraph: {
    siteName: siteTitle,
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    type: 'website',
    locale: 'en_US',
    images: [ogImage],
  },
  twitter: {
    card: 'summary',
    site: '@marketsincorp',
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
  icons: {
    icon: '/assets/images/favicon/favicon.svg',
  },
  other: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="X-DNS-Prefetch-Control" content="on" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialService',
              name: siteTitle,
              description: siteDescription,
              url: siteUrl,
              sameAs: ['https://x.com/marketsincorp'],
              serviceType: 'Investment Management',
              areaServed: 'Global',
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
