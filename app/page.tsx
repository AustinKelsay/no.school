/**
 * @fileoverview Home page with hero section and content carousels
 * @author PlebDevs Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import { PageLayout } from '@/components/layout';
import { ContentCard } from '@/components/content';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockCourses, mockUsers } from '@/data';

/**
 * Home page component with hero section and featured content
 */
export default function HomePage() {
  // Mock featured content - in real app this would come from API
  const featuredCourses = mockCourses.slice(0, 3).map(course => {
    const author = mockUsers.find(u => u.id === course.userId)!;
    return {
      type: 'course' as const,
      title: getCourseTitle(course.id),
      summary: getCourseSummary(course.id),
      image: getCourseImage(course.id),
      price: course.price,
      topics: getCourseTopics(course.id),
      author,
      createdAt: course.createdAt,
      onClick: () => console.log('Navigate to course:', course.id),
      onPurchase: () => console.log('Purchase course:', course.id),
      onZap: (amount: number) => console.log('Zap course:', course.id, amount),
    };
  });

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <div className="container mx-auto px-4 py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <Badge
                variant="secondary"
                className="border-bitcoin-orange/20 bg-bitcoin-orange/10 text-bitcoin-orange"
              >
                ⚡ Bitcoin & Lightning Education
              </Badge>
            </div>

            <h1 className="mb-6 bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-300 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
              Master Bitcoin Development
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-zinc-400 md:text-2xl">
              Learn Bitcoin, Lightning Network, and Nostr protocol development
              from industry experts. Build the decentralized future with
              hands-on courses and real-world projects.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="btn-bitcoin px-8 py-4 text-lg">
                Start Learning
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-zinc-700 px-8 py-4 text-lg text-zinc-300 hover:bg-zinc-800"
              >
                Browse Content
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="text-bitcoin-orange">⚡</span>
                <span>Lightning Integrated</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-nostr-purple">🔗</span>
                <span>Nostr Native</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-success">🎓</span>
                <span>Expert Instructors</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">🏆</span>
                <span>Completion Badges</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="bg-zinc-950 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-zinc-100">
                Featured Courses
              </h2>
              <p className="text-zinc-400">
                Start your Bitcoin development journey
              </p>
            </div>
            <Button variant="outline" className="hidden sm:inline-flex">
              View All Courses
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course, index) => (
              <ContentCard key={index} {...course} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-zinc-900/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div>
              <div className="mb-2 text-3xl font-bold text-bitcoin-orange">
                50+
              </div>
              <div className="text-zinc-400">Courses</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-lightning-purple">
                1.2k+
              </div>
              <div className="text-zinc-400">Students</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-nostr-purple">
                95%
              </div>
              <div className="text-zinc-400">Completion Rate</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-success">24/7</div>
              <div className="text-zinc-400">Community Support</div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

// Helper functions to generate mock course data
function getCourseTitle(courseId: string): string {
  const titles: Record<string, string> = {
    'course-1': 'Bitcoin Fundamentals',
    'course-2': 'Lightning Network Introduction',
    'course-3': 'Advanced Lightning Development',
    'course-4': 'Nostr Protocol Deep Dive',
    'course-5': 'Bitcoin Development Masterclass',
  };
  return titles[courseId] || 'Bitcoin Course';
}

function getCourseSummary(courseId: string): string {
  const summaries: Record<string, string> = {
    'course-1':
      'Master the fundamentals of Bitcoin, from cryptography to consensus mechanisms. Perfect for developers new to Bitcoin.',
    'course-2':
      'Learn how the Lightning Network enables instant, low-cost Bitcoin payments. Build your first Lightning application.',
    'course-3':
      'Deep dive into Lightning Network development with channel management, routing, and advanced payment flows.',
    'course-4':
      'Understand the Nostr protocol for decentralized social networks and content publishing on Bitcoin.',
    'course-5':
      'Comprehensive Bitcoin development course covering everything from basic concepts to advanced applications.',
  };
  return (
    summaries[courseId] || 'Learn Bitcoin development from industry experts.'
  );
}

function getCourseImage(courseId: string): string {
  const images: Record<string, string> = {
    'course-1':
      'https://images.unsplash.com/photo-1640826356870-b4d88eb6c1bb?w=800&h=400&fit=crop',
    'course-2':
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
    'course-3':
      'https://images.unsplash.com/photo-1518186233392-c232efbf2373?w=800&h=400&fit=crop',
    'course-4':
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    'course-5':
      'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800&h=400&fit=crop',
  };
  return (
    images[courseId] ||
    'https://images.unsplash.com/photo-1640826356870-b4d88eb6c1bb?w=800&h=400&fit=crop'
  );
}

function getCourseTopics(courseId: string): string[] {
  const topics: Record<string, string[]> = {
    'course-1': ['bitcoin', 'fundamentals', 'beginner', 'cryptography'],
    'course-2': ['lightning', 'payments', 'beginner', 'network'],
    'course-3': ['lightning', 'advanced', 'development', 'channels'],
    'course-4': ['nostr', 'protocol', 'decentralized', 'social'],
    'course-5': ['bitcoin', 'advanced', 'development', 'masterclass'],
  };
  return topics[courseId] || ['bitcoin', 'development'];
}
