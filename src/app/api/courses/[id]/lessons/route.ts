import { NextRequest, NextResponse } from 'next/server'
import { LessonAdapter } from '@/lib/db-adapter'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lessons = await LessonAdapter.findByCourseId(id)
    
    return NextResponse.json({ lessons })
  } catch (error) {
    console.error('Error fetching course lessons:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}