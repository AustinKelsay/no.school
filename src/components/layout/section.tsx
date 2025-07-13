import { cn } from "@/lib/utils"
import { Container } from "./container"

/**
 * Section component for consistent vertical spacing and structure
 * Provides standardized padding and optional container wrapping
 */
interface SectionProps {
  children: React.ReactNode
  className?: string
  containerSize?: "sm" | "md" | "lg" | "xl" | "full"
  spacing?: "sm" | "md" | "lg" | "xl"
  withContainer?: boolean
}

const spacingClasses = {
  sm: "py-8",
  md: "py-12", 
  lg: "py-16",
  xl: "py-20"
}

export function Section({ 
  children, 
  className,
  containerSize = "xl",
  spacing = "md",
  withContainer = true
}: SectionProps) {
  const content = withContainer ? (
    <Container size={containerSize}>{children}</Container>
  ) : (
    children
  )

  return (
    <section className={cn(
      spacingClasses[spacing],
      className
    )}>
      {content}
    </section>
  )
} 