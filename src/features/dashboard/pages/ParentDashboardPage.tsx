import { Link } from "@tanstack/react-router"
import {
  Banknote,
  CalendarCheck,
  CalendarX,
  ClipboardCheck,
  GraduationCap,
  Users,
  Wallet,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { countTodayAttendance } from "../utils"
import { useParentChildren } from "@/features/attendance/hooks"
import { useAuthStore } from "@/features/auth/store/authStore"
import { todayIso } from "@/lib/date"
import { formatMoney, getFirstNumber } from "@/lib/format"
import { ChildrenOverview } from "../components/ChildrenOverview"
import { QuickActions, type QuickAction } from "../components/QuickActions"
import { useExamSummary, useFinanceSummary } from "../hooks"

const quickActions: QuickAction[] = [
  { label: "View results", to: "/parent/results/term-results", icon: GraduationCap, description: "Termly & annual" },
  { label: "Attendance", to: "/parent/attendance", icon: CalendarCheck, description: "Daily records" },
  { label: "Invoices", to: "/parent/finance/invoice", icon: Banknote, description: "Fees & balances" },
  { label: "Assessments", to: "/parent/results/continuous-assessments", icon: ClipboardCheck, description: "Continuous marks" },
]

export function ParentDashboardPage() {
  const name = useAuthStore((s) => s.user?.name ?? "there")
  const childrenQuery = useParentChildren({ date: todayIso() })
  const finance = useFinanceSummary()
  const exams = useExamSummary()

  const children = childrenQuery.data ?? []
  const { present, absent } = countTodayAttendance(children)
  const feesPaid = getFirstNumber(finance.data, ["total_paid", "paid", "amount_paid", "payments_total"])
  const balance = getFirstNumber(finance.data, [
    "outstanding_balance",
    "remaining_fees",
    "total_balance",
    "balance",
    "overdue_amount",
  ])
  const results = getFirstNumber(exams.data, [
    "latest_results_available",
    "published_results",
    "result_count",
    "results_count",
    "total_results",
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Today"
        title={`Welcome back, ${name}`}
        description="A simple daily overview for your children — attendance, fees, and results."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Children" value={children.length} icon={<Users />} loading={childrenQuery.isLoading} />
        <StatCard label="Present today" value={present} icon={<CalendarCheck />} loading={childrenQuery.isLoading} />
        <StatCard label="Absent today" value={absent} icon={<CalendarX />} loading={childrenQuery.isLoading} />
        <StatCard label="Fees paid" value={formatMoney(feesPaid)} icon={<Wallet />} loading={finance.isLoading} />
        <StatCard label="Balance" value={formatMoney(balance)} icon={<Banknote />} loading={finance.isLoading} />
        <StatCard label="Results" value={results ?? "—"} icon={<GraduationCap />} loading={exams.isLoading} />
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>My children</CardTitle>
          <CardAction>
            <Button asChild variant="ghost" size="sm">
              <Link to="/parent/children">View all</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ChildrenOverview children={children} loading={childrenQuery.isLoading} />
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-foreground text-sm font-semibold tracking-wide">Quick actions</h2>
        <QuickActions actions={quickActions} />
      </div>
    </div>
  )
}
