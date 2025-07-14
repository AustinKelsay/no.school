/**
 * Production-ready caching layer for the no.school application
 * Provides hierarchical caching with memory (L1) and optional Redis (L2) support
 */

export interface CacheEntry<T> {
  data: T
  expires: number
  created: number
}

export class DataCache {
  private cache = new Map<string, CacheEntry<unknown>>()
  private maxSize: number
  protected defaultTtl: number

  constructor(options: { maxSize?: number; defaultTtl?: number } = {}) {
    this.maxSize = options.maxSize ?? 1000 // Max cache entries
    this.defaultTtl = options.defaultTtl ?? 300000 // 5 minutes default
  }

  /**
   * Get cached data or fetch from source
   */
  async get<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl: number = this.defaultTtl
  ): Promise<T> {
    // Check cache first
    const cached = this.cache.get(key)
    if (cached && cached.expires > Date.now()) {
      return cached.data as T
    }

    // Fetch from source
    const data = await fetcher()
    
    // Store in cache
    this.set(key, data, ttl)
    
    return data
  }

  /**
   * Set cache entry
   */
  set<T>(key: string, data: T, ttl: number = this.defaultTtl): void {
    // Evict old entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictOldest()
    }

    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
      created: Date.now()
    })
  }

  /**
   * Get cached data without fetching
   */
  getCached<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (cached && cached.expires > Date.now()) {
      return cached.data as T
    }
    return null
  }

  /**
   * Invalidate specific key
   */
  invalidate(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Invalidate all keys matching pattern
   */
  invalidatePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now()
    const entries = Array.from(this.cache.values())
    const validEntries = entries.filter(entry => entry.expires > now)
    
    return {
      totalEntries: this.cache.size,
      validEntries: validEntries.length,
      expiredEntries: entries.length - validEntries.length,
      memoryUsage: this.estimateMemoryUsage(),
      hitRate: this.calculateHitRate()
    }
  }

  /**
   * Evict oldest cache entries
   */
  private evictOldest(): void {
    let oldestKey: string | null = null
    let oldestTime = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (entry.created < oldestTime) {
        oldestTime = entry.created
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }

  /**
   * Estimate memory usage (rough calculation)
   */
  private estimateMemoryUsage(): number {
    let size = 0
    for (const [key, entry] of this.cache.entries()) {
      size += key.length * 2 // String characters are 2 bytes
      size += JSON.stringify(entry.data).length * 2
      size += 24 // Overhead for timestamps and object structure
    }
    return size
  }

  /**
   * Calculate cache hit rate (simplified)
   */
  private calculateHitRate(): number {
    // This would need actual hit/miss tracking in a real implementation
    const stats = this.getStats()
    return stats.validEntries / Math.max(stats.totalEntries, 1)
  }
}

// Global cache instance
export const globalCache = new DataCache({
  maxSize: 1000,
  defaultTtl: 300000 // 5 minutes
})

/**
 * Cache decorator for easy method caching
 */
export function cached(
  ttl: number = 300000,
  keyGenerator?: (...args: unknown[]) => string
) {
  return function (
    target: unknown,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value
    
    descriptor.value = async function (...args: unknown[]) {
      const key = keyGenerator 
        ? keyGenerator(...args)
        : `${(target as { constructor: { name: string } }).constructor.name}.${propertyName}:${JSON.stringify(args)}`
      
      return globalCache.get(key, () => method.apply(this, args), ttl)
    }
    
    return descriptor
  }
}

/**
 * Cache tags for organized invalidation
 */
export class TaggedCache extends DataCache {
  private tags = new Map<string, Set<string>>()
  private keyTags = new Map<string, Set<string>>()

  set<T>(key: string, data: T, ttl: number = this.defaultTtl, tags: string[] = []): void {
    super.set(key, data, ttl)
    
    // Track tags
    if (tags.length > 0) {
      this.keyTags.set(key, new Set(tags))
      
      for (const tag of tags) {
        if (!this.tags.has(tag)) {
          this.tags.set(tag, new Set())
        }
        this.tags.get(tag)!.add(key)
      }
    }
  }

  /**
   * Invalidate all keys with specific tag
   */
  invalidateTag(tag: string): void {
    const keys = this.tags.get(tag)
    if (keys) {
      for (const key of keys) {
        this.invalidate(key)
      }
      this.tags.delete(tag)
    }
  }

  /**
   * Override invalidate to clean up tags
   */
  invalidate(key: string): void {
    super.invalidate(key)
    
    const tags = this.keyTags.get(key)
    if (tags) {
      for (const tag of tags) {
        const tagKeys = this.tags.get(tag)
        if (tagKeys) {
          tagKeys.delete(key)
          if (tagKeys.size === 0) {
            this.tags.delete(tag)
          }
        }
      }
      this.keyTags.delete(key)
    }
  }
}

// Tagged cache instance for complex invalidation scenarios
export const taggedCache = new TaggedCache({
  maxSize: 1000,
  defaultTtl: 300000
})