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
 * Color classes for difficulty levels
 */
export const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-700 dark:text-green-300",
  intermediate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300", 
  advanced: "bg-red-500/10 text-red-700 dark:text-red-300",
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
 * Category colors for consistent theming
 */
export const categoryColors: Record<string, string> = {
  frontend: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  backend: "bg-green-500/10 text-green-700 dark:text-green-300",
  database: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  mobile: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  web3: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  lightning: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
  security: "bg-red-500/10 text-red-700 dark:text-red-300",
  devops: "bg-gray-500/10 text-gray-700 dark:text-gray-300",
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