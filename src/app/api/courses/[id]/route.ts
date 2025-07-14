import { NextRequest, NextResponse } from 'next/server';
import { CourseRepository } from '@/lib/repositories';

/**
 * GET /api/courses/[id] - Fetch a specific course
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = id;
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    const course = await CourseRepository.findById(courseId);
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ course });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/courses/[id] - Update a specific course
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = id;
    const body = await request.json();
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    const updatedCourse = await CourseRepository.update(courseId, body);
    
    return NextResponse.json(
      { course: updatedCourse, message: 'Course updated successfully' }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/courses/[id] - Delete a specific course
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = id;
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    const deleted = await CourseRepository.delete(courseId);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Course deleted successfully' }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
} 