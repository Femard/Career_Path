import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Career Path — Visualisateur de carrière',
  description: 'Visualisez votre parcours professionnel et explorez vos objectifs avec l\'IA',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className="antialiased bg-[#0a0a0f] text-slate-200 min-h-screen">
        {children}
      </body>
    </html>
  );
}
