"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { HighlightText, SubtleHighlightText } from "@/components/ui/highlight-text"
import { 
  BookOpen, 
  Clock,
  User,
  Users,
  Zap,
  Lock,
  Play,
  FileText
} from "lucide-react"
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"

interface SearchResultCardProps {
  id: string
  type: 'course' | 'resource'
  title: string
  description: string
  category: string
  instructor: string
  image?: string
  price: number
  isPremium: boolean
  keyword: string
  className?: string
}

export function SearchResultCard({
  id,
  type,
  title,
  description,
  category,
  instructor,
  image,
  price,
  isPremium,
  keyword,
  className
}: SearchResultCardProps) {
  const router = useRouter()
  
  const handleClick = () => {
    if (type === 'course') {
      router.push(`/courses/${id}`)
    } else {
      router.push(`/content/${id}`)
    }
  }
  
  const getTypeIcon = () => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-4 w-4" />
      case 'resource':
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }
  
  const getTypeBadgeColor = () => {
    switch (type) {
      case 'course':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300'
      case 'resource':
        return 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
        "border border-border/50 hover:border-primary/20",
        "bg-card hover:bg-accent/5",
        className
      )}
      onClick={handleClick}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            {/* Type Badge */}
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={cn(
                  "flex items-center gap-1 text-xs font-medium transition-colors",
                  getTypeBadgeColor()
                )}
              >
                {getTypeIcon()}
                {type === 'course' ? 'Course' : 'Resource'}
              </Badge>
              
              {/* Premium Badge */}
              {isPremium && (
                <Badge variant="default" className="flex items-center gap-1 text-xs">
                  <Lock className="h-3 w-3" />
                  {price > 0 ? `${price} sats` : 'Premium'}
                </Badge>
              )}
            </div>
            
            {/* Title with Highlighting */}
            <CardTitle className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
              <HighlightText text={title} highlight={keyword} />
            </CardTitle>
          </div>
          
          {/* Image */}
          {image && (
            <div className="flex-shrink-0">
              <OptimizedImage
                src={image}
                alt={title}
                width={80}
                height={60}
                className="rounded-md object-cover border border-border/20"
              />
            </div>
          )}
        </div>
        
        {/* Description with Highlighting */}
        {description && (
          <CardDescription className="text-sm text-muted-foreground line-clamp-2">
            <SubtleHighlightText text={description} highlight={keyword} />
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          {/* Category and Instructor */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="capitalize">{instructor}</span>
            </div>
            
            {category && (
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">
                  {category}
                </Badge>
              </div>
            )}
          </div>
          
          {/* Action Button */}
          <Button 
            size="sm" 
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              handleClick()
            }}
          >
            {type === 'course' ? (
              <>
                <Play className="h-3 w-3 mr-1" />
                Start Learning
              </>
            ) : (
              <>
                <FileText className="h-3 w-3 mr-1" />
                View Content
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}