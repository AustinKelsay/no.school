"use client"

import { CircleHelp } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { ReactNode, MouseEvent } from "react"

interface InfoTooltipProps {
  content: ReactNode
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  className?: string
  iconClassName?: string
}

export const InfoTooltip = ({
  content,
  side = "top",
  align = "center",
  className,
  iconClassName
}: InfoTooltipProps) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleClick}
          aria-label="More info"
          className={cn(
            "text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full p-0.5",
            className
          )}
        >
          <CircleHelp className={cn("h-4 w-4", iconClassName)} aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        className="max-w-xs text-left leading-tight"
      >
        {content}
      </TooltipContent>
    </Tooltip>
  )
}
