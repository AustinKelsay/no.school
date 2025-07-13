import { 
  Code, 
  Palette, 
  Zap, 
  Database, 
  Smartphone, 
  Globe, 
  Video, 
  FileText, 
  Shield,
  type LucideIcon 
} from "lucide-react"
import type { 
  Course, 
  ContentItem, 
  MockCourse, 
  MockVideo, 
  MockDocument, 
  CourseStats,
  DbCourse,
  DbLesson,
  DbDocument,
  DbVideo,
  NostrCourseListEvent,
  NostrFreeLessonEvent,
  NostrPaidLessonEvent,
  NostrFreeDocumentEvent,
  NostrPaidDocumentEvent,
  NostrFreeVideoEvent,
  NostrPaidVideoEvent,
  NostrCourseData,
  NostrDocumentData,
  NostrVideoData,
  CourseWithLessons
} from "./types"

/**
 * Centralized mock data for the application
 * Single source of truth for all content to eliminate duplication
 */

/**
 * Core content data - single source of truth
 * Contains all information needed for different views and contexts
 */
interface CoreContentItem {
  id: number
  title: string
  shortDescription: string
  fullDescription: string
  type: 'course' | 'video' | 'document' | 'guide' | 'cheatsheet'
  category: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  instructor: string
  rating: number
  isPremium: boolean
  createdAt: string
  
  // Course-specific data
  lessons?: Array<{
    id: number
    title: string
    duration: string
    completed: boolean
  }>
  enrollmentCount?: number
  
  // Video-specific data
  videoUrl?: string
  
  // Document-specific data
  documentType?: 'cheatsheet' | 'guide' | 'cookbook' | 'checklist' | 'reference'
  
  // UI theming (for homepage cards)
  icon?: LucideIcon
  gradient?: string
}

/**
 * Single source of truth for all content
 */
