import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LessonDraftPreviewPageClient } from './lesson-draft-preview-client'

interface LessonDraftPreviewPageProps {
  params: Promise<{
    id: string
    lessonId: string
  }>
}

/**
 * Lesson draft preview page (Server Component)
 */
export default async function LessonDraftPreviewPage({ params }: LessonDraftPreviewPageProps) {
  // Check authentication first
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }
  
  const { id, lessonId } = await params
  
  if (!id || !lessonId) {
    notFound()
  }
  
  return <LessonDraftPreviewPageClient courseId={id} lessonId={lessonId} />
}