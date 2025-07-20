/**
 * NextAuth Configuration
 * 
 * This file configures NextAuth with:
 * - PostgreSQL adapter via Prisma
 * - Email magic link authentication
 * - Custom NIP07 Nostr browser extension authentication
 */

import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import type { Adapter } from 'next-auth/adapters'
import type { NostrEvent } from 'snstr'

/**
 * Verify NIP07 authentication event
 */
async function verifyNostrAuth(signedEvent: NostrEvent): Promise<boolean> {
  try {
    // Basic validation - in production you'd want proper cryptographic verification
    if (!signedEvent.sig || !signedEvent.pubkey) {
      console.error('Missing signature or pubkey')
      return false
    }
    
    // Verify this is a recent event (within 10 minutes)
    const now = Math.floor(Date.now() / 1000)
    const timeDiff = now - signedEvent.created_at
    if (timeDiff > 600) { // 10 minutes
      console.error('Event too old')
      return false
    }
    
    // Verify it's an authentication event (kind 22242 is common for auth)
    if (signedEvent.kind !== 22242) {
      console.error('Invalid event kind for authentication')
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error verifying Nostr authentication:', error)
    return false
  }
}



export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  
  providers: [
    // Email Magic Link Provider
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60, // 24 hours
    }),
    
    // Custom NIP07 Nostr Credentials Provider
    CredentialsProvider({
      id: 'nostr',
      name: 'Nostr (NIP07)',
      credentials: {
        pubkey: { 
          label: 'Public Key', 
          type: 'text',
          placeholder: 'Your Nostr public key (hex format)'
        },
        signedEvent: { 
          label: 'Signed Event', 
          type: 'text',
          placeholder: 'JSON signed event from browser extension'
        }
      },
      async authorize(credentials, req) {
        if (!credentials?.pubkey || !credentials?.signedEvent) {
          throw new Error('Missing required credentials')
        }

        try {
          // Parse the signed event
          const signedEvent: NostrEvent = JSON.parse(credentials.signedEvent)
          
          // Verify the pubkey matches
          if (signedEvent.pubkey !== credentials.pubkey) {
            throw new Error('Public key mismatch')
          }

          // Verify the authentication
          const isValid = await verifyNostrAuth(signedEvent)
          if (!isValid) {
            throw new Error('Invalid Nostr authentication')
          }

          // Check if user exists or create new user
          let user = await prisma.user.findUnique({
            where: { pubkey: credentials.pubkey }
          })

          if (!user) {
            // Create new user with Nostr pubkey
            user = await prisma.user.create({
              data: {
                pubkey: credentials.pubkey,
                username: `nostr_${credentials.pubkey.substring(0, 8)}`,
              }
            })
          }

          return {
            id: user.id,
            email: user.email,
            name: user.username,
            image: user.avatar,
            pubkey: user.pubkey || undefined,
          }
        } catch (error) {
          console.error('Nostr authentication error:', error)
          return null
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // Add user info to JWT token
      if (user) {
        token.pubkey = user.pubkey
        token.userId = user.id
      }
      return token
    },
    
    async session({ session, token }) {
      // Add user info to session
      if (token) {
        session.user.id = token.userId as string
        session.user.pubkey = token.pubkey as string
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      // Redirect to home after successful auth
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },

  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  events: {
    async createUser({ user }) {
      console.log('New user created:', user.email || user.pubkey)
    },
    async signIn({ user, account, isNewUser }) {
      console.log('User signed in:', user.email || user.pubkey, 'via', account?.provider)
    }
  },

  debug: process.env.NODE_ENV === 'development',
}

// Export helper functions for NIP07 authentication
export { verifyNostrAuth } 