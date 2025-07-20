/**
 * NextAuth Type Extensions
 * 
 * This file extends the default NextAuth types to include
 * custom properties like Nostr pubkeys
 */

import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      pubkey?: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    pubkey?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    userId?: string
    pubkey?: string
  }
} 