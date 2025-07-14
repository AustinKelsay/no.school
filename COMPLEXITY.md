
# Application Complexity Analysis & Resolution Plan

This document outlines the five most complex parts of the application, their current issues, and detailed solutions for addressing complexity while maintaining functionality.

## 1. API Route Handlers (CRUD Operations)

**Files:**
- `src/app/api/courses/route.ts`
- `src/app/api/courses/[id]/route.ts`

**Current Issues:**
- Generic error handling that loses important context
- Minimal input validation leading to security vulnerabilities
- Direct coupling to mock data without abstraction layer
- Inconsistent ID validation patterns duplicated across routes
- Race conditions in ID generation (coursesDatabase.length + 1)

**Solution: Service Layer Architecture**

**Priority:** High | **Timeline:** 1-2 weeks | **Risk:** Low

Create a structured service layer with proper validation and error handling:

```typescript
// lib/api-utils.ts - Shared validation utilities
import { z } from 'zod'

export const CourseCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  duration: z.string().optional(),
  instructor: z.string().optional(),
  image: z.string().url().optional(),
})

export const CourseUpdateSchema = CourseCreateSchema.partial()

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message)
  }
}

export function validateCourseId(id: string): { success: true; courseId: number } | { success: false; error: string } {
  const courseId = parseInt(id)
  if (isNaN(courseId) || courseId <= 0) {
    return { success: false, error: 'Invalid course ID' }
  }
  return { success: true, courseId }
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }
  
  console.error('Unexpected API error:', error)
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}
```

```typescript
// lib/repositories.ts - Data abstraction layer
export class CourseRepository {
  static findById(id: number): Course | null {
    return coursesDatabase.find(c => c.id === id) || null
  }

  static findAll(filters: { category?: string }): Course[] {
    let courses = coursesDatabase
    if (filters.category) {
      courses = courses.filter(c => 
        c.category.toLowerCase() === filters.category!.toLowerCase()
      )
    }
    return courses
  }

  static create(data: CourseCreateData): Course {
    const newCourse: Course = {
      id: Math.max(...coursesDatabase.map(c => c.id), 0) + 1,
      ...data,
      rating: 0,
      enrollmentCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lessons: []
    }
    
    coursesDatabase.push(newCourse)
    return newCourse
  }

  static update(id: number, data: Partial<Course>): Course | null {
    const index = coursesDatabase.findIndex(c => c.id === id)
    if (index === -1) return null
    
    coursesDatabase[index] = { ...coursesDatabase[index], ...data }
    return coursesDatabase[index]
  }

  static delete(id: number): boolean {
    const index = coursesDatabase.findIndex(c => c.id === id)
    if (index === -1) return false
    
    coursesDatabase.splice(index, 1)
    return true
  }
}
```

## 2. Server Actions Security & Architecture

**File:**
- `src/lib/actions.ts`

**Current Issues:**
- No authentication or authorization checks
- Basic input validation vulnerable to attacks
- No rate limiting allowing spam attacks
- Generic error handling exposing sensitive information
- Missing CSRF protection beyond Next.js defaults
- Console logging exposing data in production

**Solution: Secure Action Framework**

**Priority:** High | **Timeline:** 2-3 weeks | **Risk:** Medium

Implement a type-safe, secure server action framework:

