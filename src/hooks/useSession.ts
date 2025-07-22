/**
 * NextAuth Session Hook
 * 
 * Convenience hook that wraps next-auth/react useSession
 * with proper TypeScript types and error handling
 */

import { useSession as useNextAuthSession } from 'next-auth/react'

export function useSession() {
  return useNextAuthSession()
}

export function useAuth() {
  const { data: session, status } = useNextAuthSession()
  
  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    session,
    status,
  }
} 