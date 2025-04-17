'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

/**
 * A higher-order component that protects routes by ensuring the user is authenticated.
 * If the user is not authenticated, they are redirected to the `/sign-in` page.
 * While authentication status is being determined, a loading spinner is displayed.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to render if the user is authenticated.
 * @returns {JSX.Element | null} - The rendered component or null if the user is not authenticated.
 *
 * @remarks
 * This component uses the `useAuth` hook to retrieve the current user's authentication status
 * and the `useRouter` hook from Next.js for navigation.
 *
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 * ```
 */

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user && !loading) {
    return null;
  }

  return <>{children}</>;
}