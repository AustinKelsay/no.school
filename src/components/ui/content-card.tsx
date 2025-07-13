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
import { contentTypeIcons, difficultyColors } from "@/data/config"

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
  return 'type' in item && 'tags' in item && 'difficulty' in item
}

export function ContentCard({ 
  item, 
  variant = 'content', 
  showEnrollment = false,
  onTagClick,
  className = ""
}: ContentCardProps) {
  const isContent = isContentItem(item)
  
  // Determine header visual
  let headerContent = null
  
  if (isContent) {
    const TypeIcon = contentTypeIcons[item.type] || BookOpen
    
    // Content item header with type icon and difficulty
    headerContent = (
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <TypeIcon className="h-4 w-4 text-primary" />
          </div>
          <Badge variant="outline" className={difficultyColors[item.difficulty]}>
            {item.difficulty}
          </Badge>
        </div>
        {item.isPremium && (
          <Crown className="h-4 w-4 text-yellow-500" />
        )}
      </div>
    )
  } else {
    // Course header with category badge (only for Course items, not homepage items)
    const isCourse = 'category' in item
    headerContent = (
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {item.title}
          </CardTitle>
          <CardDescription className="mt-1">
            {item.description}
          </CardDescription>
        </div>
        {isCourse && (
          <Badge variant="secondary" className="ml-2">
            {(item as Course).category}
          </Badge>
        )}
      </div>
    )
  }

  // Homepage variant uses gradients
  if (variant === 'homepage') {
    const homepageItem = item as HomepageItem
    return (
      <Card className={`relative overflow-hidden ${className}`}>
        <div className={`aspect-video bg-gradient-to-br ${homepageItem.gradient} flex items-center justify-center p-6`}>
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
              <homepageItem.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{homepageItem.title}</h3>
            {homepageItem.duration && (
              <p className="text-sm text-muted-foreground mt-1">{homepageItem.duration}</p>
            )}
            {homepageItem.type && (
              <p className="text-sm text-muted-foreground mt-1">{homepageItem.type}</p>
            )}
          </div>
        </div>
        <CardHeader>
          <CardTitle>{homepageItem.title}</CardTitle>
          <CardDescription>{homepageItem.description}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className={`hover:shadow-md transition-shadow cursor-pointer group ${className}`}>
      {/* Course variant shows a header image */}
      {variant === 'course' && (
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-primary" />
        </div>
      )}
      
      <CardHeader className="space-y-2">
        {headerContent}
        
        {/* Title and description for content items */}
        {isContent && (
          <>
            <CardTitle className="group-hover:text-primary transition-colors">
              {item.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {item.description}
            </CardDescription>
          </>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Tags for content items */}
        {isContent && item.tags && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs px-2 py-0.5 cursor-pointer hover:bg-secondary/80"
                onClick={(e) => {
                  e.stopPropagation()
                  onTagClick?.(tag)
                }}
              >
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        {/* Meta information */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
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
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {item.rating}
            </div>
          )}
        </div>

        {/* Star rating for courses */}
        {!isContent && variant === 'course' && 'rating' in item && item.rating && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${
                    i < Math.floor(item.rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-sm font-medium">{item.rating}</span>
            {'enrollmentCount' in item && item.enrollmentCount && (
              <span className="text-sm text-muted-foreground">
                ({item.enrollmentCount} reviews)
              </span>
            )}
          </div>
        )}

        {/* Action buttons for courses */}
        {variant === 'course' && !isContent && showEnrollment && 'id' in item && (
          <div className="flex items-center space-x-2">
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