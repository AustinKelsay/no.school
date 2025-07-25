/**
 * Admin Check API Route
 * 
 * Provides comprehensive admin status information including database and config checks.
 * Used by the useAdminInfo hook for complete admin information.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAdminInfo } from '@/lib/admin-utils'

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { 
          error: 'Unauthorized',
          adminInfo: {
            isAdmin: false,
            isModerator: false,
            level: 'none',
            permissions: {},
            source: 'none'
          }
        },
        { status: 401 }
      )
    }

    // Get comprehensive admin information
    const adminInfo = await getAdminInfo(session)

    return NextResponse.json({
      success: true,
      adminInfo
    })
  } catch (error) {
    console.error('Error checking admin status:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        adminInfo: {
          isAdmin: false,
          isModerator: false,
          level: 'none',
          permissions: {},
          source: 'none'
        }
      },
      { status: 500 }
    )
  }
}