import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { FileText } from "lucide-react"

import { DataTable } from "@/components/DataTable"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { PageHeader } from "@/components/ui/page-header"
import { formatDate } from "@/lib/date"
import { formatMoney, titleCase } from "@/lib/format"
import { useInvoices } from "../hooks"
import type { Invoice } from "../types"
import { amountOf, statusOf, statusTone } from "../utils"

const columns: ColumnDef<Invoice>[] = [
  {
    id: "invoice",
    header: "Invoice",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.invoice_number ?? row.original.reference ?? `#${row.original.id ?? "—"}`}
      </span>
    ),
  },
  {
    accessorKey: "student_name",
    header: "Student",
    cell: ({ row }) =>
      row.original.student_name ?? row.original.description ?? row.original.balance_name ?? "—",
  },
  {
    id: "date",
    header: "Date",
    cell: ({ row }) =>
      formatDate(row.original.date ?? row.original.issued_at ?? row.original.created_at),
  },
  {
    id: "amount",
    header: "Amount",
    cell: ({ row }) => formatMoney(amountOf(row.original, ["amount", "total", "balance"])),
  },
  {
    id: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => {
      const status = statusOf(row.original, ["status_display", "status", "invoice_status"])
      return status ? <Badge variant={statusTone(status)}>{titleCase(status)}</Badge> : "—"
    },
  },
]

export function InvoicesPage() {
  const { data = [], isLoading, isError, error, refetch } = useInvoices()

  const empty = useMemo(
    () => (
      <EmptyState
        icon={FileText}
        variant="dashed"
        title="No invoices"
        description="Invoices issued by your school will appear here."
      />
    ),
    [],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Finance"
        title="Invoices"
        icon={<FileText />}
        description="Fee invoices across all your children."
      />

      {isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : (
        <DataTable columns={columns} data={data} loading={isLoading} empty={empty} />
      )}
    </div>
  )
}
