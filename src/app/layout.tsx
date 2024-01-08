import type { Metadata } from 'next';
import { Roboto_Mono } from 'next/font/google';
import './globals.css';

const monoFont = Roboto_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TypoSpeed Tracker',
  description: 'TypoSpeed Tracker | Track you typing speed',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={monoFont.className}>{children}</body>
    </html>
  );
}
