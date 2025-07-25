import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CoursePublishPageClient } from './course-publish-client'

interface CoursePublishPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CoursePublishPage({ params }: CoursePublishPageProps) {
  // Check authentication first
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }
  
  const { id } = await params
  
  if (!id) {
    notFound()
  }
  
  return <CoursePublishPageClient courseId={id} />
}