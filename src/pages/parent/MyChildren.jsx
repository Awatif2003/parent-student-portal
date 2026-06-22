import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getMyChildrenAttendance } from "../../services/attendanceService";
import { getStudentProfile } from "../../services/portalDataService";
import { getDisplayName } from "../../utils/portalIdentity";
import AttendanceRecordsTable from "./AttendanceRecordsTable";
import ParentStudentTable from "./ParentStudentTable";
import { parentNavItems } from "./parentNavItems";

function MyChildren() {
  const [searchParams] = useSearchParams();
  const selectedStudentId = searchParams.get("studentId");
  const [selectedStudentState, setSelectedStudentState] = useState({ isLoading: false, error: "", student: null });
  const [attendanceFilters, setAttendanceFilters] = useState({ date: "", start_date: "", end_date: "" });
  const [attendanceState, setAttendanceState] = useState({ isLoading: true, error: "", records: [] });

  const loadSelectedStudent = useCallback(
    (studentId) => {
      if (!studentId) {
        setSelectedStudentState({ isLoading: false, error: "", student: null });
        return Promise.resolve();
      }

      setSelectedStudentState({ isLoading: true, error: "", student: null });

      return getStudentProfile(studentId)
        .then((student) => {
          setSelectedStudentState({ isLoading: false, error: "", student });
        })
        .catch((fetchError) => {
          setSelectedStudentState({ isLoading: false, error: fetchError.message || "Unable to load student details.", student: null });
        });
    },
    [],
  );

  useEffect(() => {
    void Promise.resolve().then(() => loadSelectedStudent(selectedStudentId));
  }, [loadSelectedStudent, selectedStudentId]);

  const loadAttendance = useCallback(() => {
    setAttendanceState((currentState) => ({ ...currentState, isLoading: true, error: "" }));

    return getMyChildrenAttendance({
      student_id: selectedStudentId,
      ...attendanceFilters,
    })
      .then((data) => {
        setAttendanceState({ isLoading: false, error: "", records: normalizeAttendanceRecords(data) });
      })
      .catch((fetchError) => {
        setAttendanceState({
          isLoading: false,
          error: fetchError.message || "Unable to load attendance for your children.",
          records: [],
        });
      });
  }, [attendanceFilters, selectedStudentId]);

  useEffect(() => {
    void Promise.resolve().then(loadAttendance);
  }, [loadAttendance]);

  const handleAttendanceFilterChange = (event) => {
    const { name, value } = event.target;

    setAttendanceFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
      ...(name === "date" && value ? { start_date: "", end_date: "" } : {}),
      ...((name === "start_date" || name === "end_date") && value ? { date: "" } : {}),
    }));
  };

  const clearAttendanceFilters = () => {
    setAttendanceFilters({ date: "", start_date: "", end_date: "" });
  };

  return (
    <DashboardLayout
      title="My Children"
      subtitle="View linked students, class placement, school details, and open each child's profile."
      navItems={parentNavItems}
    >
      <ParentStudentTable description="Children associated with the current guardian account." actionPath="/parent/children" />

      {selectedStudentId ? (
        <section className="data-panel data-panel-spaced">
          <div className="panel-header">
            <div>
              <h3>Child Details</h3>
              <p>Profile and class information for the selected child.</p>
            </div>
          </div>

          {selectedStudentState.isLoading ? <p className="panel-note">Loading child details...</p> : null}
          {!selectedStudentState.isLoading && selectedStudentState.error ? <p className="panel-note panel-note-error">{selectedStudentState.error}</p> : null}
          {!selectedStudentState.isLoading && selectedStudentState.student ? (
            <div className="detail-grid">
              <div>
                <span>Full Name</span>
                <strong>{getDisplayName(selectedStudentState.student)}</strong>
              </div>
              <div>
                <span>Admission Number</span>
                <strong>{selectedStudentState.student.admission_number || selectedStudentState.student.admission_no || "-"}</strong>
              </div>
              <div>
                <span>Class</span>
                <strong>{selectedStudentState.student.class_name || selectedStudentState.student.class || "-"}</strong>
              </div>
              <div>
                <span>Stream</span>
                <strong>{selectedStudentState.student.stream_name || selectedStudentState.student.stream || "-"}</strong>
              </div>
              <div>
                <span>Gender</span>
                <strong>{selectedStudentState.student.gender || "-"}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{selectedStudentState.student.status || selectedStudentState.student.enrollment_status || "-"}</strong>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="data-panel data-panel-spaced">
        <div className="panel-header">
          <div>
            <h3>{selectedStudentId ? "Selected Child Attendance" : "My Children Attendance"}</h3>
            <p>
              {selectedStudentId
                ? "Attendance records filtered to the selected child."
                : "Attendance records for every child linked to your parent or guardian account."}
            </p>
          </div>
          <button className="panel-action" type="button" onClick={loadAttendance} disabled={attendanceState.isLoading}>
            {attendanceState.isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="attendance-filter-bar">
          <label>
            <span>Single date</span>
            <input type="date" name="date" value={attendanceFilters.date} onChange={handleAttendanceFilterChange} />
          </label>
          <label>
            <span>Start date</span>
            <input type="date" name="start_date" value={attendanceFilters.start_date} onChange={handleAttendanceFilterChange} />
          </label>
          <label>
            <span>End date</span>
            <input type="date" name="end_date" value={attendanceFilters.end_date} onChange={handleAttendanceFilterChange} />
          </label>
          <button className="panel-action" type="button" onClick={clearAttendanceFilters}>
            Clear dates
          </button>
        </div>

        {attendanceState.isLoading ? <p className="panel-note">Loading attendance records...</p> : null}
        {!attendanceState.isLoading && attendanceState.error ? (
          <p className="panel-note panel-note-error">{attendanceState.error}</p>
        ) : null}
        {!attendanceState.isLoading && !attendanceState.error && !attendanceState.records.length ? (
          <p className="panel-note">No attendance records matched the selected child or date filters.</p>
        ) : null}
        {!attendanceState.isLoading && !attendanceState.error && attendanceState.records.length ? (
          <AttendanceRecordsTable records={attendanceState.records} selectedStudentId={selectedStudentId} />
        ) : null}
      </section>
    </DashboardLayout>
  );
}

function normalizeAttendanceRecords(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.data?.results)) {
    return data.data.results;
  }

  if (data?.id) {
    return [data];
  }

  return [];
}

export default MyChildren;
