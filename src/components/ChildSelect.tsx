/**
 * A child picker for parent/guardian views. Several family-portal screens are
 * either scoped to one child (continuous assessment) or let a guardian narrow a
 * multi-child collection (results, finance) down to a single student.
 */
import { ChevronDown } from "lucide-react"

import type { ChildAttendance } from "@/features/attendance/types"
import { getDisplayName } from "@/lib/identity"
import { cn } from "@/lib/utils"

interface ChildSelectProps {
  children: ChildAttendance[]
  /** Selected student id, or "" for the "all children" option. */
  value: string
  onChange: (studentId: string) => void
  /** Label for the catch-all option; omit to require an explicit child. */
  allLabel?: string
  className?: string
  disabled?: boolean
}

export function ChildSelect({
  children,
  value,
  onChange,
  allLabel,
  className,
  disabled,
}: ChildSelectProps) {
  return (
    <label className={cn("relative inline-flex items-center", className)}>
      <span className="sr-only">Select child</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled || children.length === 0}
        className={cn(
          "border-input h-9 min-w-[12rem] appearance-none rounded-md border bg-transparent py-1 pr-9 pl-3 text-sm shadow-xs transition-[color,box-shadow] outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        {allLabel ? <option value="">{allLabel}</option> : null}
        {children.map((child) => (
          <option key={String(child.student_id)} value={String(child.student_id)}>
            {getDisplayName(child)}
          </option>
        ))}
      </select>
      <ChevronDown
        className="text-muted-foreground pointer-events-none absolute right-3 size-4"
        aria-hidden
      />
    </label>
  )
}
