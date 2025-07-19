import { NextRequest, NextResponse } from 'next/server';
import { CourseAdapter } from '@/lib/db-adapter';
import type { Course } from '@/data/types';

/**
 * GET /api/courses - Fetch all courses
 * Supports filtering and pagination
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '10');
  const page = parseInt(searchParams.get('page') || '1');

  try {
    // Use adapter to get courses with pagination
    const result = await CourseAdapter.findAllPaginated({
      page,
      pageSize: limit
    });

    // Note: Category filtering would be implemented via Nostr event filtering
    // For now, return all courses since filtering happens on Nostr side
    return NextResponse.json({
      courses: result.data,
      total: result.pagination.totalItems,
      page: result.pagination.page,
      totalPages: result.pagination.totalPages,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/courses - Create a new course
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { title, description, category } = body;
    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category' },
        { status: 400 }
      );
    }

    // In a real app, you'd save to database
    // Note: UI fields like title, description, category would be stored in Nostr events
    const newCourse: Course = {
      id: `course-${Date.now()}`, // Generate a simple ID for now
      userId: 'user-admin', // Default user ID
      price: 0,
      submissionRequired: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      noteId: `course-${Date.now()}-note` // Reference to Nostr event
    };

    const createdCourse = await CourseAdapter.create(newCourse);

    return NextResponse.json(
      { course: createdCourse, message: 'Course created successfully' },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
} 