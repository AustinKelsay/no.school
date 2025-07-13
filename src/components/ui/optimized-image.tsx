"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  fill?: boolean
  fallback?: string
  placeholder?: "blur" | "empty"
  blurDataURL?: string
}

/**
 * Optimized image component with error handling and loading states
 * Wraps next/image with proper fallbacks and accessibility
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes,
  fill = false,
  fallback = "/images/placeholder.svg",
  placeholder = "empty",
  blurDataURL,
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  function handleError() {
    setError(true)
    setLoading(false)
  }

  function handleLoad() {
    setLoading(false)
  }

  if (error) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
        style={{ width, height }}
      >
        <span className="text-sm">Image unavailable</span>
      </div>
    )
  }

  const imageProps = {
    src: src || fallback,
    alt,
    onError: handleError,
    onLoad: handleLoad,
    priority,
    className: cn(
      "transition-opacity duration-300",
      loading && "opacity-0",
      !loading && "opacity-100",
      className
    ),
    placeholder,
    blurDataURL,
    sizes,
    ...props,
  }

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
        alt={alt}
      />
    )
  }

  return (
    <Image
      {...imageProps}
      width={width || 400}
      height={height || 300}
      alt={alt}
    />
  )
} 