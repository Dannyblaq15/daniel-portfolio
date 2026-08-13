// app/page.js — Server Component entry point
// All heavy interactivity lives in PortfolioShell (Client Component)
import PortfolioShell from './components/PortfolioShell';

export const metadata = {
  title: 'Daniel Lewis — Software & React Native Developer',
  description:
    'Portfolio of Daniel Lewis, a software and React Native developer building practical, responsive web and mobile products.',
  keywords: [
    'Daniel Lewis portfolio',
    'React Native developer portfolio',
    'software developer portfolio',
    'mobile developer portfolio',
    'Dannyblaq15',
  ],
  alternates: {
    canonical: 'https://daniel-portfolio-mocha.vercel.app/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Daniel Lewis — Software & React Native Developer',
    description:
      'Portfolio of Daniel Lewis, a software and React Native developer building practical, responsive web and mobile products.',
    url: 'https://daniel-portfolio-mocha.vercel.app/',
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

export default function Page() {
  return <PortfolioShell />;
}
