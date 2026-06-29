import {
  Banknote,
  CalendarCheck,
  ClipboardCheck,
  GraduationCap,
  IdCard,
  Percent,
} from "lucide-react"

import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { useMyAttendance } from "@/features/attendance/hooks"
import { summarize } from "@/features/attendance/utils/status"
import { useAuthStore } from "@/features/auth/store/authStore"
import { formatMoney, getFirstNumber } from "@/lib/format"
import { QuickActions, type QuickAction } from "../components/QuickActions"
import { useExamSummary, useFinanceSummary } from "../hooks"

const quickActions: QuickAction[] = [
  { label: "My results", to: "/student/results", icon: GraduationCap, description: "Term & annual" },
  { label: "Attendance", to: "/student/attendance", icon: CalendarCheck, description: "Your record" },
  { label: "Assessments", to: "/student/results/continuous-assessment", icon: ClipboardCheck, description: "Continuous marks" },
  { label: "My details", to: "/student/details", icon: IdCard, description: "Profile & class" },
]

export function StudentDashboardPage() {
  const name = useAuthStore((s) => s.user?.name ?? "there")
  const attendance = useMyAttendance()
  const finance = useFinanceSummary()
  const exams = useExamSummary()

  const summary = summarize(attendance.data ?? [])
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
        title={`Hello, ${name}`}
        description="Your attendance, results, and fees at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Attendance rate" value={`${summary.rate}%`} icon={<Percent />} loading={attendance.isLoading} />
        <StatCard label="Present days" value={summary.present} icon={<CalendarCheck />} loading={attendance.isLoading} />
        <StatCard label="Results" value={results ?? "—"} icon={<GraduationCap />} loading={exams.isLoading} />
        <StatCard label="Balance" value={formatMoney(balance)} icon={<Banknote />} loading={finance.isLoading} />
      </div>

      <div className="space-y-3">
        <h2 className="text-foreground text-sm font-semibold tracking-wide">Quick actions</h2>
        <QuickActions actions={quickActions} />
      </div>
    </div>
  )
}
