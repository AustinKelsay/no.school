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
import { authConfigClient } from '@/lib/auth-config-client'

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
  const [isGithubLoading, setIsGithubLoading] = useState(false)
  const [isAnonymousLoading, setIsAnonymousLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const errorType = searchParams.get('error')
  const copy = authConfigClient.copy.signin

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
        setError(copy.messages.emailError)
      } else {
        setMessage(copy.messages.emailSent.replace('{email}', email))
      }
    } catch (err) {
      setError(copy.messages.genericError)
    } finally {
      setIsLoading(false)
    }
  }, [email, callbackUrl, copy.messages.emailError, copy.messages.emailSent, copy.messages.genericError])

  // Handle NIP07 Nostr sign in
  const handleNostrSignIn = useCallback(async () => {
    setIsNostrLoading(true)
    setError('')

    try {
      if (!hasNip07Support()) {
        setError(copy.messages.nostrExtensionMissing)
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
        setError(copy.messages.nostrError)
      } else {
        // Success - redirect will be handled by NextAuth
        router.push(callbackUrl)
      }
    } catch (err) {
      console.error('Nostr sign in error:', err)
      setError(err instanceof Error ? err.message : copy.messages.nostrError)
    } finally {
      setIsNostrLoading(false)
    }
  }, [callbackUrl, router, copy.messages.nostrError, copy.messages.nostrExtensionMissing])

  // Handle GitHub sign in
  const handleGithubSignIn = useCallback(async () => {
    setIsGithubLoading(true)
    setError('')

    try {
      await signIn('github', {
        callbackUrl,
      })
    } catch (err) {
      console.error('GitHub sign in error:', err)
      setError(copy.messages.githubError || copy.messages.genericError)
    } finally {
      setIsGithubLoading(false)
    }
  }, [callbackUrl, copy.messages.githubError, copy.messages.genericError])

  // Handle Anonymous sign in
  const handleAnonymousSignIn = useCallback(async () => {
    setIsAnonymousLoading(true)
    setError('')

    try {
      const result = await signIn('anonymous', {
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        setError(copy.messages.anonymousError || copy.messages.genericError)
      } else {
        // Success - redirect will be handled by NextAuth
        router.push(callbackUrl)
      }
    } catch (err) {
      console.error('Anonymous sign in error:', err)
      setError(copy.messages.anonymousError || copy.messages.genericError)
    } finally {
      setIsAnonymousLoading(false)
    }
  }, [callbackUrl, router, copy.messages.anonymousError, copy.messages.genericError])

  return (
    <AuthLayout 
      title={copy.title}
      description={copy.description}
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
          {authConfigClient.features.showEmailProvider && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{copy.emailCard.title}</CardTitle>
              <CardDescription>
                {copy.emailCard.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder={copy.emailCard.placeholder}
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
                  {isLoading ? copy.emailCard.loadingButton : copy.emailCard.button}
                </Button>
              </form>
            </CardContent>
          </Card>
          )}

          {/* Divider */}
          {authConfigClient.features.showEmailProvider && (authConfigClient.features.showNostrProvider || authConfigClient.features.showGithubProvider || authConfigClient.features.showAnonymousProvider) && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">{copy.dividerText}</span>
            </div>
          </div>
          )}

          {/* NIP07 Nostr Authentication */}
          {authConfigClient.features.showNostrProvider && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{copy.nostrCard.title}</CardTitle>
              <CardDescription>
                {copy.nostrCard.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleNostrSignIn}
                className="w-full"
                variant="outline"
                disabled={isNostrLoading}
              >
                {isNostrLoading ? copy.nostrCard.loadingButton : copy.nostrCard.button}
              </Button>
                             <p className="mt-2 text-xs text-muted-foreground">
                 {copy.nostrCard.helpText}
               </p>
            </CardContent>
          </Card>
          )}

          {/* GitHub Authentication */}
          {authConfigClient.features.showGithubProvider && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{copy.githubCard.title}</CardTitle>
              <CardDescription>
                {copy.githubCard.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleGithubSignIn}
                className="w-full"
                variant="outline"
                disabled={isGithubLoading}
              >
                {isGithubLoading ? copy.githubCard.loadingButton : copy.githubCard.button}
              </Button>
            </CardContent>
          </Card>
          )}

          {/* Anonymous Authentication */}
          {authConfigClient.features.showAnonymousProvider && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{copy.anonymousCard.title}</CardTitle>
              <CardDescription>
                {copy.anonymousCard.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleAnonymousSignIn}
                className="w-full"
                variant="outline"
                disabled={isAnonymousLoading}
              >
                {isAnonymousLoading ? copy.anonymousCard.loadingButton : copy.anonymousCard.button}
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                {copy.anonymousCard.helpText}
              </p>
            </CardContent>
          </Card>
          )}
              </div>

      {authConfigClient.features.requireTermsAcceptance && (
      <div className="text-center text-sm text-muted-foreground">
        <p>
          {copy.termsText}
        </p>
      </div>
      )}
    </AuthLayout>
  )
} 