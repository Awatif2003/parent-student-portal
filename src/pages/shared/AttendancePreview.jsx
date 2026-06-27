import { useCallback, useEffect, useMemo, useState } from "react";
import { getAttendanceSummary, getMyAttendance } from "../../services/portalDataService";

function AttendancePreview() {
  const [summary, setSummary] = useState({});
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAttendance = useCallback(() => {
    setIsLoading(true);
    setError("");

    // Both endpoints are scoped to the logged-in student by the backend.
    return Promise.all([getAttendanceSummary(), getMyAttendance()])
      .then(([summaryData, recordList]) => {
        setSummary(summaryData || {});
        setRecords(Array.isArray(recordList) ? recordList : []);
      })
      .catch((attendanceError) => {
        setError(attendanceError.message || "Unable to load attendance records.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const stats = useMemo(() => {
    const values = [
      ["Present", summary.present],
      ["Absent", summary.absent],
      ["Late", summary.late],
      ["Total", summary.total],
    ];

    return values.filter(([, value]) => value !== undefined && value !== null);
  }, [summary]);

  const recentRecords = records;

  useEffect(() => {
    void Promise.resolve().then(loadAttendance);
  }, [loadAttendance]);

  return (
    <div className="data-panel">
      <div className="panel-header">
        <div>
          <h3>Attendance Records</h3>
          <p>Your attendance summary and most recent records.</p>
        </div>
        <button className="panel-action" type="button" onClick={loadAttendance} disabled={isLoading}>
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {isLoading ? <p className="panel-note">Loading attendance records...</p> : null}

      {!isLoading && error ? <p className="panel-note panel-note-error">{error}</p> : null}

      {!isLoading && !error && !stats.length && !recentRecords.length ? <p className="panel-note">No attendance summary is available.</p> : null}

      {!isLoading && !error && stats.length ? (
        <div className="metric-grid">
          {stats.map(([label, value]) => (
            <div className="metric-card" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      ) : null}

      {!isLoading && !error && recentRecords.length ? (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Date</th>
                  <th>Session</th>
                  <th>Status</th>
                  <th>Arrival</th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.slice(0, 6).map((record) => (
                  <tr key={record.id}>
                    <td>
                      <strong>{record.student_name}</strong>
                      <span>{record.admission_number}</span>
                    </td>
                    <td>{record.class_name}</td>
                    <td>{record.date}</td>
                    <td>{record.session}</td>
                    <td>
                      <span className={`status-pill status-${record.status?.toLowerCase()}`}>
                        {record.status_display || record.status}
                      </span>
                    </td>
                    <td>{formatTime(record.arrival_time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}

function formatTime(value) {
  if (!value) {
    return "-";
  }

  return value.slice(0, 5);
}

export default AttendancePreview;
