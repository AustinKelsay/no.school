import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Edit } from "lucide-react"

interface DraftBadgeProps {
  variant?: "default" | "outline" | "compact"
  className?: string
}

/**
 * Draft status badge component using configurable theme system
 * Uses semantic draft variants instead of hardcoded colors
 */
export function DraftBadge({ variant = "default", className }: DraftBadgeProps) {
  const badgeVariant = variant === "outline" ? "draft-outline" : "draft"
  
  if (variant === "compact") {
    return (
      <Badge variant={badgeVariant} className={className}>
        Draft
      </Badge>
    )
  }
  
  return (
    <Badge variant={badgeVariant} className={className}>
      <Edit className="h-3 w-3 mr-1" />
      Draft
    </Badge>
  )
}

/**
 * Draft preview badge for indicating preview mode
 */
export function DraftPreviewBadge({ className }: { className?: string }) {
  return (
    <Badge variant="draft-outline" className={className}>
      <Edit className="h-3 w-3 mr-1" />
      Draft Preview
    </Badge>
  )
}