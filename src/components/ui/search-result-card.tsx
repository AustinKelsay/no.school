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
  FileText,
  Unlock
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
                variant="outline"
                className="flex items-center gap-1 text-xs transition-colors"
              >
                {getTypeIcon()}
                {type === 'course' ? 'Course' : 'Resource'}
              </Badge>
              
              {/* Premium/Free Badge - using theme-aware classes */}
              {isPremium ? (
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 border border-primary/20">
                  <Lock className="h-3 w-3 text-primary" />
                  <span className="text-xs font-medium text-primary">
                    {price > 0 ? `${price} sats` : 'Premium'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted border border-border">
                  <Unlock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Free</span>
                </div>
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