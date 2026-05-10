// app/page.js — Server Component entry point
// All heavy interactivity lives in PortfolioShell (Client Component)
import PortfolioShell from './components/PortfolioShell';

export const metadata = {
  title: 'Daniel Lewis | ANTI-GRAVITY — AI Generalist & Programmer',
  description:
    "Daniel Lewis — AI generalist building with Python & JavaScript. Turning ideas into real, working systems.",
  keywords: ['Daniel Lewis', 'DANNYBLAQ', 'Marodtech', 'AI Generalist', 'Python', 'JavaScript', 'Full-Stack', 'Portfolio', 'ANTI-GRAVITY'],
  openGraph: {
    title: 'Daniel Lewis | ANTI-GRAVITY',
    description: 'AI generalist building with Python & JavaScript. Turning ideas into real, working systems.',
    type: 'website',
    url: 'https://anti-gravity.dev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daniel Lewis | ANTI-GRAVITY',
    description: 'AI generalist building with Python & JavaScript.',
    creator: '@Marodtech',
  },
};

export default function Page() {
  return <PortfolioShell />;
}
