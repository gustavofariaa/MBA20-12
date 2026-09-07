import type { Metadata } from 'next';
import { Luckiest_Guy, Courier_Prime } from 'next/font/google';
import './globals.css';

const luckiestGuy = Luckiest_Guy({
  weight: '400',
  variable: '--font-cartoon',
  subsets: ['latin']
});

const courierPrime = Courier_Prime({
  weight: ['400', '700'],
  variable: '--font-retro-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Trilha do Release - O Tabuleiro da Gestão Ágil',
  description: 'Jogo de tabuleiro interativo de Gestão Ágil focado nas sprints, no ciclo de vida de software e nos imprevistos do Relatório CHAOS.',
  keywords: ['Scrum', 'Agile', 'Jogo de Tabuleiro', 'Sprint', 'Deploy', 'Relatório CHAOS', 'Next.js'],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${luckiestGuy.variable} ${courierPrime.variable} antialiased`}
    >
      <body className="font-retro bg-[#FFF8E7] text-[#1C1917] min-h-screen selection:bg-[#F59E0B] selection:text-[#1C1917]">
        {children}
      </body>
    </html>
  );
}
