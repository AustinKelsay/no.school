/**
 * URL validation utilities for pleb.school
 * 
 * Provides secure URL validation to prevent open redirect vulnerabilities
 * and ensure URLs are safe for authentication callbacks.
 */

/**
 * List of trusted domains that are allowed for external redirects
 * These domains are considered safe for authentication callbacks
 */
const TRUSTED_DOMAINS = [
  // Our own domain
  'pleb.school',
  'localhost',
  '127.0.0.1',
  // Development domains
  'vercel.app',
  'netlify.app',
  // Trusted third-party domains (add as needed)
  'github.com',
  'githubusercontent.com',
]

/**
 * Validates if a URL is safe for authentication callbacks
 * 
 * @param url - The URL to validate
 * @returns Object with validation result and sanitized URL
 */
export function validateCallbackUrl(url: string | null | undefined): {
  isValid: boolean
  sanitizedUrl: string
  error?: string
} {
  // Handle null/undefined/empty values
  if (!url || url.trim() === '') {
    return {
      isValid: true,
      sanitizedUrl: '/'
    }
  }

  const trimmedUrl = url.trim()

  // Check if it's a relative URL (starts with /)
  if (trimmedUrl.startsWith('/')) {
    // Validate relative URL format
    try {
      // Ensure it's a valid relative path
      const urlObj = new URL(trimmedUrl, 'http://localhost')
      const path = urlObj.pathname
      
      // Check for suspicious patterns
      if (path.includes('..') || path.includes('//')) {
        return {
          isValid: false,
          sanitizedUrl: '/',
          error: 'Invalid relative URL format'
        }
      }
      
      return {
        isValid: true,
        sanitizedUrl: path
      }
    } catch {
      return {
        isValid: false,
        sanitizedUrl: '/',
        error: 'Invalid URL format'
      }
    }
  }

  // Handle absolute URLs
  try {
    const urlObj = new URL(trimmedUrl)
    
    // Check if it's a trusted domain
    const hostname = urlObj.hostname.toLowerCase()
    const isTrustedDomain = TRUSTED_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    )
    
    if (!isTrustedDomain) {
      return {
        isValid: false,
        sanitizedUrl: '/',
        error: 'Untrusted domain for redirect'
      }
    }
    
    // Additional security checks for external URLs
    if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
      return {
        isValid: false,
        sanitizedUrl: '/',
        error: 'Invalid protocol'
      }
    }
    
    // Check for suspicious URL patterns
    if (urlObj.search.includes('javascript:') || 
        urlObj.search.includes('data:') ||
        urlObj.search.includes('vbscript:')) {
      return {
        isValid: false,
        sanitizedUrl: '/',
        error: 'Dangerous URL scheme detected'
      }
    }
    
    return {
      isValid: true,
      sanitizedUrl: urlObj.toString()
    }
    
  } catch (error) {
    return {
      isValid: false,
      sanitizedUrl: '/',
      error: 'Invalid URL format'
    }
  }
}

/**
 * Validates and sanitizes a callback URL from search parameters
 * 
 * @param searchParams - URLSearchParams object
 * @param paramName - Name of the parameter containing the callback URL
 * @param fallback - Fallback URL if validation fails (default: '/')
 * @returns Sanitized callback URL
 */
export function validateCallbackUrlFromParams(
  searchParams: URLSearchParams,
  paramName: string = 'callbackUrl',
  fallback: string = '/'
): string {
  const callbackUrl = searchParams.get(paramName)
  const validation = validateCallbackUrl(callbackUrl)
  
  if (!validation.isValid) {
    console.warn(`Invalid callback URL rejected: ${callbackUrl}`, validation.error)
    return fallback
  }
  
  return validation.sanitizedUrl
}

/**
 * Checks if a URL is a relative URL (starts with /)
 * 
 * @param url - The URL to check
 * @returns True if the URL is relative
 */
export function isRelativeUrl(url: string): boolean {
  return url.startsWith('/')
}

/**
 * Checks if a URL is an absolute URL with a trusted domain
 * 
 * @param url - The URL to check
 * @returns True if the URL is absolute and from a trusted domain
 */
export function isTrustedAbsoluteUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()
    return TRUSTED_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    )
  } catch {
    return false
  }
} 