```typescript
// lib/secure-actions.ts - Enhanced security framework
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { rateLimitCheck } from './rate-limiting'

export class UnauthorizedError extends Error {
  constructor(message = 'Authentication required') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export interface ActionContext {
  session: Session | null
  formData: FormData
}

export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

export function createAction<T extends z.ZodType, R>(
  schema: T,
  handler: (data: z.infer<T>, context: ActionContext) => Promise<R>
) {
  return async (formData: FormData): Promise<ActionResult<R>> => {
    try {
      // 1. Authentication check
      const session = await getServerSession()
      
      // 2. Schema validation
      const rawData = Object.fromEntries(formData.entries())
      const result = schema.safeParse(rawData)
      
      if (!result.success) {
        return {
          success: false,
          error: 'Validation failed',
          fieldErrors: result.error.flatten().fieldErrors
        }
      }

      // 3. Business logic execution
      const data = await handler(result.data, { session, formData })
      
      return { success: true, data }
    } catch (error) {
      logger.error('Action failed', { error })
      
      if (error instanceof UnauthorizedError) {
        return { success: false, error: 'Authentication required' }
      }
      
      if (error instanceof ValidationError) {
        return { 
          success: false, 
          error: error.message,
          fieldErrors: { [error.field]: [error.message] }
        }
      }
      
      return { success: false, error: 'An unexpected error occurred' }
    }
  }
}

// Enhanced enrollment action with security
const enrollmentSchema = z.object({
  courseId: z.string().uuid('Invalid course ID format'),
  email: z.string().email('Invalid email format').max(254),
})

export const enrollInCourse = createAction(
  enrollmentSchema,
  async (data, { session }) => {
    // Rate limiting
    if (session?.user) {
      await rateLimitCheck(session.user.id, 'enrollment', 5, 3600) // 5 per hour
    }

    // Authorization check
    const course = await CourseRepository.findById(data.courseId)
    if (!course) {
      throw new ValidationError('courseId', 'Course not found')
    }

    // Business logic
    const enrollment = await EnrollmentService.enroll({
      userId: session?.user?.id,
      courseId: data.courseId,
      email: data.email
    })

    // Cache revalidation
    revalidateTag(`course-${data.courseId}`)
    revalidatePath('/courses')

    return { enrollmentId: enrollment.id, message: 'Successfully enrolled!' }
  }
)
```

## 3. Dynamic Pages with Suspense and Streaming UI

**Files:**
- `src/app/courses/[id]/page.tsx`
- `src/app/courses/[id]/loading.tsx`
- `src/app/courses/page.tsx`

**Current Issues:**
- Double data fetching in `generateMetadata` and component
- Over-engineered caching with no actual caching implementation
- Artificial delays (`simulateDelay`) adding unnecessary latency
- Inconsistent Suspense usage across different pages
- Complex metadata generation for every course
- Unnecessary component splitting for simple rendering

**Solution: Standardized Suspense Patterns**

**Priority:** Medium | **Timeline:** 1 week | **Risk:** Low

Simplify and standardize the Suspense implementation:

```typescript
// lib/cache.ts - Real caching implementation
export class DataCache {
  private cache = new Map<string, { data: any; expires: number }>()
  
  async get<T>(key: string, fetcher: () => Promise<T>, ttl = 300000): Promise<T> {
    const cached = this.cache.get(key)
    if (cached && cached.expires > Date.now()) {
      return cached.data
    }
    
    const data = await fetcher()
    this.cache.set(key, { data, expires: Date.now() + ttl })
    return data
  }

  invalidate(pattern?: string) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
  }
}

const cache = new DataCache()

// Simplified data fetching without artificial delays
export async function getCachedCourseById(id: number): Promise<Course | null> {
  return cache.get(`course:${id}`, async () => {
    return CourseRepository.findById(id)
  })
}
```

```typescript
// components/ui/content-skeleton.tsx - Reusable skeleton components
interface ContentSkeletonProps {
  variant: 'grid' | 'list' | 'detail'
  count?: number
}

export function ContentSkeleton({ variant, count = 3 }: ContentSkeletonProps) {
  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 h-48 rounded-lg mb-4" />
            <div className="bg-gray-300 h-4 rounded mb-2" />
            <div className="bg-gray-300 h-4 rounded w-3/4" />
          </div>
        ))}
      </div>
    )
  }
  
  // Similar patterns for list and detail variants
}
```

