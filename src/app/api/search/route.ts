import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { SearchAdapter } from '@/lib/db-adapter'
import { handleApiError, successResponse } from '@/lib/api-utils'

// Validation schema for search query
const searchQuerySchema = z.object({
  q: z.string().min(3, 'Search query must be at least 3 characters'),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
  type: z.enum(['all', 'courses', 'resources']).optional().default('all')
})

export async function GET(request: NextRequest) {
  try {
    // Parse and validate search params
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)
    const validatedParams = searchQuerySchema.parse(searchParams)
    
    const { q: keyword, page, pageSize, type } = validatedParams
    
    // Perform search based on type
    let response
    
    switch (type) {
      case 'courses':
        response = await SearchAdapter.searchCourses({
          keyword,
          page,
          pageSize
        })
        return successResponse({
          results: response.data,
          pagination: response.pagination,
          query: keyword,
          type: 'courses'
        })
        
      case 'resources':
        response = await SearchAdapter.searchResources({
          keyword,
          page,
          pageSize
        })
        return successResponse({
          results: response.data,
          pagination: response.pagination,
          query: keyword,
          type: 'resources'
        })
        
      case 'all':
      default:
        const allResults = await SearchAdapter.searchAll({
          keyword,
          page: 1, // For 'all' search, we get everything and paginate combined results
          pageSize: 100
        })
        
        // Combine and paginate results
        const allItems = [
          ...allResults.courses.map(c => ({ ...c, type: 'course' as const })),
          ...allResults.resources.map(r => ({ ...r, type: 'resource' as const }))
        ]
        
        // Apply pagination to combined results
        const totalItems = allItems.length
        const totalPages = Math.ceil(totalItems / pageSize)
        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize
        const paginatedItems = allItems.slice(startIndex, endIndex)
        
        return successResponse({
          results: paginatedItems,
          pagination: {
            page,
            pageSize,
            totalItems,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
          },
          query: keyword,
          type: 'all',
          summary: {
            courses: allResults.courses.length,
            resources: allResults.resources.length,
            total: allResults.totalResults
          }
        })
    }
  } catch (error) {
    return handleApiError(error)
  }
}

// OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}