/**
 * Email Verification Request Page
 * 
 * This page is shown after a user requests an email magic link
 * It provides instructions and feedback about the email process
 */

'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { AuthLayout } from '@/components/auth/auth-layout'

export default function VerifyRequestPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <AuthLayout 
      title="Check your email"
      description="We've sent you a magic link to sign in"
    >
      <Card>
          <CardHeader>
            <CardTitle className="text-center">Email Sent!</CardTitle>
            <CardDescription className="text-center">
              {email ? `We sent a magic link to ${email}` : 'We sent you a magic link'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <div className="space-y-2">
                <p className="font-medium">Next steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Check your email inbox (and spam folder)</li>
                  <li>Click the magic link in the email</li>
                  <li>You&apos;ll be automatically signed in</li>
                </ol>
              </div>
            </Alert>

                         <div className="text-center text-sm text-muted-foreground space-y-2">
               <p>The magic link will expire in 24 hours.</p>
               <p>
                 Didn&apos;t receive the email?{' '}
                 <Link 
                   href="/auth/signin" 
                   className="text-primary hover:text-primary/80 underline"
                 >
                   Try again
                 </Link>
               </p>
             </div>

            <div className="text-center">
              <Button variant="outline" asChild>
                <Link href="/">
                  Return to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
    </AuthLayout>
  )
} 