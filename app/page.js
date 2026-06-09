// app/page.js — Server Component entry point
// All heavy interactivity lives in PortfolioShell (Client Component)
import PortfolioShell from './components/PortfolioShell';

export const metadata = {
  title: 'Daniel Lewis — Software Developer & React Native Developer',
  description:
    "Daniel Lewis — Software Developer based in Lagos, Nigeria. Building responsive web and mobile applications with JavaScript and React Native. Currently training as a Huawei Native Developer.",
  keywords: ['Daniel Lewis', 'Dannyblaq15', 'Software Developer', 'React Native Developer', 'Lagos', 'Nigeria', 'JavaScript', 'Portfolio'],
  openGraph: {
    title: 'Daniel Lewis | Portfolio',
    description: "Software Developer & React Native Developer based in Lagos, Nigeria. Building web and mobile apps with JavaScript and React Native.",
    type: 'website',
  },
};

export default function Page() {
  return <PortfolioShell />;
}
