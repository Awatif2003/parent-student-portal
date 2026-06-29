import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { NotificationBell } from "@/features/notifications/components/NotificationBell"
import { UserMenu } from "@/components/layout/UserMenu"
import { formatReadableDate, todayIso } from "@/lib/date"
import type { Role } from "@/types"

export function Topbar({ role, onOpenMobile }: { role: Role; onOpenMobile: () => void }) {
  const notificationsPath = role === "student" ? "/student/notifications" : "/parent/notifications"

  return (
    <header className="bg-card/80 sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 backdrop-blur sm:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={onOpenMobile}
        aria-label="Open navigation"
      >
        <Menu />
      </Button>
      <p className="text-muted-foreground hidden text-sm font-medium sm:block">
        {role === "student" ? "Student Portal" : "Parent Portal"}
      </p>
      <div className="ml-auto flex items-center gap-2">
        <time className="text-muted-foreground hidden text-sm md:block" dateTime={todayIso()}>
          {formatReadableDate(new Date())}
        </time>
        <NotificationBell to={notificationsPath} />
        <UserMenu />
      </div>
    </header>
  )
}
