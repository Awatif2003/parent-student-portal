import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { FileText } from "lucide-react"

import { DataTable } from "@/components/DataTable"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { PageHeader } from "@/components/ui/page-header"
import { getDisplayName } from "@/lib/identity"
import { formatDecimal, formatRank, titleCase } from "@/lib/format"
import { useTermResults } from "../hooks"
import type { TermResult } from "../types"

const columns: ColumnDef<TermResult>[] = [
  {
    id: "student",
    header: "Student",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="text-foreground truncate font-medium">{getDisplayName(row.original)}</p>
        <p className="text-muted-foreground truncate text-xs">
          {row.original.student_admission ?? row.original.admission_number ?? "—"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "term_name",
    header: "Term",
    cell: ({ row }) => row.original.term_name ?? "—",
  },
  {
    id: "class",
    header: "Class",
    cell: ({ row }) => row.original.class_name ?? row.original.stream_name ?? "—",
  },
  {
    id: "average",
    header: "Average",
    cell: ({ row }) => formatDecimal(row.original.average_marks ?? row.original.average),
  },
  {
    accessorKey: "division",
    header: "Division",
    cell: ({ row }) => row.original.division ?? "—",
  },
  {
    id: "rank",
    header: "Stream rank",
    cell: ({ row }) => formatRank(row.original.stream_rank),
  },
  {
    id: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => {
      const status = row.original.status_display ?? row.original.status
      return status ? <Badge variant="muted">{titleCase(status)}</Badge> : "—"
    },
  },
]

export function TermResultsPage() {
  const { data = [], isLoading, isError, error, refetch } = useTermResults()

  const empty = useMemo(
    () => (
      <EmptyState
        icon={FileText}
        variant="dashed"
        title="No results published"
        description="Published term results will appear here once the school releases them."
      />
    ),
    [],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Results"
        title="Term Results"
        icon={<FileText />}
        description="Published termly results across all your children."
      />

      {isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : (
        <DataTable columns={columns} data={data} loading={isLoading} empty={empty} />
      )}
    </div>
  )
}
