/**
 * Verify Email Link for Account Linking
 * 
 * Verifies the email token and links the email to the user's account
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { linkAccount } from '@/lib/account-linking'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (!token || !email) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/profile?tab=accounts&error=missing_params`
      )
    }

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

    // Parse the identifier to get the user ID
    const [action, userId, tokenEmail] = verificationToken.identifier.split(':')
    
    if (action !== 'link' || tokenEmail !== email) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/profile?tab=accounts&error=token_mismatch`
      )
    }

    // Link the email account to the user
    const result = await linkAccount(
      userId,
      'email',
      email,
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
            email,
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