```typescript
// Standardized page pattern
export default function CourseDetailPage({ params }: { params: { id: string } }) {
  return (
    <MainLayout>
      <Suspense fallback={<ContentSkeleton variant="detail" />}>
        <CourseContent courseId={params.id} />
      </Suspense>
    </MainLayout>
  )
}

// Simplified metadata generation
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const course = await getCachedCourseById(parseInt(params.id))
  
  if (!course) {
    return { title: 'Course Not Found' }
  }
  
  return {
    title: `${course.title} - PlebDevs`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: course.image ? [course.image] : undefined,
    },
  }
}
```

## 4. Advanced Theming System

**Files:**
- `src/contexts/theme-context.tsx`
- `src/components/theme-provider.tsx`
- `src/components/theme-selector.tsx`
- `src/lib/theme-config.ts`

**Current Issues:**
- Dual provider system creating unnecessary complexity
- 756-line configuration file with repetitive color definitions
- Runtime CSS variable injection bypassing React reconciliation
- 39 interface properties for simple theme management
- Complex hydration prevention logic
- Memory inefficient large configuration objects

**Solution: Unified CSS-First Theme System**

**Priority:** Medium | **Timeline:** 2-3 weeks | **Risk:** Medium

Simplify to a CSS-first approach with unified provider:

```typescript
// lib/theme-system.ts - Simplified theme management
export type ThemeMode = 'light' | 'dark' | 'system'
export type ThemeColor = 'blue' | 'red' | 'green' | 'purple' | 'orange'
export type ThemeStyle = 'default' | 'new-york'  
export type ThemeRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl'

export interface ThemeConfig {
  theme: ThemeMode
  color: ThemeColor
  style: ThemeStyle
  radius: ThemeRadius
}

// Generate themes programmatically instead of hardcoding
export function generateThemeConfig(color: ThemeColor): Record<string, string> {
  const hues = { blue: 240, red: 0, green: 120, purple: 280, orange: 30 }
  const hue = hues[color]
  
  return {
    '--primary': `oklch(0.648 0.148 ${hue})`,
    '--primary-foreground': `oklch(0.985 0.003 ${hue})`,
    '--secondary': `oklch(0.9 0.025 ${hue})`,
    // Generate full color palette programmatically
  }
}
```

```css
/* globals.css - CSS-first theme classes */
.theme-blue {
  --primary: oklch(0.648 0.148 240);
  --primary-foreground: oklch(0.985 0.003 240);
  --secondary: oklch(0.9 0.025 240);
  /* ... */
}

.theme-red {
  --primary: oklch(0.577 0.245 27.325);
  --primary-foreground: oklch(0.985 0.003 0);
  --secondary: oklch(0.9 0.025 0);
  /* ... */
}

.radius-none { --radius: 0rem; }
.radius-sm { --radius: 0.125rem; }
.radius-md { --radius: 0.375rem; }
```

```typescript
// contexts/unified-theme-context.tsx - Single provider
interface ThemeContextType {
  theme: ThemeMode
  color: ThemeColor
  style: ThemeStyle
  radius: ThemeRadius
  setTheme: (theme: ThemeMode) => void
  setColor: (color: ThemeColor) => void
  setStyle: (style: ThemeStyle) => void
  setRadius: (radius: ThemeRadius) => void
}

export function UnifiedThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [config, setConfig] = useState<ThemeConfig>({
    theme: 'system',
    color: 'blue',
    style: 'default',
    radius: 'md'
  })

  useEffect(() => {
    setMounted(true)
    // Apply theme classes instead of CSS injection
    document.documentElement.className = `theme-${config.color} radius-${config.radius}`
  }, [config])

  if (!mounted) return <div style={{ visibility: 'hidden' }}>{children}</div>

  return (
    <ThemeContext.Provider value={{ ...config, setTheme, setColor, setStyle, setRadius }}>
      <div className={`theme-${config.color} radius-${config.radius}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
