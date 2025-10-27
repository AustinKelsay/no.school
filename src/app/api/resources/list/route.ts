import { NextRequest, NextResponse } from 'next/server'
import { ResourceAdapter } from '@/lib/db-adapter'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page')
    const pageSize = searchParams.get('pageSize')
    // Optional flag that allows consumers (e.g. lesson selector) to include
    // resources that are already attached to a course lesson. Defaults to false
    // to preserve the original standalone library behaviour.
    const includeLessonResourcesParam = searchParams.get('includeLessonResources')
    const includeLessonResources = includeLessonResourcesParam === 'true' || includeLessonResourcesParam === '1'

    async function maybeFilterLessonResources<T extends { id: string }>(resources: T[]) {
      if (includeLessonResources) {
        return resources
      }

      const filtered = await Promise.all(
        resources.map(async (resource) => {
          const isLesson = await ResourceAdapter.isLesson(resource.id)
          return isLesson ? null : resource
        })
      )

      return filtered.filter((resource): resource is T => resource !== null)
    }

    if (page || pageSize) {
      const result = await ResourceAdapter.findAllPaginated({
        page: page ? parseInt(page) : undefined,
        pageSize: pageSize ? parseInt(pageSize) : undefined,
      })

      return NextResponse.json({
        data: await maybeFilterLessonResources(result.data),
        pagination: result.pagination,
      })
    }

    const resources = await ResourceAdapter.findAll()

    return NextResponse.json({
      resources: await maybeFilterLessonResources(resources),
    })
  } catch (error) {
    console.error('Failed to fetch resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}
