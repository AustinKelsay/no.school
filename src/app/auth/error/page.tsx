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
import { authConfigClient } from '@/lib/auth-config-client'


export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const errorCode = searchParams.get('error') || 'Default'
  const copy = authConfigClient.copy.error
  const errorInfo = copy.errorMessages[errorCode as keyof typeof copy.errorMessages] || copy.errorMessages.Default

  return (
    <AuthLayout 
      title={copy.title}
      description={copy.description}
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
                {copy.persistentError}
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
                {copy.returnHome}
              </Link>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              {copy.needHelp}{' '}
              <Link 
                href="/support" 
                className="text-primary hover:text-primary/80 underline"
              >
                {copy.contactSupport}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}