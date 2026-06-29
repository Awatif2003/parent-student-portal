import { useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Eye, Receipt, X } from "lucide-react"

import { DataTable } from "@/components/DataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { PageHeader } from "@/components/ui/page-header"
import { formatDate } from "@/lib/date"
import { formatMoney, titleCase } from "@/lib/format"
import { ReceiptCard } from "../ReceiptCard"
import { usePayments } from "../hooks"
import type { Payment } from "../types"
import { amountOf, statusOf, statusTone } from "../utils"

export function ReceiptsPage() {
  const { data = [], isLoading, isError, error, refetch } = usePayments()
  const [selected, setSelected] = useState<string | number | null>(null)

  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        id: "receipt",
        header: "Receipt",
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.receipt_number ??
              row.original.reference ??
              row.original.payment_reference ??
              `#${row.original.id ?? "—"}`}
          </span>
        ),
      },
      {
        id: "payer",
        header: "Student",
        cell: ({ row }) => row.original.student_name ?? row.original.payer ?? "—",
      },
      {
        id: "date",
        header: "Date",
        cell: ({ row }) =>
          formatDate(row.original.payment_date ?? row.original.date ?? row.original.created_at),
      },
      {
        id: "amount",
        header: "Amount",
        cell: ({ row }) => formatMoney(amountOf(row.original, ["amount", "paid_amount"])),
      },
      {
        id: "method",
        header: "Method",
        cell: ({ row }) => {
          const method = row.original.method ?? row.original.payment_method
          return method ? titleCase(method) : "—"
        },
      },
      {
        id: "status",
        header: "Status",
        enableSorting: false,
        cell: ({ row }) => {
          const status = statusOf(row.original, ["status_display", "status", "payment_status"])
          return status ? <Badge variant={statusTone(status)}>{titleCase(status)}</Badge> : "—"
        },
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) =>
          row.original.id == null ? null : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelected(row.original.id ?? null)}
            >
              <Eye /> View
            </Button>
          ),
      },
    ],
    [],
  )

  const empty = useMemo(
    () => (
      <EmptyState
        icon={Receipt}
        variant="dashed"
        title="No receipts"
        description="Payment receipts will appear here once payments are recorded."
      />
    ),
    [],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Finance"
        title="Receipts"
        icon={<Receipt />}
        description="Payment history and receipts across all your children. Open a receipt to print it or save it as a PDF."
      />

      {isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          loading={isLoading}
          empty={empty}
          onRowClick={(row) => setSelected(row.id ?? null)}
        />
      )}

      {selected != null && (
        <div className="space-y-2">
          <div className="flex items-center justify-between print:hidden">
            <h2 className="text-sm font-semibold">Receipt</h2>
            <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
              <X /> Close
            </Button>
          </div>
          <ReceiptCard paymentId={selected} />
        </div>
      )}
    </div>
  )
}
