import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CourseDraftPageClient } from './course-draft-client'

interface CourseDraftPageProps {
  params: Promise<{
    id: string
  }>
}

/**
 * Course draft page with dynamic routing (Server Component)
 */
export default async function CourseDraftPage({ params }: CourseDraftPageProps) {
  // Check authentication first
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }
  
  const { id } = await params
  
  // Basic validation
  if (!id) {
    notFound()
  }
  
  return <CourseDraftPageClient courseId={id} />
}