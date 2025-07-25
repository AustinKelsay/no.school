import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Eye, Share } from "lucide-react"
import Link from "next/link"

interface DraftBannerProps {
  title?: string
  description?: string
  actions?: React.ReactNode
  variant?: "default" | "compact"
}

/**
 * Draft warning banner component using configurable theme system
 * Uses semantic warning card variant instead of hardcoded colors
 */
export function DraftBanner({ 
  title = "Draft Preview", 
  description = "This is how your content will appear once published. Make changes or publish when ready.",
  actions,
  variant = "default"
}: DraftBannerProps) {
  return (
    <Card variant="warning">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center dark:bg-orange-900/30">
              <Edit className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold text-orange-900 dark:text-orange-100">{title}</h3>
              {variant === "default" && (
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  {description}
                </p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Draft actions for common draft operations
 */
interface DraftActionsProps {
  editHref?: string
  previewHref?: string
  publishHref?: string
  onDelete?: () => void
  className?: string
}

export function DraftActions({ 
  editHref, 
  previewHref, 
  publishHref, 
  onDelete,
  className 
}: DraftActionsProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {editHref && (
        <Button variant="outline" size="sm" asChild>
          <Link href={editHref}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
      )}
      
      {previewHref && (
        <Button variant="outline" size="sm" asChild>
          <Link href={previewHref}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Link>
        </Button>
      )}
      
      {publishHref && (
        <Button size="sm" asChild>
          <Link href={publishHref}>
            <Share className="h-4 w-4 mr-2" />
            Publish
          </Link>
        </Button>
      )}
    </div>
  )
}