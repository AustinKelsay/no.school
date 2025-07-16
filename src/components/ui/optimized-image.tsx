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
 * List of allowed domains from next.config.ts
 * These domains are configured for optimization
 */
const ALLOWED_DOMAINS = [
  'images.unsplash.com',
  'avatars.githubusercontent.com',
  'api.dicebear.com',
  'plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com',
  'miro.medium.com',
  'img.youtube.com',
  'i.ytimg.com'
]

/**
 * Check if a URL hostname is in the allowed domains list
 */
function isAllowedDomain(src: string): boolean {
  try {
    const url = new URL(src)
    return ALLOWED_DOMAINS.includes(url.hostname)
  } catch {
    // If URL parsing fails, assume it's a local image
    return true
  }
}

/**
 * Smart optimized image component that automatically handles unknown domains
 * - Uses Next.js Image optimization for configured domains
 * - Uses Next.js Image with unoptimized prop for unknown domains
 * - Maintains all Next.js Image benefits (lazy loading, responsive, etc.)
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

  // Determine if we should use optimization based on domain
  const shouldOptimize = isAllowedDomain(src || fallback)
  
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
    // Use unoptimized for unknown domains to prevent configuration errors
    unoptimized: !shouldOptimize,
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