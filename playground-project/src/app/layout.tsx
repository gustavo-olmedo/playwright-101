import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './styles/globals.css';
import Navbar from './components/Navbar/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Playground page',
  description: 'Página gerada para testes de automação',
  openGraph: {
    title: 'Playground page',
    description: 'Página gerada para testes de automação',
    images: [
      {
        url: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1721943129/BUGBUSTER/smsccp4wsl8o6v4tmmfb.jpg',
        width: 800,
        height: 600,
        alt: 'Banner de pré-visualização',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playground page',
    description: 'Página gerada para testes de automação',
    images: [
      'https://res.cloudinary.com/dtglidvcw/image/upload/v1721943129/BUGBUSTER/smsccp4wsl8o6v4tmmfb.jpg',
    ],
  },
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${inter.className} flex flex-col min-h-screen font-mono bg-gray-800`}
      >
        <header className="w-full text-center bg-gray-800 text-gray-100 pt-6 relative">
          <h1 className="text-3xl font-bold absolute top-0 left-1/2 transform -translate-x-1/2 mt-8 text-gray-100">
            Test Playground
          </h1>
        </header>
        <Navbar />
        <main className="flex-grow bg-gray-800 pt-2">{children}</main>
        <footer className="py-4 bg-gray-900 w-full text-center mt-auto text-gray-100">
          <p>&copy; 2025 Bug Buster Mentoria.</p>
        </footer>
      </body>
    </html>
  );
}
