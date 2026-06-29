import { Bell, CheckCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { PageHeader } from "@/components/ui/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { formatReadableDate } from "@/lib/date"
import { cn } from "@/lib/utils"
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "../hooks"
import type { NotificationItem } from "../types"

function title(n: NotificationItem): string {
  return String(n.title ?? n.subject ?? "Notification")
}

function message(n: NotificationItem): string {
  return String(n.message ?? n.body ?? n.description ?? "")
}

export function NotificationsPage() {
  const { data = [], isLoading, isError, error, refetch } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAll = useMarkAllNotificationsRead()
  const hasUnread = data.some((n) => !n.isRead)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Updates"
        title="Notifications"
        icon={<Bell />}
        description="Announcements and alerts from your school."
        actions={
          hasUnread ? (
            <Button variant="outline" size="sm" onClick={() => markAll.mutate()} disabled={markAll.isPending}>
              <CheckCheck />
              Mark all read
            </Button>
          ) : undefined
        }
      />

      {isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} padding="none">
              <CardContent className="space-y-2 p-4">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-full max-w-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={Bell} variant="dashed" title="No notifications" description="You're all caught up." />
      ) : (
        <div className="space-y-2">
          {data.map((n) => (
            <Card
              key={String(n.id)}
              padding="none"
              className={cn(
                "transition-colors",
                n.isRead ? "" : "border-primary/30 bg-primary/[0.03]",
              )}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    n.isRead ? "bg-transparent" : "bg-primary",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-foreground text-sm font-semibold">{title(n)}</p>
                    {n.created_at ? (
                      <span className="text-muted-foreground shrink-0 text-xs">
                        {formatReadableDate(n.created_at)}
                      </span>
                    ) : null}
                  </div>
                  {message(n) ? (
                    <p className="text-muted-foreground mt-1 text-sm leading-6">{message(n)}</p>
                  ) : null}
                </div>
                {!n.isRead ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markRead.mutate(n.id)}
                    disabled={markRead.isPending}
                  >
                    Mark read
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
