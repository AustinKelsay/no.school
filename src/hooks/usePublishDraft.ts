/**
 * React hooks for publishing drafts to Nostr
 * 
 * These hooks provide a clean interface for UI components to:
 * - Trigger publishing operations
 * - Track publishing progress
 * - Handle errors
 * - Support both NIP-07 (client-side) and server-side signing
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useSnstrContext } from '@/contexts/snstr-context'
import { isNip07User, createUnsignedResourceEvent, createUnsignedCourseEvent } from '@/lib/nostr-events'
import { hasNip07Support, type NostrEvent } from 'snstr'
import type { PublishResourceResult, PublishCourseResult } from '@/lib/publish-service'

/**
 * Publishing step tracking
 */
export interface PublishStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  details?: string
  errorMessage?: string
}

/**
 * Publishing status hook result
 */
export interface PublishStatusResult {
  steps: PublishStep[]
  currentStep: number
  isPublishing: boolean
  error: Error | null
  updateStep: (stepId: string, status: PublishStep['status'], details?: string, errorMessage?: string) => void
  reset: () => void
}

/**
 * Hook for tracking publishing status
 */
export function usePublishStatus(initialSteps: PublishStep[]): PublishStatusResult {
  const [steps, setSteps] = useState<PublishStep[]>(initialSteps)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPublishing, setIsPublishing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateStep = useCallback((
    stepId: string, 
    status: PublishStep['status'], 
    details?: string, 
    errorMessage?: string
  ) => {
    setSteps(prev => {
      const newSteps = prev.map(step => 
        step.id === stepId 
          ? { ...step, status, details, errorMessage }
          : step
      )
      
      // Update current step
      const completedSteps = newSteps.filter(s => s.status === 'completed').length
      setCurrentStep(completedSteps)
      
      // Update publishing status
      const hasError = newSteps.some(s => s.status === 'error')
      const allComplete = newSteps.every(s => s.status === 'completed')
      
      if (hasError || allComplete) {
        setIsPublishing(false)
      }
      
      if (hasError && errorMessage) {
        setError(new Error(errorMessage))
      }
      
      return newSteps
    })
  }, [])

  const reset = useCallback(() => {
    setSteps(initialSteps)
    setCurrentStep(0)
    setIsPublishing(false)
    setError(null)
  }, [initialSteps])

  return {
    steps,
    currentStep,
    isPublishing,
    error,
    updateStep,
    reset
  }
}

/**
 * Hook for publishing a resource draft
 */
