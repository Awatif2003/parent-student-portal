import { useState } from "react"
import { Download, IdCard, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState, resolveErrorMessage } from "@/components/ui/error-state"
import { PageHeader } from "@/components/ui/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { notify } from "@/components/ui/toast"
import { getDisplayName } from "@/lib/identity"
import { formatDecimal, formatNumber, formatRank } from "@/lib/format"
import { downloadReportCard } from "../api"
import { useReportCards } from "../hooks"
import type { ReportCard } from "../types"

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/40 rounded-md px-3 py-2">
      <p className="text-foreground text-lg font-semibold tabular-nums">{value}</p>
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  )
}

function ReportCardItem({ card }: { card: ReportCard }) {
  const [downloading, setDownloading] = useState(false)
  const result = card.term_result
  const grades = card.subject_grades
  const canDownload = card.enrollment != null && card.term != null

  async function handleDownload() {
    if (!canDownload) return
    setDownloading(true)
    try {
      await downloadReportCard(card.enrollment!, card.term!)
    } catch (error) {
      notify.error(resolveErrorMessage(error, "Could not download the report card."))
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card padding="none">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              {result.term_name ?? "Term result"}
            </p>
            <p className="text-foreground truncate text-base font-semibold">
              {getDisplayName(result)}
            </p>
            <p className="text-muted-foreground truncate text-sm">
              {result.student_admission ?? result.admission_number ?? "—"}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            disabled={!canDownload || downloading}
          >
            {downloading ? <Loader2 className="animate-spin" /> : <Download />}
            PDF
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Metric label="Average" value={formatDecimal(result.average_marks)} />
          <Metric label="Division" value={result.division ? String(result.division) : "—"} />
          <Metric label="Stream rank" value={formatRank(result.stream_rank)} />
          <Metric label="Subjects passed" value={formatNumber(Number(result.subjects_passed))} />
        </div>

        {grades.length > 0 ? (
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Subject</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Rank</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((grade, i) => (
                  <TableRow
                    key={grade.id ?? `${grade.subject_name}-${i}`}
                    className="hover:bg-transparent"
                  >
                    <TableCell className="font-medium">
                      {grade.subject_name ?? grade.subject ?? "—"}
                    </TableCell>
                    <TableCell>{formatDecimal(grade.average_marks ?? grade.total_marks)}</TableCell>
                    <TableCell>{grade.grade ?? "—"}</TableCell>
                    <TableCell>{formatDecimal(grade.points)}</TableCell>
                    <TableCell>{formatRank(grade.subject_rank)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}

        {result.class_teacher_comment || result.head_teacher_comment ? (
          <div className="text-muted-foreground space-y-1 border-t pt-3 text-sm">
            {result.class_teacher_comment ? <p>{result.class_teacher_comment}</p> : null}
            {result.head_teacher_comment ? <p>{result.head_teacher_comment}</p> : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function ResultCardPage() {
  const { data = [], isLoading, isError, error, refetch } = useReportCards()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Results"
        title="Result Card"
        icon={<IdCard />}
        description="Full report cards with subject grades, ready to download as PDF."
      />

      {isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} padding="none">
              <CardContent className="space-y-4 p-5">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState
          icon={IdCard}
          variant="dashed"
          title="No report cards"
          description="Report cards become available once term results are published."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.map((card) => (
            <ReportCardItem
              key={String(card.term_result.id ?? `${card.enrollment}-${card.term}`)}
              card={card}
            />
          ))}
        </div>
      )}
    </div>
  )
}
