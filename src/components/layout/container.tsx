import { cn } from "@/lib/utils"

/**
 * Container component for consistent content width and spacing
 * Provides responsive padding and max-width constraints
 */
interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

const containerSizes = {
  sm: "max-w-2xl",
  md: "max-w-4xl", 
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-screen-2xl"
}

export function Container({ 
  children, 
  className,
  size = "xl"
}: ContainerProps) {
  return (
    <div className={cn(
      "container mx-auto px-4 sm:px-6 lg:px-8",
      containerSizes[size],
      className
    )}>
      {children}
    </div>
  )
} 