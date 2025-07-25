import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ResourcePublishPageClient } from './resource-publish-client'

interface ResourcePublishPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ResourcePublishPage({ params }: ResourcePublishPageProps) {
  // Check authentication first
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }
  
  const { id } = await params
  
  if (!id) {
    notFound()
  }
  
  return <ResourcePublishPageClient resourceId={id} />
}