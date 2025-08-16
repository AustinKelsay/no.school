/**
 * Account Linking System
 * ======================
 * 
 * This module provides utilities for linking multiple authentication methods
 * to a single user account, enabling cross-device access and authentication flexibility.
 * 
 * KEY CONCEPTS:
 * 
 * 1. PRIMARY PROVIDER:
 *    - Each user has one primary authentication provider
 *    - This determines which profile source is authoritative
 *    - Can be changed by the user in settings
 * 
 * 2. PROFILE SOURCE:
 *    - "nostr": Profile fields come from Nostr (for NIP07, Anonymous users)
 *    - "oauth": Profile fields come from OAuth provider (Email, GitHub)
 *    - Determines which fields get priority during profile updates
 * 
 * 3. ACCOUNT LINKING RULES:
 *    - Users can link multiple providers to one account
 *    - Each provider can only be linked to one user
 *    - Duplicate email/pubkey checks prevent accidental duplicate accounts
 * 
 * 4. PROFILE FIELD PRIORITIZATION:
 *    - Nostr-first: Nostr profile always wins, syncs on every login
 *    - OAuth-first: OAuth profile is authoritative, no Nostr sync
 *    - Can be switched by changing primaryProvider
 */

import { prisma } from './prisma'
import { Account, User } from '@prisma/client'
import { generateKeypair } from 'snstr'

/**
 * Provider types that can be linked
 */
export type AuthProvider = 'nostr' | 'email' | 'github' | 'anonymous' | 'recovery'

/**
 * Determines if a provider is Nostr-first (user controls identity)
 */
export function isNostrFirstProvider(provider: string | null | undefined): boolean {
  return ['nostr', 'anonymous', 'recovery'].includes(provider || '')
}

/**
 * Determines if a provider is OAuth-first (platform controls identity)
 */
export function isOAuthFirstProvider(provider: string | null | undefined): boolean {
  return ['email', 'github'].includes(provider || '')
}

/**
 * Get the appropriate profile source based on provider
 */
export function getProfileSourceForProvider(provider: string): 'nostr' | 'oauth' {
  return isNostrFirstProvider(provider) ? 'nostr' : 'oauth'
}

/**
 * Check if an account can be linked to a user
 * Returns error message if cannot link, null if can link
 */
export async function canLinkAccount(
  userId: string,
  provider: string,
  providerAccountId: string
): Promise<string | null> {
  // Check if this provider/account combination already exists
  const existingAccount = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId
      }
    },
    include: {
      user: true
    }
  })

  if (existingAccount) {
    if (existingAccount.userId === userId) {
      return 'This account is already linked to your profile'
    } else {
      return 'This account is already linked to another user'
    }
  }

  // Check if user already has this provider type linked
  const userAccounts = await prisma.account.findMany({
    where: {
      userId,
      provider
    }
  })

  if (userAccounts.length > 0) {
    return `You already have a ${provider} account linked`
  }

  return null
}

/**
 * Link a new authentication method to an existing user account
 * Used when a logged-in user wants to add another auth method
 */
