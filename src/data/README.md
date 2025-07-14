# Course, Document, and Video Data Model

This document explains the comprehensive content data model for the no.school platform, which separates database metadata from Nostr content according to the specified architecture. The platform supports three main content types: **Courses**, **Documents**, and **Videos** with a rich library of **50+ educational resources** covering Bitcoin, Lightning Network, Nostr, and modern web development.

## Architecture Overview

The content data model is split into two main components:

1. **Database Models** - Lightweight metadata stored in the database
2. **Nostr Events** - Actual content stored on the Nostr network

### Database Models (Metadata Only)

The database stores only essential metadata needed for indexing, search, and UI display:

#### Course Models
- `DbCourse` - Course metadata (title, description, pricing, instructor info, Nostr references)
- `DbLesson` - Lesson metadata (title, description, duration, pricing, Nostr references)
- `CourseEnrollment` - User enrollment tracking
- `LessonProgress` - User progress tracking

#### Document Models
- `DbDocument` - Document metadata (title, description, type, difficulty, pricing, Nostr references)
- `DocumentView` - User view tracking

#### Video Models  
- `DbVideo` - Video metadata (title, description, duration, difficulty, pricing, Nostr references)
- `VideoView` - User view tracking and progress

### Nostr Events (Content)

The actual content is stored on Nostr using established NIPs:

- **NIP-51 Lists** - Courses as ordered lists of lessons
- **NIP-23 Events** - Free content (lessons, documents, videos) as long-form content
- **NIP-99 Events** - Paid content as classified listings

## Data Flow

```
Database (Metadata) ←→ Nostr (Content)
       ↓                      ↓
   Content Info           Content Events
   User Progress          Real-time Content
   View Tracking          Decentralized Storage
```

## Content Types

### Courses (5 items)
Structured learning paths with multiple lessons, designed for comprehensive education:
- **Bitcoin Development Fundamentals** - Core concepts and practical implementation
- **Lightning Network Development** - Channel management and routing protocols
- **Nostr Protocol Development** - Building decentralized applications
- **Frontend Development for Bitcoin** - React applications with Bitcoin integration
- **Lightning Network API Integration** - RESTful APIs and payment processing

### Documents (20 items)
Reference materials, guides, cheatsheets, and documentation for quick lookup and learning:
- **Bitcoin**: Script programming, API reference, node setup, security checklists
- **Lightning**: Implementation guides, routing algorithms, command references
- **Nostr**: Protocol fundamentals, client building, NIPs comprehensive reference
- **Frontend**: React optimization, CSS Grid mastery, JavaScript ES2024 features
- **Backend**: Node.js security, database design patterns, microservices architecture
- **Mobile**: React Native wallets, state management, iOS development
- **Security**: Cryptographic key management, testing frameworks, vulnerability assessments
- **Web3**: Smart contract security, DeFi protocols, blockchain integration

### Videos (25 items)
Visual learning content including tutorials, explanations, and demonstrations:
- **Bitcoin Development**: Transaction deep dives, script programming, mining pool setup
- **Lightning Network**: Channel lifecycle, routing explained, LND development
- **Nostr Protocol**: Fundamentals, client building, relay implementation
- **Frontend Development**: React performance optimization, modern CSS techniques
- **Backend Architecture**: API security, database design, microservices deployment
- **Mobile Development**: Bitcoin wallet creation, Flutter/Riverpod patterns
- **Security Practices**: Key management, penetration testing, security auditing
- **Web3 Integration**: Smart contract auditing, DeFi protocol development

## Usage Examples

### Working with Course Data

```typescript
import { 
  dbCoursesMockData, 
  dbLessonsMockData, 
  coursesWithLessons,
  getCourseById,
  getLessonsByCourseId 
} from '@/data'

// Get all courses
const allCourses = dbCoursesMockData

// Get a specific course
const course = getCourseById('course-1')

// Get course with lessons
const courseWithLessons = coursesWithLessons.find(c => c.id === 'course-1')

// Get lessons for a course
const lessons = getLessonsByCourseId('course-1')
```

### Working with Document Data

```typescript
import { 
  dbDocumentsMockData,
  getDocumentById,
  getDocumentsByCategory,
  getFreeDocuments,
  getPaidDocuments
} from '@/data'

// Get all documents
const allDocuments = dbDocumentsMockData

// Get a specific document
const document = getDocumentById('doc-1')

// Get documents by category
const bitcoinDocs = getDocumentsByCategory('bitcoin')

// Get free/paid documents
const freeDocs = getFreeDocuments()
const paidDocs = getPaidDocuments()
```

### Working with Video Data

