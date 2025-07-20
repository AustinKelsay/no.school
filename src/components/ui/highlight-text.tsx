"use client"

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface HighlightTextProps {
  text: string
  highlight: string
  className?: string
}

/**
 * Component to highlight search terms in text using theme colors
 * Automatically adapts to current theme's accent colors
 */
export function HighlightText({ text, highlight, className }: HighlightTextProps) {
  const highlightedText = useMemo(() => {
    if (!text || !highlight) return text
    
    // Create regex with word boundaries for better matching
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    
    // Split text and identify highlighted parts
    const parts = text.split(regex)
    
    return parts.map((part, index) => {
      // Check if this part matches the highlight term (case insensitive)
      const isHighlight = part.toLowerCase() === highlight.toLowerCase()
      
      if (isHighlight) {
        return (
          <mark
            key={index}
            className={cn(
              // Use theme colors for highlighting
              "bg-primary/20 text-primary-foreground font-medium rounded-sm px-0.5",
              // Add subtle animation
              "transition-colors duration-200",
              // Dark mode support
              "dark:bg-primary/30 dark:text-primary-foreground",
              className
            )}
          >
            {part}
          </mark>
        )
      }
      
      return part
    })
  }, [text, highlight, className])
  
  return <span>{highlightedText}</span>
}

/**
 * Alternative highlight style using accent colors
 */
export function AccentHighlightText({ text, highlight, className }: HighlightTextProps) {
  const highlightedText = useMemo(() => {
    if (!text || !highlight) return text
    
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => {
      const isHighlight = part.toLowerCase() === highlight.toLowerCase()
      
      if (isHighlight) {
        return (
          <mark
            key={index}
            className={cn(
              // Use accent colors for a different look
              "bg-accent text-accent-foreground font-semibold rounded px-1",
              "border-b-2 border-primary/50",
              "transition-all duration-200 hover:bg-accent/80",
              className
            )}
          >
            {part}
          </mark>
        )
      }
      
      return part
    })
  }, [text, highlight, className])
  
  return <span>{highlightedText}</span>
}

/**
 * Subtle highlight style for descriptions
 */
export function SubtleHighlightText({ text, highlight, className }: HighlightTextProps) {
  const highlightedText = useMemo(() => {
    if (!text || !highlight) return text
    
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => {
      const isHighlight = part.toLowerCase() === highlight.toLowerCase()
      
      if (isHighlight) {
        return (
          <mark
            key={index}
            className={cn(
              // Subtle highlight for descriptions
              "bg-muted text-foreground font-medium",
              "border-l-2 border-primary pl-1",
              "transition-colors duration-200",
              className
            )}
          >
            {part}
          </mark>
        )
      }
      
      return part
    })
  }, [text, highlight, className])
  
  return <span>{highlightedText}</span>
}