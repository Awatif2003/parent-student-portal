import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { CalendarX2 } from "lucide-react"

import { DataTable } from "@/components/DataTable"
import { EmptyState } from "@/components/ui/empty-state"
import { formatDate } from "@/lib/date"
import { AttendanceStatusBadge } from "./AttendanceStatusBadge"
import type { AttendanceRecord } from "../types"

export function AttendanceTable({
  records,
  loading,
  showStudent = false,
}: {
  records: AttendanceRecord[]
  loading?: boolean
  showStudent?: boolean
}) {
  const columns = useMemo<ColumnDef<AttendanceRecord>[]>(() => {
    const cols: ColumnDef<AttendanceRecord>[] = [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <span className="font-medium">{formatDate(row.original.date)}</span>
        ),
      },
    ]

    if (showStudent) {
      cols.push({
        accessorKey: "student_name",
        header: "Student",
        cell: ({ row }) => row.original.student_name ?? "—",
      })
    }

    cols.push(
      {
        accessorKey: "class_name",
        header: "Class",
        cell: ({ row }) => row.original.class_name ?? "—",
      },
      {
        id: "status",
        header: "Status",
        enableSorting: false,
        cell: ({ row }) => <AttendanceStatusBadge record={row.original} />,
      },
    )

    return cols
  }, [showStudent])

  return (
    <DataTable
      columns={columns}
      data={records}
      loading={loading}
      empty={
        <EmptyState
          icon={CalendarX2}
          variant="dashed"
          title="No attendance yet"
          description="Attendance records will appear here once the school marks them."
        />
      }
    />
  )
}