```typescript
import { 
  dbVideosMockData,
  getVideoById,
  getVideosByCategory,
  getFreeVideos,
  getPaidVideos
} from '@/data'

// Get all videos
const allVideos = dbVideosMockData

// Get a specific video
const video = getVideoById('video-1')

// Get videos by category
const lightningVideos = getVideosByCategory('lightning')

// Get free/paid videos
const freeVideos = getFreeVideos()
const paidVideos = getPaidVideos()
```

### Working with Nostr Data

```typescript
import { 
  nostrCourseListEvents,
  nostrFreeLessonEvents,
  nostrPaidLessonEvents,
  nostrFreeDocumentEvents,
  nostrPaidDocumentEvents,
  nostrFreeVideoEvents,
  nostrPaidVideoEvents,
  parseCourseListEvent,
  parseLessonEvent,
  parseDocumentEvent,
  parseVideoEvent
} from '@/data'

// Get Nostr events
const courseListEvents = nostrCourseListEvents
const documentEvents = nostrFreeDocumentEvents
const videoEvents = nostrFreeVideoEvents

// Parse events to database format
const courseMetadata = parseCourseListEvent(courseListEvents[0])
const documentMetadata = parseDocumentEvent(documentEvents[0])
const videoMetadata = parseVideoEvent(videoEvents[0])
```

### Filtering and Sorting

```typescript
import { 
  filterCourses, 
  filterDocuments,
  filterVideos,
  sortCourses, 
  getCoursesByCategory,
  getDocumentsByCategory,
  getVideosByCategory
} from '@/data'

// Filter courses
const frontendCourses = filterCourses(dbCoursesMockData, { 
  category: 'frontend',
  isPremium: false 
})

// Filter documents
const bitcoinCheatsheets = filterDocuments(dbDocumentsMockData, {
  category: 'bitcoin',
  type: 'cheatsheet',
  difficulty: 'intermediate'
})

// Filter videos
const beginnerVideos = filterVideos(dbVideosMockData, {
  difficulty: 'beginner',
  isPremium: false
})

// Sort courses by rating
const topRatedCourses = sortCourses(dbCoursesMockData, 'rating', 'desc')

// Get content by category
const lightningCourses = getCoursesByCategory('lightning')
const nostrDocs = getDocumentsByCategory('nostr')
const securityVideos = getVideosByCategory('security')
```

### Mixed Content Operations

```typescript
import { 
  getContentItems,
  getContentByType,
  searchContent,
  getTrendingContent
} from '@/data'

// Get all content types mixed together
const allContent = await getContentItems()

// Get content by specific type
const allDocuments = await getContentByType('document', {
  category: 'bitcoin',
  isPremium: false
})

// Search across all content
const searchResults = await searchContent('lightning', 'video', 'lightning')

// Get trending content
const trending = await getTrendingContent(10)
```

### Content Statistics

```typescript
import { getContentStats, getCourseStatistics } from '@/data'

// Get comprehensive content statistics
const stats = await getContentStats()
console.log(stats)
// {
//   totalCourses: 5,
//   totalDocuments: 4,
//   totalVideos: 4,
//   totalUsers: 3596,
//   averageRating: 4.8,
//   topCategories: [...]
// }

// Get course-specific statistics
const courseStats = getCourseStatistics(dbCoursesMockData)
```

## Data Structure Details

### Database Models

#### DbCourse
```typescript
interface DbCourse {
  id: string                    // Unique course ID (e.g., "course-1")
  title: string                 // Course title
  description: string           // Course description
  category: string              // Course category
  instructor: string            // Instructor name
  instructorPubkey: string      // Instructor's Nostr pubkey
  rating: number                // Course rating (0-5)
  enrollmentCount: number       // Number of enrolled students
  isPremium: boolean            // Whether course is paid
  price?: number                // Course price in sats
  currency?: string             // Currency (default: 'sats')
  image?: string                // Course image URL
  courseListEventId: string     // NIP-51 list event ID
  courseListNaddr: string       // NIP-19 naddr for course list
  published: boolean            // Whether course is published
  createdAt: string             // Creation timestamp
  updatedAt: string             // Update timestamp
}
```

#### DbDocument
```typescript
interface DbDocument {
  id: string                    // Unique document ID (e.g., "doc-1")
  title: string                 // Document title
  description: string           // Document description
  category: string              // Document category
  type: 'guide' | 'cheatsheet' | 'reference' | 'tutorial' | 'documentation'
  instructor: string            // Author name
  instructorPubkey: string      // Author's Nostr pubkey
  rating: number                // Document rating (0-5)
  viewCount: number             // Number of views
  isPremium: boolean            // Whether document is paid
  price?: number                // Document price in sats
  currency?: string             // Currency (default: 'sats')
  image?: string                // Document image URL
  tags: string[]                // Document tags
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  documentEventId: string       // NIP-23/99 event ID
  documentNaddr: string         // NIP-19 naddr for document
  published: boolean            // Whether document is published
  createdAt: string             // Creation timestamp
  updatedAt: string             // Update timestamp
}
```

