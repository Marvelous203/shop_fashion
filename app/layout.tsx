import type { Metadata } from 'next';
import { Figtree, Syne } from 'next/font/google';
import './globals.css';

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  weight: ['300', '400', '500', '600'],
});
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['700', '800'],
});

export const metadata: Metadata = {
  title: 'VELL — Create a Character',
  description: 'Virtual fashion styling studio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${figtree.variable} ${syne.variable}`}>
      <body>{children}</body>
    </html>
  );
}
