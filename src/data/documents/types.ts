/**
 * Document domain types
 * All TypeScript interfaces related to documents
 */

// ============================================================================
// DATABASE DOCUMENT MODELS
// ============================================================================

export interface DbDocument {
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
  type?: DbDocument['type']
  difficulty?: DbDocument['difficulty']
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
  type: DbDocument['type']
  difficulty: DbDocument['difficulty']
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