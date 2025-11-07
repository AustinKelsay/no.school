type NoteLike = {
  tags?: string[][]
  content?: string
}

type ImageExtractionOptions = {
  /**
   * Whether to allow generic URL fallback (any http(s):// URL) when no
   * image-specific URLs are found. Defaults to false to avoid false positives.
   */
  allowGenericUrlFallback?: boolean
}

const IMAGE_TAG_PRIORITIES = ["image", "picture", "thumbnail", "thumb", "banner"]

/**
 * Common image file extensions that indicate a URL likely points to an image.
 */
const IMAGE_EXTENSIONS = /\.(png|jpg|jpeg|gif|webp|svg)(\?|#|$)/i

function extractImageFromTags(tags?: string[][]): string | undefined {
  if (!tags) return undefined

  for (const key of IMAGE_TAG_PRIORITIES) {
    const directMatch = tags.find(tag => tag[0] === key && typeof tag[1] === "string" && tag[1].trim().length > 0)
    if (directMatch?.[1]) {
      return directMatch[1]
    }
  }

  const imetaTag = tags.find(tag => tag[0] === "imeta")
  if (imetaTag) {
    for (const entry of imetaTag.slice(1)) {
      const trimmedEntry = entry?.trim()
      if (!trimmedEntry) continue

      let key: string | undefined
      let value = ""

      if (trimmedEntry.includes("=")) {
        const [rawKey, ...rest] = trimmedEntry.split("=")
        key = rawKey?.trim()
        value = rest.join("=").trim()
      } else {
        const [rawKey, ...rest] = trimmedEntry.split(/\s+/)
        key = rawKey?.trim()
        value = rest.join(" ").trim()
      }

      if (key === "url" && value) {
        return value
      }
    }
  }

  return undefined
}

/**
 * Extracts an image URL from note content, checking explicit image patterns first,
 * then falling back to URLs with image extensions, and optionally to any URL.
 *
 * @param content - The note content to search for image URLs
 * @param options - Configuration options for extraction behavior
 * @returns The first matching image URL, or undefined if none found
 */
function extractImageFromContent(
  content?: string,
  options?: ImageExtractionOptions
): string | undefined {
  if (!content) return undefined

  // Explicit image patterns (markdown images, HTML img tags, YouTube thumbnails)
  // These are always checked first and respected regardless of options
  const markdownMatch = content.match(/!\[[^\]]*\]\(([^)]+)\)/i)
  if (markdownMatch?.[1]) {
    // Extract URL from markdown image syntax, handling:
    // - Angle-bracketed URLs: <url>
    // - Titles with spaces: url "title"
    // - Titles without spaces: url"title"
    const urlWithOptionalTitle = markdownMatch[1]
    
    // Split on whitespace once to separate URL from title
    const [urlPart] = urlWithOptionalTitle.split(/\s+/, 1)
    
    let urlOnly = urlPart.trim()
    
    // Strip surrounding angle brackets if present (handles <url> and <url>"title")
    if (urlOnly.startsWith("<")) {
      const closingBracketIndex = urlOnly.indexOf(">")
      if (closingBracketIndex !== -1) {
        urlOnly = urlOnly.slice(1, closingBracketIndex).trim()
      } else {
        // Malformed, remove just the opening bracket
        urlOnly = urlOnly.slice(1).trim()
      }
    }
    
    // Strip title if glued to URL without space (e.g., url"title")
    urlOnly = urlOnly.replace(/["'][^"']*["']$/, "").trim()
    
    return urlOnly || undefined
  }

  const htmlImgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i)
  if (htmlImgMatch?.[1]) {
    return htmlImgMatch[1]
  }

  const youtubeThumbMatch = content.match(/https?:\/\/img\.youtube\.com\/[^\s"'()]+/i)
  if (youtubeThumbMatch?.[0]) {
    return youtubeThumbMatch[0]
  }

  // Find all URLs in the content
  const urlMatches = content.matchAll(/https?:\/\/[^\s"'()]+/gi)
  const urls = Array.from(urlMatches, (match) => match[0])

  // Prefer URLs with image extensions to avoid false positives
  const imageUrlMatch = urls.find((url) => IMAGE_EXTENSIONS.test(url))
  if (imageUrlMatch) {
    return imageUrlMatch
  }

  // Generic URL fallback only if explicitly enabled
  if (options?.allowGenericUrlFallback && urls.length > 0) {
    return urls[0]
  }

  return undefined
}

/**
 * Extracts an image URL from a note, checking tags first, then content.
 * Respects explicit image patterns and prefers URLs with image extensions.
 *
 * @param note - The note to extract an image from
 * @param fallback - Optional fallback image URL if none found in the note
 * @param options - Configuration options for extraction behavior
 * @returns The extracted image URL, or the fallback if provided
 */
export function getNoteImage(
  note?: NoteLike,
  fallback?: string,
  options?: ImageExtractionOptions
): string | undefined {
  const fromTags = extractImageFromTags(note?.tags)
  if (fromTags) return fromTags

  const fromContent = extractImageFromContent(note?.content, options)
  if (fromContent) return fromContent

  return fallback
}
