# Content Configuration System

This document explains the content configuration system for managing homepage carousels and content filtering.

## Overview

The content configuration system allows you to control:
- Which content sections (courses, documents, videos) appear on the homepage
- The order of content sections
- Filtering options (free/paid content)
- Carousel settings (items per view, autoplay, loop)
- Section titles and descriptions

## Configuration File

The configuration is stored in `/config/content.json`:

```json
{
  "homepage": {
    "sections": {
      "courses": {
        "enabled": true,
        "title": "Courses",
        "description": "Structured learning paths...",
        "filters": {
          "priceFilter": "all", // "all" | "free" | "paid"
          "categories": [],     // Filter by categories
          "maxItems": 12,       // Maximum items to display
          "sortBy": "newest"    // Sort order
        },
        "carousel": {
          "itemsPerView": {
            "mobile": 1,
            "tablet": 2,
            "desktop": 3
          },
          "autoplay": false,
          "loop": false
        }
      },
      // Similar configuration for documents and videos...
    },
    "sectionOrder": ["courses", "videos", "documents"]
  }
}
```

## Usage Examples

### 1. Show Only Free Courses

```json
{
  "homepage": {
    "sections": {
      "courses": {
        "enabled": true,
        "filters": {
          "priceFilter": "free"
        }
      }
    }
  }
}
```

### 2. Show Only Paid Videos

```json
{
  "homepage": {
    "sections": {
      "videos": {
        "enabled": true,
        "filters": {
          "priceFilter": "paid"
        }
      }
    }
  }
}
```

### 3. Disable Documents Section

```json
{
  "homepage": {
    "sections": {
      "documents": {
        "enabled": false
      }
    }
  }
}
```

### 4. Change Section Order

```json
{
  "homepage": {
    "sectionOrder": ["videos", "courses", "documents"]
  }
}
```

## Filter Options

### Price Filters
- `"all"` - Show all content regardless of price
- `"free"` - Show only free content (price = 0)
- `"paid"` - Show only paid content (price > 0)

### Sort Options
- `"newest"` - Newest content first
- `"oldest"` - Oldest content first
- `"price-low"` - Lowest price first
- `"price-high"` - Highest price first
- `"popular"` - Most popular first (based on enrollment/view count)

### Categories
Available categories:
- `"bitcoin"`
- `"lightning"`
- `"nostr"`
- `"frontend"`
- `"backend"`
- `"mobile"`
- `"security"`
- `"web3"`

## Implementation Details

### TypeScript Types

```typescript
export type PriceFilter = "all" | "free" | "paid"
export type ContentType = "courses" | "documents" | "videos"

export interface ContentSectionFilters {
  priceFilter: PriceFilter
  categories: string[]
  maxItems: number
  sortBy: SortOption
}

export interface ContentSection {
  enabled: boolean
  title: string
  description: string
  filters: ContentSectionFilters
  carousel: CarouselConfig
}
```

### Utility Functions

```typescript
// Apply price filter
filterContentByPrice(items, priceFilter)

// Apply category filter
filterContentByCategories(items, categories)

// Sort content
sortContent(items, sortBy)

// Apply all filters
applyContentFilters(items, filters)
```

### Hooks

```typescript
// Get full configuration
const config = useContentConfig()

// Get section configuration
const sectionConfig = useHomepageSectionConfig('courses')

// Get enabled sections
const enabledSections = useEnabledHomepageSections()
```

## Advanced Configuration

### Dynamic Configuration Loading

In a production environment, you might want to load configuration from:
- A database
- A CMS (Content Management System)
- An API endpoint
- Environment variables

Example API integration:

```typescript
export function useContentConfig() {
  const [config, setConfig] = useState<ContentConfig | null>(null)

  useEffect(() => {
    fetch('/api/content-config')
      .then(res => res.json())
      .then(data => setConfig(data))
  }, [])

  return config
}
```

### Per-User Configuration

You could extend the system to support user preferences:

```typescript
interface UserContentPreferences {
  userId: string
  homepage: {
    hidePaidContent: boolean
    preferredCategories: string[]
    itemsPerPage: number
  }
}
```

## Best Practices

1. **Validate Configuration**: Always validate configuration data before applying
2. **Cache Configuration**: Use caching to avoid frequent reads
3. **Fallback Values**: Provide sensible defaults for missing configuration
4. **Type Safety**: Use TypeScript types to ensure configuration consistency
5. **Performance**: Apply filters efficiently, especially with large datasets

## Future Enhancements

- Real-time configuration updates via WebSocket
- A/B testing different configurations
- Analytics on configuration effectiveness
- User-specific content recommendations
- Machine learning-based content ordering