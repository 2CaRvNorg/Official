import type { Metadata } from 'next';
import LogoPreloader from './components/LogoPreloader';
import './globals.css';

export const metadata: Metadata = {
  title: '2Carvn Academy — Learn Design, Technology & Communication',
  description:
    'A six-month programme for students in Grades 6–10 across Design, Web Technology, and Communication. Multi-institution learning, live classes, gamified experience.',
  keywords: ['2Carvn Academy', 'online learning', 'grades 6-10', 'design', 'technology', 'communication', 'students'],
  openGraph: {
    title: '2Carvn Academy',
    description: 'Learn Design, Technology & Communication',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/2carvn-logo.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        <LogoPreloader />
        {children}
      </body>
    </html>
  );
}
