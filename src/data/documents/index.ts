/**
 * Document domain exports
 * Central export point for all document-related data and types
 */

// Export all types
export type * from './types'

// Export mock data
export {
  dbDocumentsMockData,
  getDocumentById,
  getDocumentsByCategory,
  getDocumentsByType,
  getFreeDocuments,
  getPaidDocuments,
  getDocumentsByDifficulty,
  getDocumentsByInstructor,
  searchDocuments,
  getDocumentStatistics,
  getPopularDocuments,
  getRecentDocuments,
  getTopRatedDocuments,
  getDocumentsByTag,
  getRelatedDocuments
} from './mock-documents'