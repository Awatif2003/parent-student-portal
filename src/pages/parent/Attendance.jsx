import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getStudentAttendanceRecords } from "../../services/attendanceService";
import { parentNavItems } from "./parentNavItems";

function Attendance() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [state, setState] = useState({ isLoading: true, error: "", children: [], records: [] });

  const selectedRecordId = searchParams.get("attendanceId") || searchParams.get("studentId");

  const loadRecords = useCallback(() => {
    setState((currentState) => ({ ...currentState, isLoading: true, error: "" }));

    return getStudentAttendanceRecords()
      .then((data) => {
        const children = normalizeChildrenAttendance(data);

        setState({
          isLoading: false,
          error: "",
          children,
          records: flattenChildrenAttendance(children),
        });
      })
      .catch((fetchError) => {
        setState({ isLoading: false, error: fetchError.message || "Unable to load attendance records.", children: [], records: [] });
      });
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadRecords);
  }, [loadRecords]);

  const filteredRecords = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return state.records;
    }

    return state.records.filter((record) =>
      [
        record.student_name,
        record.admission_number,
        record.class_name,
        record.current_class,
        record.academic_year,
        record.relationship,
        record.date,
        record.session,
        record.status_display,
        record.status,
        record.reason,
        record.school_name,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery)),
    );
  }, [state.records, searchQuery]);

  const visibleRecords = useMemo(() => filteredRecords.slice(0, pageSize), [filteredRecords, pageSize]);
  const totalEntries = state.records.length;
  const selectedRecord = useMemo(() => {
    if (!visibleRecords.length) {
      return null;
    }

    return (
      visibleRecords.find((record) => String(record.id || record.student_id) === String(selectedRecordId)) ||
      visibleRecords[0]
    );
  }, [selectedRecordId, visibleRecords]);

  return (
    <DashboardLayout
      title="Attendance"
      subtitle="Review attendance records in a detailed table."
      navItems={parentNavItems}
    >
      <section className="data-panel">
        <div className="panel-header">
          <div>
            <h3>Students Attendance</h3>
            <p>Attendance records for children linked to the current parent account.</p>
          </div>
          <button className="panel-action" type="button" onClick={loadRecords} disabled={state.isLoading}>
            {state.isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {state.isLoading ? <p className="panel-note">Loading attendance records...</p> : null}
        {!state.isLoading && state.error ? <p className="panel-note panel-note-error">{state.error}</p> : null}
        {!state.isLoading && !state.error && !state.children.length ? <p className="panel-note">No children were returned by the API.</p> : null}
        {!state.isLoading && !state.error && state.children.length && !state.records.length ? (
          <p className="panel-note">Children were returned, but no attendance records are available yet.</p>
        ) : null}

        {!state.isLoading && !state.error && state.children.length ? (
          <div className="record-grid" style={{ marginBottom: "1rem" }}>
            {state.children.map((child) => {
              const stats = getChildAttendanceStats(child);
              const firstAttendanceId = child.attendance?.[0]?.id;

              return (
                <article className="record-card" key={child.student_id || child.student_name}>
                  <div>
                    <p className="record-label">{child.relationship || "Child"}</p>
                    <h4>{child.student_name || "-"}</h4>
                    <p>{child.admission_number || "Admission number unavailable"}</p>
                  </div>
                  <div className="record-meta">
                    <span>{child.current_class || "Class unavailable"}</span>
                    <span>{formatSchoolName(child.school)}</span>
                    <span>{child.academic_year ? `Academic Year ${child.academic_year}` : "Academic year unavailable"}</span>
                    <span>{stats}</span>
                  </div>
                  <Link className="record-link" to={`/parent/attendance?${firstAttendanceId ? `attendanceId=${firstAttendanceId}` : `studentId=${child.student_id}`}`}>
                    View attendance
                  </Link>
                </article>
              );
            })}
          </div>
        ) : null}

        {!state.isLoading && !state.error && selectedRecord ? (
          <div className="table-panel" style={{ marginBottom: "1rem" }}>
            <div className="panel-header">
              <div>
                <h3>Attendance Detail</h3>
                <p>Selected record with the child profile returned by the parent attendance API.</p>
              </div>
            </div>

            <div className="detail-grid">
              <DetailItem label="Student Name" value={selectedRecord.student_name} />
              <DetailItem label="Admission No." value={selectedRecord.admission_number} />
              <DetailItem label="Relationship" value={selectedRecord.relationship} />
              <DetailItem label="School" value={selectedRecord.school_name} />
              <DetailItem label="Class" value={selectedRecord.current_class || selectedRecord.class_name} />
              <DetailItem label="Academic Year" value={selectedRecord.academic_year} />
              <DetailItem label="Date" value={selectedRecord.date} />
              <DetailItem label="Session" value={selectedRecord.session} />
              <DetailItem label="Status" value={selectedRecord.status_display || selectedRecord.status} />
              <DetailItem label="Arrival Time" value={formatTime(selectedRecord.arrival_time)} />
              <DetailItem label="Reason" value={selectedRecord.reason} />
              <DetailItem label="Record ID" value={selectedRecord.id} />
              <DetailItem label="Student ID" value={selectedRecord.student_id} />
            </div>
          </div>
        ) : null}

        {!state.isLoading && !state.error && state.records.length ? (
          <div className="table-panel">
            <div className="table-controls">
              <label className="table-length">
                <span>Show</span>
                <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>entries</span>
              </label>

              <label className="table-search">
                <span>Search:</span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Student, school, class, stream, or status"
                />
              </label>
            </div>

            <div className="table-wrap">
              <table className="data-table student-detail-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Student Name</th>
                    <th>School</th>
                    <th>Admission No.</th>
                    <th>Class</th>
                    <th>Academic Year</th>
                    <th>Date</th>
                    <th>Session</th>
                    <th>Status</th>
                    <th>Arrival</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRecords.map((record, index) => {
                    const recordId = record.id || record.student_id;

                    return (
                      <tr className={String(recordId) === selectedRecordId ? "selected-row" : ""} key={recordId || `${record.student_name}-${record.date}-${index}`}>
                        <td>{index + 1}</td>
                        <td>{record.student_name || "-"}</td>
                        <td>{record.school_name || "-"}</td>
                        <td>{record.admission_number || "-"}</td>
                        <td>{record.current_class || record.class_name || "-"}</td>
                        <td>{record.academic_year || "-"}</td>
                        <td>{record.date || "-"}</td>
                        <td>{record.session || "-"}</td>
                        <td>
                          <span className={`status-pill status-${String(record.status || "unknown").toLowerCase()}`}>
                            {record.status_display || record.status || "-"}
                          </span>
                        </td>
                        <td>{formatTime(record.arrival_time)}</td>
                        <td>{record.reason || "-"}</td>
                        <td>
                          {recordId ? (
                            <Link className="table-action-link" to={`/parent/attendance?attendanceId=${recordId}`}>
                              View
                            </Link>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <p>
                Showing {visibleRecords.length ? 1 : 0} to {visibleRecords.length} of {totalEntries} entries
                {state.records.length !== filteredRecords.length ? ` (filtered from ${totalEntries} total entries)` : ""}
              </p>
              <div className="table-pagination" aria-label="Attendance table pagination">
                <button type="button" disabled>
                  Previous
                </button>
                <button className="active" type="button" disabled>
                  1
                </button>
                <button type="button" disabled>
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </DashboardLayout>
  );
}

function normalizeChildrenAttendance(data) {
  if (Array.isArray(data?.children)) {
    return data.children;
  }

  if (Array.isArray(data?.data?.children)) {
    return data.data.children;
  }

  return [];
}

function flattenChildrenAttendance(children) {
  return children.flatMap((child) => {
    const attendanceRecords = Array.isArray(child.attendance) ? child.attendance : [];

    return attendanceRecords.map((record) => ({
      ...record,
      student_id: child.student_id,
      student_name: child.student_name,
      admission_number: child.admission_number,
      relationship: child.relationship,
      school_id: child.school?.id,
      school_name: formatSchoolName(child.school),
      current_class: child.current_class,
      academic_year: child.academic_year,
    }));
  });
}

function getChildAttendanceStats(child) {
  const attendanceRecords = Array.isArray(child.attendance) ? child.attendance : [];

  if (!attendanceRecords.length) {
    return "No attendance records";
  }

  const presentCount = attendanceRecords.filter((record) => record.status === "PRESENT").length;
  const absentCount = attendanceRecords.filter((record) => record.status === "ABSENT").length;

  return `${attendanceRecords.length} records: ${presentCount} present, ${absentCount} absent`;
}

function formatSchoolName(school) {
  if (!school) {
    return "";
  }

  if (typeof school === "string") {
    return school;
  }

  return school.name || school.school_name || "";
}

function formatTime(value) {
  if (!value) {
    return "-";
  }

  return value.length >= 5 ? value.slice(0, 5) : value;
}
function DetailItem({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}

export default Attendance;