const coreContentData: CoreContentItem[] = [
  // Courses
  {
    id: 1,
    title: "PlebDevs Starter",
    shortDescription: "Get started with the fundamentals",
    fullDescription: "Get started with the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for absolute beginners.",
    type: "course",
    category: "beginner",
    tags: ["fundamentals", "beginner", "html", "css", "javascript", "web-development"],
    difficulty: "beginner",
    duration: "4 hours",
    instructor: "Sarah Chen",
    rating: 4.9,
    isPremium: false,
    createdAt: "2024-01-15",
    icon: Code,
    gradient: "from-blue-500/20 to-purple-500/20",
    enrollmentCount: 1247,
    lessons: [
      { id: 1, title: "HTML Basics", duration: "30 min", completed: false },
      { id: 2, title: "CSS Fundamentals", duration: "45 min", completed: false },
      { id: 3, title: "JavaScript Introduction", duration: "60 min", completed: false },
      { id: 4, title: "Building Your First Website", duration: "90 min", completed: false }
    ]
  },
  {
    id: 2,
    title: "Frontend Course",
    shortDescription: "Build beautiful user interfaces",
    fullDescription: "Build beautiful user interfaces with modern frameworks and best practices. Learn React, TypeScript, and modern tooling.",
    type: "course",
    category: "frontend",
    tags: ["frontend", "react", "typescript", "ui", "design", "modern"],
    difficulty: "intermediate",
    duration: "8 hours",
    instructor: "Emma Style",
    rating: 4.8,
    isPremium: false,
    createdAt: "2024-01-20",
    icon: Palette,
    gradient: "from-green-500/20 to-blue-500/20",
    enrollmentCount: 892,
    lessons: [
      { id: 5, title: "React Fundamentals", duration: "90 min", completed: false },
      { id: 6, title: "Component Patterns", duration: "60 min", completed: false },
      { id: 7, title: "State Management", duration: "75 min", completed: false },
      { id: 8, title: "TypeScript Integration", duration: "45 min", completed: false },
      { id: 9, title: "Testing React Apps", duration: "60 min", completed: false }
    ]
  },
  {
    id: 3,
    title: "Backend Course",
    shortDescription: "Master server-side development",
    fullDescription: "Master server-side development with Node.js, databases, and APIs. Build scalable backend applications.",
    type: "course",
    category: "backend",
    tags: ["backend", "nodejs", "api", "database", "server", "scalable"],
    difficulty: "intermediate",
    duration: "10 hours",
    instructor: "Mike Rodriguez",
    rating: 4.7,
    isPremium: true,
    createdAt: "2024-01-22",
    icon: Zap,
    gradient: "from-yellow-500/20 to-red-500/20",
    enrollmentCount: 634,
    lessons: [
      { id: 10, title: "Node.js Fundamentals", duration: "75 min", completed: false },
      { id: 11, title: "Express.js Framework", duration: "90 min", completed: false },
      { id: 12, title: "Database Integration", duration: "60 min", completed: false },
      { id: 13, title: "API Development", duration: "75 min", completed: false },
      { id: 14, title: "Authentication & Authorization", duration: "60 min", completed: false },
      { id: 15, title: "Deployment & DevOps", duration: "45 min", completed: false }
    ]
  },
  {
    id: 4,
    title: "Database Design",
    shortDescription: "Learn to design efficient databases",
    fullDescription: "Learn to design efficient and scalable database systems. Cover SQL, NoSQL, and optimization techniques.",
    type: "course",
    category: "database",
    tags: ["database", "sql", "nosql", "optimization", "backend", "performance"],
    difficulty: "intermediate",
    duration: "6 hours",
    instructor: "Carlos Data",
    rating: 4.6,
    isPremium: false,
    createdAt: "2024-01-25",
    icon: Database,
    gradient: "from-purple-500/20 to-pink-500/20",
    enrollmentCount: 445,
    lessons: [
      { id: 16, title: "Database Fundamentals", duration: "45 min", completed: false },
      { id: 17, title: "SQL Mastery", duration: "90 min", completed: false },
      { id: 18, title: "NoSQL Databases", duration: "60 min", completed: false },
      { id: 19, title: "Query Optimization", duration: "75 min", completed: false },
      { id: 20, title: "Database Security", duration: "30 min", completed: false }
    ]
  },
  {
    id: 5,
    title: "Mobile Development",
    shortDescription: "Build apps for iOS and Android",
    fullDescription: "Build apps for iOS and Android using React Native. Learn cross-platform development.",
    type: "course",
    category: "mobile",
    tags: ["mobile", "react-native", "ios", "android", "app", "cross-platform"],
    difficulty: "advanced",
    duration: "12 hours",
    instructor: "Anna Mobile",
    rating: 4.9,
    isPremium: true,
    createdAt: "2024-01-28",
    icon: Smartphone,
    gradient: "from-orange-500/20 to-red-500/20",
    enrollmentCount: 378,
    lessons: [
      { id: 21, title: "React Native Setup", duration: "30 min", completed: false },
      { id: 22, title: "Core Components", duration: "60 min", completed: false },
      { id: 23, title: "Navigation", duration: "75 min", completed: false },
      { id: 24, title: "State Management", duration: "90 min", completed: false },
      { id: 25, title: "Native Features", duration: "60 min", completed: false },
      { id: 26, title: "Publishing Apps", duration: "45 min", completed: false }
    ]
  },
  {
    id: 6,
    title: "Web3 Development",
    shortDescription: "Build decentralized applications",
    fullDescription: "Build decentralized applications on blockchain networks. Learn Solidity, smart contracts, and dApp development.",
    type: "course",
    category: "web3",
    tags: ["web3", "blockchain", "smart-contracts", "solidity", "dapp", "crypto"],
    difficulty: "advanced",
    duration: "15 hours",
    instructor: "David Chain",
    rating: 4.8,
    isPremium: true,
    createdAt: "2024-02-01",
    icon: Globe,
    gradient: "from-indigo-500/20 to-purple-500/20",
    enrollmentCount: 256,
    lessons: [
      { id: 27, title: "Blockchain Basics", duration: "60 min", completed: false },
      { id: 28, title: "Solidity Programming", duration: "120 min", completed: false },
      { id: 29, title: "Smart Contracts", duration: "90 min", completed: false },
      { id: 30, title: "DApp Development", duration: "105 min", completed: false },
      { id: 31, title: "Web3 Integration", duration: "75 min", completed: false },
      { id: 32, title: "DeFi Protocols", duration: "60 min", completed: false }
    ]
  },
  {
    id: 7,
    title: "Lightning Development",
    shortDescription: "Master Lightning Network development",
    fullDescription: "Master Lightning Network development. Build payment applications and integrate Lightning into your projects.",
    type: "course",
    category: "lightning",
    tags: ["lightning", "bitcoin", "payments", "layer2", "development", "integration"],
    difficulty: "advanced",
    duration: "14 hours",
    instructor: "Jack Lightning",
    rating: 4.9,
    isPremium: true,
    createdAt: "2024-02-05",
    icon: Zap,
    gradient: "from-yellow-500/20 to-orange-500/20",
    enrollmentCount: 187,
    lessons: [
      { id: 33, title: "Lightning Network Basics", duration: "60 min", completed: false },
      { id: 34, title: "Channel Management", duration: "90 min", completed: false },
      { id: 35, title: "Payment Integration", duration: "75 min", completed: false },
      { id: 36, title: "Advanced Features", duration: "60 min", completed: false }
    ]
  },
  {
    id: 8,
    title: "Security Fundamentals",
    shortDescription: "Learn web security best practices",
    fullDescription: "Learn web security best practices, common vulnerabilities, and how to protect your applications.",
    type: "course",
    category: "security",
    tags: ["security", "vulnerabilities", "protection", "best-practices", "web-security"],
    difficulty: "intermediate",
    duration: "7 hours",
    instructor: "Alex Security",
    rating: 4.7,
    isPremium: false,
    createdAt: "2024-02-08",
    icon: Shield,
    gradient: "from-red-500/20 to-orange-500/20",
    enrollmentCount: 543,
    lessons: [
      { id: 37, title: "Security Basics", duration: "45 min", completed: false },
      { id: 38, title: "Common Vulnerabilities", duration: "60 min", completed: false },
      { id: 39, title: "Protection Strategies", duration: "75 min", completed: false }
    ]
  },

  // Videos
  {
    id: 9,
    title: "Lightning Network Basics",
    shortDescription: "Understanding the Lightning Network",
    fullDescription: "Understanding the Lightning Network and its applications in modern payment systems.",
    type: "video",
    category: "lightning",
    tags: ["lightning", "bitcoin", "payments", "layer2", "basics"],
    difficulty: "beginner",
    duration: "15:23",
    instructor: "Jack Lightning",
    rating: 4.8,
    isPremium: false,
    createdAt: "2024-01-10",
    icon: Video,
    gradient: "from-yellow-500/20 to-orange-500/20"
  },
  {
    id: 10,
    title: "React Fundamentals",
    shortDescription: "Learn React from scratch",
    fullDescription: "Learn React from scratch with practical examples and best practices.",
    type: "video",
    category: "frontend",
    tags: ["react", "javascript", "frontend", "components", "hooks"],
    difficulty: "beginner",
    duration: "22:15",
    instructor: "Emma Style",
    rating: 4.9,
    isPremium: false,
    createdAt: "2024-01-12",
    icon: Video,
    gradient: "from-blue-500/20 to-cyan-500/20"
  },
  {
    id: 11,
    title: "Node.js Crash Course",
    shortDescription: "Backend development with Node.js",
    fullDescription: "Backend development with Node.js - from basics to building APIs.",
    type: "video",
    category: "backend",
    tags: ["nodejs", "backend", "api", "javascript", "server"],
    difficulty: "intermediate",
    duration: "18:45",
    instructor: "Mike Rodriguez",
    rating: 4.7,
    isPremium: false,
    createdAt: "2024-01-14",
    icon: Video,
    gradient: "from-green-500/20 to-emerald-500/20"
  },
  {
    id: 12,
    title: "CSS Grid Mastery",
    shortDescription: "Advanced CSS layout techniques",
    fullDescription: "Advanced CSS layout techniques using CSS Grid for responsive design.",
    type: "video",
    category: "frontend",
    tags: ["css", "grid", "layout", "responsive", "frontend"],
    difficulty: "intermediate",
    duration: "12:30",
    instructor: "Emma Style",
    rating: 4.6,
    isPremium: false,
    createdAt: "2024-01-16",
    icon: Video,
    gradient: "from-pink-500/20 to-rose-500/20"
  },
  {
    id: 13,
    title: "API Development Best Practices",
    shortDescription: "Building RESTful APIs",
    fullDescription: "Building RESTful APIs with security, performance, and scalability in mind.",
    type: "video",
    category: "backend",
    tags: ["api", "rest", "backend", "security", "performance"],
    difficulty: "intermediate",
    duration: "25:10",
    instructor: "Mike Rodriguez",
    rating: 4.8,
    isPremium: true,
    createdAt: "2024-01-18",
    icon: Video,
    gradient: "from-purple-500/20 to-violet-500/20"
  },
  {
    id: 14,
    title: "TypeScript Deep Dive",
    shortDescription: "Advanced TypeScript features",
    fullDescription: "Advanced TypeScript features and patterns for large-scale applications.",
    type: "video",
    category: "frontend",
    tags: ["typescript", "advanced", "patterns", "frontend", "types"],
    difficulty: "advanced",
    duration: "28:40",
    instructor: "Emma Style",
    rating: 4.9,
    isPremium: true,
    createdAt: "2024-01-20",
    icon: Video,
    gradient: "from-indigo-500/20 to-purple-500/20"
  },
  {
    id: 15,
    title: "Rust for Beginners",
    shortDescription: "Introduction to Rust programming",
    fullDescription: "Introduction to Rust programming language and its unique features.",
    type: "video",
    category: "systems",
    tags: ["rust", "systems", "memory-safety", "performance", "beginner"],
    difficulty: "beginner",
    duration: "20:15",
    instructor: "Ryan Rust",
    rating: 4.7,
    isPremium: false,
    createdAt: "2024-01-22",
    icon: Video,
    gradient: "from-orange-500/20 to-red-500/20"
  },
  {
    id: 16,
    title: "Web3 Wallet Integration",
    shortDescription: "Integrating Web3 wallets",
    fullDescription: "How to integrate Web3 wallets into your decentralized applications.",
    type: "video",
    category: "web3",
    tags: ["web3", "wallet", "integration", "dapp", "blockchain"],
    difficulty: "advanced",
    duration: "19:30",
    instructor: "David Chain",
    rating: 4.8,
    isPremium: true,
    createdAt: "2024-01-24",
    icon: Video,
    gradient: "from-indigo-500/20 to-purple-500/20"
  },

  // Documents
  {
    id: 17,
    title: "JavaScript Cheatsheet",
    shortDescription: "Quick reference for JavaScript",
    fullDescription: "Quick reference for JavaScript syntax, methods, and best practices.",
    type: "cheatsheet",
    category: "frontend",
    tags: ["javascript", "reference", "syntax", "methods", "cheatsheet"],
    difficulty: "beginner",
    duration: "",
    instructor: "Sarah Chen",
    rating: 4.8,
    isPremium: false,
    createdAt: "2024-01-05",
    icon: FileText,
    gradient: "from-yellow-500/20 to-amber-500/20",
    documentType: "cheatsheet"
  },
  {
    id: 18,
    title: "React Hooks Guide",
    shortDescription: "Comprehensive guide to React hooks",
    fullDescription: "Comprehensive guide to React hooks with examples and use cases.",
    type: "guide",
    category: "frontend",
    tags: ["react", "hooks", "guide", "examples", "patterns"],
    difficulty: "intermediate",
    duration: "",
    instructor: "Emma Style",
    rating: 4.9,
    isPremium: false,
    createdAt: "2024-01-08",
    icon: FileText,
    gradient: "from-blue-500/20 to-sky-500/20",
    documentType: "guide"
  },
  {
    id: 19,
    title: "Git Command Reference",
    shortDescription: "Essential Git commands",
    fullDescription: "Essential Git commands every developer should know.",
    type: "cheatsheet",
    category: "tools",
    tags: ["git", "commands", "version-control", "reference", "tools"],
    difficulty: "beginner",
    duration: "",
    instructor: "Dev Tools",
    rating: 4.7,
    isPremium: false,
    createdAt: "2024-01-03",
    icon: FileText,
    gradient: "from-gray-500/20 to-slate-500/20",
    documentType: "reference"
  },
  {
    id: 20,
    title: "CSS Flexbox Guide",
    shortDescription: "Master CSS Flexbox layout",
    fullDescription: "Master CSS Flexbox layout with practical examples and patterns.",
    type: "guide",
    category: "frontend",
    tags: ["css", "flexbox", "layout", "responsive", "guide"],
    difficulty: "beginner",
    duration: "",
    instructor: "Emma Style",
    rating: 4.6,
    isPremium: false,
    createdAt: "2024-01-06",
    icon: FileText,
    gradient: "from-green-500/20 to-teal-500/20",
    documentType: "guide"
  },
  {
    id: 21,
    title: "Security Best Practices",
    shortDescription: "Web security essentials",
    fullDescription: "Web security essentials and common vulnerability prevention.",
    type: "guide",
    category: "security",
    tags: ["security", "vulnerabilities", "best-practices", "web-security"],
    difficulty: "intermediate",
    duration: "",
    instructor: "Alex Security",
    rating: 4.8,
    isPremium: false,
    createdAt: "2024-01-09",
    icon: Shield,
    gradient: "from-red-500/20 to-orange-500/20",
    documentType: "guide"
  },
  {
    id: 22,
    title: "Lightning Network Cheatsheet",
    shortDescription: "Quick reference for Lightning Network",
    fullDescription: "Quick reference for Lightning Network concepts and commands.",
    type: "cheatsheet",
    category: "lightning",
    tags: ["lightning", "bitcoin", "payments", "reference", "cheatsheet"],
    difficulty: "intermediate",
    duration: "",
    instructor: "Jack Lightning",
    rating: 4.7,
    isPremium: false,
    createdAt: "2024-01-11",
    icon: FileText,
    gradient: "from-yellow-500/20 to-orange-500/20",
    documentType: "cheatsheet"
  },
  {
    id: 23,
    title: "Node.js Performance Guide",
    shortDescription: "Optimizing Node.js applications",
    fullDescription: "Optimizing Node.js applications for better performance and scalability.",
    type: "guide",
    category: "backend",
    tags: ["nodejs", "performance", "optimization", "scalability", "backend"],
    difficulty: "advanced",
    duration: "",
    instructor: "Mike Rodriguez",
    rating: 4.9,
    isPremium: true,
    createdAt: "2024-01-13",
    icon: FileText,
    gradient: "from-green-500/20 to-emerald-500/20",
    documentType: "guide"
  },
  {
    id: 24,
    title: "Database Optimization Cookbook",
    shortDescription: "Database optimization recipes",
    fullDescription: "Recipes for optimizing database queries and improving performance.",
    type: "document",
    category: "database",
    tags: ["database", "optimization", "queries", "performance", "sql"],
    difficulty: "advanced",
    duration: "",
    instructor: "Carlos Data",
    rating: 4.8,
    isPremium: true,
    createdAt: "2024-01-17",
    icon: FileText,
    gradient: "from-purple-500/20 to-pink-500/20",
    documentType: "cookbook"
  },
  {
    id: 25,
    title: "Mobile App Testing Guide",
    shortDescription: "Testing mobile applications",
    fullDescription: "Comprehensive guide to testing mobile applications across platforms.",
    type: "guide",
    category: "mobile",
    tags: ["mobile", "testing", "quality-assurance", "platforms", "guide"],
    difficulty: "intermediate",
    duration: "",
    instructor: "Anna Mobile",
    rating: 4.7,
    isPremium: false,
    createdAt: "2024-01-19",
    icon: FileText,
    gradient: "from-orange-500/20 to-red-500/20",
    documentType: "guide"
  },
  {
    id: 26,
    title: "Web3 Security Checklist",
    shortDescription: "Web3 security considerations",
    fullDescription: "Essential security considerations for Web3 and DeFi applications.",
    type: "cheatsheet",
    category: "web3",
    tags: ["web3", "security", "defi", "checklist", "blockchain"],
    difficulty: "advanced",
    duration: "",
    instructor: "David Chain",
    rating: 4.9,
    isPremium: true,
    createdAt: "2024-01-21",
    icon: Shield,
    gradient: "from-indigo-500/20 to-purple-500/20",
    documentType: "checklist"
  },
  {
    id: 27,
    title: "TypeScript Configuration Guide",
    shortDescription: "TypeScript configuration for projects",
    fullDescription: "Complete guide to configuring TypeScript for different project types.",
    type: "guide",
    category: "frontend",
    tags: ["typescript", "configuration", "setup", "projects", "guide"],
    difficulty: "intermediate",
    duration: "",
    instructor: "Emma Style",
    rating: 4.6,
    isPremium: false,
    createdAt: "2024-01-23",
    icon: FileText,
    gradient: "from-blue-500/20 to-sky-500/20",
    documentType: "guide"
  },
  {
    id: 28,
    title: "Rust Ownership Cheatsheet",
    shortDescription: "Rust ownership and borrowing",
    fullDescription: "Quick reference for Rust ownership, borrowing, and lifetimes.",
    type: "cheatsheet",
    category: "systems",
    tags: ["rust", "ownership", "borrowing", "lifetimes", "memory"],
    difficulty: "intermediate",
    duration: "",
    instructor: "Ryan Rust",
    rating: 4.8,
    isPremium: false,
    createdAt: "2024-01-25",
    icon: FileText,
    gradient: "from-orange-500/20 to-red-500/20",
    documentType: "cheatsheet"
  }
]

