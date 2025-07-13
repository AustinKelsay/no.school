"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MainLayout } from "@/components/layout/main-layout"
import { Section } from "@/components/layout/section"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ContentCard } from "@/components/ui/content-card"
import { 
  Star, 
  Users, 
  Video, 
  Crown,
  Zap,
  Shield,
  Code,
  Palette,
  BookOpen,
  FileText,
  Loader2,
  Play,
  Download
} from "lucide-react"
import { getCachedContentItems, getContentStats } from '@/lib/data'
import type { ContentItem, ContentStats } from '@/lib/data'
import { contentTypeFilters, popularTags } from "@/data/config"

/**
 * Homepage component featuring hero section, content filters, and mixed content grid
 * Now showcases courses, documents, and videos with dedicated sections
 */
export default function Home() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [contentStats, setContentStats] = useState<ContentStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [items, stats] = await Promise.all([
          getCachedContentItems(),
          getContentStats()
        ])
        setContentItems(items)
        setContentStats(stats)
      } catch (error) {
        console.error('Error fetching content:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Show loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </MainLayout>
    )
  }
  
  // Filter content items by type to create separate sections
  const courses = contentItems.filter(item => item.type === 'course')
  const videos = contentItems.filter(item => item.type === 'video')
  const documents = contentItems.filter(item => 
    item.type === 'document' || item.type === 'guide' || item.type === 'cheatsheet'
  )

  // Get featured content (top rated)
  const featuredCourses = courses
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3)

  const featuredVideos = videos
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3)

  const featuredDocuments = documents
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3)

  return (
    <MainLayout>
      {/* Hero Section */}
      <Section 
        spacing="xl" 
        className="bg-gradient-to-b from-background to-secondary/20"
      >
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Learn to code<br />
              Build on <span className="text-primary">Bitcoin</span><br />
              Become a <span className="text-orange-500">plebdev</span>
            </h1>
            
            <p className="max-w-md text-lg text-muted-foreground">
              Master Bitcoin and Lightning Network development with comprehensive courses, 
              hands-on tutorials, and reference guides built on Nostr and Lightning.
            </p>
            
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                {['JD', 'SM', 'AL', 'TR', 'PK'].map((initials) => (
                  <Avatar key={initials} className="h-10 w-10 border-2 border-background">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="text-sm">
                <div className="font-semibold">{contentStats?.totalUsers?.toLocaleString() || '3,596'}+ learners</div>
                <div className="text-muted-foreground">across all content</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${
                    i < Math.floor(contentStats?.averageRating || 4.8) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300'
                  }`} />
                ))}
              </div>
              <span className="font-semibold">{contentStats?.averageRating?.toFixed(1) || '4.8'}</span>
              <span className="text-sm text-muted-foreground">average rating</span>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-background/50 rounded-lg p-3 border">
                <div className="text-lg font-bold text-primary">{contentStats?.totalCourses || 5}</div>
                <div className="text-xs text-muted-foreground">Courses</div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border">
                <div className="text-lg font-bold text-orange-500">{contentStats?.totalVideos || 4}</div>
                <div className="text-xs text-muted-foreground">Videos</div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border">
                <div className="text-lg font-bold text-blue-500">{contentStats?.totalDocuments || 4}</div>
                <div className="text-xs text-muted-foreground">Guides</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <BookOpen className="h-5 w-5 mr-2" />
                Start Learning
              </Button>
              <Button size="lg" variant="outline">
                <Zap className="h-5 w-5 mr-2" />
                Lightning Course
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-video rounded-lg bg-gradient-to-br from-orange-500/20 to-yellow-500/20 flex items-center justify-center border border-orange-500/20">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/20">
                  <Zap className="h-10 w-10 text-orange-500" />
                </div>
                <p className="text-muted-foreground">⚡ Lightning Network Development</p>
              </div>
            </div>
            
            {/* Floating content type cards */}
            <div className="absolute -top-4 -right-4 z-10">
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center">
                    <Code className="h-4 w-4 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Bitcoin Development</div>
                    <div className="text-xs text-muted-foreground">{courses.length} courses</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 z-10">
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Guides & Docs</div>
                    <div className="text-xs text-muted-foreground">{documents.length} resources</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -left-8 z-10">
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center">
                    <Play className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Video Tutorials</div>
                    <div className="text-xs text-muted-foreground">{videos.length} videos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Filter Tags */}
      <Section spacing="sm" className="border-b">
        <div className="flex flex-wrap gap-2">
          <Badge variant="default" className="px-4 py-2">
            <Users className="mr-1 h-4 w-4" />
            Featured
          </Badge>
          
          {/* Content type filters */}
          {contentTypeFilters.map(({ icon: Icon, label }) => (
            <Badge key={label} variant="outline" className="px-4 py-2">
              <Icon className="mr-1 h-4 w-4" />
              {label}
            </Badge>
          ))}
          
          {/* Premium/Free filters */}
          <Badge variant="outline" className="px-4 py-2">
            Free
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Crown className="mr-1 h-4 w-4" />
            Premium
          </Badge>
          
          {/* Bitcoin/Lightning focused tags */}
          <Badge variant="outline" className="px-4 py-2">
            <Zap className="mr-1 h-4 w-4 text-orange-500" />
            Lightning
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Code className="mr-1 h-4 w-4" />
            Bitcoin
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Shield className="mr-1 h-4 w-4" />
            Security
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Palette className="mr-1 h-4 w-4" />
            Frontend
          </Badge>
          
          {/* Popular tags */}
          {popularTags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="outline" className="px-4 py-2">
              {tag}
            </Badge>
          ))}
        </div>
      </Section>

      {/* Featured Courses Section */}
      <Section spacing="lg" className="bg-gradient-to-r from-orange-50/50 to-yellow-50/50 dark:from-orange-950/20 dark:to-yellow-950/20">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Courses</h2>
            <p className="text-muted-foreground">
              Start your Bitcoin development journey with our top-rated courses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <ContentCard key={course.id} item={course} variant="content" />
            ))}
          </div>
        </div>
      </Section>

      {/* Featured Videos Section */}
      <Section spacing="lg" className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Play className="h-8 w-8 text-purple-500" />
              <h2 className="text-3xl font-bold">Videos</h2>
            </div>
            <p className="text-muted-foreground">
              Watch and learn with our comprehensive video tutorials
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVideos.map((video) => (
              <ContentCard key={video.id} item={video} variant="content" />
            ))}
          </div>
        </div>
      </Section>

      {/* Featured Documents Section */}
      <Section spacing="lg" className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Download className="h-8 w-8 text-blue-500" />
              <h2 className="text-3xl font-bold">Documents</h2>
            </div>
            <p className="text-muted-foreground">
              Quick reference guides and comprehensive documentation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDocuments.map((document) => (
              <ContentCard key={document.id} item={document} variant="content" />
            ))}
          </div>
        </div>
      </Section>
    </MainLayout>
  )
}
