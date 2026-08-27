import type { Metadata } from 'next';
import { Outfit, Lexend } from 'next/font/google';
import './globals.css';
import { RootProvider } from 'fumadocs-ui/provider/next';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'AddisPay Platform & Developer Documentation',
  description: 'Technical architecture, design system, API reference, and deployment documentation for the AddisPay Web Platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${lexend.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-700 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-300">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
