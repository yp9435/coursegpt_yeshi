import type { Metadata } from 'next';
import { Press_Start_2P } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

const pixelFont = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CourseGPT',
  description: 'AI-powered course creation platform with pixel game aesthetics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://unpkg.com/nes.css@latest/css/nes.min.css" rel="stylesheet" />
      </head>
      <body className={pixelFont.className}>
        <div className="bgGrid"></div>
        <div className="content">
          <AuthProvider>
            {children}
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}