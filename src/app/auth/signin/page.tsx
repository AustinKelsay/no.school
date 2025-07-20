/**
 * Authentication Sign-In Page
 * 
 * This page provides both email magic link and NIP07 Nostr authentication
 * Users can choose their preferred method to authenticate
 */

'use client'

import { useState, useCallback } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { AuthLayout } from '@/components/auth/auth-layout'
import { hasNip07Support } from 'snstr'

interface NostrWindow extends Window {
  nostr?: {
    getPublicKey(): Promise<string>
    signEvent(event: {
      kind: number
      created_at: number
      tags: string[][]
      content: string
    }): Promise<{
      id: string
      pubkey: string
      created_at: number
      kind: number
      tags: string[][]
      content: string
      sig: string
    }>
  }
}

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isNostrLoading, setIsNostrLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const errorType = searchParams.get('error')

  // Handle email magic link sign in
  const handleEmailSignIn = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const result = await signIn('email', {
        email,
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        setError('Failed to send magic link. Please try again.')
      } else {
        setMessage(`Check your email! We've sent a magic link to ${email}`)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [email, callbackUrl])

  // Handle NIP07 Nostr sign in
  const handleNostrSignIn = useCallback(async () => {
    setIsNostrLoading(true)
    setError('')

    try {
      if (!hasNip07Support()) {
        setError('Nostr browser extension not found. Please install a NIP07-compatible extension like Alby, nos2x, or Flamingo.')
        return
      }

      // Get user's public key from the extension
      const pubkey = await (window as NostrWindow).nostr!.getPublicKey()

      // Authenticate with NextAuth using just the public key
      const result = await signIn('nostr', {
        pubkey,
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        setError('Nostr authentication failed. Please try again.')
      } else {
        // Success - redirect will be handled by NextAuth
        router.push(callbackUrl)
      }
    } catch (err) {
      console.error('Nostr sign in error:', err)
      setError(err instanceof Error ? err.message : 'Failed to authenticate with Nostr extension')
    } finally {
      setIsNostrLoading(false)
    }
  }, [callbackUrl, router])

  return (
    <AuthLayout 
      title="Sign in to your account"
      description="Choose your preferred authentication method"
    >
      {/* Error Display */}
      {(error || errorType) && (
        <Alert variant="destructive">
          {error || (errorType === 'CredentialsSignin' ? 'Authentication failed. Please try again.' : 'An error occurred during sign in.')}
        </Alert>
      )}

      {/* Success Message */}
      {message && (
        <Alert>
          {message}
        </Alert>
      )}

      <div className="space-y-6">
          {/* Email Magic Link Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Email Magic Link</CardTitle>
              <CardDescription>
                We&apos;ll send you a secure link to sign in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading || !email}
                >
                  {isLoading ? 'Sending...' : 'Send Magic Link'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* NIP07 Nostr Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nostr Extension (NIP07)</CardTitle>
              <CardDescription>
                Sign in with your Nostr browser extension
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleNostrSignIn}
                className="w-full"
                variant="outline"
                disabled={isNostrLoading}
              >
                {isNostrLoading ? 'Connecting...' : 'Sign in with Nostr'}
              </Button>
                             <p className="mt-2 text-xs text-muted-foreground">
                 Requires a NIP07-compatible browser extension like Alby, nos2x, or Flamingo
               </p>
            </CardContent>
          </Card>
              </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          By signing in, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </AuthLayout>
  )
} 