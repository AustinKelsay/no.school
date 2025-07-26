'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  X, 
  AlertCircle, 
  CheckCircle, 
  BookOpen,
  Image,
  DollarSign,
  Tag,
  Plus,
  Loader2,
  FileText,
  Video,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import LessonSelector from './lesson-selector'
import { OptimizedImage } from '@/components/ui/optimized-image'

interface FormData {
  title: string
  summary: string
  image: string
  price: number
  topics: string[]
}

interface LessonData {
  id: string
  type: 'resource' | 'draft'
  resourceId?: string
  draftId?: string
  title: string
  contentType?: string
  price?: number
  image?: string
  summary?: string
}

export default function CreateCourseDraftForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const draftId = searchParams.get('draft')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [courseDraftId, setCourseDraftId] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: '',
    summary: '',
    image: '',
    price: 0,
    topics: [],
  })
  
  // Lessons state
  const [lessons, setLessons] = useState<LessonData[]>([])
  
  // Temporary input states
  const [currentTopic, setCurrentTopic] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  // Load draft data if editing
  useEffect(() => {
    const loadDraft = async () => {
      if (!draftId) return
      
      setIsLoading(true)
      try {
        const response = await fetch(`/api/drafts/courses/${draftId}`)
        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to load draft')
        }
        
        const draft = result.data
        setCourseDraftId(draft.id)
        setFormData({
          title: draft.title,
          summary: draft.summary,
          image: draft.image || '',
          price: draft.price || 0,
          topics: draft.topics || [],
        })
        
        // Load lessons
        if (draft.draftLessons && draft.draftLessons.length > 0) {
          const loadedLessons: LessonData[] = draft.draftLessons.map((lesson: {
            id: string
            resourceId?: string
            draftId?: string
            resource?: { title: string; price: number }
            draft?: { title: string; type: string; price: number }
          }) => ({
            id: lesson.id,
            type: lesson.resourceId ? 'resource' : 'draft',
            resourceId: lesson.resourceId,
            draftId: lesson.draftId,
            title: lesson.resource?.title || lesson.draft?.title || 'Unknown',
            contentType: lesson.draft?.type,
            price: lesson.resource?.price || lesson.draft?.price
          }))
          setLessons(loadedLessons)
        }
      } catch (err) {
        console.error('Error loading draft:', err)
        setMessage({ 
          type: 'error', 
          text: err instanceof Error ? err.message : 'Failed to load draft' 
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadDraft()
  }, [draftId])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters'
    }
    
    if (!formData.summary.trim()) {
      newErrors.summary = 'Summary is required'
    } else if (formData.summary.length > 1000) {
      newErrors.summary = 'Summary must be less than 1000 characters'
    }
    
    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'Must be a valid URL'
    }
    
    if (formData.price < 0) {
      newErrors.price = 'Price must be 0 or greater'
    }
    
    if (formData.topics.length === 0) {
      newErrors.topics = 'At least one topic is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const addTopic = () => {
    if (currentTopic.trim() && !formData.topics.includes(currentTopic.trim())) {
      setFormData(prev => ({
        ...prev,
        topics: [...prev.topics, currentTopic.trim()]
      }))
      setCurrentTopic('')
      setErrors(prev => ({ ...prev, topics: undefined }))
    }
  }

  const removeTopic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index)
    }))
  }

  const handleAddLessons = (selectedLessons: LessonData[]) => {
    setLessons([...lessons, ...selectedLessons])
  }

  const removeLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index))
  }

  const moveLessonUp = (index: number) => {
    if (index === 0) return
    const newLessons = [...lessons]
    const temp = newLessons[index]
    newLessons[index] = newLessons[index - 1]
    newLessons[index - 1] = temp
    setLessons(newLessons)
  }

  const moveLessonDown = (index: number) => {
    if (index === lessons.length - 1) return
    const newLessons = [...lessons]
    const temp = newLessons[index]
    newLessons[index] = newLessons[index + 1]
    newLessons[index + 1] = temp
    setLessons(newLessons)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    setMessage(null)
    
    try {
      // Create or update course draft
      const courseUrl = draftId ? `/api/drafts/courses/${draftId}` : '/api/drafts/courses'
      const courseMethod = draftId ? 'PUT' : 'POST'
      
      const courseResponse = await fetch(courseUrl, {
        method: courseMethod,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!courseResponse.ok) {
        const error = await courseResponse.json()
        throw new Error(error.error || 'Failed to save course draft')
      }

      const courseResult = await courseResponse.json()
      const savedCourseDraftId = courseResult.data.id
      
      // If we have lessons, create draft lessons
      if (lessons.length > 0) {
        // First, delete existing lessons if updating
        if (draftId) {
          const existingLessonsResponse = await fetch(`/api/drafts/lessons?courseDraftId=${savedCourseDraftId}`)
          if (existingLessonsResponse.ok) {
            const existingLessons = await existingLessonsResponse.json()
            for (const lesson of existingLessons.data) {
              await fetch(`/api/drafts/lessons/${lesson.id}`, { method: 'DELETE' })
            }
          }
        }
        
        // Create new lessons
        for (let i = 0; i < lessons.length; i++) {
          const lesson = lessons[i]
          const lessonData = {
            courseDraftId: savedCourseDraftId,
            resourceId: lesson.resourceId,
            draftId: lesson.draftId,
            index: i
          }
          
          const lessonResponse = await fetch('/api/drafts/lessons', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(lessonData),
          })
          
          if (!lessonResponse.ok) {
            console.error('Failed to create lesson:', await lessonResponse.json())
          }
        }
      }
      
      setMessage({ 
        type: 'success', 
        text: draftId ? 'Course draft updated successfully! Redirecting...' : 'Course draft created successfully! Redirecting...' 
      })
      
      setTimeout(() => {
        router.push(`/drafts/courses/${savedCourseDraftId}`)
      }, 1500)
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'An unexpected error occurred' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-muted-foreground">Loading draft...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <Alert className={message.type === 'error' ? 'border-destructive' : 'border-green-500'}>
          {message.type === 'error' ? (
            <AlertCircle className="h-4 w-4 text-destructive" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course Information</CardTitle>
          <CardDescription>
            Provide the essential details about your course
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a descriptive course title"
              value={formData.title}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, title: e.target.value }))
                setErrors(prev => ({ ...prev, title: undefined }))
              }}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">
              Summary
              <span className="text-sm text-muted-foreground ml-2">
                ({formData.summary.length}/1000)
              </span>
            </Label>
            <Textarea
              id="summary"
              placeholder="Provide a comprehensive summary of your course"
              className={`resize-none ${errors.summary ? 'border-destructive' : ''}`}
              rows={4}
              value={formData.summary}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, summary: e.target.value }))
                setErrors(prev => ({ ...prev, summary: undefined }))
              }}
            />
            {errors.summary && <p className="text-sm text-destructive">{errors.summary}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Course Lessons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course Lessons</CardTitle>
          <CardDescription>
            Add and organize lessons for your course
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LessonSelector onAddLessons={handleAddLessons} existingLessons={lessons} />
          
          {lessons.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Lessons</Label>
              <div className="space-y-2 border rounded-lg p-3 bg-muted/30">
                {lessons.map((lesson, index) => (
                  <div key={`${lesson.type}-${lesson.resourceId || lesson.draftId}-${index}`} 
                       className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                    {/* Lesson Number */}
                    <div className="text-center">
                      <span className="text-2xl font-bold text-muted-foreground">
                        {index + 1}
                      </span>
                    </div>
                    
                    {/* Lesson Image */}
                    <div className="relative w-24 h-16 bg-muted rounded-md flex-shrink-0 overflow-hidden">
                      {lesson.image ? (
                        <OptimizedImage
                          src={lesson.image}
                          alt={lesson.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {lesson.contentType === 'video' ? (
                            <Video className="h-6 w-6 text-muted-foreground" />
                          ) : (
                            <FileText className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">{lesson.title}</p>
                      {lesson.summary && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                          {lesson.summary}
                        </p>
                      )}
                      <div className="flex gap-2 mt-2">
                        {lesson.contentType && (
                          <Badge variant="secondary" className="text-xs capitalize">
                            {lesson.contentType}
                          </Badge>
                        )}
                        {lesson.type === 'draft' && (
                          <Badge variant="outline" className="text-xs">
                            Draft
                          </Badge>
                        )}
                        {lesson.price !== undefined && lesson.price > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <DollarSign className="h-3 w-3 mr-0.5" />
                            {lesson.price.toLocaleString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveLessonUp(index)}
                        disabled={index === 0}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveLessonDown(index)}
                        disabled={index === lessons.length - 1}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <div className="w-px h-6 bg-border mx-1" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLesson(index)}
                        className="h-8 w-8 p-0 hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Media & Pricing</CardTitle>
          <CardDescription>
            Add a preview image and set your course pricing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image className="h-4 w-4 inline-block mr-1" role="img" aria-hidden="true" />
              Preview Image <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="image"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, image: e.target.value }))
                setErrors(prev => ({ ...prev, image: undefined }))
              }}
              className={errors.image ? 'border-destructive' : ''}
            />
            {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">
              <DollarSign className="h-4 w-4 inline-block mr-1" />
              Course Price (in sats)
            </Label>
            <div className="relative">
              <Input
                id="price"
                type="number"
                min="0"
                placeholder="0"
                value={formData.price}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))
                  setErrors(prev => ({ ...prev, price: undefined }))
                }}
                className={errors.price ? 'border-destructive' : ''}
              />
              {formData.price > 0 && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Badge variant="secondary" className="text-xs">
                    Premium
                  </Badge>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Set to 0 for free courses. Individual lessons may have their own pricing.
            </p>
            {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Organization</CardTitle>
          <CardDescription>
            Add topics to help users discover your course
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>
              <Tag className="h-4 w-4 inline-block mr-1" />
              Topics
            </Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a topic (e.g., Bitcoin, Lightning, Nostr)"
                  value={currentTopic}
                  onChange={(e) => setCurrentTopic(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTopic()
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={addTopic}
                  size="icon"
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.topics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.topics.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1">
                      {topic}
                      <button
                        type="button"
                        onClick={() => removeTopic(index)}
                        className="ml-2 p-1 hover:bg-destructive/20 rounded-sm transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            {errors.topics && <p className="text-sm text-destructive">{errors.topics}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6 pb-8">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          size="lg"
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            draftId ? 'Update Course Draft' : 'Create Course Draft'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push('/drafts')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}