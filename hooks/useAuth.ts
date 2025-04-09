'use client';

import { useAuth as useAuthContext } from '@/contexts/AuthContext';

// This is a convenience re-export of the hook from the context
// Makes it easier to import in components
export function useAuth() {
  return useAuthContext();
}