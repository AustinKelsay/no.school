/**
 * Authentication Error Page
 * 
 * This page handles authentication errors and provides
 * helpful error messages with recovery options
 */

'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { AuthLayout } from '@/components/auth/auth-layout'

// Error code to message mapping
const errorMessages: Record<string, { title: string; description: string; action: string }> = {
  CredentialsSignin: {
    title: 'Authentication Failed',
    description: 'The credentials you provided are invalid. Please check your information and try again.',
    action: 'Try signing in again'
  },
  EmailSignin: {
    title: 'Email Signin Error',
    description: 'There was an error sending your magic link. Please try again.',
    action: 'Request new magic link'
  },
  OAuthSignin: {
    title: 'OAuth Signin Error',
    description: 'There was an error with the OAuth provider. Please try again.',
    action: 'Try again'
  },
  OAuthCallback: {
    title: 'OAuth Callback Error',
    description: 'There was an error processing the OAuth callback. Please try again.',
    action: 'Try again'
  },
  EmailCreateAccount: {
    title: 'Email Account Creation Error',
    description: 'There was an error creating your account with this email. Please try again.',
    action: 'Try again'
  },
  Callback: {
    title: 'Callback Error',
    description: 'There was an error during the authentication callback. Please try again.',
    action: 'Try again'
  },
  OAuthCreateAccount: {
    title: 'OAuth Account Creation Error',
    description: 'There was an error creating your account with the OAuth provider. Please try again.',
    action: 'Try again'
  },
  SessionRequired: {
    title: 'Session Required',
    description: 'You need to be signed in to access this page.',
    action: 'Sign in'
  },
  Default: {
    title: 'Authentication Error',
    description: 'An unexpected error occurred during authentication. Please try again.',
    action: 'Try again'
  }
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const errorCode = searchParams.get('error') || 'Default'
  const errorInfo = errorMessages[errorCode] || errorMessages.Default

  return (
    <AuthLayout 
      title="Oops! Something went wrong"
      description="We encountered an issue with your authentication"
    >
      <Card>
          <CardHeader>
            <CardTitle className="text-center text-destructive">
              {errorInfo.title}
            </CardTitle>
            <CardDescription className="text-center">
              {errorInfo.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <div className="space-y-2">
                <p className="font-medium">Error Code: {errorCode}</p>
                <p className="text-sm">
                  If this problem persists, please contact support with the error code above.
                </p>
              </div>
            </Alert>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/signin">
                  {errorInfo.action}
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  Return to Home
                </Link>
              </Button>
            </div>

                         <div className="text-center text-sm text-muted-foreground">
               <p>
                 Need help?{' '}
                 <Link 
                   href="/support" 
                   className="text-primary hover:text-primary/80 underline"
                 >
                   Contact Support
                 </Link>
               </p>
             </div>
                     </CardContent>
         </Card>
     </AuthLayout>
   )
} 