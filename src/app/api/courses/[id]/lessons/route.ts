import { NextRequest, NextResponse } from 'next/server'
import { LessonRepository } from '@/lib/repositories'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lessons = await LessonRepository.findByCourseId(id)
    
    return NextResponse.json({ lessons })
  } catch (error) {
    console.error('Error fetching course lessons:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}