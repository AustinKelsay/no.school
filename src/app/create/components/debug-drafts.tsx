'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useDraftsQuery } from '@/hooks/useDraftsQuery'

export default function DebugDrafts() {
  const { data: session, status } = useSession()
  const draftsQuery = useDraftsQuery()
  const [apiTestResult, setApiTestResult] = useState<unknown>(null)
  const [apiTestError, setApiTestError] = useState<string | null>(null)

  const testApiDirectly = async () => {
    try {
      setApiTestError(null)
      const response = await fetch('/api/drafts/resources', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      setApiTestResult({
        status: response.status,
        ok: response.ok,
        data
      })
    } catch (error) {
      setApiTestError(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Debug: Draft Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Session Info */}
          <div>
            <h3 className="font-semibold mb-2">Session Status:</h3>
            <pre className="bg-muted p-2 rounded text-xs overflow-auto">
              {JSON.stringify({ 
                status, 
                user: session?.user,
                expires: session?.expires 
              }, null, 2)}
            </pre>
          </div>

          {/* Hook Status */}
          <div>
            <h3 className="font-semibold mb-2">useDraftsQuery Hook:</h3>
            <pre className="bg-muted p-2 rounded text-xs overflow-auto">
              {JSON.stringify({
                isLoading: draftsQuery.isLoading,
                isError: draftsQuery.isError,
                error: draftsQuery.error?.message,
                draftsCount: draftsQuery.drafts.length,
                pagination: draftsQuery.pagination
              }, null, 2)}
            </pre>
          </div>

          {/* Direct API Test */}
          <div>
            <h3 className="font-semibold mb-2">Direct API Test:</h3>
            <Button onClick={testApiDirectly} className="mb-2">
              Test API Directly
            </Button>
            {apiTestResult !== null && (
              <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                {JSON.stringify(apiTestResult, null, 2)}
              </pre>
            )}
            {apiTestError && (
              <Alert className="border-destructive">
                <AlertDescription>{apiTestError}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Drafts List */}
          {draftsQuery.drafts.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Drafts Found:</h3>
              <div className="space-y-2">
                {draftsQuery.drafts.map((draft) => (
                  <div key={draft.id} className="border p-2 rounded">
                    <p className="font-medium">{draft.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Type: {draft.type} | ID: {draft.id}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}