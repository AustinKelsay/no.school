/**
 * OAuth Account Linking Callback Endpoint
 * 
 * Handles OAuth callbacks for account linking (GitHub, etc.)
 * Processes the OAuth response and links the account
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { linkAccount } from '@/lib/account-linking'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/profile?tab=accounts&error=${encodeURIComponent(error)}`
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/profile?tab=accounts&error=missing_params`
      )
    }

    // Decode and validate state
    let stateData
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString())
    } catch {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/profile?tab=accounts&error=invalid_state`
      )
    }

    // Verify the action is for linking
    if (stateData.action !== 'link') {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/profile?tab=accounts&error=invalid_action`
      )
    }

    // Check if user is still logged in and matches the state
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.id !== stateData.userId) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/profile?tab=accounts&error=session_mismatch`
      )
    }

    // Exchange code for access token (GitHub)
    if (stateData.provider === 'github') {
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // Use separate GitHub OAuth app for linking if configured
          client_id: process.env.GITHUB_LINK_CLIENT_ID || process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_LINK_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET,
          code: code,
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/account/oauth-callback`
        })
      })

      const tokenData = await tokenResponse.json()
      
      if (!tokenData.access_token) {
        return NextResponse.redirect(
          `${process.env.NEXTAUTH_URL}/profile?tab=accounts&error=token_exchange_failed`
        )
      }

      // Get user info from GitHub
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/json'
        }
      })

      const githubUser = await userResponse.json()
      
      if (!githubUser.id) {
        return NextResponse.redirect(
          `${process.env.NEXTAUTH_URL}/profile?tab=accounts&error=user_fetch_failed`
        )
      }

      // Link the GitHub account
      const result = await linkAccount(
        session.user.id,
        'github',
        githubUser.id.toString(),
        {
          access_token: tokenData.access_token,
          token_type: tokenData.token_type,
          scope: tokenData.scope
        }
      )

      if (result.success) {
        return NextResponse.redirect(
          `${process.env.NEXTAUTH_URL}/profile?tab=accounts&success=github_linked`
        )
      } else {
        return NextResponse.redirect(
          `${process.env.NEXTAUTH_URL}/profile?tab=accounts&error=${encodeURIComponent(result.error || 'linking_failed')}`
        )
      }
    }

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/profile?tab=accounts&error=unknown_provider`
    )
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/profile?tab=accounts&error=internal_error`
    )
  }
}