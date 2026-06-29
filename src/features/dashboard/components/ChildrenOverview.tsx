import { Users } from "lucide-react"

import { Avatar } from "@/components/ui/avatar"
import { Badge, type BadgeVariant } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { attendanceTone, TONE_LABEL } from "@/features/attendance/utils/status"
import type { ChildAttendance, AttendanceTone } from "@/features/attendance/types"
import { getDisplayName } from "@/lib/identity"

const VARIANT_BY_TONE: Record<AttendanceTone, BadgeVariant> = {
  present: "success",
  absent: "danger",
  late: "warning",
  excused: "muted",
  unknown: "muted",
}

function childTone(child: ChildAttendance): AttendanceTone {
  const latest = child.attendance?.[0]
  return latest ? attendanceTone(latest) : "unknown"
}

function childMeta(child: ChildAttendance): string {
  return (
    [child.current_class, child.school?.name].filter(Boolean).join(" · ") ||
    "Class & school unavailable"
  )
}

export function ChildrenOverview({
  children,
  loading,
}: {
  children: ChildAttendance[]
  loading?: boolean
}) {
  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} padding="none">
            <CardContent className="flex items-center gap-3 p-4">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (children.length === 0) {
    return (
      <EmptyState
        icon={Users}
        variant="dashed"
        title="No children linked"
        description="No children were returned for this guardian account."
      />
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {children.map((child) => {
        const tone = childTone(child)
        return (
          <Card key={String(child.student_id)} padding="none">
            <CardContent className="flex items-center gap-3 p-4">
              <Avatar name={getDisplayName(child)} />
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-semibold">
                  {getDisplayName(child)}
                </p>
                <p className="text-muted-foreground truncate text-xs">{childMeta(child)}</p>
              </div>
              <Badge variant={VARIANT_BY_TONE[tone]}>{TONE_LABEL[tone]}</Badge>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
