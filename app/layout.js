import './globals.css';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  metadataBase: new URL('https://daniel-portfolio-mocha.vercel.app'),
  title: {
    default: 'Daniel Lewis — Software & React Native Developer',
    template: '%s | Daniel Lewis',
  },
  description:
    'Portfolio of Daniel Lewis, a software and React Native developer building practical, responsive web and mobile products.',
  keywords: [
    'Daniel Lewis',
    'Dannyblaq15',
    'software developer',
    'React Native developer',
    'frontend developer',
    'mobile app developer',
    'Next.js developer',
    'Flutter developer',
    'portfolio',
  ],
  authors: [{ name: 'Daniel Lewis', url: 'https://daniel-portfolio-mocha.vercel.app/' }],
  creator: 'Daniel Lewis',
  publisher: 'Daniel Lewis',
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.ico?v=2',
    shortcut: '/favicon.ico?v=2',
    apple: '/apple-touch-icon.png?v=2',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Daniel Lewis — Software & React Native Developer',
    description:
      'Portfolio of Daniel Lewis, a software and React Native developer building practical, responsive web and mobile products.',
    url: '/',
    siteName: 'Daniel Lewis Portfolio',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'Daniel Lewis portfolio icon',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daniel Lewis — Software & React Native Developer',
    description:
      'Portfolio of Daniel Lewis, a software and React Native developer building practical, responsive web and mobile products.',
    images: ['/icon-512.png'],
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Daniel Lewis',
  alternateName: 'Dannyblaq',
  url: 'https://daniel-portfolio-mocha.vercel.app/',
  image: 'https://daniel-portfolio-mocha.vercel.app/daniel-photo.jpg',
  jobTitle: 'Software & React Native Developer',
  sameAs: [
    'https://github.com/Dannyblaq15',
    'https://www.linkedin.com/in/daniel-lewis-739635232/',
  ],
  knowsAbout: [
    'Software development',
    'React Native',
    'JavaScript',
    'TypeScript',
    'Next.js',
    'Flutter',
    'Mobile applications',
    'Responsive web design',
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Daniel Lewis Portfolio',
  url: 'https://daniel-portfolio-mocha.vercel.app/',
  description:
    'Portfolio of Daniel Lewis, a software and React Native developer building practical, responsive web and mobile products.',
  author: {
    '@type': 'Person',
    name: 'Daniel Lewis',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Bootstrap CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          crossOrigin="anonymous"
        />
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch (e) {}
            `,
          }}
        />
        <meta name="theme-color" content="#D85A21" />
      </head>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([personJsonLd, websiteJsonLd]),
          }}
        />
        <Analytics />
        {/* Bootstrap JS */}
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          crossOrigin="anonymous"
          async
        />
      </body>
    </html>
  );
}