```

**Estimated Complexity Reduction:**
- 67% fewer lines of code (1,200 → 400 lines)
- 79% fewer interface properties (39 → 8 properties) 
- 87% smaller configuration (756 → 100 lines)
- 50% fewer components (4 → 2 files)

## 5. Data Layer Architecture Unification

**Files:**
- `src/data/types.ts` (400+ lines)
- `src/data/mock-data.ts` (2,600+ lines)
- `src/lib/data.ts` (586 lines)
- `src/data/index.ts`

**Current Issues:**
- Three incompatible data models requiring constant transformation
- 2,600-line mock data file violating single responsibility
- No actual caching despite functions named "getCached*"
- Manual synchronization across multiple data representations
- Complex transformation chains with 4+ steps between models
- Memory inefficient loading of all data regardless of need

**Solution: Unified Data Architecture**

**Priority:** High | **Timeline:** 6-8 weeks | **Risk:** High

Implement a phased migration to unified data layer:

**Phase 1: Immediate Caching & Domain Separation (Weeks 1-2)**

```typescript
// lib/cache.ts - Production-ready caching
export class HierarchicalCache {
  private l1 = new Map<string, { data: any; expires: number }>() // Memory cache
  private l2: Redis | null = null // Redis cache (when available)
  
  async get<T>(key: string, fetcher: () => Promise<T>, ttl = 300000): Promise<T> {
    // L1 cache check
    const l1Cached = this.l1.get(key)
    if (l1Cached && l1Cached.expires > Date.now()) {
      return l1Cached.data
    }
    
    // L2 cache check (Redis)
    if (this.l2) {
      const l2Cached = await this.l2.get(key)
      if (l2Cached) {
        const data = JSON.parse(l2Cached)
        this.l1.set(key, { data, expires: Date.now() + ttl })
        return data
      }
    }
    
    // Fetch from source
    const data = await fetcher()
    
    // Cache in both layers
    this.l1.set(key, { data, expires: Date.now() + ttl })
    if (this.l2) {
      await this.l2.setex(key, Math.floor(ttl / 1000), JSON.stringify(data))
    }
    
    return data
  }

  invalidatePattern(pattern: string) {
    // Invalidate all keys matching pattern
    for (const key of this.l1.keys()) {
      if (key.includes(pattern)) {
        this.l1.delete(key)
      }
    }
    
    if (this.l2) {
      // Redis pattern invalidation
      this.l2.eval('return redis.call("del", unpack(redis.call("keys", ARGV[1])))', 0, pattern)
    }
  }
}
```

```
// Split mock data by domain
src/data/
├── courses/
│   ├── mock-courses.ts      (200 lines)
│   ├── mock-lessons.ts      (150 lines)
│   ├── types.ts             (50 lines)
│   └── index.ts
├── documents/
│   ├── mock-documents.ts    (100 lines)
│   ├── types.ts             (30 lines)
│   └── index.ts
├── videos/
│   ├── mock-videos.ts       (100 lines)
│   ├── types.ts             (30 lines)
│   └── index.ts
└── index.ts                 (Central exports)
```

**Phase 2: Data Model Unification (Weeks 3-6)**

```typescript
// data/unified-models.ts - Single source of truth
export interface UnifiedCourse {
  // Core database fields
  id: string                          // Primary UUID identifier
  title: string
  description: string
  category: string
  instructor: string
  instructorPubkey: string
  
  // Nostr integration
  nostrEvents: {
    courseListEvent?: NostrCourseListEvent
    lessonEvents: NostrLessonEvent[]
  }
  
  // Metadata
  rating: number
  enrollmentCount: number
  isPremium: boolean
  price?: number
  createdAt: string
  updatedAt: string
  
  // Computed fields for legacy compatibility
  computed: {
    legacyId: number              // For backwards compatibility
    duration: string              // Calculated from lessons
    lessonsCount: number          // Derived field
  }
}

