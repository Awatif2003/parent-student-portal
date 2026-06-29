import { Link } from "@tanstack/react-router"
import { Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useUnreadCount } from "../hooks"

/** Header bell with a live unread badge. `to` is the role's notifications path. */
export function NotificationBell({
  to,
}: {
  to: "/parent/notifications" | "/student/notifications"
}) {
  const { data: unread = 0 } = useUnreadCount()
  const hasUnread = unread > 0

  return (
    <Button
      asChild
      variant="ghost"
      size="icon-sm"
      className="relative"
      aria-label={hasUnread ? `Notifications, ${unread} unread` : "Notifications"}
    >
      <Link to={to}>
        <Bell />
        {hasUnread ? (
          <span
            className={cn(
              "bg-destructive text-white absolute -top-0.5 -right-0.5 flex min-w-4 items-center justify-center rounded-full px-1 text-[0.6rem] font-bold leading-4",
            )}
          >
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </Link>
    </Button>
  )
}