#### DbVideo
```typescript
interface DbVideo {
  id: string                    // Unique video ID (e.g., "video-1")
  title: string                 // Video title
  description: string           // Video description
  category: string              // Video category
  instructor: string            // Instructor name
  instructorPubkey: string      // Instructor's Nostr pubkey
  duration: string              // Video duration (e.g., "25:30")
  rating: number                // Video rating (0-5)
  viewCount: number             // Number of views
  isPremium: boolean            // Whether video is paid
  price?: number                // Video price in sats
  currency?: string             // Currency (default: 'sats')
  thumbnailUrl?: string         // Video thumbnail URL
  videoUrl?: string             // Video file URL
  tags: string[]                // Video tags
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  videoEventId: string          // NIP-23/99 event ID
  videoNaddr: string            // NIP-19 naddr for video
  published: boolean            // Whether video is published
  createdAt: string             // Creation timestamp
  updatedAt: string             // Update timestamp
}
```

### Nostr Events

#### Course List Event (NIP-51)
```typescript
interface NostrCourseListEvent {
  id: string                    // Event ID
  pubkey: string                // Instructor pubkey
  created_at: number            // Unix timestamp
  kind: 30001                   // NIP-51 list kind
  content: string               // Empty for lists
  tags: string[][]              // Course metadata and lesson references
  sig: string                   // Event signature
}
```

#### Free Content Events (NIP-23)
```typescript
interface NostrFreeContentEvent {
  id: string                    // Event ID
  pubkey: string                // Author pubkey
  created_at: number            // Unix timestamp
  kind: 30023                   // NIP-23 long-form content
  content: string               // Content (Markdown)
  tags: string[][]              // Content metadata
  sig: string                   // Event signature
}
```

#### Paid Content Events (NIP-99)
```typescript
interface NostrPaidContentEvent {
  id: string                    // Event ID
  pubkey: string                // Author pubkey
  created_at: number            // Unix timestamp
  kind: 30402                   // NIP-99 classified listing
  content: string               // Content (Markdown)
  tags: string[][]              // Content metadata + pricing
  sig: string                   // Event signature
}
```

## Tag Structure

### Course List Event Tags
- `["d", "course-identifier"]` - Course identifier
- `["title", "Course Title"]` - Course title
- `["description", "Course description"]` - Course description
- `["image", "image-url"]` - Course image
- `["published_at", "timestamp"]` - Publication timestamp
- `["price", "amount", "currency"]` - Course price (if paid)
- `["l", "category"]` - Course category
- `["t", "tag"]` - Course tags/topics
- `["a", "kind:pubkey:identifier"]` - Lesson references

### Document Event Tags
- `["d", "document-identifier"]` - Document identifier
- `["title", "Document Title"]` - Document title
- `["summary", "Document description"]` - Document description
- `["published_at", "timestamp"]` - Publication timestamp
- `["price", "amount", "currency"]` - Document price (if paid)
- `["t", "tag"]` - Document tags/topics
- `["image", "image-url"]` - Document image (optional)

### Video Event Tags
- `["d", "video-identifier"]` - Video identifier
- `["title", "Video Title"]` - Video title
- `["summary", "Video description"]` - Video description
- `["duration", "25:30"]` - Video duration
- `["published_at", "timestamp"]` - Publication timestamp
- `["price", "amount", "currency"]` - Video price (if paid)
- `["t", "tag"]` - Video tags/topics
- `["r", "video-url"]` - Video file URL
- `["image", "thumbnail-url"]` - Video thumbnail

## Mock Data Available

### Database Mock Data
- `dbCoursesMockData` - 5 comprehensive courses (Bitcoin/Lightning/Nostr focused)
- `dbLessonsMockData` - 8 detailed lessons (mix of free/paid content)
- `dbDocumentsMockData` - 20 comprehensive documents (guides, cheatsheets, API references, tutorials)
- `dbVideosMockData` - 25 educational videos (tutorials, deep dives, explanations)
- `coursesWithLessons` - Combined course and lesson data with full relationships

### Nostr Mock Data
- `nostrCourseListEvents` - 2 sample course list events
- `nostrFreeLessonEvents` - 2 sample free lesson events
- `nostrPaidLessonEvents` - 1 sample paid lesson event
- `nostrFreeDocumentEvents` - 2 sample free document events
- `nostrPaidDocumentEvents` - 1 sample paid document event
- `nostrFreeVideoEvents` - 2 sample free video events
- `nostrPaidVideoEvents` - 1 sample paid video event