/**
 * Transformation functions to generate different views from core data
 */

/**
 * Transform core data to ContentItem format for content pages
 */
function transformToContentItem(item: CoreContentItem): ContentItem {
  return {
    id: item.id,
    title: item.title,
    description: item.fullDescription,
    type: item.type,
    category: item.category,
    tags: item.tags,
    difficulty: item.difficulty,
    duration: item.duration,
    instructor: item.instructor,
    rating: item.rating,
    isPremium: item.isPremium,
    createdAt: item.createdAt
  }
}

/**
 * Transform core data to Course format for API responses
 */
function transformToCourse(item: CoreContentItem): Course {
  if (item.type !== 'course') {
    throw new Error('Cannot transform non-course item to Course type')
  }
  
  return {
    id: item.id,
    title: item.title,
    description: item.fullDescription,
    category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
    duration: item.duration,
    instructor: item.instructor,
    rating: item.rating,
    image: "/placeholder.svg",
    enrollmentCount: item.enrollmentCount || 0,
    createdAt: item.createdAt,
    lessons: item.lessons || []
  }
}

/**
 * Transform core data to MockCourse format for homepage cards
 */
function transformToMockCourse(item: CoreContentItem): MockCourse {
  if (item.type !== 'course') {
    throw new Error('Cannot transform non-course item to MockCourse type')
  }
  
  return {
    title: item.title,
    description: item.shortDescription,
    icon: item.icon || Code,
    gradient: item.gradient || "from-gray-500/20 to-slate-500/20"
  }
}

/**
 * Transform core data to MockVideo format for homepage cards
 */
function transformToMockVideo(item: CoreContentItem): MockVideo {
  if (item.type !== 'video') {
    throw new Error('Cannot transform non-video item to MockVideo type')
  }
  
  return {
    title: item.title,
    description: item.shortDescription,
    icon: item.icon || Video,
    gradient: item.gradient || "from-gray-500/20 to-slate-500/20",
    duration: item.duration
  }
}

/**
 * Transform core data to MockDocument format for homepage cards
 */
function transformToMockDocument(item: CoreContentItem): MockDocument {
  if (!['document', 'guide', 'cheatsheet'].includes(item.type)) {
    throw new Error('Cannot transform non-document item to MockDocument type')
  }
  
  return {
    title: item.title,
    description: item.shortDescription,
    icon: item.icon || FileText,
    gradient: item.gradient || "from-gray-500/20 to-slate-500/20",
    type: item.documentType || item.type
  }
}

/**
 * Exported data - transformed views from core data
 * These maintain the existing API for backward compatibility
 */

// All content items for content pages
export const mockContentItems: ContentItem[] = coreContentData.map(transformToContentItem)

// Course data for API responses
export const coursesDatabase: Course[] = coreContentData
  .filter(item => item.type === 'course')
  .map(transformToCourse)

// Homepage card data (legacy - kept for backward compatibility but not used)
export const mockCourses: MockCourse[] = coreContentData
  .filter(item => item.type === 'course')
  .map(transformToMockCourse)

export const mockVideos: MockVideo[] = coreContentData
  .filter(item => item.type === 'video')
  .map(transformToMockVideo)

export const mockDocuments: MockDocument[] = coreContentData
  .filter(item => ['document', 'guide', 'cheatsheet'].includes(item.type))
  .map(transformToMockDocument)

/**
 * Course statistics generated from core data
 */
