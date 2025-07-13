"use client"

import { useState, useMemo, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/main-layout"
import { Section } from "@/components/layout/section"
import { ContentCard } from "@/components/ui/content-card"

import { getCachedContentItems } from '@/lib/data'
import type { ContentItem } from '@/lib/data'
import { 
  contentTypeFilters, 
  difficultyFilters, 
  popularTags 
} from "@/data/config"
import { 
  Crown,
  Filter,
  X,
  FileText,
  Loader2
} from "lucide-react"


export default function ContentPage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set(['all']))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const items = await getCachedContentItems()
        setContentItems(items)
      } catch (error) {
        console.error('Error fetching content items:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Filter content based on selected filters
  const filteredContent = useMemo(() => {
    if (selectedFilters.has('all') || selectedFilters.size === 0) {
      return contentItems
    }

    return contentItems.filter(item => {
      const itemAttributes = [
        item.type,
        item.category,
        item.difficulty,
        ...item.tags,
        item.isPremium ? 'premium' : 'free'
      ]
      
      return Array.from(selectedFilters).some(filter => 
        itemAttributes.includes(filter)
      )
    })
  }, [contentItems, selectedFilters])

  // Show loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading content...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const toggleFilter = (filter: string) => {
    const newFilters = new Set(selectedFilters)
    
    if (filter === 'all') {
      setSelectedFilters(new Set(['all']))
    } else {
      newFilters.delete('all')
      if (newFilters.has(filter)) {
        newFilters.delete(filter)
      } else {
        newFilters.add(filter)
      }
      
      if (newFilters.size === 0) {
        newFilters.add('all')
      }
      
      setSelectedFilters(newFilters)
    }
  }

  const clearAllFilters = () => {
    setSelectedFilters(new Set(['all']))
  }

  if (loading) {
    return (
      <MainLayout>
        <Section spacing="lg">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading content...</p>
            </div>
          </div>
        </Section>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      {/* Header Section */}
      <Section spacing="lg" className="border-b">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Content Library</h1>
            <p className="text-muted-foreground">
              Discover courses, videos, guides, and resources to accelerate your learning
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredContent.length} of {contentItems.length} items
            </p>
            {selectedFilters.size > 1 || !selectedFilters.has('all') ? (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear filters
              </Button>
            ) : null}
          </div>
        </div>
      </Section>

      {/* Filter Tags */}
      <Section spacing="sm" className="border-b bg-secondary/20">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* All filter */}
            <Badge
              variant={selectedFilters.has('all') ? 'default' : 'outline'}
              className="px-4 py-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => toggleFilter('all')}
            >
              All Content
            </Badge>
            
            {/* Type filters */}
            <div key="type-filters" className="flex flex-wrap gap-2">
              {contentTypeFilters.map(({ type, icon: Icon, label }) => (
                <Badge
                  key={type}
                  variant={selectedFilters.has(type) ? 'default' : 'outline'}
                  className="px-4 py-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => toggleFilter(type)}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {label}
                </Badge>
              ))}
            </div>
            
            {/* Difficulty filters */}
            <div key="difficulty-filters" className="flex flex-wrap gap-2">
              {difficultyFilters.map(({ difficulty, label }) => (
                <Badge
                  key={difficulty}
                  variant={selectedFilters.has(difficulty) ? 'default' : 'outline'}
                  className="px-4 py-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => toggleFilter(difficulty)}
                >
                  {label}
                </Badge>
              ))}
            </div>
            
            {/* Premium/Free filters */}
            <div key="premium-filters" className="flex flex-wrap gap-2">
              <Badge
                key="free"
                variant={selectedFilters.has('free') ? 'default' : 'outline'}
                className="px-4 py-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => toggleFilter('free')}
              >
                Free
              </Badge>
              <Badge
                key="premium"
                variant={selectedFilters.has('premium') ? 'default' : 'outline'}
                className="px-4 py-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => toggleFilter('premium')}
              >
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>

            {/* Popular tags */}
            <div key="popular-tags" className="flex flex-wrap gap-2">
              {popularTags.slice(0, 6).map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedFilters.has(tag) ? 'default' : 'outline'}
                  className="px-4 py-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => toggleFilter(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Content Grid */}
      <Section spacing="lg">
        {filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No content found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters to see more content
            </p>
            <Button variant="outline" onClick={clearAllFilters}>
              Show all content
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <ContentCard 
                key={item.id} 
                item={item} 
                variant="content"
                onTagClick={toggleFilter}
              />
            ))}
          </div>
        )}
      </Section>
    </MainLayout>
  )
}