/**
 * Clean OAuth-style Authentication Sign-In Page
 * 
 * Modern authentication interface with multiple providers
 * Follows current design patterns with proper spacing and visual hierarchy
 */

'use client'

import { useState, useCallback } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { hasNip07Support } from 'snstr'
import { authConfigClient } from '@/lib/auth-config-client'
import { validateCallbackUrlFromParams } from '@/lib/url-utils'
import { Mail, Github, Zap, KeyRound, UserX, Sparkles, ArrowRight, HelpCircle } from 'lucide-react'
import Link from 'next/link'

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
  const [privateKey, setPrivateKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isNostrLoading, setIsNostrLoading] = useState(false)
  const [isGithubLoading, setIsGithubLoading] = useState(false)
  const [isAnonymousLoading, setIsAnonymousLoading] = useState(false)
  const [isRecoveryLoading, setIsRecoveryLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const callbackUrl = validateCallbackUrlFromParams(searchParams, 'callbackUrl', '/')
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

  // Handle Recovery sign in
  const handleRecoverySignIn = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!privateKey) return

    setIsRecoveryLoading(true)
    setError('')

    try {
      const result = await signIn('recovery', {
        privateKey,
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        setError(copy.messages.recoveryError || copy.messages.genericError)
      } else {
        // Success - redirect will be handled by NextAuth
        router.push(callbackUrl)
      }
    } catch (err) {
      console.error('Recovery sign in error:', err)
      setError(copy.messages.recoveryError || copy.messages.genericError)
    } finally {
      setIsRecoveryLoading(false)
    }
  }, [privateKey, callbackUrl, router, copy.messages.recoveryError, copy.messages.genericError])

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
        <Container className="py-8 lg:py-16">
          <Section className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-4 mb-12">
              <Badge variant="outline" className="w-fit mx-auto">
                <Sparkles className="h-3 w-3 mr-1" />
                Lightning & Nostr Enabled
              </Badge>
              
              <h1 className="text-3xl lg:text-4xl font-bold">{copy.title}</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {copy.description}
              </p>
            </div>

          {/* Error Display */}
          {(error || errorType) && (
            <Alert variant="destructive" className="mb-8 max-w-2xl mx-auto">
              {error || (errorType === 'CredentialsSignin' ? 'Authentication failed. Please try again.' : 'An error occurred during sign in.')}
            </Alert>
          )}

          {/* Success Message */}
          {message && (
            <Alert className="mb-8 max-w-2xl mx-auto border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
              {message}
            </Alert>
          )}

          <div className="max-w-md mx-auto space-y-4">
            {/* Primary OAuth Buttons */}
            <div className="space-y-3">
              {/* GitHub Authentication */}
              {authConfigClient.features.showGithubProvider && (
                <div className="relative">
                  <Button 
                    onClick={handleGithubSignIn}
                    className="w-full h-12 text-base"
                    variant="outline"
                    size="lg"
                    disabled={isGithubLoading}
                  >
                    <Github className="h-5 w-5 mr-3" />
                    {isGithubLoading ? copy.githubCard.loadingButton : copy.githubCard.button}
                    {!isGithubLoading && <ArrowRight className="ml-auto h-4 w-4" />}
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="absolute -right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <div className="space-y-1">
                        <p className="font-medium">{copy.githubCard.title}</p>
                        <p className="text-sm">{copy.githubCard.description}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}

              {/* Nostr Extension */}
              {authConfigClient.features.showNostrProvider && (
                <div className="relative">
                  <Button 
                    onClick={handleNostrSignIn}
                    className="w-full h-12 text-base"
                    size="lg"
                    disabled={isNostrLoading}
                  >
                    <Zap className="h-5 w-5 mr-3" />
                    {isNostrLoading ? copy.nostrCard.loadingButton : copy.nostrCard.button}
                    {!isNostrLoading && <ArrowRight className="ml-auto h-4 w-4" />}
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="absolute -right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <div className="space-y-2">
                        <p className="font-medium">{copy.nostrCard.title}</p>
                        <p className="text-sm">{copy.nostrCard.description}</p>
                        <p className="text-xs text-muted-foreground">{copy.nostrCard.helpText}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}

              {/* Anonymous Access */}
              {authConfigClient.features.showAnonymousProvider && (
                <div className="relative">
                  <Button 
                    onClick={handleAnonymousSignIn}
                    className="w-full h-12 text-base"
                    variant="outline"
                    size="lg"
                    disabled={isAnonymousLoading}
                  >
                    <UserX className="h-5 w-5 mr-3" />
                    {isAnonymousLoading ? copy.anonymousCard.loadingButton : copy.anonymousCard.button}
                    {!isAnonymousLoading && <ArrowRight className="ml-auto h-4 w-4" />}
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="absolute -right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <div className="space-y-2">
                        <p className="font-medium">{copy.anonymousCard.title}</p>
                        <p className="text-sm">{copy.anonymousCard.description}</p>
                        <p className="text-xs text-muted-foreground">{copy.anonymousCard.helpText}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>

            {/* Divider */}
            {authConfigClient.features.showEmailProvider && (
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>
            )}

            {/* Email Form */}
            {authConfigClient.features.showEmailProvider && (
              <div className="relative">
                <form onSubmit={handleEmailSignIn} className="space-y-3">
                  <Input
                    type="email"
                    placeholder={copy.emailCard.placeholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 text-base"
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base"
                    size="lg"
                    disabled={isLoading || !email}
                  >
                    <Mail className="h-5 w-5 mr-3" />
                    {isLoading ? copy.emailCard.loadingButton : copy.emailCard.button}
                    {!isLoading && <ArrowRight className="ml-auto h-4 w-4" />}
                  </Button>
                </form>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="absolute -right-10 top-6 p-1 hover:bg-muted rounded-full transition-colors">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-medium">{copy.emailCard.title}</p>
                      <p className="text-sm">{copy.emailCard.description}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

            {/* Recovery Section */}
            {authConfigClient.features.showRecoveryProvider && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-dashed" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Account Recovery</span>
                  </div>
                </div>

                <Card className="border-dashed relative">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="text-center space-y-1">
                        <KeyRound className="h-8 w-8 mx-auto text-muted-foreground" />
                        <h3 className="font-medium">{copy.recoveryCard.title}</h3>
                        <p className="text-sm text-muted-foreground">{copy.recoveryCard.description}</p>
                      </div>
                      
                      <form onSubmit={handleRecoverySignIn} className="space-y-3">
                        <Input
                          type="password"
                          placeholder={copy.recoveryCard.placeholder}
                          value={privateKey}
                          onChange={(e) => setPrivateKey(e.target.value)}
                          required
                          disabled={isRecoveryLoading}
                          className="h-11 font-mono text-sm"
                        />
                        <Button 
                          type="submit" 
                          className="w-full h-11"
                          variant="outline"
                          disabled={isRecoveryLoading || !privateKey}
                        >
                          {isRecoveryLoading ? copy.recoveryCard.loadingButton : copy.recoveryCard.button}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </form>
                      
                      <p className="text-xs text-muted-foreground text-center">
                        {copy.recoveryCard.helpText}
                      </p>
                    </div>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="absolute -right-10 top-6 p-1 hover:bg-muted rounded-full transition-colors">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <div className="space-y-2">
                          <p className="font-medium">Account Recovery Details</p>
                          <p className="text-sm">Supported formats: {authConfigClient.providers?.recovery?.supportedFormats?.join(', ') || 'hex, nsec'}</p>
                          <p className="text-xs text-muted-foreground">{authConfigClient.providers?.recovery?.description || copy.recoveryCard.helpText}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Footer Links */}
            <div className="text-center space-y-4 pt-8">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/" className="text-primary hover:underline font-medium">
                  Get started for free
                </Link>
              </p>
              
              {authConfigClient.features.requireTermsAcceptance && (
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {copy.termsText}
                </p>
              )}
              
              <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                <span>•</span>
                <Link href="/support" className="hover:text-foreground transition-colors">Help</Link>
              </div>
            </div>
          </div>
        </Section>
      </Container>
    </div>
    </TooltipProvider>
  )
} 