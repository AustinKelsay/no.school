/**
 * NextAuth API Route Handler (App Router)
 * 
 * This file creates the authentication endpoints for NextAuth
 * including email magic links and NIP07 Nostr authentication
 */

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 