// Transform only when needed for specific views
export const toLegacyCourse = (unified: UnifiedCourse): Course => ({
  id: unified.computed.legacyId,
  title: unified.title,
  description: unified.description,
  category: unified.category,
  instructor: unified.instructor,
  rating: unified.rating,
  enrollmentCount: unified.enrollmentCount,
  duration: unified.computed.duration,
  // Minimal transformation
})

export const toContentItem = (unified: UnifiedCourse): ContentItem => ({
  id: unified.computed.legacyId,
  type: 'course' as const,
  title: unified.title,
  description: unified.description,
  category: unified.category,
  // View-specific fields only
})
```

**Phase 3: Repository Pattern (Weeks 7-12)**

```typescript
// services/course-repository.ts - Data access abstraction
export interface CourseRepository {
  findById(id: string): Promise<UnifiedCourse | null>
  findByCategory(category: string): Promise<UnifiedCourse[]>
  search(query: string, filters?: CourseFilters): Promise<UnifiedCourse[]>
  save(course: UnifiedCourse): Promise<void>
  delete(id: string): Promise<void>
}

export class MockCourseRepository implements CourseRepository {
  private cache = new HierarchicalCache()
  
  async findById(id: string): Promise<UnifiedCourse | null> {
    return this.cache.get(`course:${id}`, async () => {
      // Mock data access
      return mockCourses.find(c => c.id === id) || null
    })
  }
  
  async findByCategory(category: string): Promise<UnifiedCourse[]> {
    return this.cache.get(`courses:category:${category}`, async () => {
      return mockCourses.filter(c => c.category === category)
    })
  }
}

export class DatabaseCourseRepository implements CourseRepository {
  async findById(id: string): Promise<UnifiedCourse | null> {
    // Real database implementation
    const result = await db.course.findUnique({ where: { id } })
    return result ? mapDbToUnified(result) : null
  }
}

export class NostrCourseRepository implements CourseRepository {
  async findById(id: string): Promise<UnifiedCourse | null> {
    // Nostr relay implementation
    const events = await nostr.fetchEvents({ kinds: [30001], '#d': [id] })
    return events.length > 0 ? mapNostrToUnified(events[0]) : null
  }
}
```

## Implementation Timeline & Risk Assessment

### **Phase 1: Quick Wins (Weeks 1-2)**
- **Risk: Low** | **Impact: High**
- Remove artificial delays and implement real caching
- Split mock data files by domain
- Standardize Suspense patterns
- Add basic API validation

### **Phase 2: Security & Architecture (Weeks 3-6)**  
- **Risk: Medium** | **Impact: High**
- Implement secure server actions framework
- Create service layer abstraction
- Begin data model unification
- Add authentication and rate limiting

### **Phase 3: Theme Simplification (Weeks 7-9)**
- **Risk: Medium** | **Impact: Medium**  
- Migrate to CSS-first theme system
- Unify provider architecture
- Reduce configuration complexity

### **Phase 4: Data Layer Completion (Weeks 10-24)**
- **Risk: High** | **Impact: High**
- Complete repository pattern implementation
- Migrate to unified data model
- Add database integration
- Enhance Nostr integration with validation

### **Risk Mitigation Strategies:**
- **Feature Flags:** Gradual rollout of new architecture
- **Backward Compatibility:** Maintain existing APIs during migration  
- **Comprehensive Testing:** Unit, integration, and performance tests
- **Monitoring:** Real-time error tracking and performance metrics
- **Rollback Plans:** Ability to revert changes if issues arise

### **Expected Outcomes:**
- **60-80% complexity reduction** across all identified areas
- **Improved security** with authentication and validation
- **Better performance** through real caching and optimization
- **Enhanced maintainability** with cleaner architecture
- **Scalability preparation** for production deployment

This plan provides a clear roadmap for addressing each complexity while maintaining full functionality and providing a path to production-ready architecture.