### Combined Data
- `nostrCourseData` - Combined course list + lesson events
- `nostrDocumentData` - Document events wrapped for consistency
- `nostrVideoData` - Video events wrapped for consistency

## Utility Functions

### Data Parsing
- `parseCourseListEvent()` - Parse NIP-51 event to database format
- `parseLessonEvent()` - Parse NIP-23/99 lesson event to database format
- `parseDocumentEvent()` - Parse NIP-23/99 document event to database format
- `parseVideoEvent()` - Parse NIP-23/99 video event to database format
- `extractLessonReferences()` - Extract lesson refs from course list

### Data Generation
- `generateCourseListEvent()` - Create NIP-51 event from course data
- `generateLessonEvent()` - Create NIP-23/99 event from lesson data
- `generateDocumentEvent()` - Create NIP-23/99 event from document data
- `generateVideoEvent()` - Create NIP-23/99 event from video data
- `generateNaddr()` - Generate NIP-19 naddr identifier
- `parseNaddr()` - Parse NIP-19 naddr identifier

### Data Validation
- `validateCourseData()` - Validate course data before publishing
- `validateDocumentData()` - Validate document data before publishing
- `validateVideoData()` - Validate video data before publishing
- `calculateCourseDuration()` - Calculate total course duration

### Data Filtering
- `filterCourses()` - Filter courses by criteria
- `filterDocuments()` - Filter documents by criteria  
- `filterVideos()` - Filter videos by criteria
- `sortCourses()` - Sort courses by various fields
- `getCoursesByCategory()` - Get courses by category
- `getDocumentsByCategory()` - Get documents by category
- `getVideosByCategory()` - Get videos by category
- `getFreeLessons()` / `getPaidLessons()` - Filter lessons by type
- `getFreeDocuments()` / `getPaidDocuments()` - Filter documents by type
- `getFreeVideos()` / `getPaidVideos()` - Filter videos by type

### Data Retrieval
- `getCourseById()` - Get course by ID
- `getDocumentById()` - Get document by ID
- `getVideoById()` - Get video by ID
- `getLessonById()` - Get lesson by ID
- `getLessonsByCourseId()` - Get lessons for a course
- `getNostrCourseByListEventId()` - Get Nostr course by event ID
- `getNostrDocumentByEventId()` - Get Nostr document by event ID
- `getNostrVideoByEventId()` - Get Nostr video by event ID

### Content Operations
- `getContentItems()` - Get all content types as unified list
- `getContentByType()` - Get content filtered by type and criteria
- `searchContent()` - Search across all content types
- `getTrendingContent()` - Get trending content by algorithm
- `getContentStats()` - Get comprehensive content statistics

## Content Categories

The platform supports the following content categories:

- **bitcoin** - Core Bitcoin protocol, development, and concepts
- **lightning** - Lightning Network development and integration
- **nostr** - Nostr protocol development and applications  
- **frontend** - Frontend development (React, JavaScript, UI/UX)
- **backend** - Backend development and infrastructure
- **mobile** - Mobile app development
- **security** - Security best practices and implementations
- **web3** - Decentralized web and blockchain technologies

## Content Difficulty Levels

- **beginner** - No prior knowledge required
- **intermediate** - Some experience expected
- **advanced** - Significant expertise required

## Content Types

### Document Types
- **guide** - Step-by-step instructional content
- **cheatsheet** - Quick reference materials
- **reference** - Comprehensive documentation
- **tutorial** - Hands-on learning content  
- **documentation** - Technical documentation

### Video Types
All videos use the same base structure but can be categorized by:
- Duration (short/medium/long)
- Format (tutorial/explanation/demonstration)
- Interactivity (follow-along/watch-only)

## Best Practices

1. **Always validate data** before creating Nostr events
2. **Use utility functions** for consistent data handling
3. **Keep database models lightweight** - only essential metadata
4. **Store content on Nostr** for decentralization and censorship resistance
5. **Use proper NIP identifiers** for cross-platform compatibility
6. **Handle both free and paid content** appropriately
7. **Maintain proper relationships** through references
8. **Implement proper tagging** for discoverability
9. **Use appropriate difficulty levels** for content
10. **Follow category conventions** for consistency

## Integration Points

This data model integrates with:
- **Database layer** for metadata storage and search
- **Nostr relays** for content distribution  
- **UI components** for display and interaction
- **Payment systems** for paid content access
- **Search and filtering** for content discovery
- **Analytics** for view tracking and statistics
- **Recommendation engine** for content suggestions

The architecture provides a clean separation between metadata and content while maintaining the flexibility to support comprehensive educational content across multiple formats on a decentralized platform. 