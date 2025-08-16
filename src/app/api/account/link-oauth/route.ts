/**
 * OAuth Account Linking Initiation Endpoint
 * 
 * Initiates OAuth flow for linking additional accounts (GitHub, etc.)
 * This endpoint generates the OAuth URL with proper state for account linking
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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

    // Get provider from query params
    const searchParams = request.nextUrl.searchParams
    const provider = searchParams.get('provider')
    
    if (!provider || !['github'].includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider' },
        { status: 400 }
      )
    }

    // For GitHub OAuth
    if (provider === 'github') {
      // Use separate GitHub OAuth app for linking if configured, otherwise use main app
      const clientId = process.env.GITHUB_LINK_CLIENT_ID || process.env.GITHUB_CLIENT_ID
      if (!clientId) {
        return NextResponse.json(
          { error: 'GitHub OAuth not configured' },
          { status: 500 }
        )
      }

      // Create state with user ID and linking flag
      const state = Buffer.from(JSON.stringify({
        userId: session.user.id,
        action: 'link',
        provider: 'github'
      })).toString('base64')

      // Build GitHub OAuth URL with our custom callback for account linking
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/account/oauth-callback`,
        scope: 'user:email',
        state: state
      })

      const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`
      
      return NextResponse.redirect(githubAuthUrl)
    }

    return NextResponse.json(
      { error: 'Provider not implemented' },
      { status: 400 }
    )
  } catch (error) {
    console.error('OAuth linking initiation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}