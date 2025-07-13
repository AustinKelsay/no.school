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
    lessons: [
      { id: 1, title: "Introduction to Development", duration: "30 min" },
      { id: 2, title: "Setting up Your Environment", duration: "45 min" },
      { id: 3, title: "Your First Project", duration: "45 min" },
    ],
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
    lessons: [
      { id: 1, title: "HTML Fundamentals", duration: "1 hour" },
      { id: 2, title: "CSS Styling", duration: "1.5 hours" },
      { id: 3, title: "JavaScript Basics", duration: "2 hours" },
      { id: 4, title: "React Introduction", duration: "1.5 hours" },
    ],
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
    lessons: [
      { id: 1, title: "Node.js Fundamentals", duration: "2 hours" },
      { id: 2, title: "Database Design", duration: "2 hours" },
      { id: 3, title: "API Development", duration: "2 hours" },
      { id: 4, title: "Authentication", duration: "2 hours" },
    ],
  },
];

/**
 * GET /api/courses/[id] - Fetch a specific course
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);
    
    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    const course = mockCourses.find(c => c.id === courseId);
    
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
    const courseId = parseInt(id);
    const body = await request.json();
    
    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    const courseIndex = mockCourses.findIndex(c => c.id === courseId);
    
    if (courseIndex === -1) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Update course (in real app, update database)
    const updatedCourse = { ...mockCourses[courseIndex], ...body };
    
    return NextResponse.json(
      { course: updatedCourse, message: 'Course updated successfully' }
    );
  } catch {
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
    const courseId = parseInt(id);
    
    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    const courseIndex = mockCourses.findIndex(c => c.id === courseId);
    
    if (courseIndex === -1) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // In real app, delete from database
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