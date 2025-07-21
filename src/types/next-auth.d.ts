/**
 * NextAuth Type Extensions
 * 
 * This file extends the default NextAuth types to include
 * custom properties like Nostr pubkeys and private keys for ephemeral accounts
 */

import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      pubkey?: string
      username?: string
      privkey?: string  // Private key for ephemeral accounts (anonymous, email, github)
    } & DefaultSession['user']
  }

  interface User {
    id: string
    email?: string | null
    username?: string
    avatar?: string
    pubkey?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    userId?: string
    pubkey?: string
    username?: string
    avatar?: string
    privkey?: string  // Private key for ephemeral accounts
    provider?: string // Track which provider was used for authentication
  }
} 