export const courseStats: CourseStats = {
  totalCourses: coreContentData.length,
  totalStudents: coreContentData
    .filter(item => item.type === 'course')
    .reduce((sum, item) => sum + (item.enrollmentCount || 0), 0),
  averageRating: Number((coreContentData.reduce((sum, item) => sum + item.rating, 0) / coreContentData.length).toFixed(1)),
  completionRate: 78,
  topCategories: Object.entries(
    coreContentData.reduce((acc, item) => {
      const category = item.category.charAt(0).toUpperCase() + item.category.slice(1)
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7)
}

/**
 * DATABASE MOCK DATA
 * Course metadata stored in database
 */

export const dbCoursesMockData: DbCourse[] = [
  {
    id: "course-1",
    title: "Bitcoin Lightning Development Fundamentals",
    description: "Learn to build applications on the Lightning Network with hands-on projects and real-world examples.",
    category: "lightning",
    instructor: "Jack Lightning",
    instructorPubkey: "npub1jackl1ghtning4dev3l0p3r1234567890abcdef1234567890abcdef12345",
    rating: 4.9,
    enrollmentCount: 1247,
    isPremium: false,
    price: 0,
    currency: "sats",
    image: "/course-images/lightning-fundamentals.jpg",
    courseListEventId: "course-list-event-1",
    courseListNaddr: "naddr1qqxnzd3cxqmn2v3hxucrxwpnxqmnxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpn",
    published: true,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  },
  {
    id: "course-2",
    title: "Advanced React Development with Bitcoin Integration",
    description: "Master React development while building Bitcoin-enabled applications using modern web technologies.",
    category: "frontend",
    instructor: "Sarah Chen",
    instructorPubkey: "npub1sarahchen4dev3l0p3r1234567890abcdef1234567890abcdef12345",
    rating: 4.8,
    enrollmentCount: 892,
    isPremium: true,
    price: 50000,
    currency: "sats",
    image: "/course-images/react-bitcoin.jpg",
    courseListEventId: "course-list-event-2",
    courseListNaddr: "naddr1qqxnzd3cxqmn2v3hxucrxwpnxqmnxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpn",
    published: true,
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z"
  },
  {
    id: "course-3",
    title: "Nostr Protocol Development",
    description: "Build decentralized social applications using the Nostr protocol and Bitcoin Lightning payments.",
    category: "web3",
    instructor: "Mike Rodriguez",
    instructorPubkey: "npub1miker0driguez4dev3l0p3r1234567890abcdef1234567890abcdef12345",
    rating: 4.7,
    enrollmentCount: 634,
    isPremium: true,
    price: 75000,
    currency: "sats",
    image: "/course-images/nostr-development.jpg",
    courseListEventId: "course-list-event-3",
    courseListNaddr: "naddr1qqxnzd3cxqmn2v3hxucrxwpnxqmnxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpn",
    published: true,
    createdAt: "2024-01-22T00:00:00Z",
    updatedAt: "2024-01-22T00:00:00Z"
  },
  {
    id: "course-4",
    title: "Bitcoin Node Operations and Security",
    description: "Learn to run, secure, and optimize Bitcoin nodes for production environments.",
    category: "backend",
    instructor: "Emma Style",
    instructorPubkey: "npub1emmastyle4dev3l0p3r1234567890abcdef1234567890abcdef12345",
    rating: 4.6,
    enrollmentCount: 445,
    isPremium: false,
    price: 0,
    currency: "sats",
    image: "/course-images/bitcoin-node.jpg",
    courseListEventId: "course-list-event-4",
    courseListNaddr: "naddr1qqxnzd3cxqmn2v3hxucrxwpnxqmnxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpn",
    published: true,
    createdAt: "2024-01-25T00:00:00Z",
    updatedAt: "2024-01-25T00:00:00Z"
  },
  {
    id: "course-5",
    title: "Mobile Bitcoin Wallet Development",
    description: "Build secure Bitcoin wallets for iOS and Android using React Native and Lightning Network.",
    category: "mobile",
    instructor: "Anna Mobile",
    instructorPubkey: "npub1annamobile4dev3l0p3r1234567890abcdef1234567890abcdef12345",
    rating: 4.9,
    enrollmentCount: 378,
    isPremium: true,
    price: 100000,
    currency: "sats",
    image: "/course-images/mobile-wallet.jpg",
    courseListEventId: "course-list-event-5",
    courseListNaddr: "naddr1qqxnzd3cxqmn2v3hxucrxwpnxqmnxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpn",
    published: true,
    createdAt: "2024-01-28T00:00:00Z",
    updatedAt: "2024-01-28T00:00:00Z"
  }
]

export const dbLessonsMockData: DbLesson[] = [
  // Course 1 - Bitcoin Lightning Development Fundamentals (Free)
  {
    id: "lesson-1-1",
    courseId: "course-1",
    title: "Understanding the Lightning Network",
    description: "Introduction to Layer 2 scaling solutions and how Lightning Network works.",
    duration: "45 min",
    order: 1,
    isPremium: false,
    lessonEventId: "lesson-event-1-1",
    lessonNaddr: "naddr1qqxnzd3cxqmn2v3hxucrxwpnxqmnxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpn",
    published: true,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  },
  {
    id: "lesson-1-2",
    courseId: "course-1",
    title: "Setting Up Your Development Environment",
    description: "Configure your development environment for Lightning Network development.",
    duration: "30 min",
    order: 2,
    isPremium: false,
    lessonEventId: "lesson-event-1-2",
    lessonNaddr: "naddr1qqxnzd3cxqmn2v3hxucrxwpnxqmnxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpn",
    published: true,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  },
  {
    id: "lesson-1-3",
    courseId: "course-1",
    title: "Building Your First Lightning App",
    description: "Create a simple Lightning payment application from scratch.",
    duration: "60 min",
    order: 3,
    isPremium: false,
    lessonEventId: "lesson-event-1-3",
    lessonNaddr: "naddr1qqxnzd3cxqmn2v3hxucrxwpnxqmnxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpn",
    published: true,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  },
  // Course 2 - Advanced React Development with Bitcoin Integration (Paid)
  {
    id: "lesson-2-1",
    courseId: "course-2",
    title: "React Fundamentals for Bitcoin Apps",
    description: "Master React concepts essential for building Bitcoin applications.",
    duration: "90 min",
    order: 1,
    isPremium: true,
    price: 10000,
    currency: "sats",
    lessonEventId: "lesson-event-2-1",
    lessonNaddr: "naddr1qqxnzd3cxqmn2v3hxucrxwpnxqmnxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpn",
    published: true,
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z"
  },
  {
    id: "lesson-2-2",
    courseId: "course-2",
    title: "Bitcoin Payment Component Development",
    description: "Build reusable React components for Bitcoin payments and wallet integration.",
    duration: "75 min",
    order: 2,
    isPremium: true,
    price: 15000,
    currency: "sats",
    lessonEventId: "lesson-event-2-2",
    lessonNaddr: "naddr1qqxnzd3cxqmn2v3hxucrxwpnxqmnxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpn",
    published: true,
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z"
  },
  // Course 3 - Nostr Protocol Development (Paid)
  {
    id: "lesson-3-1",
    courseId: "course-3",
    title: "Nostr Protocol Fundamentals",
    description: "Deep dive into the Nostr protocol, NIPs, and event structure.",
    duration: "60 min",
    order: 1,
    isPremium: true,
    price: 20000,
    currency: "sats",
    lessonEventId: "lesson-event-3-1",
    lessonNaddr: "naddr1qqxnzd3cxqmn2v3hxucrxwpnxqmnxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpn",
    published: true,
    createdAt: "2024-01-22T00:00:00Z",
    updatedAt: "2024-01-22T00:00:00Z"
  },
  {
    id: "lesson-3-2",
    courseId: "course-3",
    title: "Building Nostr Clients",
    description: "Create your own Nostr client with relay communication and event handling.",
    duration: "90 min",
    order: 2,
    isPremium: true,
    price: 25000,
    currency: "sats",
    lessonEventId: "lesson-event-3-2",
    lessonNaddr: "naddr1qqxnzd3cxqmn2v3hxucrxwpnxqmnxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpn",
    published: true,
    createdAt: "2024-01-22T00:00:00Z",
    updatedAt: "2024-01-22T00:00:00Z"
  }
]

/**
 * DATABASE MOCK DATA FOR DOCUMENTS
 * Document metadata stored in database
 */

export const dbDocumentsMockData: DbDocument[] = [
  {
    id: "doc-1",
    title: "Bitcoin Development Cheatsheet",
    description: "Essential Bitcoin development commands, APIs, and best practices in one comprehensive reference.",
    category: "bitcoin",
    type: "cheatsheet",
    instructor: "Satoshi Dev",
    instructorPubkey: "npub1satoshidev4bitcoin1234567890abcdef1234567890abcdef12345",
    rating: 4.9,
    viewCount: 2847,
    isPremium: false,
    price: 0,
    currency: "sats",
    image: "/doc-images/bitcoin-cheatsheet.jpg",
    tags: ["bitcoin", "reference", "cheatsheet", "api", "development"],
    difficulty: "intermediate",
    documentEventId: "doc-event-1",
    documentNaddr: "naddr1qqxnzd3cxqmn2v3hxucrxwpnxqmnxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpn",
    published: true,
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z"
  },
  {
    id: "doc-2",
    title: "Lightning Network Integration Guide",
    description: "Step-by-step guide to integrating Lightning Network payments into your applications.",
    category: "lightning",
    type: "guide",
    instructor: "Alice Lightning",
    instructorPubkey: "npub1alicelightning4dev1234567890abcdef1234567890abcdef12345",
    rating: 4.8,
    viewCount: 1923,
    isPremium: true,
    price: 25000,
    currency: "sats",
    image: "/doc-images/lightning-guide.jpg",
    tags: ["lightning", "integration", "payments", "guide", "tutorial"],
    difficulty: "advanced",
    documentEventId: "doc-event-2",
    documentNaddr: "naddr1qqxnzd3cxqmn2v3hxucrxwpnxqmnxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpn",
    published: true,
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-01-12T00:00:00Z"
  },
  {
    id: "doc-3",
    title: "Nostr NIPs Reference",
    description: "Complete reference guide to Nostr Implementation Possibilities (NIPs) with examples.",
    category: "nostr",
    type: "reference",
    instructor: "Bob Nostr",
    instructorPubkey: "npub1bobnostr4protocol1234567890abcdef1234567890abcdef12345",
    rating: 4.7,
    viewCount: 1456,
    isPremium: false,
    price: 0,
    currency: "sats",
    image: "/doc-images/nostr-nips.jpg",
    tags: ["nostr", "nips", "protocol", "reference", "documentation"],
    difficulty: "intermediate",
    documentEventId: "doc-event-3",
    documentNaddr: "naddr1qqxnzd3cxqmn2v3hxucrxwpnxqmnxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpn",
    published: true,
    createdAt: "2024-01-14T00:00:00Z",
    updatedAt: "2024-01-14T00:00:00Z"
  },
  {
    id: "doc-4",
    title: "React Bitcoin Component Library",
    description: "Documentation for reusable React components for Bitcoin and Lightning applications.",
    category: "frontend",
    type: "documentation",
    instructor: "Carol React",
    instructorPubkey: "npub1carolreact4bitcoin1234567890abcdef1234567890abcdef12345",
    rating: 4.6,
    viewCount: 892,
    isPremium: true,
    price: 15000,
    currency: "sats",
    image: "/doc-images/react-components.jpg",
    tags: ["react", "bitcoin", "components", "frontend", "library"],
    difficulty: "intermediate",
    documentEventId: "doc-event-4",
    documentNaddr: "naddr1qqxnzd3cxqmn2v3hxucrxwpnxqmnxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpn",
    published: true,
    createdAt: "2024-01-16T00:00:00Z",
    updatedAt: "2024-01-16T00:00:00Z"
  }
]

/**
 * DATABASE MOCK DATA FOR VIDEOS
 * Video metadata stored in database
 */

export const dbVideosMockData: DbVideo[] = [
  {
    id: "video-1",
    title: "Bitcoin Fundamentals Explained",
    description: "A comprehensive 25-minute introduction to Bitcoin, covering everything from basic concepts to how the network operates.",
    category: "bitcoin",
    instructor: "David Bitcoin",
    instructorPubkey: "npub1davidbitcoin4fundamentals1234567890abcdef1234567890abcdef12345",
    duration: "25:30",
    rating: 4.9,
    viewCount: 5420,
    isPremium: false,
    price: 0,
    currency: "sats",
    thumbnailUrl: "/video-thumbnails/bitcoin-fundamentals.jpg",
    videoUrl: "https://example.com/videos/bitcoin-fundamentals.mp4",
    tags: ["bitcoin", "fundamentals", "blockchain", "beginner", "introduction"],
    difficulty: "beginner",
    videoEventId: "video-event-1",
    videoNaddr: "naddr1qqxnzd3cxqmn2v3hxucrxwpnxqmnxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpn",
    published: true,
    createdAt: "2024-01-08T00:00:00Z",
    updatedAt: "2024-01-08T00:00:00Z"
  },
  {
    id: "video-2",
    title: "Lightning Network Deep Dive",
    description: "Advanced technical overview of Lightning Network architecture, channels, and payment routing.",
    category: "lightning",
    instructor: "Eve Lightning",
    instructorPubkey: "npub1evelightning4deepdive1234567890abcdef1234567890abcdef12345",
    duration: "42:15",
    rating: 4.8,
    viewCount: 3201,
    isPremium: true,
    price: 35000,
    currency: "sats",
    thumbnailUrl: "/video-thumbnails/lightning-deep-dive.jpg",
    videoUrl: "https://example.com/videos/lightning-deep-dive.mp4",
    tags: ["lightning", "technical", "architecture", "advanced", "payments"],
    difficulty: "advanced",
    videoEventId: "video-event-2",
    videoNaddr: "naddr1qqxnzd3cxqmn2v3hxucrxwpnxqmnxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpn",
    published: true,
    createdAt: "2024-01-11T00:00:00Z",
    updatedAt: "2024-01-11T00:00:00Z"
  },
  {
    id: "video-3",
    title: "Building Your First Nostr App",
    description: "In this hands-on tutorial, we'll build a complete Nostr application from scratch. You'll learn how to connect to relays, publish events, and create a simple social media interface.",
    category: "nostr",
    instructor: "Frank Nostr",
    instructorPubkey: "npub1franknostr4tutorial1234567890abcdef1234567890abcdef12345",
    duration: "38:45",
    rating: 4.7,
    viewCount: 2156,
    isPremium: false,
    price: 0,
    currency: "sats",
    thumbnailUrl: "/video-thumbnails/nostr-app-tutorial.jpg",
    videoUrl: "https://example.com/videos/nostr-app-tutorial.mp4",
    tags: ["nostr", "tutorial", "app", "development", "hands-on"],
    difficulty: "intermediate",
    videoEventId: "video-event-3",
    videoNaddr: "naddr1qqxnzd3cxqmn2v3hxucrxwpnxqmnxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpn",
    published: true,
    createdAt: "2024-01-13T00:00:00Z",
    updatedAt: "2024-01-13T00:00:00Z"
  },
  {
    id: "video-4",
    title: "Bitcoin Security Best Practices",
    description: "Essential security practices for Bitcoin developers and users, covering wallet security, key management, and more.",
    category: "security",
    instructor: "Grace Security",
    instructorPubkey: "npub1gracesecurity4bitcoin1234567890abcdef1234567890abcdef12345",
    duration: "31:20",
    rating: 4.8,
    viewCount: 1834,
    isPremium: true,
    price: 20000,
    currency: "sats",
    thumbnailUrl: "/video-thumbnails/bitcoin-security.jpg",
    videoUrl: "https://example.com/videos/bitcoin-security.mp4",
    tags: ["security", "bitcoin", "best-practices", "wallet", "safety"],
    difficulty: "intermediate",
    videoEventId: "video-event-4",
    videoNaddr: "naddr1qqxnzd3cxqmn2v3hxucrxwpnxqmnxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpnxqcrxwpn",
    published: true,
    createdAt: "2024-01-17T00:00:00Z",
    updatedAt: "2024-01-17T00:00:00Z"
  }
]

/**
 * NOSTR MOCK DATA
 * Actual course content stored on Nostr
 */

export const nostrCourseListEvents: NostrCourseListEvent[] = [
  {
    id: "course-list-event-1",
    pubkey: "npub1jackl1ghtning4dev3l0p3r1234567890abcdef1234567890abcdef12345",
    created_at: 1705363200, // 2024-01-15
    kind: 30001,
    content: "",
    sig: "signature1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    tags: [
      ["d", "lightning-fundamentals"],
      ["title", "Bitcoin Lightning Development Fundamentals"],
      ["description", "Learn to build applications on the Lightning Network with hands-on projects and real-world examples."],
      ["image", "/course-images/lightning-fundamentals.jpg"],
      ["published_at", "1705363200"],
      ["l", "lightning"],
      ["t", "bitcoin"],
      ["t", "lightning"],
      ["t", "development"],
      ["t", "beginner"],
      ["a", "30023:npub1jackl1ghtning4dev3l0p3r1234567890abcdef1234567890abcdef12345:understanding-lightning"],
      ["a", "30023:npub1jackl1ghtning4dev3l0p3r1234567890abcdef1234567890abcdef12345:dev-environment-setup"],
      ["a", "30023:npub1jackl1ghtning4dev3l0p3r1234567890abcdef1234567890abcdef12345:first-lightning-app"]
    ]
  },
  {
    id: "course-list-event-2",
    pubkey: "npub1sarahchen4dev3l0p3r1234567890abcdef1234567890abcdef12345",
    created_at: 1705795200, // 2024-01-20
    kind: 30001,
    content: "",
    sig: "signature1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    tags: [
      ["d", "react-bitcoin-integration"],
      ["title", "Advanced React Development with Bitcoin Integration"],
      ["description", "Master React development while building Bitcoin-enabled applications using modern web technologies."],
      ["image", "/course-images/react-bitcoin.jpg"],
      ["published_at", "1705795200"],
      ["price", "50000", "sats"],
      ["l", "frontend"],
      ["t", "react"],
      ["t", "bitcoin"],
      ["t", "frontend"],
      ["t", "intermediate"],
      ["a", "30402:npub1sarahchen4dev3l0p3r1234567890abcdef1234567890abcdef12345:react-bitcoin-fundamentals"],
      ["a", "30402:npub1sarahchen4dev3l0p3r1234567890abcdef1234567890abcdef12345:bitcoin-payment-components"]
    ]
  }
]

