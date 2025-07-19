"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { 
  BookOpen, 
  Star,
  Clock,
  User,
  Crown,
  Users,
  Zap,
  Calendar,
  Lock,
  Unlock,
  MessageCircle,
  Heart,
  Eye
} from "lucide-react"
import type { ContentItem } from "@/data/types"
import { contentTypeIcons } from "@/data/config"
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from "react"
import { useNostr, type NormalizedProfile } from "@/hooks/useNostr"
import { encodePublicKey } from "snstr"

interface HomepageItem {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  duration?: string
  type?: string
}

interface ContentCardProps {
  item: ContentItem | HomepageItem
  variant?: 'content' | 'course' | 'homepage'
  onTagClick?: (tag: string) => void
  className?: string
  showContentTypeTags?: boolean
}

function isContentItem(item: ContentItem | HomepageItem): item is ContentItem {
  return 'type' in item && 'id' in item
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`
  return `${Math.floor(diffInSeconds / 31536000)}y ago`
}

function generateMockZapsCount(itemId: string): number {
  // Create a deterministic "random" number based on item ID
  // This ensures server and client render the same value
  let hash = 0;
  for (let i = 0; i < itemId.length; i++) {
    const char = itemId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use the hash to generate a consistent "random" number between 500-4500
  const normalized = Math.abs(hash) % 4000;
  return normalized + 500;
}

function generateMockCommentsCount(itemId: string): number {
  // Create a deterministic "random" number based on item ID + offset
  let hash = 0;
  const seed = itemId + 'comments';
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Generate a number between 5-150 for comments
  const normalized = Math.abs(hash) % 145;
  return normalized + 5;
}

function generateMockReactionsCount(itemId: string): number {
  // Create a deterministic "random" number based on item ID + offset
  let hash = 0;
  const seed = itemId + 'reactions';
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Generate a number between 20-800 for reactions
  const normalized = Math.abs(hash) % 780;
  return normalized + 20;
}

function formatNpubWithEllipsis(pubkey: string): string {
  try {
    const npub = encodePublicKey(pubkey as `${string}1${string}`);
    return `${npub.slice(0, 12)}...${npub.slice(-6)}`;
  } catch {
    // Fallback to hex format if encoding fails
    return `${pubkey.slice(0, 6)}...${pubkey.slice(-6)}`;
  }
}

export function ContentCard({ 
  item, 
  variant = 'content', 
  onTagClick,
  className = "",
  showContentTypeTags = false
}: ContentCardProps) {
  const isContent = isContentItem(item)
  const router = useRouter()
  const { fetchProfile, normalizeKind0 } = useNostr()
  
  // State to store the instructor's profile data
  const [instructorProfile, setInstructorProfile] = useState<NormalizedProfile | null>(null)

  // Fetch instructor profile when component mounts and has instructor data
  useEffect(() => {
    const fetchInstructorProfile = async () => {
      if (isContent && 'instructorPubkey' in item && item.instructorPubkey) {
        try {
          const profileEvent = await fetchProfile(item.instructorPubkey)
          const normalizedProfile = normalizeKind0(profileEvent)
          setInstructorProfile(normalizedProfile)
        } catch (error) {
          console.error('Error fetching instructor profile:', error)
        }
      }
    }

    fetchInstructorProfile()
  }, [isContent, fetchProfile, normalizeKind0, item])

  const handleCardClick = () => {
    if (!isContent) return
    
    // Navigate to appropriate detail page based on actual content type
    if (item.type === 'course') {
      router.push(`/courses/${item.id}`)
    } else {
      console.log("pushinggg", item);
      // For resources (documents, videos, guides, etc.), navigate to content detail page
      router.push(`/content/${item.id}`)
    }
  }
  
  // Homepage variant uses gradients
  if (variant === 'homepage') {
    const homepageItem = item as HomepageItem
    return (
      <Card className={`overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${className}`}>
        <div className={`h-32 bg-gradient-to-br ${homepageItem.gradient} flex items-center justify-center`}>
          <homepageItem.icon className="h-8 w-8 text-primary" />
        </div>
        <CardHeader>
          <CardTitle className="text-lg">{homepageItem.title}</CardTitle>
          <CardDescription>{homepageItem.description}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const mockZapsCount = generateMockZapsCount('id' in item ? item.id : item.title)
  const mockCommentsCount = generateMockCommentsCount('id' in item ? item.id : item.title)
  const mockReactionsCount = generateMockReactionsCount('id' in item ? item.id : item.title)

  return (
    <Card 
      className={`overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer group ${className}`}
      onClick={handleCardClick}
    >
      {/* Thumbnail/Image Area - 16:9 aspect ratio like YouTube */}
      <div className="relative aspect-video bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 overflow-hidden">
        {/* Background pattern for visual interest */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
              backgroundSize: '20px 20px'
            } as React.CSSProperties}
          />
        </div>
        
        {/* Actual image if available */}
        {(() => {
          if (isContent && (item.image || ('thumbnailUrl' in item && item.thumbnailUrl))) {
            const imageSrc = item.image || ('thumbnailUrl' in item ? item.thumbnailUrl : '') || '/placeholder.svg';
            return (
              <OptimizedImage 
                src={imageSrc as string} 
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            );
          }
          return null;
        })()}
        
        {/* Content type icon overlay */}
        <div className="absolute top-3 left-3 p-2 rounded-lg bg-transparent backdrop-blur-xs border shadow-sm">
          {(() => {
            const IconComponent = isContent ? (contentTypeIcons[item.type] || BookOpen) : BookOpen
            return <IconComponent className="h-4 w-4 text-foreground" />
          })()}
        </div>
        
        {/* Engagement metrics on the right */}
        <div className="absolute bottom-3 right-3">
          <div className="flex items-center gap-2">
            {/* Zaps */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-transparent backdrop-blur-xs shadow-sm border hover:border-amber-500 transition-colors cursor-pointer group">
              <Zap className="h-3 w-3 text-muted-foreground group-hover:text-amber-500 transition-colors" />
              <span className="text-xs font-bold text-foreground group-hover:text-amber-500 transition-colors">{mockZapsCount.toLocaleString()}</span>
            </div>
            
            {/* Comments */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-transparent backdrop-blur-xs shadow-sm border hover:border-blue-500 transition-colors cursor-pointer group">
              <MessageCircle className="h-3 w-3 text-muted-foreground group-hover:text-blue-500 transition-colors" />
              <span className="text-xs font-bold text-foreground group-hover:text-blue-500 transition-colors">{mockCommentsCount}</span>
            </div>
            
            {/* Reactions */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-transparent backdrop-blur-xs shadow-sm border hover:border-pink-500 transition-colors cursor-pointer group">
              <Heart className="h-3 w-3 text-muted-foreground group-hover:text-pink-500 transition-colors" />
              <span className="text-xs font-bold text-foreground group-hover:text-pink-500 transition-colors">{mockReactionsCount}</span>
            </div>
          </div>
        </div>
        
        {/* Central content icon - only show if no image */}
        {!isContent || (!item.image && !('thumbnailUrl' in item && item.thumbnailUrl)) ? (
          <div className="absolute inset-0 flex items-center justify-center">
            {variant === 'course' ? (
              <BookOpen className="h-12 w-12 text-primary/60" />
            ) : (() => {
              const IconComponent = isContent ? (contentTypeIcons[item.type] || BookOpen) : BookOpen
              return <IconComponent className="h-12 w-12 text-primary/60" />
            })()}
          </div>
        ) : null}
      </div>
      
      <CardHeader className="pb-3">
        {/* Title */}
        <CardTitle className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {item.title}
        </CardTitle>
        
        {/* Tags and Payment Badge */}
        <div className="flex items-center justify-between gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
          {/* Topic Tags */}
          <div className="flex flex-wrap gap-2 flex-1">
            {isContent && item.topics && item.topics.slice(0, 3).map((topic, index) => {
              // remove the 'document' 'video', and or 'course' topic IF showContentTypeTags is false
              if (!showContentTypeTags && (topic === 'document' || topic === 'video' || topic === 'course')) {
                return null
              } else if (showContentTypeTags && (topic === 'document' || topic === 'video' || topic === 'course')) {
                return (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => onTagClick?.(topic)}
                  >
                    {topic}
                  </Badge>
                )
              }

              return (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="text-xs cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => onTagClick?.(topic)}
                >
                {topic}
              </Badge>
              )
            })
          }
          </div>
          
          {/* Payment Badge */}
          {isContent && (
            <div className="flex-shrink-0 ml-2">
              {item.isPremium ? (
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
                  <Lock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                    {item.price?.toLocaleString() || '40000'} sats
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                  <Unlock className="h-3 w-3 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-300">Free</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Description */}
        <CardDescription className="text-sm leading-relaxed line-clamp-3 mb-4">
          {item.description}
        </CardDescription>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            {/* Duration for videos */}
            {isContent && item.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{item.duration}</span>
              </div>
            )}
            
            {/* Enrollment count for courses */}
            {!isContent && 'enrollmentCount' in item && typeof item.enrollmentCount === 'number' && item.enrollmentCount > 0 && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{item.enrollmentCount.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Time ago and instructor */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {isContent ? formatTimeAgo(item.createdAt) : '4 months ago'}
            </span>
          </div>
          
          {isContent && 'instructor' in item && item.instructor && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>
                {instructorProfile?.name || 
                 instructorProfile?.display_name || 
                 (('instructorPubkey' in item && item.instructorPubkey) ? formatNpubWithEllipsis(item.instructorPubkey) : 'Unknown')}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {isContent && !item.isPremium ? (
            <Button 
              className="w-full" 
              size="sm"
              variant="outline"
              onClick={() => {
                if (item.type === 'course') {
                  router.push(`/courses/${item.id}`)
                } else {
                  router.push(`/content/${item.id}`)
                }
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              {item.type === 'course' ? 'Start Learning' : 'View Content'}
            </Button>
          ) : (
            <Button 
              className="w-full" 
              size="sm"
              variant="outline"
              onClick={() => {
                router.push('/auth/signin')
              }}
            >
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}