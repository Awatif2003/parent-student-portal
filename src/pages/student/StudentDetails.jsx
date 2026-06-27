import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { getMyStudentDetail } from "../../services/portalDataService";
import { getDisplayName } from "../../utils/portalIdentity";
import { studentNavItems } from "./studentNavItems";

function StudentDetails() {
  const [state, setState] = useState({ isLoading: true, error: "", student: null });

  const loadStudent = useCallback(() => {
    setState({ isLoading: true, error: "", student: null });

    // The backend scopes /students/ to the logged-in student's own record, so
    // we resolve "me" from the list rather than guessing an id from the token.
    return getMyStudentDetail()
      .then((student) => {
        if (!student) {
          setState({ isLoading: false, error: "No student profile is linked to this account.", student: null });
          return;
        }
        setState({ isLoading: false, error: "", student });
      })
      .catch((fetchError) => {
        setState({ isLoading: false, error: fetchError.message || "Unable to load student profile.", student: null });
      });
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadStudent);
  }, [loadStudent]);

  const student = state.student;
  const enrollment = student?.current_enrollment || {};

  return (
    <DashboardLayout
      title="Student Details"
      subtitle="View personal information, admission details, class placement, and school profile information."
      navItems={studentNavItems}
    >
      <section className="data-panel data-panel-spaced">
        <div className="panel-header">
          <div>
            <h3>Profile</h3>
            <p>Your personal information from the school records.</p>
          </div>
          <button className="panel-action" type="button" onClick={loadStudent} disabled={state.isLoading}>
            {state.isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {state.isLoading ? <p className="panel-note">Loading student profile...</p> : null}
        {!state.isLoading && state.error ? <p className="panel-note panel-note-error">{state.error}</p> : null}

        {!state.isLoading && student ? (
          <div className="detail-grid">
            <div>
              <span>Full Name</span>
              <strong>{getDisplayName(student)}</strong>
            </div>
            <div>
              <span>Admission Number</span>
              <strong>{student.admission_number || "-"}</strong>
            </div>
            <div>
              <span>Class</span>
              <strong>{enrollment.grade_name || student.current_class || "-"}</strong>
            </div>
            <div>
              <span>Stream</span>
              <strong>{enrollment.stream_name || "-"}</strong>
            </div>
            <div>
              <span>Gender</span>
              <strong>{formatGender(student.gender)}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{student.status || "-"}</strong>
            </div>
            <div>
              <span>School</span>
              <strong>{student.school_name || "-"}</strong>
            </div>
            <div>
              <span>Academic Year</span>
              <strong>{enrollment.academic_year_name || "-"}</strong>
            </div>
          </div>
        ) : null}
      </section>
    </DashboardLayout>
  );
}

function formatGender(value) {
  if (value === "M") return "Male";
  if (value === "F") return "Female";
  return value || "-";
}

export default StudentDetails;
