'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { enrollInCourse } from '@/lib/actions'

interface CourseEnrollmentFormProps {
  courseId: string
  courseTitle: string
}

/**
 * Course enrollment form with server actions
 * Demonstrates progressive enhancement with loading states
 */
export function CourseEnrollmentForm({ courseId, courseTitle }: CourseEnrollmentFormProps) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; error?: string; message?: string } | null>(null)

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await enrollInCourse(formData)
      setResult(result)
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Enroll in Course</CardTitle>
        <CardDescription>
          Join {courseTitle} and start learning today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="courseId" value={courseId} />
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              disabled={isPending}
            />
          </div>

          {result && (
            <Alert variant={result.success ? "success" : "destructive"}>
              {result.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {result.success ? result.message : result.error}
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enrolling...
              </>
            ) : (
              'Enroll Now'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 