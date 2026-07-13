import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Photo Géolocalisateur',
  description: "Identifiez la localisation d'une photo grâce à l'IA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-black text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
