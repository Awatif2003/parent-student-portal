export function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

export function normalizeCollectionResponse(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data?.results)) {
    return data.data.results;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
}

export function getGuardianId(user) {
  return firstDefined(
    user?.guardian_id,
    user?.guardian?.id,
    user?.profile?.guardian_id,
    user?.guardianProfile?.id,
    user?.parent_id,
    user?.parent?.id,
    user?.id,
  );
}

export function getStudentId(user, fallbackId = null) {
  return firstDefined(
    fallbackId,
    user?.student_id,
    user?.student?.id,
    user?.profile?.student_id,
    user?.studentProfile?.id,
    user?.id,
  );
}

export function getStudentEnrollmentId(student) {
  return firstDefined(
    student?.enrollment_id,
    student?.current_enrollment_id,
    student?.current_enrollment?.id,
    student?.enrollment?.id,
    student?.latest_enrollment?.id,
    student?.active_enrollment?.id,
  );
}

export function getStudentStreamId(student) {
  return firstDefined(student?.stream_id, student?.stream?.id, student?.enrollment?.stream?.id, student?.current_stream_id);
}

export function getPreferredTermId(student) {
  return firstDefined(student?.term_id, student?.current_term_id, student?.enrollment?.term_id, student?.latest_term_id);
}

export function getRecordId(record) {
  return firstDefined(record?.id, record?.pk, record?.student_id, record?.balance_id, record?.invoice_id);
}

export function getDisplayName(record) {
  return firstDefined(
    record?.full_name,
    record?.name,
    [record?.first_name, record?.last_name].filter(Boolean).join(" "),
    record?.student_name,
    record?.guardian_name,
    record?.title,
    record?.number,
    "Unknown",
  );
}
