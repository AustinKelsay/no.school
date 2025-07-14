import { NextRequest, NextResponse } from 'next/server';
import { CourseRepository } from '@/lib/repositories';
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
    // Use repository to get courses with filtering
    const allCourses = await CourseRepository.findAll(
      category ? { category } : {}
    );

    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = allCourses.slice(startIndex, endIndex);

    return NextResponse.json({
      courses: paginatedCourses,
      total: allCourses.length,
      page,
      totalPages: Math.ceil(allCourses.length / limit),
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
    const newCourse: Course = {
      id: 0, // This will be set by the repository
      title,
      description,
      category,
      duration: body.duration || "TBD",
      instructor: body.instructor || "Unknown",
      rating: 0,
      image: body.image || "/api/placeholder/default-course.jpg",
      enrollmentCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lessons: []
    };

    const createdCourse = await CourseRepository.create(newCourse);

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