export const nostrFreeLessonEvents: NostrFreeLessonEvent[] = [
  {
    id: "lesson-event-1-1",
    pubkey: "npub1jackl1ghtning4dev3l0p3r1234567890abcdef1234567890abcdef12345",
    created_at: 1705363200,
    kind: 30023,
    content: `# Understanding the Lightning Network

## Introduction

The Lightning Network is a second-layer scaling solution for Bitcoin that enables fast, cheap, and scalable payments. This lesson will cover the fundamental concepts you need to understand before building Lightning applications.

## Key Concepts

### Payment Channels
- Bidirectional payment channels
- Channel capacity and liquidity
- Opening and closing channels

### Routing
- Multi-hop payments
- Onion routing for privacy
- Path finding algorithms

### Network Effects
- Liquidity management
- Channel balancing
- Fee structures

## Practical Examples

Let's look at a simple payment channel scenario:

\`\`\`javascript
// Example: Channel state representation
const channelState = {
  capacity: 1000000, // 1M sats
  localBalance: 600000, // 600k sats
  remoteBalance: 400000, // 400k sats
  channelId: "abc123...",
  isActive: true
}
\`\`\`

## Next Steps

In the next lesson, we'll set up your development environment and start building with the Lightning Network.`,
    sig: "signature1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    tags: [
      ["d", "understanding-lightning"],
      ["title", "Understanding the Lightning Network"],
      ["summary", "Introduction to Layer 2 scaling solutions and how Lightning Network works."],
      ["published_at", "1705363200"],
      ["duration", "45 min"],
      ["t", "lightning"],
      ["t", "bitcoin"],
      ["t", "fundamentals"],
      ["a", "30001:npub1jackl1ghtning4dev3l0p3r1234567890abcdef1234567890abcdef12345:lightning-fundamentals"]
    ]
  },
  {
    id: "lesson-event-1-2",
    pubkey: "npub1jackl1ghtning4dev3l0p3r1234567890abcdef1234567890abcdef12345",
    created_at: 1705363200,
    kind: 30023,
    content: `# Setting Up Your Development Environment

## Prerequisites

Before we begin developing Lightning applications, you'll need to set up your development environment with the necessary tools and libraries.

## Required Software

### Node.js and npm
\`\`\`bash
# Install Node.js (version 18 or higher)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
\`\`\`

### LND (Lightning Network Daemon)
\`\`\`bash
# Download and install LND
wget https://github.com/lightningnetwork/lnd/releases/download/v0.17.0-beta/lnd-linux-amd64-v0.17.0-beta.tar.gz
tar -xzf lnd-linux-amd64-v0.17.0-beta.tar.gz
sudo install lnd-linux-amd64-v0.17.0-beta/lnd /usr/local/bin/
\`\`\`

### Development Tools
- Git for version control
- Docker for containerization
- VS Code or your preferred editor

## Configuration

### LND Configuration
Create a \`lnd.conf\` file:

\`\`\`ini
[Application Options]
debuglevel=info
maxpendingchannels=5
alias=MyLightningNode
color=#3399FF

[Bitcoin]
bitcoin.active=1
bitcoin.testnet=1
bitcoin.node=bitcoind

[Bitcoind]
bitcoind.rpchost=localhost:18332
bitcoind.rpcuser=bitcoinrpc
bitcoind.rpcpass=yourpassword
bitcoind.zmqpubrawblock=tcp://127.0.0.1:28332
bitcoind.zmqpubrawtx=tcp://127.0.0.1:28333
\`\`\`

## Testing Your Setup

Let's verify everything is working:

\`\`\`bash
# Start LND
lnd

# In another terminal, check the status
lncli getinfo
\`\`\`

You should see output showing your node information. If you encounter any errors, check the logs and ensure all dependencies are properly installed.`,
    sig: "signature1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    tags: [
      ["d", "dev-environment-setup"],
      ["title", "Setting Up Your Development Environment"],
      ["summary", "Configure your development environment for Lightning Network development."],
      ["published_at", "1705363200"],
      ["duration", "30 min"],
      ["t", "setup"],
      ["t", "development"],
      ["t", "tools"],
      ["a", "30001:npub1jackl1ghtning4dev3l0p3r1234567890abcdef1234567890abcdef12345:lightning-fundamentals"]
    ]
  }
]

export const nostrPaidLessonEvents: NostrPaidLessonEvent[] = [
  {
    id: "lesson-event-2-1",
    pubkey: "npub1sarahchen4dev3l0p3r1234567890abcdef1234567890abcdef12345",
    created_at: 1705795200,
    kind: 30402,
    content: `# React Fundamentals for Bitcoin Apps

## Advanced React Patterns for Bitcoin Development

Building Bitcoin applications requires understanding advanced React patterns and state management techniques. This lesson covers the essential concepts you'll need.

## State Management for Bitcoin Apps

### Context API for Global State
\`\`\`javascript
import React, { createContext, useContext, useReducer } from 'react';

const BitcoinContext = createContext();

const bitcoinReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BALANCE':
      return { ...state, balance: action.payload };
    case 'SET_PRICE':
      return { ...state, price: action.payload };
    case 'SET_WALLET_STATUS':
      return { ...state, walletConnected: action.payload };
    default:
      return state;
  }
};

export const BitcoinProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bitcoinReducer, {
    balance: 0,
    price: 0,
    walletConnected: false
  });

  return (
    <BitcoinContext.Provider value={{ state, dispatch }}>
      {children}
    </BitcoinContext.Provider>
  );
};

export const useBitcoin = () => {
  const context = useContext(BitcoinContext);
  if (!context) {
    throw new Error('useBitcoin must be used within a BitcoinProvider');
  }
  return context;
};
\`\`\`

### Custom Hooks for Bitcoin Operations
\`\`\`javascript
import { useState, useEffect } from 'react';

export const useWalletConnection = () => {
  const [wallet, setWallet] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      if (window.webln) {
        await window.webln.enable();
        setWallet(window.webln);
      } else {
        throw new Error('WebLN not available');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
  };

  return { wallet, isConnecting, connectWallet, disconnectWallet };
};
\`\`\`

## Component Architecture

### Higher-Order Components for Bitcoin Features
\`\`\`javascript
const withBitcoinWallet = (WrappedComponent) => {
  return function BitcoinWalletComponent(props) {
    const { wallet, connectWallet, disconnectWallet } = useWalletConnection();
    
    return (
      <WrappedComponent 
        {...props}
        wallet={wallet}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
      />
    );
  };
};
\`\`\`

## Error Handling and UX

Bitcoin applications require robust error handling and clear user feedback for payment operations.

### Error Boundaries for Payment Components
\`\`\`javascript
class PaymentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Payment error:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Payment Error</h2>
          <p>Something went wrong with the payment. Please try again.</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
\`\`\`

## Performance Optimization

### Memoization for Bitcoin Price Components
\`\`\`javascript
import { memo, useMemo } from 'react';

const BitcoinPriceDisplay = memo(({ price, currency }) => {
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  }, [price, currency]);

  return <span className="bitcoin-price">{formattedPrice}</span>;
});
\`\`\`

## Testing Bitcoin React Components

### Mock Bitcoin APIs for Testing
\`\`\`javascript
// __mocks__/bitcoin.js
export const mockBitcoinAPI = {
  getBalance: jest.fn(() => Promise.resolve(1000000)),
  sendPayment: jest.fn(() => Promise.resolve({ txid: 'mock-tx-id' })),
  getTransactions: jest.fn(() => Promise.resolve([]))
};
\`\`\`

This comprehensive approach to React development for Bitcoin applications will give you the foundation needed to build robust, user-friendly Bitcoin applications.`,
    sig: "signature1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    tags: [
      ["d", "react-bitcoin-fundamentals"],
      ["title", "React Fundamentals for Bitcoin Apps"],
      ["summary", "Master React concepts essential for building Bitcoin applications."],
      ["published_at", "1705795200"],
      ["price", "10000", "sats"],
      ["duration", "90 min"],
      ["t", "react"],
      ["t", "bitcoin"],
      ["t", "frontend"],
      ["t", "advanced"],
      ["a", "30001:npub1sarahchen4dev3l0p3r1234567890abcdef1234567890abcdef12345:react-bitcoin-integration"]
    ]
  }
]

