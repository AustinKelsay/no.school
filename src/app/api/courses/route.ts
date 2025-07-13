import { NextRequest, NextResponse } from 'next/server';

/**
 * Mock course data - replace with real database calls
 */
const mockCourses = [
  {
    id: 1,
    title: "PlebDevs Starter",
    description: "Get started with the fundamentals",
    category: "beginner",
    duration: "2 hours",
    instructor: "John Doe",
    rating: 4.8,
    image: "/api/placeholder/course-1.jpg",
  },
  {
    id: 2,
    title: "Frontend Course",
    description: "Build beautiful user interfaces",
    category: "frontend",
    duration: "6 hours",
    instructor: "Jane Smith",
    rating: 4.9,
    image: "/api/placeholder/course-2.jpg",
  },
  {
    id: 3,
    title: "Backend Course",
    description: "Master server-side development",
    category: "backend",
    duration: "8 hours",
    instructor: "Mike Johnson",
    rating: 4.7,
    image: "/api/placeholder/course-3.jpg",
  },
];

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
    // Filter courses by category if provided
    let filteredCourses = mockCourses;
    if (category) {
      filteredCourses = mockCourses.filter(course => 
        course.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    return NextResponse.json({
      courses: paginatedCourses,
      total: filteredCourses.length,
      page,
      totalPages: Math.ceil(filteredCourses.length / limit),
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
    const newCourse = {
      id: mockCourses.length + 1,
      title,
      description,
      category,
      duration: body.duration || "TBD",
      instructor: body.instructor || "Unknown",
      rating: 0,
      image: body.image || "/api/placeholder/default-course.jpg",
    };

    return NextResponse.json(
      { course: newCourse, message: 'Course created successfully' },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
} 