/**
 * Video domain exports
 * Central export point for all video-related data and types
 */

// Export all types
export type * from './types'

// Export mock data
export {
  dbVideosMockData,
  getVideoById,
  getVideosByCategory,
  getFreeVideos,
  getPaidVideos,
  getVideosByDifficulty,
  getVideosByInstructor,
  searchVideos,
  getVideoStatistics,
  getPopularVideos,
  getRecentVideos,
  getTopRatedVideos,
  getVideosByDuration,
  getShortVideos,
  getMediumVideos,
  getLongVideos,
  getVideosByTag,
  getRelatedVideos,
  formatVideoDuration,
  getTotalWatchTime,
  getVideoDurationStats
} from './mock-videos'