type NoteLike = {
  tags?: string[][]
  content?: string
}

const IMAGE_TAG_PRIORITIES = ["image", "picture", "thumbnail", "thumb", "banner"]

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

function extractImageFromContent(content?: string): string | undefined {
  if (!content) return undefined

  const markdownMatch = content.match(/!\[[^\]]*\]\(([^)]+)\)/i)
  if (markdownMatch?.[1]) {
    // Strip optional title (whitespace followed by quoted text) from the URL
    const urlWithOptionalTitle = markdownMatch[1]
    const urlOnly = urlWithOptionalTitle.replace(/\s+["'][^"']*["']\s*$/, "").trim()
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

  const genericUrlMatch = content.match(/https?:\/\/[^\s"'()]+/i)
  if (genericUrlMatch?.[0]) {
    return genericUrlMatch[0]
  }

  return undefined
}

export function getNoteImage(note?: NoteLike, fallback?: string): string | undefined {
  const fromTags = extractImageFromTags(note?.tags)
  if (fromTags) return fromTags

  const fromContent = extractImageFromContent(note?.content)
  if (fromContent) return fromContent

  return fallback
}
