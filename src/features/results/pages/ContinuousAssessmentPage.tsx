import { useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { ClipboardCheck } from "lucide-react"

import { ChildSelect } from "@/components/ChildSelect"
import { DataTable } from "@/components/DataTable"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { PageHeader } from "@/components/ui/page-header"
import { useParentChildren } from "@/features/attendance/hooks"
import { formatDecimal } from "@/lib/format"
import { useContinuousAssessment } from "../hooks"
import type { ContinuousAssessmentMark } from "../types"

const columns: ColumnDef<ContinuousAssessmentMark>[] = [
  {
    accessorKey: "subject_name",
    header: "Subject",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.subject_name ?? row.original.subject ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "exam_name",
    header: "Assessment",
    cell: ({ row }) => row.original.exam_name ?? row.original.exam ?? "—",
  },
  {
    accessorKey: "marks",
    header: "Marks",
    cell: ({ row }) => formatDecimal(row.original.marks),
  },
  {
    accessorKey: "percentage",
    header: "Percentage",
    cell: ({ row }) =>
      row.original.percentage != null ? `${formatDecimal(row.original.percentage)}%` : "—",
  },
  {
    id: "grade",
    header: "Grade",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.grade ? <Badge variant="muted">{row.original.grade}</Badge> : "—",
  },
]

export function ContinuousAssessmentPage() {
  const childrenQuery = useParentChildren()
  const children = childrenQuery.data ?? []

  const [selected, setSelected] = useState("")
  const studentId = selected || (children[0] ? String(children[0].student_id) : "")

  const { data = [], isLoading, isError, error, refetch } = useContinuousAssessment(studentId)

  const empty = useMemo(
    () => (
      <EmptyState
        icon={ClipboardCheck}
        variant="dashed"
        title="No assessments yet"
        description="Continuous assessment marks will appear here once teachers record them."
      />
    ),
    [],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Results"
        title="Continuous Assessment"
        icon={<ClipboardCheck />}
        description="Live marks recorded before results are published."
        actions={
          children.length > 0 ? (
            <ChildSelect children={children} value={studentId} onChange={setSelected} />
          ) : undefined
        }
      />

      {isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : !childrenQuery.isLoading && children.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          variant="dashed"
          title="No children linked"
          description="No students were returned for this guardian account."
        />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          loading={isLoading || childrenQuery.isLoading}
          empty={empty}
        />
      )}
    </div>
  )
}
