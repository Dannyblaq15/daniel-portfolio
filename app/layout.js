import './globals.css';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'Daniel Lewis — Software Developer & React Native Developer',
  description:
    "Daniel Lewis — Software Developer based in Lagos, Nigeria. Building responsive web and mobile applications with JavaScript and React Native. Currently training as a Huawei Native Developer.",
  icons: {
    icon: '/favicon.ico?v=2',
    shortcut: '/favicon.ico?v=2',
    apple: '/apple-touch-icon.png?v=2',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Daniel Lewis | Portfolio',
    description: "Software Developer & React Native Developer based in Lagos, Nigeria. Building web and mobile apps with JavaScript and React Native.",
    type: 'website',
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
