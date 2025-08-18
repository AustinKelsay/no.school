/**
 * Account Preferences API
 * Updates user's profile source and primary provider settings
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import {
  PreferencesSchema,
  PreferencesResponse,
  PreferencesSuccessResponse,
  PreferencesErrorResponse,
  buildPreferencesUpdate,
  type PreferencesUpdate
} from '@/types/account-preferences'

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
    
    const response: PreferencesResponse = {
      profileSource: user?.profileSource || 'oauth',
      primaryProvider: user?.primaryProvider || session.provider || 'email'
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Failed to fetch preferences:', error)
    const errorResponse: PreferencesErrorResponse = {
      error: 'Failed to fetch preferences'
    }
    return NextResponse.json(errorResponse, { status: 500 })
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
    
    // Build updates object with proper typing and validation
    const updates = buildPreferencesUpdate(data)
    
    // Ensure we have at least one update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 }
      )
    }
    
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updates,
      select: {
        profileSource: true,
        primaryProvider: true
      }
    })
    
    const response: PreferencesSuccessResponse = {
      success: true,
      profileSource: user.profileSource,
      primaryProvider: user.primaryProvider
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Failed to update preferences:', error)
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const errorResponse: PreferencesErrorResponse = {
        error: 'Invalid request data',
        details: error.issues
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }
    
    // Handle Prisma errors
    if (error instanceof Error && error.message.includes('P2025')) {
      const errorResponse: PreferencesErrorResponse = {
        error: 'User not found'
      }
      return NextResponse.json(errorResponse, { status: 404 })
    }
    
    const errorResponse: PreferencesErrorResponse = {
      error: 'Failed to update preferences'
    }
    return NextResponse.json(errorResponse, { status: 500 })
  }
}