/**
 * NOSTR MOCK DATA FOR DOCUMENTS
 * Actual document content stored on Nostr
 */

export const nostrFreeDocumentEvents: NostrFreeDocumentEvent[] = [
  {
    id: "doc-event-1",
    pubkey: "npub1satoshidev4bitcoin1234567890abcdef1234567890abcdef12345",
    created_at: 1704672000, // 2024-01-10
    kind: 30023,
    content: `# Bitcoin Development Cheatsheet

## Essential Bitcoin Core RPC Commands

### Wallet Operations
\`\`\`bash
# Create a new wallet
bitcoin-cli createwallet "mywallet"

# Get wallet balance
bitcoin-cli getbalance

# Generate new address
bitcoin-cli getnewaddress

# Send Bitcoin
bitcoin-cli sendtoaddress "address" amount
\`\`\`

### Blockchain Information
\`\`\`bash
# Get current block height
bitcoin-cli getblockcount

# Get block hash by height
bitcoin-cli getblockhash 800000

# Get block info
bitcoin-cli getblock "blockhash"

# Get transaction details
bitcoin-cli gettransaction "txid"
\`\`\`

### Network Information
\`\`\`bash
# Get network info
bitcoin-cli getnetworkinfo

# Get peer connections
bitcoin-cli getpeerinfo

# Get mempool info
bitcoin-cli getmempoolinfo
\`\`\`

## Bitcoin Script Examples

### P2PKH (Pay to Public Key Hash)
\`\`\`
OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
\`\`\`

### P2SH (Pay to Script Hash)
\`\`\`
OP_HASH160 <scriptHash> OP_EQUAL
\`\`\`

### Multisig (2-of-3)
\`\`\`
OP_2 <pubKey1> <pubKey2> <pubKey3> OP_3 OP_CHECKMULTISIG
\`\`\`

## JavaScript Library Examples

### Using bitcoinjs-lib
\`\`\`javascript
const bitcoin = require('bitcoinjs-lib');

// Create a key pair
const keyPair = bitcoin.ECPair.makeRandom();
const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });

// Create a transaction
const txb = new bitcoin.TransactionBuilder();
txb.addInput(txid, vout);
txb.addOutput(targetAddress, amount);
txb.sign(0, keyPair);
const tx = txb.build();
\`\`\`

## Security Best Practices

- Never store private keys in plain text
- Use hardware wallets for production
- Validate all inputs and outputs
- Implement proper fee estimation
- Test on testnet first
- Use BIP39 mnemonic phrases
- Implement proper entropy generation

## Common Error Codes

- \`-4\`: Insufficient funds
- \`-5\`: Invalid address
- \`-8\`: Invalid parameter
- \`-26\`: Transaction already in mempool
- \`-27\`: Transaction already confirmed

## Testing Networks

- **Testnet**: Test Bitcoin network with worthless coins
- **Regtest**: Local testing network
- **Signet**: Newer test network with controlled block production

## Useful Resources

- [Bitcoin Core Documentation](https://bitcoincore.org/en/doc/)
- [Bitcoin Developer Guide](https://developer.bitcoin.org/)
- [BIPs Repository](https://github.com/bitcoin/bips)
- [Bitcoin Stack Exchange](https://bitcoin.stackexchange.com/)`,
    sig: "signature1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    tags: [
      ["d", "bitcoin-dev-cheatsheet"],
      ["title", "Bitcoin Development Cheatsheet"],
      ["summary", "Essential Bitcoin development commands, APIs, and best practices in one comprehensive reference."],
      ["published_at", "1704672000"],
      ["t", "bitcoin"],
      ["t", "reference"],
      ["t", "cheatsheet"],
      ["t", "development"],
      ["t", "api"]
    ]
  },
  {
    id: "doc-event-3",
    pubkey: "npub1bobnostr4protocol1234567890abcdef1234567890abcdef12345",
    created_at: 1704844800, // 2024-01-14
    kind: 30023,
    content: `# Nostr NIPs Reference Guide

## Core NIPs

### NIP-01: Basic Protocol Flow
- Event structure and signatures
- Communication between clients and relays
- Message types: EVENT, REQ, CLOSE

### NIP-02: Contact List and Petnames
\`\`\`json
{
  "kind": 3,
  "content": "",
  "tags": [
    ["p", "<pubkey>", "<relay-url>", "<petname>"]
  ]
}
\`\`\`

### NIP-04: Encrypted Direct Messages
\`\`\`json
{
  "kind": 4,
  "content": "<encrypted-content>",
  "tags": [
    ["p", "<recipient-pubkey>"]
  ]
}
\`\`\`

## Event Kinds

| Kind | Description | NIP |
|------|-------------|-----|
| 0 | User Metadata | NIP-01 |
| 1 | Text Note | NIP-01 |
| 2 | Recommend Relay | NIP-01 |
| 3 | Contacts | NIP-02 |
| 4 | Encrypted DMs | NIP-04 |
| 5 | Event Deletion | NIP-09 |
| 6 | Reposts | NIP-18 |
| 7 | Reaction | NIP-25 |
| 40 | Channel Creation | NIP-28 |
| 41 | Channel Metadata | NIP-28 |
| 42 | Channel Message | NIP-28 |
| 43 | Channel Hide Message | NIP-28 |
| 44 | Channel Mute User | NIP-28 |

## Common Tag Types

### Standard Tags
- \`e\`: Event reference
- \`p\`: Pubkey reference  
- \`a\`: Address reference
- \`r\`: URL reference
- \`t\`: Hashtag

### Extended Tags
- \`subject\`: Subject/title
- \`summary\`: Summary/description
- \`published_at\`: Publication timestamp
- \`expires_at\`: Expiration timestamp
- \`nonce\`: Proof of work nonce
- \`difficulty\`: PoW difficulty target

## Client-Relay Communication

### Subscribe to Events
\`\`\`json
["REQ", "<subscription-id>", {"kinds": [1], "limit": 50}]
\`\`\`

### Publish Event
\`\`\`json
["EVENT", {event-object}]
\`\`\`

### Close Subscription
\`\`\`json
["CLOSE", "<subscription-id>"]
\`\`\`

## Filter Examples

### Get User Profile
\`\`\`json
{"kinds": [0], "authors": ["<pubkey>"]}
\`\`\`

### Get Recent Notes
\`\`\`json
{"kinds": [1], "limit": 20}
\`\`\`

### Get Replies to Event
\`\`\`json
{"kinds": [1], "#e": ["<event-id>"]}
\`\`\`

### Get Events by Hashtag
\`\`\`json
{"kinds": [1], "#t": ["bitcoin"]}
\`\`\`

## JavaScript Examples

### Create Event
\`\`\`javascript
import { Event } from 'nostr-tools';

const event = new Event({
  kind: 1,
  content: "Hello Nostr!",
  tags: [
    ["t", "hello"],
    ["t", "nostr"]
  ]
});

await event.sign(privateKey);
\`\`\`

### Connect to Relay
\`\`\`javascript
import { Relay } from 'nostr-tools';

const relay = await Relay.connect('wss://relay.damus.io');

relay.subscribe([
  {"kinds": [1], "limit": 10}
], {
  onevent(event) {
    console.log('New event:', event);
  },
  oneose() {
    console.log('End of stored events');
  }
});
\`\`\`

## Best Practices

1. **Always validate events** before processing
2. **Use multiple relays** for redundancy
3. **Implement proper error handling**
4. **Cache events locally** when possible
5. **Respect rate limits**
6. **Use websocket reconnection logic**
7. **Verify signatures** on received events

## Security Considerations

- Store private keys securely
- Validate all incoming data
- Use secure websocket connections (wss://)
- Implement proper key derivation
- Be careful with NIP-04 encrypted messages (consider NIP-17)
- Use proper entropy for key generation

## Useful Libraries

- **nostr-tools**: Core JavaScript library
- **nostr-dev-kit**: Rust library with bindings
- **go-nostr**: Go implementation
- **python-nostr**: Python library

This reference covers the most commonly used NIPs and patterns in Nostr development.`,
    sig: "signature1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    tags: [
      ["d", "nostr-nips-reference"],
      ["title", "Nostr NIPs Reference"],
      ["summary", "Complete reference guide to Nostr Implementation Possibilities (NIPs) with examples."],
      ["published_at", "1704844800"],
      ["t", "nostr"],
      ["t", "nips"],
      ["t", "protocol"],
      ["t", "reference"],
      ["t", "documentation"]
    ]
  }
]

