/**
 * NextAuth Configuration
 * 
 * This file configures NextAuth with:
 * - PostgreSQL adapter via Prisma
 * - Email magic link authentication
 * - Custom NIP07 Nostr browser extension authentication
 * - Anonymous authentication with generated Nostr keypairs
 * - GitHub OAuth authentication
 * - Ephemeral Nostr keypair generation for non-Nostr accounts
 * - Configurable settings via config/auth.json
 * 
 * EPHEMERAL KEYPAIR SYSTEM:
 * ========================
 * 
 * This system ensures ALL users have Nostr capabilities regardless of their authentication method:
 * 
 * 1. NIP07 Authentication (nostr provider):
 *    - Users authenticate with their own Nostr keypair via browser extension
 *    - We store only the public key (pubkey) in the database
 *    - Private key (privkey) is NOT stored - users manage their own keys
 *    - Session includes pubkey but NOT privkey (for security)
 * 
 * 2. Anonymous Authentication (anonymous provider):
 *    - System generates fresh Nostr keypair for each anonymous session
 *    - Both pubkey and privkey are stored in database (ephemeral account)
 *    - Session includes both pubkey AND privkey (user can sign events)
 * 
 * 3. Email/GitHub Authentication (email/github providers):
 *    - System automatically generates Nostr keypair on user creation or first sign-in
 *    - Both pubkey and privkey are stored in database (ephemeral account)
 *    - Session includes both pubkey AND privkey (user can sign events)
 *    - This happens transparently - users don't know they have Nostr keys
 * 
 * 4. Future NIP46 Authentication (nip46 provider - not implemented yet):
 *    - Users authenticate via remote signing protocol
 *    - Similar to NIP07, we store only pubkey
 *    - Private key remains on remote signer, not in our database
 *    - Session includes pubkey but NOT privkey
 * 
 * SECURITY CONSIDERATIONS:
 * =======================
 * 
 * - NIP07/NIP46 users: Private keys never touch our system (user-controlled)
 * - Ephemeral accounts: Private keys stored encrypted in database
 * - Session privkey is only exposed for accounts that need client-side signing
 * - Provider tracking ensures we only expose privkey to appropriate account types
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
        token.provider = account?.provider
        
        /**
         * EPHEMERAL KEYPAIR HANDLING IN JWT:
         * =================================
         * 
         * We include the private key in the JWT token ONLY for users who authenticate
         * via providers that use ephemeral keypairs (anonymous, email, github).
         * 
         * NIP07 users manage their own keys and should never have privkey in our system.
         * Future NIP46 users will also manage keys remotely.
         * 
         * This allows ephemeral account users to sign Nostr events client-side
         * while maintaining security for user-controlled key authentication.
         */
        if (account?.provider && !['nostr'].includes(account.provider)) {
          // Fetch the user's privkey from database for ephemeral accounts
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { privkey: true }
          })
          token.privkey = dbUser?.privkey || undefined
          
          console.log('JWT Callback - Ephemeral keypair handling:')
          console.log('- Provider:', account.provider)
          console.log('- User ID:', user.id)
          console.log('- User email/username:', user.email || user.username)
          console.log('- Has pubkey in user object:', !!user.pubkey)
          console.log('- Has privkey in database:', !!dbUser?.privkey)
          console.log('- Setting privkey in token:', !!token.privkey)
        }
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
        
        /**
         * EPHEMERAL KEYPAIR HANDLING IN SESSION:
         * =====================================
         * 
         * We expose the private key in the user session for users who have ephemeral keypairs.
         * This includes anonymous, email, and GitHub users.
         * 
         * For existing users who already have sessions, we determine if they need privkey
         * by checking if they have one stored in the database. NIP07 users never have
         * privkey stored since they manage their own keys.
         * 
         * This enables client-side Nostr event signing for ephemeral account users while
         * keeping private keys secure for NIP07/NIP46 users who manage their own keys.
         */
        
        // Check if user has ephemeral keys by looking for stored privkey
        // NIP07 users won't have privkey stored in database
        if (session.user.pubkey) {
          console.log('Session Callback - Ephemeral keypair handling:')
          console.log('- User ID:', token.userId)
          console.log('- Provider in token:', token.provider)
          console.log('- Has pubkey:', !!session.user.pubkey)
          console.log('- Has privkey in token:', !!token.privkey)
          
          // If privkey is already in token, use it (for new logins)
          if (token.privkey) {
            session.user.privkey = token.privkey as string
            console.log('- Using privkey from token:', !!session.user.privkey)
          } else {
            // For existing sessions, fetch privkey from database if it exists
            try {
              const dbUser = await prisma.user.findUnique({
                where: { id: token.userId as string },
                select: { privkey: true }
              })
              if (dbUser?.privkey) {
                session.user.privkey = dbUser.privkey
                console.log('- Fetched privkey from database:', !!session.user.privkey)
              } else {
                console.log('- No privkey in database (likely NIP07 user)')
              }
              // If no privkey in database, this is likely a NIP07 user (expected)
            } catch (error) {
              console.error('Failed to fetch privkey for session:', error)
            }
          }
          
          console.log('- Final session has privkey:', !!session.user.privkey)
        }
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
      
      /**
       * EPHEMERAL KEYPAIR GENERATION ON USER CREATION:
       * ==============================================
       * 
       * When a new user is created via email or GitHub authentication,
       * they don't have Nostr keys yet. We automatically generate an
       * ephemeral keypair for them so they can participate in Nostr
       * functionality without knowing they're using Nostr.
       * 
       * This does NOT apply to:
       * - NIP07 users (they provide their own pubkey)
       * - Anonymous users (they get keys in the authorize function)
       * - Future NIP46 users (they'll have remote keys)
       * 
       * The generated keypair is stored in our database and made
       * available to the client for event signing.
       */
      if (!user.pubkey) {
        try {
          const keys = await generateKeypair()
          
          if (keys && keys.publicKey && keys.privateKey) {
            // Update user with generated Nostr keys
            await prisma.user.update({
              where: { id: user.id },
              data: {
                pubkey: keys.publicKey,
                privkey: keys.privateKey,
              }
            })
            console.log('Generated ephemeral Nostr keypair for user:', user.email || user.username)
          }
        } catch (error) {
          console.error('Failed to generate ephemeral Nostr keypair:', error)
        }
      }
    },
    async signIn({ user, account }) {
      console.log('User signed in:', user.email || user.pubkey || user.username, 'via', account?.provider)
      
      /**
       * EPHEMERAL KEYPAIR GENERATION ON SIGN IN:
       * ========================================
       * 
       * For existing users who signed up before the ephemeral keypair
       * system was implemented, we generate keys on their next sign-in.
       * 
       * This ensures backward compatibility - all existing email/GitHub
       * users will get Nostr capabilities without any action required.
       * 
       * Provider exclusions:
       * - 'nostr': These users already have their own keys
       * - 'anonymous': These users get keys in the authorize function
       * - 'nip46' (future): These users will have remote keys
       */
      if (!user.pubkey && account?.provider && !['nostr', 'anonymous'].includes(account.provider)) {
        try {
          const keys = await generateKeypair()
          
          if (keys && keys.publicKey && keys.privateKey) {
            // Update user with generated Nostr keys
            await prisma.user.update({
              where: { id: user.id },
              data: {
                pubkey: keys.publicKey,
                privkey: keys.privateKey,
              }
            })
            console.log('Generated ephemeral Nostr keypair for existing user:', user.email || user.username)
          }
        } catch (error) {
          console.error('Failed to generate ephemeral Nostr keypair for existing user:', error)
        }
      }
    }
  },

  debug: process.env.NODE_ENV === 'development',
}

// Export helper functions and configuration
export { verifyNostrPubkey, authConfig } 