import type { LucideIcon } from "lucide-react"
import { Inbox } from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface EmptyStateProps {
  /** Lucide icon component shown in the tinted tile. Defaults to `Inbox`. */
  icon?: LucideIcon
  /** Optional small uppercase kicker above the title. */
  kicker?: string
  title: string
  description?: string
  /** Optional CTA(s) — typically a `<Button>`. */
  action?: ReactNode
  className?: string
  /** Visual emphasis. `dashed` reads as "nothing here yet"; `solid` as a panel. */
  variant?: "solid" | "dashed"
}

/**
 * Shared empty state. Brand-tinted icon tile, centered copy, optional kicker and
 * action.
 */
export function EmptyState({
  icon: Icon = Inbox,
  kicker,
  title,
  description,
  action,
  className,
  variant = "solid",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg px-6 py-12 text-center",
        variant === "dashed"
          ? "bg-muted/20 border border-dashed"
          : "bg-card border shadow-card",
        className,
      )}
    >
      <span className="bg-primary/10 text-primary ring-primary/15 flex size-12 items-center justify-center rounded-md ring-1 ring-inset">
        <Icon className="size-6" aria-hidden />
      </span>
      <div className="space-y-1">
        {kicker ? (
          <p className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
            {kicker}
          </p>
        ) : null}
        <p className="text-foreground text-sm font-semibold">{title}</p>
        {description ? (
          <p className="text-muted-foreground mx-auto max-w-md text-sm leading-6">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}
