/**
 * Video domain types
 * All TypeScript interfaces related to videos
 */

// ============================================================================
// DATABASE VIDEO MODELS
// ============================================================================

export interface DbVideo {
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

// ============================================================================
// VIDEO VIEWS AND TRACKING
// ============================================================================

export interface VideoView {
  id: string
  userId: string
  videoId: string
  viewedAt: string
  watchTime: number             // in seconds
  progress: number              // 0-100 (percentage watched)
  completed: boolean            // if watched >= 90%
}

export interface VideoBookmark {
  id: string
  userId: string
  videoId: string
  bookmarkedAt: string
  timestamp: number             // bookmark position in seconds
  notes?: string
}

export interface VideoPlaylist {
  id: string
  userId: string
  title: string
  description?: string
  videoIds: string[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

// ============================================================================
// VIDEO STATISTICS
// ============================================================================

export interface VideoStats {
  totalVideos: number
  totalViews: number
  averageRating: number
  totalDurationMinutes: number
  totalDurationFormatted: string
  categoryCounts: Record<string, number>
  difficultyCounts: Record<string, number>
  premiumVideos: number
  freeVideos: number
}

// ============================================================================
// FILTERING AND SEARCH
// ============================================================================

export interface VideoFilters {
  category?: string
  difficulty?: DbVideo['difficulty']
  isPremium?: boolean
  instructor?: string
  tags?: string[]
  rating?: number
  minDuration?: number          // in minutes
  maxDuration?: number          // in minutes
}

export interface VideoSearchResult {
  videos: DbVideo[]
  total: number
  query: string
  filters: VideoFilters
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateVideoData {
  title: string
  description: string
  category: string
  difficulty: DbVideo['difficulty']
  duration: string
  tags: string[]
  isPremium?: boolean
  price?: number
  thumbnailUrl?: string
  videoUrl?: string
}

export interface UpdateVideoData extends Partial<CreateVideoData> {
  published?: boolean
}

// ============================================================================
// VIDEO PLAYER TYPES
// ============================================================================

export interface VideoPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  playbackRate: number
  isFullscreen: boolean
  quality: 'auto' | '720p' | '1080p' | '480p'
}

export interface VideoChapter {
  id: string
  title: string
  startTime: number             // in seconds
  endTime: number               // in seconds
  description?: string
}

export interface VideoWithChapters extends DbVideo {
  chapters: VideoChapter[]
}

// ============================================================================
// VIDEO ANALYTICS
// ============================================================================

export interface VideoAnalytics {
  videoId: string
  totalViews: number
  uniqueViews: number
  averageWatchTime: number      // in seconds
  completionRate: number        // percentage
  dropOffPoints: number[]       // array of seconds where users commonly stop
  viewsByDay: Record<string, number>
  viewsByRegion: Record<string, number>
}

// ============================================================================
// VIDEO TRANSCRIPTION AND CAPTIONS
// ============================================================================

export interface VideoCue {
  startTime: number
  endTime: number
  text: string
}

export interface VideoTranscript {
  videoId: string
  language: string
  cues: VideoCue[]
  generatedAt: string
}

export interface VideoCaption {
  videoId: string
  language: string
  url: string
  isDefault: boolean
}