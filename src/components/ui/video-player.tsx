/**
 * Video player component that handles different video formats
 * Supports embedded HTML content, YouTube videos, and direct video files
 */

'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, Volume2, VolumeX, Maximize, ExternalLink, Download } from 'lucide-react'
import { sanitizeContent } from '@/lib/content-utils'

interface VideoPlayerProps {
  content: string
  title?: string
  videoUrl?: string
  duration?: string
  thumbnailUrl?: string
  className?: string
}

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/user\/[^\/]+#p\/[au]\/\d+\/([^&\n?#]+)/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return null
}

/**
 * Check if content contains embedded video
 */
function isEmbeddedVideo(content: string): boolean {
  return content.includes('<video') || content.includes('<iframe')
}

/**
 * Extract video source from content
 */
function extractVideoSource(content: string): string | null {
  // Check for direct video source
  const sourceMatch = content.match(/src="([^"]+\.(mp4|webm|mov|avi))"/i)
  if (sourceMatch) return sourceMatch[1]
  
  // Check for YouTube embed
  const youtubeMatch = content.match(/src="[^"]*youtube\.com\/embed\/([^"?]+)/i)
  if (youtubeMatch) return `https://www.youtube.com/watch?v=${youtubeMatch[1]}`
  
  return null
}

/**
 * Video controls component
 */
function VideoControls({ videoUrl, duration }: { videoUrl?: string; duration?: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 border-t">
      <div className="flex items-center space-x-2">
        {duration && (
          <Badge variant="outline" className="text-xs">
            {duration}
          </Badge>
        )}
        <Badge variant="secondary" className="text-xs">
          Video
        </Badge>
      </div>
      
      <div className="flex items-center space-x-2">
        {videoUrl && (
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a href={videoUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              Watch on Platform
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * Embedded video renderer
 */
function EmbeddedVideoRenderer({ content }: { content: string }) {
  const sanitizedContent = sanitizeContent(content)
  
  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <div 
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </div>
  )
}

/**
 * Video thumbnail with play button
 */
function VideoThumbnail({ 
  thumbnailUrl, 
  title, 
  onPlay 
}: { 
  thumbnailUrl?: string; 
  title?: string; 
  onPlay: () => void 
}) {
  return (
    <div className="relative aspect-video bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-lg overflow-hidden cursor-pointer group">
      {thumbnailUrl ? (
        <img 
          src={thumbnailUrl} 
          alt={title || 'Video thumbnail'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg font-medium text-foreground">Video Content</p>
            <p className="text-sm text-muted-foreground">Click to play</p>
          </div>
        </div>
      )}
      
      {/* Play button overlay */}
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="lg"
          className="rounded-full bg-primary/90 hover:bg-primary text-primary-foreground"
          onClick={onPlay}
        >
          <Play className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

/**
 * Main video player component
 */
export function VideoPlayer({ 
  content, 
  title, 
  videoUrl, 
  duration, 
  thumbnailUrl, 
  className = '' 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showThumbnail, setShowThumbnail] = useState(true)
  
  const handlePlay = () => {
    setIsPlaying(true)
    setShowThumbnail(false)
  }
  
  const isEmbedded = isEmbeddedVideo(content)
  const extractedVideoUrl = videoUrl || extractVideoSource(content) || undefined
  
  return (
    <Card className={className}>
      {title && (
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Play className="h-5 w-5" />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="p-0">
        {showThumbnail && thumbnailUrl ? (
          <VideoThumbnail 
            thumbnailUrl={thumbnailUrl}
            title={title}
            onPlay={handlePlay}
          />
        ) : isEmbedded ? (
          <EmbeddedVideoRenderer content={content} />
        ) : (
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <div className="mb-4">
                <Play className="h-12 w-12 mx-auto opacity-60" />
              </div>
              <p className="text-lg font-medium">Video Player</p>
              <p className="text-sm opacity-60">Video content will appear here</p>
            </div>
          </div>
        )}
        
        <VideoControls videoUrl={extractedVideoUrl} duration={duration} />
      </CardContent>
    </Card>
  )
}

/**
 * Simple video embed component for inline usage
 */
export function VideoEmbed({ content, className = '' }: { content: string; className?: string }) {
  const sanitizedContent = sanitizeContent(content)
  
  return (
    <div className={`aspect-video rounded-lg overflow-hidden ${className}`}>
      <div 
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </div>
  )
} 