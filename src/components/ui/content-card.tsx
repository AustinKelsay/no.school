import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CourseEnrollmentForm } from "@/components/forms/course-enrollment-form"
import { 
  BookOpen, 
  Star,
  Clock,
  User,
  Crown,
  Users
} from "lucide-react"
import type { ContentItem, Course } from "@/data/types"
import { contentTypeIcons, difficultyVariants } from "@/data/config"
import React from "react"

interface HomepageItem {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  duration?: string
  type?: string
}

interface ContentCardProps {
  item: ContentItem | Course | HomepageItem
  variant?: 'content' | 'course' | 'homepage'
  showEnrollment?: boolean
  onTagClick?: (tag: string) => void
  className?: string
}

function isContentItem(item: ContentItem | Course | HomepageItem): item is ContentItem {
  return 'type' in item && 'difficulty' in item
}

export function ContentCard({ 
  item, 
  variant = 'content', 
  showEnrollment = false,
  onTagClick,
  className = ""
}: ContentCardProps) {
  const isContent = isContentItem(item)
  
  // Homepage variant uses gradients
  if (variant === 'homepage') {
    const homepageItem = item as HomepageItem
    return (
      <Card className={className}>
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

  return (
    <Card className={`transition-shadow hover:shadow-md cursor-pointer group ${className}`}>
      {/* Course variant shows a header image */}
      {variant === 'course' && (
        <div className="h-32 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      
      <CardHeader>
        {isContent && (
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-secondary">
                {React.createElement(contentTypeIcons[item.type] || BookOpen, { className: "h-4 w-4 text-secondary-foreground" })}
              </div>
              <Badge variant={difficultyVariants[item.difficulty]} className="capitalize">
                {item.difficulty}
              </Badge>
            </div>
            {item.isPremium && (
              <Crown className="h-4 w-4 text-primary" />
            )}
          </div>
        )}
        
        <CardTitle className="group-hover:text-primary transition-colors">
          {item.title}
        </CardTitle>
        
        <CardDescription>
          {item.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Meta information */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            {'duration' in item && item.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {item.duration}
              </div>
            )}
            {'instructor' in item && item.instructor && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {item.instructor}
              </div>
            )}
            {!isContent && 'enrollmentCount' in item && item.enrollmentCount && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {item.enrollmentCount.toLocaleString()} students
              </div>
            )}
          </div>
          
          {'rating' in item && item.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary text-primary" />
              {item.rating}
            </div>
          )}
        </div>

        {/* Action buttons for courses */}
        {variant === 'course' && !isContent && showEnrollment && 'id' in item && (
          <div className="flex items-center gap-2">
            <Button className="flex-1" size="sm">
              View Course
            </Button>
            <CourseEnrollmentForm 
              courseId={item.id.toString()} 
              courseTitle={item.title}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}