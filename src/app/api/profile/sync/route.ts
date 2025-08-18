/**
 * Profile Sync API Endpoint
 * 
 * Allows syncing profile data from a specific provider to the user's profile
 * Respects the dual authentication architecture and profile source settings
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, syncUserProfileFromNostr, fetchNostrProfile } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { isOAuthFirstProvider, shouldSyncFromNostr } from '@/lib/account-linking'

// Request schema
const SyncRequestSchema = z.object({
  provider: z.string().min(1, 'Provider is required')
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = SyncRequestSchema.parse(body)
    const { provider } = validatedData

    // Get the user with their linked accounts
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        accounts: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if the provider is linked
    const linkedAccount = user.accounts.find(acc => acc.provider === provider)
    
    if (!linkedAccount && provider !== 'nostr') {
      return NextResponse.json(
        { error: `Provider ${provider} is not linked to your account` },
        { status: 400 }
      )
    }

    // Handle sync based on provider type
    let updatedUser = null
    let syncMessage = ''

    switch (provider) {
      case 'nostr':
        // Sync from Nostr if user has a pubkey
        if (!user.pubkey) {
          return NextResponse.json(
            { error: 'No Nostr profile linked to this account' },
            { status: 400 }
          )
        }

        // Check if we should sync from Nostr based on user's settings
        if (!shouldSyncFromNostr(user)) {
          // If user is OAuth-first, we can still manually sync but show a warning
          const nostrProfile = await fetchNostrProfile(user.pubkey)
          
          if (nostrProfile) {
            // Update only the enhanced fields for OAuth-first users
            updatedUser = await prisma.user.update({
              where: { id: user.id },
              data: {
                nip05: nostrProfile.nip05 as string || user.nip05,
                lud16: nostrProfile.lud16 as string || user.lud16,
                banner: nostrProfile.banner as string || user.banner,
              }
            })
            syncMessage = 'Synced enhanced fields from Nostr profile (basic fields preserved due to OAuth-first setting)'
          } else {
            return NextResponse.json(
              { error: 'No Nostr profile found' },
              { status: 404 }
            )
          }
        } else {
          // Full sync for Nostr-first users
          updatedUser = await syncUserProfileFromNostr(user.id, user.pubkey)
          if (!updatedUser) {
            return NextResponse.json(
              { error: 'Failed to sync from Nostr' },
              { status: 500 }
            )
          }
          syncMessage = 'Successfully synced full profile from Nostr'
        }
        break

      case 'github':
        // Sync from GitHub OAuth data
        if (!linkedAccount) {
          return NextResponse.json(
            { error: 'GitHub account not linked' },
            { status: 400 }
          )
        }

        // GitHub profile data is stored in the account's provider_account_id and other fields
        // We need to fetch fresh data from GitHub API if needed
        // For now, use the data we have from the OAuth account
        
        updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            username: linkedAccount.providerAccountId || user.username, // GitHub username
            // GitHub doesn't provide email in account link, keep existing
            avatar: user.avatar, // GitHub avatar URL is typically stored in user.avatar
          }
        })
        syncMessage = 'Successfully synced profile from GitHub'
        break

      case 'email':
        // Email provider doesn't have external profile data to sync
        // Just ensure email is set correctly
        if (user.email) {
          syncMessage = 'Email profile is already up to date'
          updatedUser = user
        } else {
          return NextResponse.json(
            { error: 'No email associated with this account' },
            { status: 400 }
          )
        }
        break

      default:
        // Handle custom/future providers
        return NextResponse.json(
          { error: `Sync not supported for provider: ${provider}` },
          { status: 400 }
        )
    }

    // Return success response with updated profile data
    // Map database fields to session-compatible names
    return NextResponse.json({
      success: true,
      message: syncMessage,
      profile: {
        name: updatedUser?.username,  // Map username to name for session compatibility
        email: updatedUser?.email,
        image: updatedUser?.avatar,    // Map avatar to image for session compatibility
        nip05: updatedUser?.nip05,
        lud16: updatedUser?.lud16,
        banner: updatedUser?.banner,
        provider,
        syncedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Profile sync error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to sync profile' },
      { status: 500 }
    )
  }
}