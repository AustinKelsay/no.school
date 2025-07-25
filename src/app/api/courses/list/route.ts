import { NextRequest, NextResponse } from 'next/server'
import { CourseAdapter } from '@/lib/db-adapter'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page')
    const pageSize = searchParams.get('pageSize')

    if (page || pageSize) {
      const result = await CourseAdapter.findAllPaginated({
        page: page ? parseInt(page) : undefined,
        pageSize: pageSize ? parseInt(pageSize) : undefined
      })
      return NextResponse.json(result)
    }

    const courses = await CourseAdapter.findAll()
    return NextResponse.json({ courses })
  } catch (error) {
    console.error('Failed to fetch courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}