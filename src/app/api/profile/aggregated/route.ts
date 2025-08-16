/**
 * API endpoint for fetching aggregated profile data
 * Combines data from all linked accounts
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAggregatedProfile } from '@/lib/profile-aggregator'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const aggregatedProfile = await getAggregatedProfile(session.user.id)
    
    return NextResponse.json(aggregatedProfile)
  } catch (error) {
    console.error('Failed to fetch aggregated profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile data' },
      { status: 500 }
    )
  }
}