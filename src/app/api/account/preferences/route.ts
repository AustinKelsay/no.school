/**
 * Account Preferences API
 * Updates user's profile source and primary provider settings
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const PreferencesSchema = z.object({
  profileSource: z.enum(['nostr', 'oauth']).optional(),
  primaryProvider: z.string().optional()
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        profileSource: true,
        primaryProvider: true
      }
    })
    
    return NextResponse.json({
      profileSource: user?.profileSource || 'oauth',
      primaryProvider: user?.primaryProvider || session.provider || 'email'
    })
  } catch (error) {
    console.error('Failed to fetch preferences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    )
  }
}

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
    const data = PreferencesSchema.parse(body)
    
    // Verify primary provider is linked
    if (data.primaryProvider) {
      const accounts = await prisma.account.findMany({
        where: { userId: session.user.id },
        select: { provider: true }
      })
      
      const hasProvider = accounts.some(a => a.provider === data.primaryProvider)
      if (!hasProvider && data.primaryProvider !== 'current') {
        return NextResponse.json(
          { error: 'Provider not linked to account' },
          { status: 400 }
        )
      }
    }
    
    const updates: any = {}
    if (data.profileSource !== undefined) updates.profileSource = data.profileSource
    if (data.primaryProvider !== undefined) updates.primaryProvider = data.primaryProvider
    
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updates,
      select: {
        profileSource: true,
        primaryProvider: true
      }
    })
    
    return NextResponse.json({
      success: true,
      profileSource: user.profileSource,
      primaryProvider: user.primaryProvider
    })
  } catch (error) {
    console.error('Failed to update preferences:', error)
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    )
  }
}