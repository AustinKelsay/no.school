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
 * Verify NIP07 public key format
 */
function verifyNostrPubkey(pubkey: string): boolean {
  // Check if it's a valid hex string of 64 characters (32 bytes)
  return /^[a-f0-9]{64}$/i.test(pubkey)
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
        }
      },
      async authorize(credentials) {
        if (!credentials?.pubkey) {
          throw new Error('Missing public key')
        }

        try {
          // Verify the public key format
          if (!verifyNostrPubkey(credentials.pubkey)) {
            throw new Error('Invalid public key format')
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
export { verifyNostrPubkey } 