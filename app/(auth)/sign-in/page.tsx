'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const { user, signInWithGoogle, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Redirect if already authenticated
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
          <p className="text-sm">
            Create and manage AI-powered courses
          </p>
        </div>
        
        <div className="nes-container is-dark with-title pixel-shadow">
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
              <i className="nes-octocat animate"></i>
              <p className="mt-4 text-xs">
                Press START to continue your adventure!
              </p>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-xs">
                Don&apos;t have an account?{' '}
                <Link href="/sign-up" className="underline hover:opacity-70 pixel-transition">
                  Sign up
                </Link>
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