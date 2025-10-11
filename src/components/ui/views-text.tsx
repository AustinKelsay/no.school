"use client"

import * as React from "react"
import { useViews } from "@/hooks/useViews"

type Notation = "standard" | "compact"

export interface ViewsTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  ns?: string
  id?: string
  keyOverride?: string
  notation?: Notation
  label?: boolean
  track?: boolean
  dedupe?: "session" | "day" | false
}

export function ViewsText({
  ns,
  id,
  keyOverride,
  notation = "standard",
  label = true,
  track = true,
  dedupe = "session",
  className,
  ...rest
}: ViewsTextProps) {
  const { count } = useViews({ ns, id, key: keyOverride, track, dedupe })

  const formatted = React.useMemo(() => {
    const value = typeof count === "number" ? count : 0
    return new Intl.NumberFormat(undefined, {
      notation: notation === "compact" ? "compact" : undefined,
      maximumFractionDigits: 1,
    }).format(value)
  }, [count, notation])

  return (
    <span className={className} {...rest}>
      {formatted}
      {label ? " views" : null}
    </span>
  )
}