export const nostrPaidDocumentEvents: NostrPaidDocumentEvent[] = [
  {
    id: "doc-event-2",
    pubkey: "npub1alicelightning4dev1234567890abcdef1234567890abcdef12345",
    created_at: 1704758400, // 2024-01-12
    kind: 30402,
    content: `# Lightning Network Integration Guide

## Advanced Lightning Integration Strategies

This comprehensive guide covers everything you need to know about integrating Lightning Network payments into your applications, from basic concepts to production deployment.

## Setting Up Your Lightning Infrastructure

### LND Integration
\`\`\`javascript
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the Lightning RPC proto file
const packageDefinition = protoLoader.loadSync('lightning.proto');
const lnrpc = grpc.loadPackageDefinition(packageDefinition).lnrpc;

// Connect to LND
const lightning = new lnrpc.Lightning(
  'localhost:10009',
  grpc.credentials.createSsl()
);

// Get node info
lightning.getInfo({}, (err, response) => {
  if (err) console.error(err);
  else console.log('Node info:', response);
});
\`\`\`

### WebLN Integration for Web Apps
\`\`\`javascript
class LightningPayments {
  constructor() {
    this.webln = null;
  }

  async init() {
    if (typeof window !== 'undefined' && window.webln) {
      try {
        await window.webln.enable();
        this.webln = window.webln;
        return true;
      } catch (err) {
        console.error('WebLN initialization failed:', err);
        return false;
      }
    }
    return false;
  }

  async sendPayment(invoice) {
    if (!this.webln) {
      throw new Error('WebLN not available');
    }

    try {
      const result = await this.webln.sendPayment(invoice);
      return result;
    } catch (err) {
      throw new Error(\`Payment failed: \${err.message}\`);
    }
  }

  async makeInvoice(amount, description) {
    if (!this.webln) {
      throw new Error('WebLN not available');
    }

    const args = {
      amount: amount,
      defaultMemo: description
    };

    return await this.webln.makeInvoice(args);
  }
}
\`\`\`

## Payment Flow Implementation

### Creating Invoices
\`\`\`javascript
async function createInvoice(amountSats, description) {
  const request = {
    value: amountSats,
    memo: description,
    expiry: 3600, // 1 hour
  };

  return new Promise((resolve, reject) => {
    lightning.addInvoice(request, (err, response) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
}

// Usage
const invoice = await createInvoice(1000, 'Test payment');
console.log('Payment request:', invoice.payment_request);
\`\`\`

### Monitoring Payments
\`\`\`javascript
function subscribeToInvoices() {
  const call = lightning.subscribeInvoices({});
  
  call.on('data', (invoice) => {
    if (invoice.settled) {
      console.log('Payment received:', {
        amount: invoice.amt_paid_sat,
        hash: invoice.r_hash.toString('hex'),
        memo: invoice.memo
      });
      
      // Handle successful payment
      handlePaymentSuccess(invoice);
    }
  });

  call.on('error', (err) => {
    console.error('Invoice subscription error:', err);
  });
}
\`\`\`

## Channel Management

### Opening Channels
\`\`\`javascript
async function openChannel(nodeId, localFundingAmount) {
  const request = {
    node_pubkey: Buffer.from(nodeId, 'hex'),
    local_funding_amount: localFundingAmount,
    push_sat: 0,
    target_conf: 6,
    sat_per_byte: 1
  };

  return new Promise((resolve, reject) => {
    lightning.openChannelSync(request, (err, response) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
}
\`\`\`

### Channel Balancing
\`\`\`javascript
async function rebalanceChannel(outgoingChannel, incomingChannel, amount) {
  // Create a circular payment to rebalance channels
  const route = await findRoute(
    incomingChannel.remote_pubkey,
    amount,
    [outgoingChannel.chan_id, incomingChannel.chan_id]
  );

  const payment = await lightning.sendToRoute({
    payment_hash: generateRandomHash(),
    routes: [route]
  });

  return payment;
}
\`\`\`

## Error Handling and Retry Logic

### Robust Payment Handling
\`\`\`javascript
class PaymentHandler {
  constructor(maxRetries = 3) {
    this.maxRetries = maxRetries;
  }

  async sendPaymentWithRetry(paymentRequest) {
    let attempt = 0;
    
    while (attempt < this.maxRetries) {
      try {
        const result = await this.sendPayment(paymentRequest);
        return result;
      } catch (err) {
        attempt++;
        
        if (this.isRetryableError(err) && attempt < this.maxRetries) {
          const delay = this.calculateBackoff(attempt);
          await this.sleep(delay);
          continue;
        }
        
        throw err;
      }
    }
  }

  isRetryableError(err) {
    const retryableCodes = [
      'TEMPORARY_CHANNEL_FAILURE',
      'TEMPORARY_NODE_FAILURE',
      'INSUFFICIENT_BALANCE'
    ];
    
    return retryableCodes.some(code => 
      err.message.includes(code)
    );
  }

  calculateBackoff(attempt) {
    return Math.min(1000 * Math.pow(2, attempt), 10000);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
\`\`\`

## Security Best Practices

### Macaroon Management
\`\`\`javascript
const fs = require('fs');
const grpc = require('@grpc/grpc-js');

function createSecureCredentials(certPath, macaroonPath) {
  // Read TLS cert
  const lndCert = fs.readFileSync(certPath);
  const sslCreds = grpc.credentials.createSsl(lndCert);

  // Read macaroon
  const macaroon = fs.readFileSync(macaroonPath);
  const metadata = new grpc.Metadata();
  metadata.add('macaroon', macaroon.toString('hex'));

  // Combine credentials
  const macaroonCreds = grpc.credentials.createFromMetadataGenerator(
    (args, callback) => callback(null, metadata)
  );

  return grpc.credentials.combineChannelCredentials(
    sslCreds,
    macaroonCreds
  );
}
\`\`\`

## Production Deployment Considerations

### Health Monitoring
\`\`\`javascript
class LightningHealthMonitor {
  constructor(lightning) {
    this.lightning = lightning;
    this.healthThresholds = {
      minChannels: 3,
      minBalance: 1000000, // 1M sats
      maxPendingHtlcs: 10
    };
  }

  async checkHealth() {
    try {
      const [info, channels, pendingChannels] = await Promise.all([
        this.getNodeInfo(),
        this.getChannels(),
        this.getPendingChannels()
      ]);

      const health = {
        isHealthy: true,
        issues: []
      };

      // Check channel count
      if (channels.length < this.healthThresholds.minChannels) {
        health.isHealthy = false;
        health.issues.push('Insufficient channels');
      }

      // Check balance
      const totalBalance = channels.reduce(
        (sum, ch) => sum + parseInt(ch.local_balance), 0
      );
      
      if (totalBalance < this.healthThresholds.minBalance) {
        health.isHealthy = false;
        health.issues.push('Low channel balance');
      }

      return health;
    } catch (err) {
      return {
        isHealthy: false,
        issues: ['Node unreachable']
      };
    }
  }
}
\`\`\`

### Backup Strategies
\`\`\`javascript
async function createChannelBackup() {
  return new Promise((resolve, reject) => {
    lightning.exportAllChannelBackups({}, (err, response) => {
      if (err) reject(err);
      else {
        // Store backup securely
        const backup = response.multi_chan_backup;
        fs.writeFileSync(
          \`backup-\${Date.now()}.dat\`,
          backup.multi_chan_backup
        );
        resolve(backup);
      }
    });
  });
}
\`\`\`

This guide provides the foundation for production-ready Lightning Network integration. Remember to always test thoroughly on testnet before deploying to mainnet.`,
    sig: "signature1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    tags: [
      ["d", "lightning-integration-guide"],
      ["title", "Lightning Network Integration Guide"],
      ["summary", "Step-by-step guide to integrating Lightning Network payments into your applications."],
      ["published_at", "1704758400"],
      ["price", "25000", "sats"],
      ["t", "lightning"],
      ["t", "integration"],
      ["t", "payments"],
      ["t", "guide"],
      ["t", "tutorial"]
    ]
  }
]

/**
 * NOSTR MOCK DATA FOR VIDEOS
 * Actual video content stored on Nostr
 */

