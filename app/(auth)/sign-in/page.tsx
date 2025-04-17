'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";


/**
 * SignIn Component
 *
 * This component renders a sign-in page for the CourseGPT application.
 * It provides a Google sign-in button and redirects authenticated users
 * to the dashboard. The UI includes a retro-styled design with NES.css
 * elements and a pixel art animation.
 *
 * @returns {JSX.Element | null} The rendered sign-in page or null if the user is already authenticated.
 *
 * @remarks
 * - Utilizes the `useAuth` hook to manage authentication state.
 * - Redirects authenticated users to the `/dashboard` route.
 * - Displays a loading state while the sign-in process is ongoing.
 *
 * @component
 *
 * @example
 * ```tsx
 * import SignIn from './path-to-sign-in';
 *
 * function App() {
 *   return <SignIn />;
 * }
 * ```
 *
 * @dependencies
 * - `useAuth`: Custom hook for authentication.
 * - `useRouter`: Next.js router for navigation.
 * - `Image`: Next.js Image component for displaying the pixel art animation.
 * - `Link`: Next.js Link component for navigation.
 *
 * @internal
 * - The `signInWithGoogle` function is expected to handle Google OAuth sign-in.
 * - The `isLoading` state ensures the button is disabled during the sign-in process.
 */

export default function SignIn() {
  const { user, signInWithGoogle, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (user && !loading) {
    router.push('/dashboard');
    return null;
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl mb-2">
            Sign in to CourseGPT
          </h2>
        </div>
        
        <div className="nes-container is-light with-title pixel-shadow">
          <p className="title">Login</p>
          
          <div className="py-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="nes-btn is-primary w-full"
            >
              <div className="flex items-center justify-center">
                <i className="nes-icon google is-small mr-2"></i>
                <span>{isLoading ? 'Loading...' : 'Sign in with Google'}</span>
              </div>
            </button>
            
            <div className="mt-8 text-center">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <Image
                  width={300}
                  height={300}
                  src="/cat.gif"
                  alt="Pixel art animation"
                  className="mx-auto mb-4"
                />
              </div>
            </div>
              <p className="mt-4 text-xs">
                Press START to continue your adventure!
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/" className="nes-btn">
            Back to Title Screen
          </Link>
        </div>
      </div>
    </div>
  );
}