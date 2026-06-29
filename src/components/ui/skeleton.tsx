import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Token-driven loading placeholder. Pulses gently (disabled under
 * prefers-reduced-motion via the global rule in styles.css). Compose with
 * width/height/shape utilities, e.g. `<Skeleton className="h-4 w-32" />`.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
