/**
 * Identity & payload-shape normalizers.
 *
 * The backend is inconsistent about how it wraps collections (bare array,
 * `{ results }`, `{ data: { results } }`, `{ data: [] }`) and about where a
 * student/guardian id lives on a profile. These helpers paper over that at the
 * service boundary so feature code can stay clean. Ported from the original
 * portalIdentity.js — this domain knowledge predates the migration.
 */
import type { Dict } from "@/types"

export function firstDefined<T = unknown>(...values: T[]): T | undefined {
  return values.find(
    (value) => value !== undefined && value !== null && (value as unknown) !== "",
  )
}

/** Coerce any of the backend's list-envelope shapes into a flat array. */
export function normalizeCollection<T = Dict>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[]
  const d = (data ?? {}) as Dict
  if (Array.isArray(d.data?.results)) return d.data.results
  if (Array.isArray(d.results)) return d.results
  if (Array.isArray(d.data)) return d.data
  return []
}

export function getGuardianId(user: Dict | null | undefined): string | undefined {
  return firstDefined(
    user?.guardian_id,
    user?.guardian?.id,
    user?.profile?.guardian_id,
    user?.guardianProfile?.id,
    user?.parent_id,
    user?.parent?.id,
    user?.id,
  )
}

export function getStudentId(
  user: Dict | null | undefined,
  fallbackId: string | null = null,
): string | undefined {
  return firstDefined(
    fallbackId,
    user?.student_id,
    user?.student?.id,
    user?.profile?.student_id,
    user?.studentProfile?.id,
    user?.id,
  )
}

export function getStudentEnrollmentId(student: Dict | null | undefined): string | undefined {
  return firstDefined(
    student?.enrollment_id,
    student?.current_enrollment_id,
    student?.current_enrollment?.id,
    student?.enrollment?.id,
    student?.latest_enrollment?.id,
    student?.active_enrollment?.id,
  )
}

export function getStudentStreamId(student: Dict | null | undefined): string | undefined {
  return firstDefined(
    student?.stream_id,
    student?.stream?.id,
    student?.enrollment?.stream?.id,
    student?.current_stream_id,
  )
}

export function getPreferredTermId(student: Dict | null | undefined): string | undefined {
  return firstDefined(
    student?.term_id,
    student?.current_term_id,
    student?.enrollment?.term_id,
    student?.latest_term_id,
  )
}

export function getRecordId(record: Dict | null | undefined): string | undefined {
  return firstDefined(
    record?.id,
    record?.pk,
    record?.student_id,
    record?.balance_id,
    record?.invoice_id,
  )
}

export function getDisplayName(record: Dict | null | undefined): string {
  return (
    firstDefined(
      record?.full_name,
      record?.name,
      [record?.first_name, record?.last_name].filter(Boolean).join(" ") || undefined,
      record?.student_name,
      record?.guardian_name,
      record?.title,
      record?.number,
    ) ?? "Unknown"
  )
}
