import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAttendanceSummary, getStudentAttendance } from "../../services/portalDataService";
import { normalizeCollectionResponse } from "../../utils/portalIdentity";

function AttendancePreview() {
  const [searchParams] = useSearchParams();
  const selectedRecordId = searchParams.get("attendanceId") || searchParams.get("studentId");
  const [attendanceData, setAttendanceData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAttendance = useCallback(() => {
    setIsLoading(true);
    setError("");

    const loader = selectedRecordId ? getStudentAttendance(selectedRecordId) : getAttendanceSummary();

    return loader
      .then((data) => {
        setAttendanceData(data || {});
      })
      .catch((attendanceError) => {
        setError(attendanceError.message || "Unable to load attendance records.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedRecordId]);

  const stats = useMemo(() => {
    const values = [
      ["Present", attendanceData.present_count],
      ["Absent", attendanceData.absent_count],
      ["Late", attendanceData.late_count],
      ["Total", attendanceData.total_count || attendanceData.count],
    ];

    return values.filter(([, value]) => value !== undefined && value !== null);
  }, [attendanceData]);

  const recentRecords = useMemo(() => {
    const records = normalizeCollectionResponse(attendanceData);

    if (records.length) {
      return records;
    }

    if (attendanceData?.id && attendanceData?.student_name) {
      return [attendanceData];
    }

    return Array.isArray(attendanceData.recent_records) ? attendanceData.recent_records : [];
  }, [attendanceData]);

  useEffect(() => {
    void Promise.resolve().then(loadAttendance);
  }, [loadAttendance]);

  return (
    <div className="data-panel">
      <div className="panel-header">
        <div>
          <h3>Attendance Records</h3>
          <p>{selectedRecordId ? "Selected attendance record from the API." : "Latest attendance records from the API."}</p>
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