export function usePublishResource(draftId: string) {
  const { data: session } = useSession()
  const { publish: publishToRelays } = useSnstrContext()
  const queryClient = useQueryClient()
  
  const publishStatus = usePublishStatus([
    {
      id: 'validate',
      title: 'Validate Content',
      description: 'Checking content format and metadata',
      status: 'pending'
    },
    {
      id: 'nostr-event',
      title: 'Create Nostr Event',
      description: 'Generating NIP-23/NIP-99 content event',
      status: 'pending'
    },
    {
      id: 'sign',
      title: 'Sign Event',
      description: 'Cryptographically signing the event',
      status: 'pending'
    },
    {
      id: 'publish',
      title: 'Publish to Relays',
      description: 'Broadcasting to Nostr relay network',
      status: 'pending'
    },
    {
      id: 'database',
      title: 'Update Database',
      description: 'Creating published resource record',
      status: 'pending'
    },
    {
      id: 'cleanup',
      title: 'Complete',
      description: 'Publishing completed successfully',
      status: 'pending'
    }
  ])

  const mutation = useMutation<PublishResourceResult, Error, { privkey?: string }>({
    mutationFn: async ({ privkey }) => {
      if (!session?.user?.id) {
        throw new Error('Not authenticated')
      }

      const provider = (session as { provider?: string })?.provider
      const isNip07 = isNip07User(provider)

      // For NIP-07 users, we need to handle signing client-side
      if (isNip07) {
        publishStatus.updateStep('validate', 'processing')
        
        // First, validate the draft
        const validateResponse = await fetch(`/api/drafts/resources/${draftId}/validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        if (!validateResponse.ok) {
          throw new Error('Draft validation failed')
        }
        publishStatus.updateStep('validate', 'completed', 'Content validation passed')

        // Get the draft data for client-side event creation
        publishStatus.updateStep('nostr-event', 'processing')
        const draftResponse = await fetch(`/api/drafts/resources/${draftId}`)
        if (!draftResponse.ok) {
          throw new Error('Failed to fetch draft')
        }
        const { data: draft } = await draftResponse.json()

        // Create unsigned event
        if (!hasNip07Support()) {
          throw new Error('Nostr extension not available')
        }
        
        // Get public key from the browser extension
        const pubkey = await (window as any).nostr.getPublicKey()
        const unsignedEvent = createUnsignedResourceEvent(draft, pubkey)
        publishStatus.updateStep('nostr-event', 'completed', `${draft.price > 0 ? 'NIP-99' : 'NIP-23'} event created`)

        // Sign with NIP-07 using the browser extension directly
        publishStatus.updateStep('sign', 'processing')
        let signedEvent: NostrEvent
        try {
          // Use the browser extension's signEvent function directly
          signedEvent = await (window as any).nostr.signEvent(unsignedEvent)
          publishStatus.updateStep('sign', 'completed', 'Event signed with browser extension')
        } catch (error) {
          publishStatus.updateStep('sign', 'error', undefined, 'User rejected signing request')
          throw new Error('Signing rejected by user')
        }

        // Publish to relays
        publishStatus.updateStep('publish', 'processing')
        const publishResults = await publishToRelays(signedEvent)
        const successCount = publishResults.filter(r => r).length
        publishStatus.updateStep('publish', 'completed', `Published to ${successCount} relays`)

        // Send to API for database update
        publishStatus.updateStep('database', 'processing')
        const response = await fetch(`/api/drafts/resources/${draftId}/publish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ signedEvent, relays: [] }) // Relays already published
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to update database')
        }

        publishStatus.updateStep('database', 'completed', 'Resource record created')
        publishStatus.updateStep('cleanup', 'completed', 'Publishing completed')

        return response.json()
      } else {
        // Server-side signing - send everything to API
        const response = await fetch(`/api/drafts/resources/${draftId}/publish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ privkey })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to publish')
        }

        return response.json()
      }
    },
    onSuccess: () => {
      // Invalidate drafts and resources queries
      queryClient.invalidateQueries({ queryKey: ['drafts'] })
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
    onError: (error) => {
      publishStatus.updateStep(publishStatus.currentStep.toString(), 'error', undefined, error.message)
    }
  })

  return {
    ...mutation,
    publishStatus,
    publish: mutation.mutate
  }
}

/**
 * Hook for publishing a course draft
 */
export function usePublishCourse(courseDraftId: string) {
  const { data: session } = useSession()
  const { publish: publishToRelays } = useSnstrContext()
  const queryClient = useQueryClient()
  
  const publishStatus = usePublishStatus([
    {
      id: 'validate',
      title: 'Validate Course',
      description: 'Checking course structure and lessons',
      status: 'pending'
    },
    {
      id: 'publish-lessons',
      title: 'Publish Draft Lessons',
      description: 'Publishing unpublished lesson drafts',
      status: 'pending'
    },
    {
      id: 'course-event',
      title: 'Create Course Event',
      description: 'Generating NIP-51 curation set',
      status: 'pending'
    },
    {
      id: 'sign',
      title: 'Sign Event',
      description: 'Cryptographically signing the event',
      status: 'pending'
    },
    {
      id: 'publish',
      title: 'Publish to Relays',
      description: 'Broadcasting to Nostr relay network',
      status: 'pending'
    },
    {
      id: 'database',
      title: 'Update Database',
      description: 'Creating course and lesson records',
      status: 'pending'
    },
    {
      id: 'cleanup',
      title: 'Complete',
      description: 'Publishing completed successfully',
      status: 'pending'
    }
  ])

  const mutation = useMutation<PublishCourseResult, Error, { privkey?: string }>({
    mutationFn: async ({ privkey }) => {
      if (!session?.user?.id) {
        throw new Error('Not authenticated')
      }

      const provider = (session as { provider?: string })?.provider
      const isNip07 = isNip07User(provider)
      
      console.log('Publishing course - Provider:', provider, 'isNip07:', isNip07)

      // For NIP-07 users, handle client-side signing
      if (isNip07) {
        publishStatus.updateStep('validate', 'processing')
        
        // Validate the course draft
        const validateResponse = await fetch(`/api/drafts/courses/${courseDraftId}/validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        if (!validateResponse.ok) {
          throw new Error('Course validation failed')
        }
        publishStatus.updateStep('validate', 'completed', 'Course structure validated')

        // Get the course draft data with lessons
        const draftResponse = await fetch(`/api/drafts/courses/${courseDraftId}`)
        if (!draftResponse.ok) {
          throw new Error('Failed to fetch course draft')
        }
        const { data: courseDraft } = await draftResponse.json()

        // Check if extension is available
        console.log('Checking NIP-07 support, window.nostr:', (window as any).nostr)
        if (!hasNip07Support()) {
          throw new Error('Nostr extension not available')
        }

        // Get public key from the browser extension
        console.log('Getting public key from extension...')
        const pubkey = await (window as any).nostr.getPublicKey()
        console.log('Got pubkey:', pubkey)

        // Publish draft lessons first
        publishStatus.updateStep('publish-lessons', 'processing')
        const publishedLessonEvents: NostrEvent[] = []
        const lessonReferences: Array<{ resourceId: string; pubkey: string }> = []
        
        for (const draftLesson of courseDraft.draftLessons) {
          if (draftLesson.draftId && draftLesson.draft) {
            // This is an unpublished draft - publish it
            const unsignedEvent = createUnsignedResourceEvent(draftLesson.draft, pubkey)
            
            try {
              const signedEvent = await (window as any).nostr.signEvent(unsignedEvent)
              
              // Publish to relays
              const publishResults = await publishToRelays(signedEvent)
              const successCount = publishResults.filter(r => r).length
              
              if (successCount === 0) {
                throw new Error(`Failed to publish draft lesson ${draftLesson.index} to any relay`)
              }
              
              // Send to API to create resource in database
              const resourceResponse = await fetch(`/api/drafts/resources/${draftLesson.draftId}/publish`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ signedEvent, relays: [] })
              })
              
              if (!resourceResponse.ok) {
                throw new Error(`Failed to save lesson ${draftLesson.index} to database`)
              }
              
              const resourceResult = await resourceResponse.json()
              
              publishedLessonEvents.push(signedEvent)
              lessonReferences.push({
                resourceId: resourceResult.data?.resource?.id || draftLesson.draftId,
                pubkey
              })
            } catch (error) {
              publishStatus.updateStep('publish-lessons', 'error', undefined, 
                error instanceof Error ? error.message : 'Failed to publish draft lesson')
              throw error
            }
          } else if (draftLesson.resourceId) {
            // This is an already published resource
            // Use the resource owner's pubkey if available, otherwise use current user's
            const resourcePubkey = draftLesson.resource?.user?.pubkey || pubkey
            lessonReferences.push({
              resourceId: draftLesson.resourceId,
              pubkey: resourcePubkey
            })
          }
        }
        
        publishStatus.updateStep('publish-lessons', 'completed', 
          `Published ${publishedLessonEvents.length} draft lessons`)

        // Create course event
        publishStatus.updateStep('course-event', 'processing')
        const unsignedCourseEvent = createUnsignedCourseEvent(courseDraft, lessonReferences, pubkey)
        publishStatus.updateStep('course-event', 'completed', 'NIP-51 course event created')

        // Sign course event
        publishStatus.updateStep('sign', 'processing')
        let signedCourseEvent: NostrEvent
        try {
          signedCourseEvent = await (window as any).nostr.signEvent(unsignedCourseEvent)
          publishStatus.updateStep('sign', 'completed', 'Course event signed with browser extension')
        } catch (error) {
          publishStatus.updateStep('sign', 'error', undefined, 'User rejected signing request')
          throw new Error('Signing rejected by user')
        }

        // Publish course event to relays
        publishStatus.updateStep('publish', 'processing')
        const coursePublishResults = await publishToRelays(signedCourseEvent)
        const courseSuccessCount = coursePublishResults.filter(r => r).length
        publishStatus.updateStep('publish', 'completed', `Published to ${courseSuccessCount} relays`)

        // Send to API for database update
        publishStatus.updateStep('database', 'processing')
        const response = await fetch(`/api/drafts/courses/${courseDraftId}/publish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            signedEvent: signedCourseEvent, 
            relays: [],
            publishedLessonEvents 
          })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to update database')
        }

        publishStatus.updateStep('database', 'completed', 'Course and lesson records created')
        publishStatus.updateStep('cleanup', 'completed', 'Publishing completed')

        return response.json()
      }

      // Server-side publishing (handles all steps)
      const response = await fetch(`/api/drafts/courses/${courseDraftId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privkey })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to publish course')
      }

      publishStatus.updateStep('cleanup', 'completed', 'Course published successfully')
      return response.json()
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['drafts'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
    onError: (error) => {
      publishStatus.updateStep(publishStatus.currentStep.toString(), 'error', undefined, error.message)
    }
  })

  return {
    ...mutation,
    publishStatus,
    publish: mutation.mutate
  }
}