export const nostrFreeVideoEvents: NostrFreeVideoEvent[] = [
  {
    id: "video-event-1",
    pubkey: "npub1davidbitcoin4fundamentals1234567890abcdef1234567890abcdef12345",
    created_at: 1704585600, // 2024-01-08
    kind: 30023,
    content: `# Bitcoin Fundamentals Explained

## Video Description

A comprehensive 25-minute introduction to Bitcoin, covering everything from basic concepts to how the network operates. Perfect for developers who want to understand the foundation before diving into development.

## What You'll Learn

- What is Bitcoin and why it matters
- How blockchain technology works
- Understanding transactions and UTXOs
- Proof of Work consensus mechanism
- Network security and decentralization
- Basic cryptographic concepts

## Video Chapters

1. **Introduction** (0:00 - 2:30)
   - Brief history of Bitcoin
   - Why digital money matters

2. **Blockchain Basics** (2:30 - 8:00)
   - Blocks and transactions
   - Hash functions and Merkle trees
   - Chain of trust

3. **Proof of Work** (8:00 - 15:00)
   - Mining process
   - Difficulty adjustment
   - Energy considerations

4. **Network Effects** (15:00 - 20:00)
   - Decentralization benefits
   - Node operation
   - Consensus rules

5. **Getting Started** (20:00 - 25:30)
   - Running a node
   - Development resources
   - Next steps

## Prerequisites

- Basic understanding of programming concepts
- No prior Bitcoin knowledge required

## Resources Mentioned

- [Bitcoin Whitepaper](https://bitcoin.org/bitcoin.pdf)
- [Bitcoin Core Documentation](https://bitcoincore.org/en/doc/)
- [Mastering Bitcoin Book](https://github.com/bitcoinbook/bitcoinbook)

## Video Quality

- **Resolution**: 1080p HD
- **Duration**: 25:30
- **Format**: MP4
- **Subtitles**: Available in English

Perfect for beginners who want to build a solid foundation before moving to more advanced topics.`,
    sig: "signature1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    tags: [
      ["d", "bitcoin-fundamentals-video"],
      ["title", "Bitcoin Fundamentals Explained"],
      ["summary", "A comprehensive introduction to Bitcoin, blockchain technology, and how it all works together."],
      ["published_at", "1704585600"],
      ["duration", "25:30"],
      ["t", "bitcoin"],
      ["t", "fundamentals"],
      ["t", "blockchain"],
      ["t", "beginner"],
      ["t", "video"],
      ["r", "https://example.com/videos/bitcoin-fundamentals.mp4"]
    ]
  },
  {
    id: "video-event-3",
    pubkey: "npub1franknostr4tutorial1234567890abcdef1234567890abcdef12345",
    created_at: 1704844800, // 2024-01-13
    kind: 30023,
    content: `# Building Your First Nostr App

## Video Description

In this hands-on tutorial, we'll build a complete Nostr application from scratch. You'll learn how to connect to relays, publish events, and create a simple social media interface.

## What You'll Build

A simple Nostr client with:
- User profile management
- Note publishing and reading
- Real-time updates
- Relay management

## Video Chapters

1. **Project Setup** (0:00 - 5:00)
   - Installing dependencies
   - Project structure
   - Basic HTML/CSS setup

2. **Connecting to Nostr** (5:00 - 12:00)
   - Using nostr-tools library
   - Relay connections
   - Event subscriptions

3. **Key Management** (12:00 - 18:00)
   - Generating key pairs
   - Secure storage
   - Signing events

4. **Publishing Notes** (18:00 - 25:00)
   - Creating events
   - Event validation
   - Publishing to relays

5. **Real-time Updates** (25:00 - 32:00)
   - Subscription management
   - UI updates
   - Error handling

6. **Polish and Testing** (32:00 - 38:45)
   - Adding features
   - Testing on multiple relays
   - Deployment tips

## Code Repository

All source code is available on GitHub: \`https://github.com/example/nostr-tutorial\`

## Prerequisites

- Basic JavaScript knowledge
- Familiarity with HTML/CSS
- Understanding of async/await

## Technologies Used

- Vanilla JavaScript
- nostr-tools library
- WebSocket connections
- Local storage for persistence

## Video Quality

- **Resolution**: 1080p HD with screen recording
- **Duration**: 38:45
- **Format**: MP4
- **Code**: Available for download

Follow along and build your first decentralized social app!`,
    sig: "signature1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    tags: [
      ["d", "nostr-app-tutorial"],
      ["title", "Building Your First Nostr App"],
      ["summary", "Hands-on tutorial showing how to build a simple Nostr application from scratch."],
      ["published_at", "1704844800"],
      ["duration", "38:45"],
      ["t", "nostr"],
      ["t", "tutorial"],
      ["t", "app"],
      ["t", "development"],
      ["t", "hands-on"],
      ["t", "video"],
      ["r", "https://example.com/videos/nostr-app-tutorial.mp4"]
    ]
  }
]

export const nostrPaidVideoEvents: NostrPaidVideoEvent[] = [
  {
    id: "video-event-2",
    pubkey: "npub1evelightning4deepdive1234567890abcdef1234567890abcdef12345",
    created_at: 1704672000, // 2024-01-11
    kind: 30402,
    content: `# Lightning Network Deep Dive

## Premium Video Content

This is an advanced technical deep dive into Lightning Network architecture, covering topics not available in free content. Perfect for developers building production Lightning applications.

## Advanced Topics Covered

### Channel State Management
- Commitment transaction structure
- Revocation keys and penalties
- HTLC (Hash Time Locked Contracts) lifecycle
- Channel state synchronization

### Payment Routing Algorithms
- Dijkstra's algorithm for pathfinding
- Multi-path payments (MPP)
- Atomic Multi-Path (AMP) payments
- Fee optimization strategies

### Security Considerations
- Channel force closures
- Watchtower integration
- Backup strategies
- Key derivation schemes

## Video Chapters

1. **Advanced Channel Mechanics** (0:00 - 8:00)
   - Commitment transaction anatomy
   - Revocation mechanisms
   - Channel state transitions

2. **HTLC Deep Dive** (8:00 - 15:00)
   - Hash lock mechanics
   - Time lock strategies
   - Cross-chain atomic swaps

3. **Routing Optimization** (15:00 - 25:00)
   - Graph theory applications
   - Liquidity discovery
   - Fee calculations

4. **Multi-Path Payments** (25:00 - 32:00)
   - Payment splitting strategies
   - Atomic guarantees
   - Failure handling

5. **Production Considerations** (32:00 - 42:15)
   - Watchtower setup
   - Backup strategies
   - Monitoring and alerting

## Exclusive Content

This video includes:
- **Source code examples** for advanced routing
- **Production deployment** checklist
- **Security audit** guidelines
- **Performance optimization** techniques

## Who This Is For

- Lightning Network developers
- Infrastructure engineers
- Protocol researchers
- Advanced Bitcoin developers

## Prerequisites

- Solid understanding of Bitcoin
- Basic Lightning Network knowledge
- Programming experience (Python/JavaScript/Go)
- Cryptography fundamentals

## Bonus Materials

Premium subscribers get access to:
- Complete source code repository
- Additional documentation
- Private Discord channel
- Follow-up Q&A session

## Video Quality

- **Resolution**: 4K UHD
- **Duration**: 42:15
- **Format**: MP4 with multiple quality options
- **Subtitles**: English, Spanish, Japanese
- **Slides**: PDF available for download

This deep dive will give you the knowledge needed to build robust, production-ready Lightning applications.`,
    sig: "signature1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    tags: [
      ["d", "lightning-deep-dive"],
      ["title", "Lightning Network Deep Dive"],
      ["summary", "Advanced technical overview of Lightning Network architecture, channels, and payment routing."],
      ["published_at", "1704672000"],
      ["price", "35000", "sats"],
      ["duration", "42:15"],
      ["t", "lightning"],
      ["t", "technical"],
      ["t", "architecture"],
      ["t", "advanced"],
      ["t", "video"],
      ["r", "https://example.com/videos/lightning-deep-dive.mp4"]
    ]
  }
]

/**
 * COMBINED COURSE DATA
 * Database courses with their lessons
 */

export const coursesWithLessons: CourseWithLessons[] = dbCoursesMockData.map(course => ({
  ...course,
  lessons: dbLessonsMockData.filter(lesson => lesson.courseId === course.id)
}))

/**
 * NOSTR COURSE DATA
 * Complete Nostr course data with list events and lesson events
 */

export const nostrCourseData: NostrCourseData[] = [
  {
    courseListEvent: nostrCourseListEvents[0],
    lessonEvents: nostrFreeLessonEvents.filter(lesson => 
      lesson.tags.some(tag => tag[0] === 'a' && tag[1].includes('lightning-fundamentals'))
    )
  },
  {
    courseListEvent: nostrCourseListEvents[1],
    lessonEvents: nostrPaidLessonEvents.filter(lesson => 
      lesson.tags.some(tag => tag[0] === 'a' && tag[1].includes('react-bitcoin-integration'))
    )
  }
]

/**
 * NOSTR DOCUMENT DATA
 * Complete Nostr document data
 */

export const nostrDocumentData: NostrDocumentData[] = [
  { documentEvent: nostrFreeDocumentEvents[0] },
  { documentEvent: nostrPaidDocumentEvents[0] },
  { documentEvent: nostrFreeDocumentEvents[1] }
]

/**
 * NOSTR VIDEO DATA
 * Complete Nostr video data
 */

export const nostrVideoData: NostrVideoData[] = [
  { videoEvent: nostrFreeVideoEvents[0] },
  { videoEvent: nostrPaidVideoEvents[0] },
  { videoEvent: nostrFreeVideoEvents[1] }
]

/**
 * UTILITY FUNCTIONS
 * Helper functions to work with course data
 */

export function getCourseById(id: string): DbCourse | undefined {
  return dbCoursesMockData.find(course => course.id === id)
}

export function getLessonById(id: string): DbLesson | undefined {
  return dbLessonsMockData.find(lesson => lesson.id === id)
}

export function getLessonsByCourseId(courseId: string): DbLesson[] {
  return dbLessonsMockData.filter(lesson => lesson.courseId === courseId)
}

export function getDocumentById(id: string): DbDocument | undefined {
  return dbDocumentsMockData.find(doc => doc.id === id)
}

export function getVideoById(id: string): DbVideo | undefined {
  return dbVideosMockData.find(video => video.id === id)
}

export function getNostrCourseByListEventId(eventId: string): NostrCourseData | undefined {
  return nostrCourseData.find(course => course.courseListEvent.id === eventId)
}

export function getNostrDocumentByEventId(eventId: string): NostrDocumentData | undefined {
  return nostrDocumentData.find(doc => doc.documentEvent.id === eventId)
}

export function getNostrVideoByEventId(eventId: string): NostrVideoData | undefined {
  return nostrVideoData.find(video => video.videoEvent.id === eventId)
}

export function getFreeLessons(): DbLesson[] {
  return dbLessonsMockData.filter(lesson => !lesson.isPremium)
}

export function getPaidLessons(): DbLesson[] {
  return dbLessonsMockData.filter(lesson => lesson.isPremium)
}

export function getFreeDocuments(): DbDocument[] {
  return dbDocumentsMockData.filter(doc => !doc.isPremium)
}

export function getPaidDocuments(): DbDocument[] {
  return dbDocumentsMockData.filter(doc => doc.isPremium)
}

export function getFreeVideos(): DbVideo[] {
  return dbVideosMockData.filter(video => !video.isPremium)
}

export function getPaidVideos(): DbVideo[] {
  return dbVideosMockData.filter(video => video.isPremium)
}

export function getCoursesByCategory(category: string): DbCourse[] {
  return dbCoursesMockData.filter(course => course.category === category)
}

export function getDocumentsByCategory(category: string): DbDocument[] {
  return dbDocumentsMockData.filter(doc => doc.category === category)
}

export function getVideosByCategory(category: string): DbVideo[] {
  return dbVideosMockData.filter(video => video.category === category)
}

export function getPublishedCourses(): DbCourse[] {
  return dbCoursesMockData.filter(course => course.published)
}

export function getPublishedDocuments(): DbDocument[] {
  return dbDocumentsMockData.filter(doc => doc.published)
}

export function getPublishedVideos(): DbVideo[] {
  return dbVideosMockData.filter(video => video.published)
}