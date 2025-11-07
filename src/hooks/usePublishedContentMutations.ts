import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { NostrEvent } from 'snstr'
import { publishedContentQueryKeys } from './usePublishedContentQuery'
import { resourceNotesQueryKeys } from './useResourceNotes'
import { courseNotesQueryKeys } from './useCourseNotes'

type RepublishResourcePayload = {
  id: string
  data: {
    title: string
    summary: string
    content: string
    price: number
    image?: string
    topics: string[]
    additionalLinks: string[]
    type: 'document' | 'video'
    videoUrl?: string
    signedEvent?: NostrEvent
    privkey?: string
    relays?: string[]
    relaySet?: 'default' | 'content' | 'profile' | 'zapThreads'
  }
}

type RepublishCoursePayload = {
  id: string
  data: {
    title: string
    summary: string
    image?: string
    price: number
    topics: string[]
    signedEvent?: NostrEvent
    privkey?: string
    relays?: string[]
    relaySet?: 'default' | 'content' | 'profile' | 'zapThreads'
  }
}

type DeletePayload = {
  id: string
}

async function republishResource({ id, data }: RepublishResourcePayload) {
  const response = await fetch(`/api/resources/${id}/republish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message =
      typeof errorBody.error === 'string' ? errorBody.error : 'Failed to republish resource'
    const error = new Error(message) as Error & { code?: string }
    if (typeof errorBody.code === 'string') {
      error.code = errorBody.code
    }
    throw error
  }

  return response.json()
}

async function republishCourse({ id, data }: RepublishCoursePayload) {
  const response = await fetch(`/api/courses/${id}/republish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message =
      typeof errorBody.error === 'string' ? errorBody.error : 'Failed to republish course'
    const error = new Error(message) as Error & { code?: string }
    if (typeof errorBody.code === 'string') {
      error.code = errorBody.code
    }
    throw error
  }

  return response.json()
}

async function deleteResource({ id }: DeletePayload) {
  const response = await fetch(`/api/resources/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message =
      typeof errorBody.error === 'string' ? errorBody.error : 'Failed to delete resource'
    throw new Error(message)
  }

  return response.json()
}

async function deleteCourse({ id }: DeletePayload) {
  const response = await fetch(`/api/courses/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message =
      typeof errorBody.error === 'string' ? errorBody.error : 'Failed to delete course'
    throw new Error(message)
  }

  return response.json()
}

export function useRepublishResourceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: republishResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: publishedContentQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: resourceNotesQueryKeys.all })
    },
  })
}

export function useRepublishCourseMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: republishCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: publishedContentQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: courseNotesQueryKeys.all })
    },
  })
}

export function useDeleteResourceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: publishedContentQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: resourceNotesQueryKeys.all })
    },
  })
}

export function useDeleteCourseMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: publishedContentQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: courseNotesQueryKeys.all })
    },
  })
}
