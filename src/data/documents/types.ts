/**
 * Document domain types
 * All TypeScript interfaces related to documents
 */

import { Resource } from '../types'

// ============================================================================
// DATABASE DOCUMENT MODELS (using DbResource as base)
// ============================================================================

export interface DbDocument extends Resource {
  type: 'guide' | 'cheatsheet' | 'reference' | 'tutorial' | 'documentation'
  documentEventId: string       // NIP-23/99 event ID (alias for resourceEventId)
  documentNaddr: string         // NIP-19 naddr for document (alias for resourceNaddr)
}

// ============================================================================
// DOCUMENT VIEWS AND TRACKING
// ============================================================================

export interface DocumentView {
  id: string
  userId: string
  documentId: string
  viewedAt: string
  timeSpent: number             // in seconds
  completionPercentage: number  // 0-100
}

export interface DocumentBookmark {
  id: string
  userId: string
  documentId: string
  bookmarkedAt: string
  notes?: string
}

// ============================================================================
// DOCUMENT STATISTICS
// ============================================================================

export interface DocumentStats {
  totalDocuments: number
  totalViews: number
  averageRating: number
  typeCounts: Record<string, number>
  categoryCounts: Record<string, number>
  difficultyCounts: Record<string, number>
  premiumDocuments: number
  freeDocuments: number
}

// ============================================================================
// FILTERING AND SEARCH
// ============================================================================

export interface DocumentFilters {
  category?: string
  type?: 'guide' | 'cheatsheet' | 'reference' | 'tutorial' | 'documentation'
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  isPremium?: boolean
  instructor?: string
  tags?: string[]
  rating?: number
}

export interface DocumentSearchResult {
  documents: DbDocument[]
  total: number
  query: string
  filters: DocumentFilters
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateDocumentData {
  title: string
  description: string
  category: string
  type: 'guide' | 'cheatsheet' | 'reference' | 'tutorial' | 'documentation'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  isPremium?: boolean
  price?: number
  image?: string
}

export interface UpdateDocumentData extends Partial<CreateDocumentData> {
  published?: boolean
}

// ============================================================================
// DOCUMENT CONTENT TYPES
// ============================================================================

export interface DocumentSection {
  id: string
  title: string
  content: string
  order: number
}

export interface DocumentWithContent extends DbDocument {
  sections: DocumentSection[]
  wordCount: number
  estimatedReadTime: number    // in minutes
}