import './globals.css';

export const metadata = {
  title: 'Daniel Lewis — AI Generalist & Software developer',
  description:
    "Daniel Lewis — AI generalist building with Python & JavaScript. Turning ideas into real, working systems. Exploring the space between software and engineering.",
  openGraph: {
    title: 'Daniel Lewis | ANTI-GRAVITY',
    description: "AI generalist building with Python & JavaScript. Turning ideas into real, working systems.",
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
        <meta name="theme-color" content="#0A0A0A" />
      </head>
      <body>
        {children}
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
