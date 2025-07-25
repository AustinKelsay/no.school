import { NextRequest, NextResponse } from 'next/server'
import { ResourceAdapter } from '@/lib/db-adapter'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page')
    const pageSize = searchParams.get('pageSize')

    if (page || pageSize) {
      const result = await ResourceAdapter.findAllPaginated({
        page: page ? parseInt(page) : undefined,
        pageSize: pageSize ? parseInt(pageSize) : undefined
      })
      
      // Filter out lessons at the resource level
      const resourcesWithoutLessons = await Promise.all(
        result.data.map(async (resource) => {
          const isLesson = await ResourceAdapter.isLesson(resource.id)
          return isLesson ? null : resource
        })
      )
      
      return NextResponse.json({
        data: resourcesWithoutLessons.filter(r => r !== null),
        pagination: result.pagination
      })
    }

    const resources = await ResourceAdapter.findAll()
    
    // Filter out lessons
    const resourcesWithoutLessons = await Promise.all(
      resources.map(async (resource) => {
        const isLesson = await ResourceAdapter.isLesson(resource.id)
        return isLesson ? null : resource
      })
    )

    return NextResponse.json({ 
      resources: resourcesWithoutLessons.filter(r => r !== null) 
    })
  } catch (error) {
    console.error('Failed to fetch resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}