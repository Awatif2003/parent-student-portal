import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { isApiError } from "@/lib/api/client"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  /** The thrown error — an ApiError message is surfaced when available. */
  error?: unknown
  title?: string
  /** Retry handler — typically a react-query `refetch`. */
  onRetry?: () => void
  className?: string
}

export function resolveErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (isApiError(error)) return error.message
  if (error instanceof Error) return error.message
  return fallback
}

export function ErrorState({ error, title = "Unable to load", onRetry, className }: ErrorStateProps) {
  return (
    <div
      className={cn(
        "border-destructive/30 bg-destructive/5 flex flex-col items-center justify-center gap-3 rounded-lg border px-6 py-12 text-center",
        className,
      )}
    >
      <span className="bg-destructive/10 text-destructive ring-destructive/20 flex size-12 items-center justify-center rounded-md ring-1 ring-inset">
        <AlertTriangle className="size-6" aria-hidden />
      </span>
      <div className="space-y-1">
        <p className="text-foreground text-sm font-semibold">{title}</p>
        <p className="text-muted-foreground mx-auto max-w-md text-sm leading-6">
          {resolveErrorMessage(error)}
        </p>
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}
