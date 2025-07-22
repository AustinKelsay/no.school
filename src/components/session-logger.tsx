'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

/**
 * Client component to log session information
 * This component runs on the client side and logs session data when available
 */
export function SessionLogger() {
  const { data: session, status } = useSession()
  
  useEffect(() => {
    if (status === 'loading') {
      console.log('🔄 Session loading...')
      return
    }
    
    if (session) {
      console.log('✅ User session found:', {
        userId: session.user?.id,
        email: session.user?.email,
        name: session.user?.name,
        pubkey: session.user?.pubkey,
        status,
        expires: session.expires
      })
    } else {
      console.log('❌ No active session')
    }
  }, [session, status])

  // This component doesn't render anything visible
  return null
}