/**
 * Example component demonstrating the new optimization features:
 * 1. Visibility-based interactions
 * 2. Pagination support
 * 3. Query prefetching
 * 
 * This shows how to use the optimized hooks in practice
 */

"use client";

import { useRef } from 'react';
import { useInteractions } from '@/hooks/useInteractions';
import { useVideosQuery } from '@/hooks/useVideosQuery';
import { usePrefetchProps } from '@/hooks/usePrefetch';

interface OptimizedContentCardProps {
  resourceId: string;
  eventId?: string;
  showPagination?: boolean;
}

export function OptimizedContentCard({ 
  resourceId, 
  eventId, 
  showPagination = false 
}: OptimizedContentCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { getPrefetchProps } = usePrefetchProps();

  // Use visibility-based interactions
  const { interactions, isLoading: interactionsLoading } = useInteractions({
    eventId,
    elementRef: cardRef as React.RefObject<HTMLElement>, // Type assertion for compatibility
    enabled: !!eventId,
  });

  // Use paginated videos query
  const { 
    videos, 
    isLoading: videosLoading, 
    pagination,
    refetch 
  } = useVideosQuery({
    page: showPagination ? 1 : undefined,
    pageSize: showPagination ? 10 : undefined,
  });

  // Get prefetch props for hover/focus interactions
  const prefetchProps = getPrefetchProps('resource', resourceId);

  return (
    <div 
      ref={cardRef}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-shadow hover:shadow-lg"
      {...prefetchProps} // This enables prefetching on hover/focus
    >
      {/* Content Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Resource {resourceId}
        </h3>
        
        {/* Interaction Counts - Only renders when visible */}
        {eventId && (
          <div className="flex space-x-4 text-sm text-gray-600 dark:text-gray-400">
            {interactionsLoading ? (
              <div className="animate-pulse flex space-x-2">
                <div className="w-8 h-4 bg-gray-200 rounded"></div>
                <div className="w-8 h-4 bg-gray-200 rounded"></div>
                <div className="w-8 h-4 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <>
                <span>❤️ {interactions.likes}</span>
                <span>⚡ {interactions.zaps}</span>
                <span>💬 {interactions.comments}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Video Content */}
      <div className="space-y-4">
        {videosLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {videos.slice(0, 3).map((video) => {
              // Extract title from note tags
              const title = video.note?.tags?.find(tag => tag[0] === 'title' || tag[0] === 'name')?.[1] || `Video ${video.id}`;
              const description = video.note?.tags?.find(tag => tag[0] === 'summary' || tag[0] === 'description')?.[1] || 'No description available';
              
              return (
                <div 
                  key={video.id} 
                  className="border-l-2 border-blue-500 pl-3"
                  {...getPrefetchProps('resource', video.id)} // Prefetch individual videos
                >
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    {title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {description}
                  </p>
                </div>
              );
            })}
            
            {/* Pagination Info */}
            {showPagination && pagination && (
              <div className="mt-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Page {pagination.page} of {pagination.totalPages} 
                  ({pagination.totalItems} total videos)
                </span>
                <div className="flex space-x-2">
                  <button 
                    disabled={!pagination.hasPrev}
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button 
                    disabled={!pagination.hasNext}
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-between items-center">
        <button 
          onClick={() => refetch()}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Refresh Content
        </button>
        
        <div className="text-xs text-gray-500">
          Optimized with visibility tracking & prefetching
        </div>
      </div>
    </div>
  );
}

/**
 * Example usage component showing multiple optimization features
 */
export function OptimizedContentGrid({ eventIds }: { eventIds: string[] }) {
  const { 
    videos, 
    isLoading, 
    pagination 
  } = useVideosQuery({
    page: 1,
    pageSize: 12,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid of optimized cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <OptimizedContentCard
            key={video.id}
            resourceId={video.id}
            eventId={eventIds[index]} // Optional event ID for interactions
            showPagination={false}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination && (
        <div className="flex justify-center space-x-4">
          <button 
            disabled={!pagination.hasPrev}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous Page
          </button>
          <span className="flex items-center px-4 py-2 text-gray-700">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button 
            disabled={!pagination.hasNext}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next Page
          </button>
        </div>
      )}
    </div>
  );
}