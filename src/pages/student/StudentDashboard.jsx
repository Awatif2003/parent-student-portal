import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import AttendancePreview from "../shared/AttendancePreview";
import { getDashboardOverview } from "../../services/dashboardService";
import { studentNavItems } from "./studentNavItems";

function StudentDashboard() {
  const [state, setState] = useState({ isLoading: true, error: "", data: null });

  const loadOverview = useCallback(() => {
    setState({ isLoading: true, error: "", data: null });

    // The backend returns a per-student snapshot for student accounts.
    return getDashboardOverview()
      .then((data) => setState({ isLoading: false, error: "", data }))
      .catch((fetchError) =>
        setState({ isLoading: false, error: fetchError.message || "Unable to load your dashboard.", data: null }),
      );
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadOverview);
  }, [loadOverview]);

  const student = state.data?.student || null;
  const attendance = state.data?.attendance || null;
  const latest = state.data?.latest_result || null;

  const stats = attendance
    ? [
        ["Attendance rate", attendance.attendance_rate != null ? `${attendance.attendance_rate}%` : "-"],
        ["Present", attendance.present],
        ["Absent", attendance.absent],
        ["Late", attendance.late],
      ]
    : [];

  return (
    <DashboardLayout
      title="Student Dashboard"
      subtitle="A clear place to view your details, attendance, assessments, and term results."
      navItems={studentNavItems}
    >
      <section className="data-panel data-panel-spaced">
        <div className="panel-header">
          <div>
            <h3>{student ? `Welcome, ${student.name}` : "Welcome"}</h3>
            <p>
              {student
                ? `${student.current_class || "Class not set"} · Adm: ${student.admission_number}`
                : "Your personal snapshot."}
            </p>
          </div>
          <button className="panel-action" type="button" onClick={loadOverview} disabled={state.isLoading}>
            {state.isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {state.isLoading ? <p className="panel-note">Loading your dashboard...</p> : null}
        {!state.isLoading && state.error ? <p className="panel-note panel-note-error">{state.error}</p> : null}

        {!state.isLoading && stats.length ? (
          <div className="metric-grid">
            {stats.map(([label, value]) => (
              <div className="metric-card" key={label}>
                <strong>{value ?? "-"}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        ) : null}

        {!state.isLoading && latest ? (
          <div className="detail-grid">
            <div>
              <span>Latest term</span>
              <strong>{latest.term || "-"}</strong>
            </div>
            <div>
              <span>Average marks</span>
              <strong>{latest.average_marks ?? "-"}</strong>
            </div>
            <div>
              <span>Division</span>
              <strong>{latest.division || "-"}</strong>
            </div>
          </div>
        ) : null}

        {!state.isLoading && !latest && !state.error ? (
          <p className="panel-note">No published results yet.</p>
        ) : null}
      </section>

      <div className="dashboard-grid">
        <article className="dashboard-card">
          <div className="card-icon" aria-hidden="true">D</div>
          <div>
            <h2>Student Details</h2>
            <p>See your personal information, class placement, and admission details.</p>
            <Link className="panel-action" to="/student/details">View details</Link>
          </div>
        </article>
        <article className="dashboard-card">
          <div className="card-icon" aria-hidden="true">R</div>
          <div>
            <h2>Results</h2>
            <p>Review continuous assessments, term results, and academic progress.</p>
            <Link className="panel-action" to="/student/results/term-results">View results</Link>
          </div>
        </article>
      </div>

      <section className="data-panel data-panel-spaced" id="attendance">
        <AttendancePreview />
      </section>
    </DashboardLayout>
  );
}

export default StudentDashboard;
