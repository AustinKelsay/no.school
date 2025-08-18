/**
 * Send Email Verification for Account Linking
 * 
 * Sends a verification email to link an email address to an existing account
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sanitizeEmail } from '@/lib/api-utils'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get email from request body
    const body = await request.json()
    const { email } = body

    const normalizedEmail = sanitizeEmail(String(email || ''))
    const isValidEmail = z.string().email('Invalid email address').max(254).safeParse(normalizedEmail).success
    if (!isValidEmail) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Check if email is already linked to another account
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (existingUser) {
      if (existingUser.id === session.user.id) {
        return NextResponse.json(
          { error: 'This email is already linked to your account' },
          { status: 400 }
        )
      } else {
        return NextResponse.json(
          { error: 'This email is already linked to another account' },
          { status: 400 }
        )
      }
    }

    // Check if user already has an email linked (if they're not using email provider)
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { accounts: true }
    })

    const hasEmailAccount = currentUser?.accounts.some(a => a.provider === 'email')
    if (hasEmailAccount) {
      return NextResponse.json(
        { error: 'You already have an email account linked' },
        { status: 400 }
      )
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000) // 1 hour from now

    // Store verification token
    await prisma.verificationToken.create({
      data: {
        identifier: `link:${session.user.id}:${normalizedEmail}`,
        token,
        expires
      }
    })

    // Send verification email
    const port = parseInt(process.env.EMAIL_SERVER_PORT || '587', 10)
    const secureEnv = process.env.EMAIL_SERVER_SECURE
    const secure = typeof secureEnv === 'string'
      ? /^(true|1|yes)$/i.test(secureEnv)
      : port === 465

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port,
      secure,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      // Enforce STARTTLS when not using implicit TLS (port 465)
      requireTLS: !secure,
      tls: {
        minVersion: 'TLSv1.2',
        ciphers: 'TLS_AES_256_GCM_SHA384:TLS_AES_128_GCM_SHA256:TLS_CHACHA20_POLY1305_SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256',
        rejectUnauthorized: true,
      },
    })

    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/account/verify-email-link?token=${token}&email=${encodeURIComponent(normalizedEmail)}`

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: normalizedEmail,
      subject: 'Verify your email to link to your account',
      html: `
        <div>
          <h2>Verify your email address</h2>
          <p>Click the link below to verify your email and link it to your account:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
          <p>Or copy and paste this link in your browser:</p>
          <p>${verificationUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
      text: `
        Verify your email address
        
        Click the link below to verify your email and link it to your account:
        ${verificationUrl}
        
        This link will expire in 1 hour.
        
        If you didn't request this, please ignore this email.
      `
    })

    return NextResponse.json({ 
      success: true,
      message: 'Verification email sent' 
    })
  } catch (error) {
    console.error('Send verification email error:', error)
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    )
  }
}