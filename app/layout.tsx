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

/**
 * RootLayout component serves as the main layout wrapper for the application.
 * It defines the HTML structure, includes global styles, and wraps the content
 * with an authentication provider.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 *
 * @returns {JSX.Element} The root layout structure of the application.
 *
 * @remarks
 * - Includes a link to the NES.css stylesheet for styling.
 * - Applies a pixel font class to the body element.
 * - Contains a background grid and a content wrapper for the main application content.
 * - Wraps the children components with an `AuthProvider` for authentication context.
 */

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