export async function linkAccount(
  userId: string,
  provider: string,
  providerAccountId: string,
  accountData?: {
    access_token?: string
    refresh_token?: string
    expires_at?: number
    token_type?: string
    scope?: string
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if account can be linked
    const canLink = await canLinkAccount(userId, provider, providerAccountId)
    if (canLink) {
      return { success: false, error: canLink }
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true }
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Create the account link
    await prisma.account.create({
      data: {
        userId,
        provider,
        providerAccountId,
        type: 'credentials', // Most of our providers use credentials
        ...accountData
      }
    })

    // Only set as primary if user doesn't already have a primary provider
    // This preserves the original authentication method as primary
    if (!user.primaryProvider) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          primaryProvider: provider,
          profileSource: getProfileSourceForProvider(provider)
        }
      })
    }

    // If linking a Nostr provider and user doesn't have keys, generate them
    if (isNostrFirstProvider(provider) && !user.pubkey) {
      const keys = await generateKeypair()
      await prisma.user.update({
        where: { id: userId },
        data: {
          pubkey: keys.publicKey,
          privkey: provider === 'nostr' ? null : keys.privateKey // Only store privkey for non-NIP07
        }
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to link account:', error)
    return { success: false, error: 'Failed to link account' }
  }
}

/**
 * Unlink an authentication method from a user account
 * Cannot unlink the last remaining auth method
 */
export async function unlinkAccount(
  userId: string,
  provider: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get user with all accounts
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true }
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Check if this is the last account
    if (user.accounts.length <= 1) {
      return { success: false, error: 'Cannot unlink your last authentication method' }
    }

    // Find the account to unlink
    const accountToUnlink = user.accounts.find(a => a.provider === provider)
    if (!accountToUnlink) {
      return { success: false, error: 'Account not found' }
    }

    // Delete the account link
    await prisma.account.delete({
      where: { id: accountToUnlink.id }
    })

    // If this was the primary provider, set a new primary
    if (user.primaryProvider === provider) {
      const remainingAccounts = user.accounts.filter(a => a.provider !== provider)
      if (remainingAccounts.length > 0) {
        const newPrimary = remainingAccounts[0]
        await prisma.user.update({
          where: { id: userId },
          data: {
            primaryProvider: newPrimary.provider,
            profileSource: getProfileSourceForProvider(newPrimary.provider)
          }
        })
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to unlink account:', error)
    return { success: false, error: 'Failed to unlink account' }
  }
}

/**
 * Change the primary authentication provider for a user
 * This affects which profile source is authoritative
 */
export async function changePrimaryProvider(
  userId: string,
  newProvider: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify user has this provider linked
    const account = await prisma.account.findFirst({
      where: {
        userId,
        provider: newProvider
      }
    })

    if (!account) {
      return { success: false, error: 'Provider not linked to your account' }
    }

    // Update primary provider and profile source
    await prisma.user.update({
      where: { id: userId },
      data: {
        primaryProvider: newProvider,
        profileSource: getProfileSourceForProvider(newProvider)
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to change primary provider:', error)
    return { success: false, error: 'Failed to change primary provider' }
  }
}

/**
 * Get all linked accounts for a user
 */
export async function getLinkedAccounts(userId: string): Promise<{
  accounts: Array<{
    provider: string
    isPrimary: boolean
    createdAt: Date
  }>
  primaryProvider: string | null
  profileSource: string | null
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { accounts: true }
  })

  if (!user) {
    return {
      accounts: [],
      primaryProvider: null,
      profileSource: null
    }
  }

  return {
    accounts: user.accounts.map(account => ({
      provider: account.provider,
      isPrimary: account.provider === user.primaryProvider,
      createdAt: new Date() // Account model doesn't have createdAt, using current date as placeholder
    })),
    primaryProvider: user.primaryProvider,
    profileSource: user.profileSource
  }
}

/**
 * Handle account merging when linking reveals accounts should be merged
 * This is complex and should be done carefully to avoid data loss
 */
export async function mergeAccounts(
  primaryUserId: string,
  secondaryUserId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Start a transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // Move all accounts from secondary to primary
      await tx.account.updateMany({
        where: { userId: secondaryUserId },
        data: { userId: primaryUserId }
      })

      // Move all content from secondary to primary
      await tx.course.updateMany({
        where: { userId: secondaryUserId },
        data: { userId: primaryUserId }
      })

      await tx.resource.updateMany({
        where: { userId: secondaryUserId },
        data: { userId: primaryUserId }
      })

      await tx.draft.updateMany({
        where: { userId: secondaryUserId },
        data: { userId: primaryUserId }
      })

      await tx.courseDraft.updateMany({
        where: { userId: secondaryUserId },
        data: { userId: primaryUserId }
      })

      // Move purchases
      await tx.purchase.updateMany({
        where: { userId: secondaryUserId },
        data: { userId: primaryUserId }
      })

      // Move progress tracking
      await tx.userLesson.updateMany({
        where: { userId: secondaryUserId },
        data: { userId: primaryUserId }
      })

      await tx.userCourse.updateMany({
        where: { userId: secondaryUserId },
        data: { userId: primaryUserId }
      })

      // Move badges
      await tx.userBadge.updateMany({
        where: { userId: secondaryUserId },
        data: { userId: primaryUserId }
      })

      // Delete secondary user's sessions
      await tx.session.deleteMany({
        where: { userId: secondaryUserId }
      })

      // Delete secondary user
      await tx.user.delete({
        where: { id: secondaryUserId }
      })
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to merge accounts:', error)
    return { success: false, error: 'Failed to merge accounts' }
  }
}

/**
 * Determine which profile fields to use based on profile source
 * Used during login to decide whether to sync from Nostr or use OAuth data
 */
export function shouldSyncFromNostr(user: {
  profileSource?: string | null
  primaryProvider?: string | null
}): boolean {
  // If explicitly set to nostr source, sync from Nostr
  if (user.profileSource === 'nostr') return true
  
  // If no explicit source but primary is Nostr-first, sync from Nostr
  if (!user.profileSource && isNostrFirstProvider(user.primaryProvider)) return true
  
  // Otherwise don't sync from Nostr (OAuth is authoritative)
  return false
}

/**
 * Get display name for a provider
 */
export function getProviderDisplayName(provider: string): string {
  const names: Record<string, string> = {
    nostr: 'Nostr (NIP-07)',
    email: 'Email',
    github: 'GitHub',
    anonymous: 'Anonymous',
    recovery: 'Recovery Key'
  }
  return names[provider] || provider
}