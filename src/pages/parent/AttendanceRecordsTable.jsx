import { useMemo, useState } from "react";

function AttendanceRecordsTable({ records, selectedStudentId }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(25);

  const filteredRecords = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return records;
    }

    return records.filter((record) =>
      [
        record.student_name,
        record.admission_number,
        record.class_name,
        record.date,
        record.session,
        record.status,
        record.status_display,
        record.reason,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery)),
    );
  }, [records, searchQuery]);

  const visibleRecords = filteredRecords.slice(0, pageSize);

  return (
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
            placeholder="Student, class, date, or status"
          />
        </label>
      </div>

      <div className="table-wrap">
        <table className="data-table student-detail-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Student</th>
              <th>Admission No.</th>
              <th>Class</th>
              <th>Date</th>
              <th>Session</th>
              <th>Status</th>
              <th>Arrival</th>
              <th>Departure</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {visibleRecords.map((record, index) => (
              <tr
                className={matchesSelectedStudent(record, selectedStudentId) ? "selected-row" : ""}
                key={record.id || `${record.enrollment}-${record.date}-${record.session}-${index}`}
              >
                <td>{index + 1}</td>
                <td>{record.student_name || "-"}</td>
                <td>{record.admission_number || "-"}</td>
                <td>{record.class_name || "-"}</td>
                <td>{record.date || "-"}</td>
                <td>{formatLabel(record.session)}</td>
                <td>
                  <span className={`status-pill status-${String(record.status || "unknown").toLowerCase()}`}>
                    {record.status_display || formatLabel(record.status)}
                  </span>
                </td>
                <td>{formatTime(record.arrival_time)}</td>
                <td>{formatTime(record.departure_time)}</td>
                <td>{record.reason || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <p>
          Showing {visibleRecords.length ? 1 : 0} to {visibleRecords.length} of {filteredRecords.length} entries
          {filteredRecords.length !== records.length ? ` (filtered from ${records.length} total entries)` : ""}
        </p>
      </div>
    </div>
  );
}

function matchesSelectedStudent(record, selectedStudentId) {
  if (!selectedStudentId) {
    return false;
  }

  return [record.student_id, record.enrollment].some((value) => String(value || "") === String(selectedStudentId));
}

function formatTime(value) {
  if (!value) {
    return "-";
  }

  return String(value).slice(0, 5);
}

function formatLabel(value) {
  if (!value) {
    return "-";
  }

  return String(value)
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default AttendanceRecordsTable;
