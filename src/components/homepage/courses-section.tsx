"use client";

import { useCoursesQuery, CourseWithNote } from "@/hooks/useCoursesQuery";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ContentCard } from "@/components/ui/content-card";
import { Section } from "@/components/layout";

/**
 * Client component for fetching and displaying courses
 * Uses the useCoursesQuery hook to fetch courses with their Nostr notes
 */
export function CoursesSection() {
  const { courses, isLoading, isError, error } = useCoursesQuery();

  if (isLoading) {
    return (
      <Section spacing="lg" className="bg-muted/30">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Courses</h2>
            <p className="text-muted-foreground">
              Structured learning paths from Bitcoin fundamentals to advanced Lightning Network development
            </p>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading courses...</span>
          </div>
        </div>
      </Section>
    );
  }

  if (isError) {
    return (
      <Section spacing="lg" className="bg-muted/30">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Courses</h2>
            <p className="text-muted-foreground">
              Structured learning paths from Bitcoin fundamentals to advanced Lightning Network development
            </p>
          </div>
          
          <div className="text-center py-12">
            <p className="text-red-600">Error loading courses: {error?.message}</p>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section spacing="lg" className="bg-muted/30">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Courses</h2>
          <p className="text-muted-foreground">
            Structured learning paths from Bitcoin fundamentals to advanced Lightning Network development
          </p>
        </div>
        
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses available at the moment.</p>
          </div>
        ) : (
          <Carousel 
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {courses.map((course) => (
                <CarouselItem key={course.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <CourseCard course={course} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-12" />
            <CarouselNext className="-right-12" />
          </Carousel>
        )}
      </div>
    </Section>
  );
}

/**
 * Custom course card component that handles the CourseWithNote type
 * Transforms Course data into a format compatible with ContentCard
 */
function CourseCard({ course }: { course: CourseWithNote }) {
  // Transform CourseWithNote into ContentCard-compatible format
  const contentItem = {
    id: course.id,
    type: 'course' as const,
    title: course.note?.tags.find(tag => tag[0] === "name")?.[1] || `Course ${course.id}`,
    description: course.note?.tags.find(tag => tag[0] === "about")?.[1] || '',
    category: course.price > 0 ? 'Premium' : 'Free',
    duration: '2-4 weeks',
    image: course.note?.tags.find(tag => tag[0] === "image")?.[1] || '',
    href: `/courses/${course.id}`,
    tags: course.note?.tags || [],
    author: course.userId,  
    instructor: course.userId,
    instructorPubkey: course.note?.pubkey || '',
    published: true,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    price: course.price,
    isPremium: course.price > 0,
    isNew: false,
    rating: 4.5,
    studentsCount: 0,
    featured: false,
    topics: course.note?.tags.filter(tag => tag[0] === "t").map(tag => tag[1]) || [],
    additionalLinks: course.note?.tags.filter(tag => tag[0] === "l").map(tag => tag[1]) || [],
  };

  return <ContentCard item={contentItem} variant="content" showContentTypeTags={false} />;
} 