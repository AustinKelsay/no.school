'use client'

import React from 'react'
import { Zap, MessageCircle, Heart } from 'lucide-react'

interface InteractionMetricsProps {
  /** Number of zaps */
  zapsCount: number
  /** Number of comments */
  commentsCount: number
  /** Number of likes/reactions */
  likesCount: number
  /** Loading state for zaps */
  isLoadingZaps?: boolean
  /** Loading state for comments */
  isLoadingComments?: boolean
  /** Loading state for likes */
  isLoadingLikes?: boolean
  /** Additional className for the container */
  className?: string
  /** Whether to show the interactions in a compact layout */
  compact?: boolean
}

/**
 * Reusable component for displaying interaction metrics (zaps, comments, likes)
 * with hover effects and scroll-to-comments functionality
 */
export function InteractionMetrics({
  zapsCount,
  commentsCount,
  likesCount,
  isLoadingZaps = false,
  isLoadingComments = false,
  isLoadingLikes = false,
  className = '',
  compact = false
}: InteractionMetricsProps) {
  const handleScrollToComments = () => {
    const commentsSection = document.querySelector('[data-comments-section]')
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const spacing = compact ? 'gap-3 sm:gap-4' : 'gap-4 sm:gap-6'
  const iconSize = compact ? 'h-4 w-4' : 'h-5 w-5'
  const textSize = compact ? 'text-xs' : 'text-xs sm:text-sm'

  return (
    <div className={`flex items-center flex-wrap ${spacing} ${className}`}>
      {/* Zaps */}
      <div 
        className="flex items-center space-x-1.5 sm:space-x-2 transition-colors cursor-pointer group"
        onClick={handleScrollToComments}
      >
        <Zap className={`${iconSize} text-muted-foreground group-hover:text-amber-500 transition-colors`} />
        <span className="font-medium text-foreground group-hover:text-amber-500 transition-colors">
          {isLoadingZaps ? (
            <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
          ) : (
            zapsCount.toLocaleString()
          )}
        </span>
        <span className={`text-muted-foreground group-hover:text-amber-500 transition-colors ${textSize}`}>
          zaps
        </span>
      </div>
      
      {/* Comments */}
      <div 
        className="flex items-center space-x-1.5 sm:space-x-2 transition-colors cursor-pointer group"
        onClick={handleScrollToComments}
      >
        <MessageCircle className={`${iconSize} text-muted-foreground group-hover:text-blue-500 transition-colors`} />
        <span className="font-medium text-foreground group-hover:text-blue-500 transition-colors">
          {isLoadingComments ? (
            <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
          ) : (
            commentsCount.toLocaleString()
          )}
        </span>
        <span className={`text-muted-foreground group-hover:text-blue-500 transition-colors ${textSize}`}>
          comments
        </span>
      </div>
      
      {/* Likes */}
      <div 
        className="flex items-center space-x-1.5 sm:space-x-2 transition-colors cursor-pointer group"
        onClick={handleScrollToComments}
      >
        <Heart className={`${iconSize} text-muted-foreground group-hover:text-pink-500 transition-colors`} />
        <span className="font-medium text-foreground group-hover:text-pink-500 transition-colors">
          {isLoadingLikes ? (
            <div className="w-4 h-4 rounded-full border-2 border-pink-500 border-t-transparent animate-spin"></div>
          ) : (
            likesCount.toLocaleString()
          )}
        </span>
        <span className={`text-muted-foreground group-hover:text-pink-500 transition-colors ${textSize}`}>
          likes
        </span>
      </div>
    </div>
  )
}