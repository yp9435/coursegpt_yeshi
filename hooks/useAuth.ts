'use client';

import { useAuth as useAuthContext } from '@/contexts/AuthContext';

/**
 * Custom hook to access the authentication context.
 *
 * This hook provides a convenient way to retrieve the authentication context
 * by internally calling the `useAuthContext` hook. It can be used to access
 * authentication-related data and functionality throughout the application.
 *
 * @returns The value provided by the `useAuthContext` hook.
 */

export function useAuth() {
  return useAuthContext();
}