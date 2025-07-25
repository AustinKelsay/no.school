import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        draft: "border-orange-200 bg-orange-50/30 dark:border-orange-800 dark:bg-orange-950/20",
        warning: "border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Card({ 
  className, 
  variant,
  ...props 
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
