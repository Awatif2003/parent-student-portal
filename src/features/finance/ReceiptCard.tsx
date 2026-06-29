/**
 * ReceiptCard — fetches and renders a printable payment receipt from
 * `GET /finance/payments/{id}/receipt/`. The "Download / Print" button opens
 * the browser print dialog (Save as PDF) with everything but the receipt
 * hidden, so a parent can save or print a clean receipt without a server PDF.
 */
import type { ReactNode } from "react"
import { Download } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ErrorState } from "@/components/ui/error-state"
import { Spinner } from "@/components/ui/spinner"
import { formatDate } from "@/lib/date"
import { formatMoney } from "@/lib/format"
import { useReceipt } from "./hooks"

/** Receipt amounts arrive as decimal strings; render them as grouped money. */
function money(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—"
  return formatMoney(Number(value))
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}

export function ReceiptCard({ paymentId }: { paymentId: string | number | null }) {
  const { data, isLoading, isError, error, refetch } = useReceipt(paymentId)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 p-6 text-sm">
          <Spinner /> Loading receipt…
        </CardContent>
      </Card>
    )
  }
  if (isError || !data) {
    return (
      <Card>
        <CardContent className="p-6">
          <ErrorState error={error} onRetry={() => void refetch()} />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Print only the receipt — hide the rest of the app in the print dialog. */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #receipt-print, #receipt-print * { visibility: visible !important; }
          #receipt-print {
            position: absolute; inset: 0; margin: 0;
            box-shadow: none; border: none;
          }
        }
      `}</style>

      <Card id="receipt-print" className="max-w-xl">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-start justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="text-lg font-semibold">{data.school.name}</h2>
              {data.school.motto && (
                <p className="text-muted-foreground text-xs italic">{data.school.motto}</p>
              )}
              <p className="text-muted-foreground mt-1 text-xs">
                {[data.school.address, data.school.city, data.school.region]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p className="text-muted-foreground text-xs">
                {[data.school.phone, data.school.email].filter(Boolean).join(" · ")}
              </p>
            </div>
            <div className="text-right">
              <Badge variant="muted">RECEIPT</Badge>
              <p className="mt-2 font-mono text-sm font-semibold">{data.receipt_number}</p>
              <p className="text-muted-foreground text-xs">{formatDate(data.payment_date)}</p>
              {data.is_cancelled && (
                <Badge variant="danger" className="mt-1">
                  REVERSED
                </Badge>
              )}
            </div>
          </div>

          <div>
            <Row label="Student" value={data.student.name} />
            <Row label="Admission #" value={data.student.admission_number} />
            <Row label="Class" value={data.student.stream} />
            <Row label="Invoice" value={data.invoice.invoice_number} />
            <Row label="Term" value={data.invoice.term} />
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between text-base font-semibold">
              <span>Amount paid</span>
              <span>{money(data.amount)}</span>
            </div>
            <Row label="Method" value={data.payment_method_display} />
            {data.reference_number && <Row label="Reference" value={data.reference_number} />}
            <Row label="Paid by" value={data.paid_by_name || "—"} />
            {data.received_by_name && <Row label="Received by" value={data.received_by_name} />}
          </div>

          <div className="bg-muted/40 rounded-md p-3">
            <Row label="Invoice balance" value={money(data.invoice.balance)} />
            <Row
              label="Outstanding (account)"
              value={data.balance_after == null ? "—" : money(data.balance_after)}
            />
          </div>

          {data.notes && <p className="text-muted-foreground text-xs">Note: {data.notes}</p>}

          <div className="flex justify-end print:hidden">
            <Button variant="outline" onClick={() => window.print()}>
              <Download /> Download / Print
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
