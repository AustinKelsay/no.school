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
import { authConfigClient } from '@/lib/auth-config-client'

export default function VerifyRequestPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const copy = authConfigClient.copy.verifyRequest

  return (
    <AuthLayout 
      title={copy.title}
      description={copy.description}
    >
      <Card>
          <CardHeader>
            <CardTitle className="text-center">{copy.cardTitle}</CardTitle>
            <CardDescription className="text-center">
              {email ? copy.cardDescription.replace('{email}', email) : copy.cardDescriptionNoEmail}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <div className="space-y-2">
                <p className="font-medium">{copy.steps.title}</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>{copy.steps.step1}</li>
                  <li>{copy.steps.step2}</li>
                  <li>{copy.steps.step3}</li>
                </ol>
              </div>
            </Alert>

                         <div className="text-center text-sm text-muted-foreground space-y-2">
               <p>{copy.expiry}</p>
               <p>
                 {copy.noEmail}{' '}
                 <Link 
                   href="/auth/signin" 
                   className="text-primary hover:text-primary/80 underline"
                 >
                   {copy.tryAgain}
                 </Link>
               </p>
             </div>

            <div className="text-center">
              <Button variant="outline" asChild>
                <Link href="/">
                  {copy.returnHome}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
    </AuthLayout>
  )
} 