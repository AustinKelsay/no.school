'use server'

/**
 * Profile Server Actions
 * 
 * Server actions for updating user profile information
 * - Basic profile updates (name, email for OAuth-first accounts only)
 * - Enhanced Nostr fields (nip05, lud16, banner)
 * - Respects dual authentication architecture (no Nostr profile updates for Nostr-first accounts)
 */

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Basic profile update schema for OAuth-first accounts
const BasicProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  email: z.string().email('Invalid email').optional()
})

// Enhanced profile fields schema (allowed for all users)
const EnhancedProfileSchema = z.object({
  nip05: z.string().min(1, 'NIP05 address required').optional(),
  lud16: z.string().min(1, 'Lightning address required').optional(),
  banner: z.string().url('Invalid banner URL').optional()
})

export type BasicProfileData = z.infer<typeof BasicProfileSchema>
export type EnhancedProfileData = z.infer<typeof EnhancedProfileSchema>

/**
 * Update basic profile information (name, email)
 * Only allowed for OAuth-first accounts (email, GitHub)
 * Nostr-first accounts get their profile from Nostr relays
 */
export async function updateBasicProfile(data: BasicProfileData) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      throw new Error('Not authenticated')
    }

    // Check if user has privkey (OAuth-first) - only they can update basic profile
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { privkey: true, email: true, username: true }
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Only OAuth-first accounts (those with privkey) can update basic profile
    if (!user.privkey) {
      throw new Error('Basic profile updates not allowed for Nostr-first accounts. Profile is managed via Nostr.')
    }

    const validatedData = BasicProfileSchema.parse(data)
    const updates: { username?: string; email?: string } = {}

    if (validatedData.name && validatedData.name !== user.username) {
      updates.username = validatedData.name
    }

    if (validatedData.email && validatedData.email !== user.email) {
      updates.email = validatedData.email
    }

    if (Object.keys(updates).length === 0) {
      return { success: true, message: 'No changes to apply' }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: updates
    })

    revalidatePath('/profile')
    
    return { 
      success: true, 
      message: 'Basic profile updated successfully',
      updates: Object.keys(updates)
    }
  } catch (error) {
    console.error('Error updating basic profile:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        message: 'Invalid data provided',
        errors: error.issues
      }
    }
    
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to update basic profile' 
    }
  }
}

/**
 * Update enhanced Nostr profile fields (nip05, lud16, banner)
 * Allowed for all users - these are database fields that complement Nostr profile
 * For Nostr-first accounts, these can be overridden by Nostr profile sync
 */
export async function updateEnhancedProfile(data: EnhancedProfileData) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      throw new Error('Not authenticated')
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        privkey: true,
        nip05: true,
        lud16: true,
        banner: true
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const validatedData = EnhancedProfileSchema.parse(data)
    const updates: { nip05?: string; lud16?: string; banner?: string } = {}

    if (validatedData.nip05 && validatedData.nip05 !== user.nip05) {
      updates.nip05 = validatedData.nip05
    }

    if (validatedData.lud16 && validatedData.lud16 !== user.lud16) {
      updates.lud16 = validatedData.lud16
    }

    if (validatedData.banner && validatedData.banner !== user.banner) {
      updates.banner = validatedData.banner
    }

    if (Object.keys(updates).length === 0) {
      return { success: true, message: 'No changes to apply' }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: updates
    })

    revalidatePath('/profile')
    
    const isNostrFirst = !user.privkey
    const warningMessage = isNostrFirst 
      ? 'Note: These changes may be overridden if your Nostr profile contains different values.'
      : ''

    return { 
      success: true, 
      message: `Enhanced profile updated successfully. ${warningMessage}`,
      updates: Object.keys(updates),
      isNostrFirst
    }
  } catch (error) {
    console.error('Error updating enhanced profile:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        message: 'Invalid data provided',
        errors: error.issues
      }
    }
    
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to update enhanced profile' 
    }
  }
}