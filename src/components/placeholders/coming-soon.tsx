import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Highlight {
  icon: LucideIcon
  title: string
  description: string
}

interface CtaConfig {
  label: string
  href: string
  variant?: "default" | "outline"
}

interface ComingSoonPlaceholderProps {
  badge?: string
  title: string
  description: string
  highlights?: Highlight[]
  primaryCta?: CtaConfig
  secondaryCta?: CtaConfig
}

/**
 * Themed placeholder for upcoming product areas.
 * Keeps typography and spacing consistent with the global system.
 */
export function ComingSoonPlaceholder({
  badge = "Coming soon",
  title,
  description,
  highlights = [],
  primaryCta,
  secondaryCta
}: ComingSoonPlaceholderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border bg-card/60 p-8 sm:p-10 shadow-lg">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/15 to-transparent" />
      <div className="relative space-y-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          {badge ? (
            <Badge className="mx-auto w-fit" variant="secondary">
              {badge}
            </Badge>
          ) : null}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {highlights.length ? (
          <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
            {highlights.map((item, index) => (
              <Card
                key={`${item.title}-${index}`}
                className="h-full border-border bg-background/60 p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : null}

        {(primaryCta || secondaryCta) && (
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            {primaryCta ? (
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
            ) : null}
            {secondaryCta ? (
              <Button
                size="lg"
                variant={secondaryCta.variant ?? "outline"}
                className="w-full sm:w-auto"
                asChild
              >
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
