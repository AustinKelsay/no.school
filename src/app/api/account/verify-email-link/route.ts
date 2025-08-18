/**
 * Verify Email Link for Account Linking
 * 
 * Verifies the email token and links the email to the user's account
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sanitizeEmail } from '@/lib/api-utils'
import { linkAccount } from '@/lib/account-linking'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')
    const emailParam = searchParams.get('email')

    if (!token || !emailParam) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/profile?tab=accounts&error=missing_params`
      )
    }

    const normalizedEmail = sanitizeEmail(emailParam)

    // Find and validate the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!verificationToken) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/profile?tab=accounts&error=invalid_token`
      )
    }

    // Check if token has expired
    if (verificationToken.expires < new Date()) {
      // Clean up expired token
      await prisma.verificationToken.delete({
        where: { token }
      })
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/profile?tab=accounts&error=token_expired`
      )
    }

    // Parse and validate the identifier format: expected 'link:<userId>:<email>'
    const identifierParts = verificationToken.identifier.split(':')
    if (identifierParts.length !== 3) {
      console.error('Invalid verification token identifier format', {
        identifier: verificationToken.identifier,
        token
      })
      try {
        await prisma.verificationToken.delete({ where: { token } })
      } catch (cleanupError) {
        console.warn('Failed to delete malformed verification token', { token, cleanupError })
      }
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/profile?tab=accounts&error=invalid_token_format`
      )
    }
    const [action, userId, tokenEmail] = identifierParts
    
    if (action !== 'link' || tokenEmail !== normalizedEmail) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/profile?tab=accounts&error=token_mismatch`
      )
    }

    // Link the email account to the user
    const result = await linkAccount(
      userId,
      'email',
      normalizedEmail,
      {}
    )

    // Clean up the used token
    await prisma.verificationToken.delete({
      where: { token }
    })

    if (result.success) {
      // Update the user's email field if they don't have one
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })
      
      if (user && !user.email) {
        await prisma.user.update({
          where: { id: userId },
          data: { 
            email: normalizedEmail,
            emailVerified: new Date()
          }
        })
      }

      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/profile?tab=accounts&success=email_linked`
      )
    } else {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/profile?tab=accounts&error=${encodeURIComponent(result.error || 'linking_failed')}`
      )
    }
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/profile?tab=accounts&error=verification_error`
    )
  }
}