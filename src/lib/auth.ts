/**
 * NextAuth Configuration
 * 
 * This file configures NextAuth with:
 * - PostgreSQL adapter via Prisma
 * - Email magic link authentication
 * - Custom NIP07 Nostr browser extension authentication
 * - Configurable settings via config/auth.json
 */

import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import { prisma } from './prisma'
import type { Adapter } from 'next-auth/adapters'
import type { NostrEvent } from 'snstr'
import { generateKeypair } from 'snstr'
import authConfig from '../../config/auth.json'

/**
 * Verify NIP07 public key format
 */
function verifyNostrPubkey(pubkey: string): boolean {
  // Check if it's a valid hex string of 64 characters (32 bytes)
  return /^[a-f0-9]{64}$/i.test(pubkey)
}

/**
 * Generate anonymous user data with random defaults
 */
function generateAnonymousUserData(pubkey: string) {
  const shortPubkey = pubkey.substring(0, authConfig.providers.anonymous.usernameLength)
  const username = `${authConfig.providers.anonymous.usernamePrefix}${shortPubkey}`
  const avatar = `${authConfig.providers.anonymous.defaultAvatar}${pubkey}`
  const nip05 = `${username}@${authConfig.providers.anonymous.defaultNip05Domain}`
  
  return {
    username,
    avatar,
    nip05,
    lud16: authConfig.providers.anonymous.defaultLightning
  }
}



// Build providers array based on configuration
const providers = []

// Add Email Provider if enabled
if (authConfig.providers.email.enabled) {
  providers.push(
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
      maxAge: authConfig.providers.email.maxAge,
    })
  )
}

// Add Nostr Provider if enabled
if (authConfig.providers.nostr.enabled) {
  providers.push(
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

          if (!user && authConfig.providers.nostr.autoCreateUser) {
            // Create new user with Nostr pubkey
            user = await prisma.user.create({
              data: {
                pubkey: credentials.pubkey,
                username: `${authConfig.providers.nostr.usernamePrefix}${credentials.pubkey.substring(0, authConfig.providers.nostr.usernameLength)}`,
              }
            })
          }

          if (!user) {
            throw new Error('User not found and auto-creation disabled')
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
  )
}

// Add GitHub Provider if enabled
if (authConfig.providers.github.enabled) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        // Check if user is in allowed list (if configured)
        const allowedUsers = authConfig.providers.github.allowedUsers as string[]
        if (allowedUsers.length > 0 && !allowedUsers.includes(profile.login)) {
          throw new Error(`Access denied for GitHub user: ${profile.login}`)
        }

        // Map GitHub profile to our database schema (username, avatar vs name, image)
        return {
          id: profile.id.toString(),
          email: profile.email,
          username: profile.login,
          avatar: profile.avatar_url,
        }
      }
    })
  )
}

// Add Anonymous Provider if enabled
if (authConfig.providers.anonymous.enabled) {
  providers.push(
    CredentialsProvider({
      id: 'anonymous',
      name: 'Anonymous',
      credentials: {
        generateKeys: {
          label: 'Generate Keys',
          type: 'hidden',
          value: 'true'
        }
      },
      async authorize() {
        try {
          // Generate new Nostr keypair using snstr
          const keys = await generateKeypair()
          
          if (!keys || !keys.publicKey || !keys.privateKey) {
            throw new Error('Failed to generate Nostr keys')
          }

          // Verify the generated public key format
          if (!verifyNostrPubkey(keys.publicKey)) {
            throw new Error('Generated invalid public key format')
          }

          // Generate anonymous user data
          const userData = generateAnonymousUserData(keys.publicKey)

          // Create new anonymous user if auto-creation is enabled
          if (authConfig.providers.anonymous.autoCreateUser) {
            const user = await prisma.user.create({
              data: {
                pubkey: keys.publicKey,
                privkey: keys.privateKey, // Store for anonymous accounts
                username: userData.username,
                avatar: userData.avatar,
                nip05: userData.nip05,
                lud16: userData.lud16,
              }
            })

            return {
              id: user.id,
              email: user.email,
              username: user.username || undefined,
              avatar: user.avatar || undefined,
              pubkey: user.pubkey || undefined,
            }
          }

          throw new Error('Anonymous user creation disabled')
        } catch (error) {
          console.error('Anonymous authentication error:', error)
          return null
        }
      }
    })
  )
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  
  providers,

  callbacks: {
    async jwt({ token, user, account }) {
      // Add user info to JWT token
      if (user) {
        token.pubkey = user.pubkey
        token.userId = user.id
        token.username = user.username
        token.avatar = user.avatar
      }
      return token
    },
    
    async session({ session, token }) {
      // Add user info to session and map database fields to expected session fields
      if (token) {
        session.user.id = token.userId as string
        session.user.pubkey = token.pubkey as string
        session.user.username = token.username as string
        // Map avatar to image for NextAuth compatibility
        session.user.image = token.avatar as string
        // Map username to name for NextAuth compatibility
        session.user.name = token.username as string
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      // Use configured redirect URL after successful auth
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}${authConfig.security.redirectAfterSignin}`
    }
  },

  pages: {
    signIn: authConfig.pages.signin,
    verifyRequest: authConfig.pages.verifyRequest,
    error: authConfig.pages.error,
  },

  session: {
    strategy: authConfig.session.strategy as 'jwt' | 'database',
    maxAge: authConfig.session.maxAge,
    updateAge: authConfig.session.updateAge,
  },

  events: {
    async createUser({ user }) {
      console.log('New user created:', user.email || user.pubkey || user.username)
    },
    async signIn({ user, account }) {
      console.log('User signed in:', user.email || user.pubkey || user.username, 'via', account?.provider)
    }
  },

  debug: process.env.NODE_ENV === 'development',
}

// Export helper functions and configuration
export { verifyNostrPubkey, authConfig } 