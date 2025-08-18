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
import { z } from 'zod'

/**
 * Valid maximum size constraints for the OAuth state value
 */
const MAX_STATE_PARAM_LENGTH = 4096
const MAX_STATE_DECODED_BYTES = 4096

/**
 * Schema describing the expected structure of the decoded OAuth state object.
 * We only support linking GitHub currently, so the provider is restricted.
 */
const OAuthStateSchema = z.object({
  action: z.literal('link'),
  userId: z.string().min(1).max(128),
  provider: z.literal('github')
}).strict()

/**
 * Normalize a base64/base64url string to standard base64 by replacing URL-safe
 * characters and fixing padding.
 */
function normalizeBase64Input(input: string): string {
  let normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const pad = normalized.length % 4
  if (pad === 2) normalized += '=='
  else if (pad === 3) normalized += '='
  else if (pad !== 0) throw new Error('Invalid base64 length')
  return normalized
}

/**
 * Validate that an input string looks like base64/base64url and is reasonably sized.
 */
function assertValidBase64Shape(input: string): void {
  if (typeof input !== 'string' || input.length === 0) throw new Error('Missing state')
  if (input.length > MAX_STATE_PARAM_LENGTH) throw new Error('State too large')
  // Allow both base64 and base64url alphabets; restrict '=' padding to the end
  const base64Like = /^[A-Za-z0-9+/_-]+={0,2}$/
  if (!base64Like.test(input)) throw new Error('Invalid characters in state')
}

/**
 * Safely decode, size-check, and schema-validate the OAuth state value.
 */
function validateAndParseState(stateParam: string) {
  assertValidBase64Shape(stateParam)
  const normalized = normalizeBase64Input(stateParam)
  const decodedBuffer = Buffer.from(normalized, 'base64')
  if (decodedBuffer.byteLength === 0) throw new Error('Empty decoded state')
  if (decodedBuffer.byteLength > MAX_STATE_DECODED_BYTES) throw new Error('Decoded state too large')
  let parsed: unknown
  try {
    parsed = JSON.parse(decodedBuffer.toString('utf8'))
  } catch {
    throw new Error('State is not valid JSON')
  }
  const result = OAuthStateSchema.safeParse(parsed)
  if (!result.success) throw new Error('State schema validation failed')
  return result.data
}

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
      stateData = validateAndParseState(state)
    } catch (validationError) {
      console.warn('Invalid OAuth state:', validationError)
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