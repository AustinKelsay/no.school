import { 
  BookOpen, 
  Video, 
  FileText, 
  Map, 
  Shield,
  type LucideIcon
} from "lucide-react"

/**
 * Centralized UI configuration for consistent display across the application
 * Uses CSS variables for colors to work with the configurable theme system
 */

/**
 * Icons mapping for different content types
 */
export const contentTypeIcons: Record<string, LucideIcon> = {
  course: BookOpen,
  video: Video,
  document: FileText,
  guide: Map,
  cheatsheet: Shield,
}

/**
 * Semantic color classes for difficulty levels using CSS variables
 * These automatically adapt to the current theme configuration
 */
export const difficultyColors: Record<string, string> = {
  beginner: "bg-difficulty-beginner/10 text-difficulty-beginner border-difficulty-beginner/20",
  intermediate: "bg-difficulty-intermediate/10 text-difficulty-intermediate border-difficulty-intermediate/20", 
  advanced: "bg-difficulty-advanced/10 text-difficulty-advanced border-difficulty-advanced/20",
}

/**
 * Display labels for content types
 */
export const contentTypeLabels: Record<string, string> = {
  course: "Course",
  video: "Video",
  document: "Document",
  guide: "Guide",
  cheatsheet: "Cheat Sheet",
}

/**
 * Display labels for difficulty levels
 */
export const difficultyLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
}

/**
 * Category labels for content organization
 */
export const categoryLabels: Record<string, string> = {
  bitcoin: "Bitcoin",
  lightning: "Lightning",
  nostr: "Nostr",
  frontend: "Frontend",
  backend: "Backend",
  mobile: "Mobile",
  security: "Security",
  web3: "Web3",
}

/**
 * Priority levels for content sorting
 */
export const priorityLevels: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
}

/**
 * Content status options
 */
export const contentStatus: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
}

/**
 * Enrollment status options
 */
export const enrollmentStatus: Record<string, string> = {
  enrolled: "Enrolled",
  completed: "Completed",
  inProgress: "In Progress",
  notStarted: "Not Started",
}

/**
 * Payment status options
 */
export const paymentStatus: Record<string, string> = {
  pending: "Pending",
  completed: "Completed",
  failed: "Failed",
  refunded: "Refunded",
}

/**
 * Popular tags for filtering
 */
export const popularTags = [
  'react', 'javascript', 'lightning', 'frontend', 'backend', 'security',
  'beginner', 'intermediate', 'advanced', 'free', 'premium', 'nodejs',
  'html', 'css', 'api', 'database', 'web3', 'mobile', 'typescript'
]

/**
 * Content type filters for UI
 */
export const contentTypeFilters = [
  { type: 'course', icon: BookOpen, label: 'Courses' },
  { type: 'video', icon: Video, label: 'Videos' },
  { type: 'document', icon: FileText, label: 'Documents' },
  { type: 'guide', icon: Map, label: 'Guides' },
  { type: 'cheatsheet', icon: Shield, label: 'Cheat Sheets' }
]

/**
 * Difficulty levels for filtering
 */
export const difficultyFilters = [
  { difficulty: 'beginner', label: 'Beginner' },
  { difficulty: 'intermediate', label: 'Intermediate' },
  { difficulty: 'advanced', label: 'Advanced' }
] 