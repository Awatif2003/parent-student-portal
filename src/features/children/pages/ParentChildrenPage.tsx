import { Link } from "@tanstack/react-router"
import { CalendarCheck, GraduationCap, Receipt, Users } from "lucide-react"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { PageHeader } from "@/components/ui/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { useParentChildren } from "@/features/attendance/hooks"
import type { ChildAttendance } from "@/features/attendance/types"
import { getDisplayName } from "@/lib/identity"

function detail(label: string, value?: string) {
  return (
    <div className="min-w-0">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="text-foreground truncate text-sm font-medium">{value || "—"}</p>
    </div>
  )
}

function ChildCard({ child }: { child: ChildAttendance }) {
  return (
    <Card padding="none">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center gap-3">
          <Avatar name={getDisplayName(child)} size="lg" />
          <div className="min-w-0">
            <p className="text-foreground truncate text-base font-semibold">
              {getDisplayName(child)}
            </p>
            <p className="text-muted-foreground truncate text-sm">
              {child.admission_number || "No admission number"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t pt-4">
          {detail("Class", child.current_class)}
          {detail("School", child.school?.name)}
          {detail("Academic year", child.academic_year)}
          {detail("Recorded days", String(child.attendance?.length ?? 0))}
        </div>

        <div className="flex flex-wrap gap-2 border-t pt-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/parent/attendance">
              <CalendarCheck />
              Attendance
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/parent/results/term-results">
              <GraduationCap />
              Results
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/parent/finance/invoice">
              <Receipt />
              Finance
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function ParentChildrenPage() {
  const { data = [], isLoading, isError, error, refetch } = useParentChildren()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Parent Portal"
        title="My Children"
        icon={<Users />}
        description="The students linked to your guardian account, across all schools."
      />

      {isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} padding="none">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState
          icon={Users}
          variant="dashed"
          title="No children linked"
          description="No students were returned for this guardian account. Contact the school if this looks wrong."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((child) => (
            <ChildCard key={String(child.student_id)} child={child} />
          ))}
        </div>
      )}
    </div>
  )
}
