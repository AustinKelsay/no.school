/**
 * Profile Sync API
 * Syncs profile data from a specific provider
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, fetchNostrProfile } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { provider } = body
    
    if (!provider) {
      return NextResponse.json(
        { error: 'Provider is required' },
        { status: 400 }
      )
    }
    
    // Get the account for this provider
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: provider
      }
    })
    
    if (!account && provider !== 'current') {
      return NextResponse.json(
        { error: 'Provider not linked' },
        { status: 400 }
      )
    }
    
    let updates: any = {}
    
    switch (provider) {
      case 'nostr':
        if (account?.providerAccountId) {
          const nostrProfile = await fetchNostrProfile(account.providerAccountId)
          if (nostrProfile) {
            updates = {
              username: nostrProfile.name || undefined,
              avatar: nostrProfile.picture || undefined,
              banner: nostrProfile.banner || undefined,
              nip05: nostrProfile.nip05 || undefined,
              lud16: nostrProfile.lud16 || undefined
            }
            // Remove undefined values
            Object.keys(updates).forEach(key => 
              updates[key] === undefined && delete updates[key]
            )
          }
        }
        break
        
      case 'github':
        if (account?.access_token) {
          try {
            const response = await fetch('https://api.github.com/user', {
              headers: {
                'Authorization': `Bearer ${account.access_token}`,
                'Accept': 'application/json'
              }
            })
            
            if (response.ok) {
              const githubUser = await response.json()
              updates = {
                username: githubUser.name || githubUser.login || undefined,
                email: githubUser.email || undefined,
                avatar: githubUser.avatar_url || undefined
              }
              // Remove undefined values
              Object.keys(updates).forEach(key => 
                updates[key] === undefined && delete updates[key]
              )
            }
          } catch (error) {
            console.error('Failed to fetch GitHub profile:', error)
          }
        }
        break
        
      case 'current':
        // No sync needed for current session
        return NextResponse.json({
          success: true,
          message: 'Current session data is already up to date'
        })
        
      default:
        return NextResponse.json(
          { error: 'Unsupported provider' },
          { status: 400 }
        )
    }
    
    if (Object.keys(updates).length > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: updates
      })
      
      return NextResponse.json({
        success: true,
        message: `Profile synced from ${provider}`,
        updated: Object.keys(updates)
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'No updates found from provider'
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync profile' },
      { status: 500 }
    )
  }
}