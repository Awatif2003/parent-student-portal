import type { ReactNode } from "react"

import { Badge, type BadgeVariant } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface StatCardProps {
  label: string
  value: ReactNode
  icon?: ReactNode
  /** Trend / status chip rendered top-right. */
  delta?: ReactNode
  deltaVariant?: BadgeVariant
  /** Optional caption shown under the value. */
  hint?: string
  /** When true, renders a skeleton in place of the value (and delta). */
  loading?: boolean
  className?: string
}

/**
 * Premium KPI surface: elevated card, brand-tinted icon tile, prominent
 * `tabular-nums` value, optional trend chip, and a built-in loading skeleton.
 */
export function StatCard({
  label,
  value,
  icon,
  delta,
  deltaVariant = "success",
  hint,
  loading = false,
  className,
}: StatCardProps) {
  return (
    <Card variant="stat" padding="none" className={className}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-muted-foreground truncate text-sm font-medium">{label}</p>
          {icon ? (
            <div className="bg-primary/10 text-primary ring-primary/15 flex size-9 shrink-0 items-center justify-center rounded-md ring-1 ring-inset [&_svg]:size-[1.1rem]">
              {icon}
            </div>
          ) : null}
        </div>
        <div className="mt-3 flex items-end justify-between gap-3">
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-foreground text-3xl font-semibold tabular-nums tracking-tight">
              {value}
            </p>
          )}
          {delta && !loading ? (
            <Badge variant={deltaVariant} className="mb-0.5 shrink-0">
              {delta}
            </Badge>
          ) : null}
        </div>
        {hint && !loading ? (
          <p className="text-muted-foreground mt-1.5 truncate text-xs">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
