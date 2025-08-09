/**
 * List Linked Accounts API Endpoint
 * 
 * Returns all linked authentication methods for the current user.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getLinkedAccounts } from '@/lib/account-linking'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get linked accounts
    const linkedAccounts = await getLinkedAccounts(session.user.id)

    return NextResponse.json(linkedAccounts)
  } catch (error) {
    console.error('Get linked accounts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}