import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getStudentProfile } from "../../services/portalDataService";
import { getCurrentUser } from "../../utils/authStorage";
import { getDisplayName, getStudentId } from "../../utils/portalIdentity";
import { studentNavItems } from "./studentNavItems";

function StudentDetails() {
  const [searchParams] = useSearchParams();
  const user = getCurrentUser();
  const fallbackStudentId = useMemo(() => getStudentId(user, searchParams.get("studentId")), [searchParams, user]);
  const [state, setState] = useState({ isLoading: true, error: "", student: null });

  const loadStudent = useCallback(() => {
    if (!fallbackStudentId) {
      setState({ isLoading: false, error: "Unable to determine the current student profile.", student: null });
      return Promise.resolve();
    }

    setState({ isLoading: true, error: "", student: null });

    return getStudentProfile(fallbackStudentId)
      .then((student) => {
        setState({ isLoading: false, error: "", student });
      })
      .catch((fetchError) => {
        setState({ isLoading: false, error: fetchError.message || "Unable to load student profile.", student: null });
      });
  }, [fallbackStudentId]);

  useEffect(() => {
    void Promise.resolve().then(loadStudent);
  }, [loadStudent]);

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
            <p>Basic student information from the API.</p>
          </div>
          <button className="panel-action" type="button" onClick={loadStudent} disabled={state.isLoading}>
            {state.isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {state.isLoading ? <p className="panel-note">Loading student profile...</p> : null}
        {!state.isLoading && state.error ? <p className="panel-note panel-note-error">{state.error}</p> : null}

        {!state.isLoading && state.student ? (
          <div className="detail-grid">
            <div>
              <span>Full Name</span>
              <strong>{getDisplayName(state.student)}</strong>
            </div>
            <div>
              <span>Admission Number</span>
              <strong>{state.student.admission_number || state.student.admission_no || "-"}</strong>
            </div>
            <div>
              <span>Class</span>
              <strong>{state.student.class_name || state.student.class || "-"}</strong>
            </div>
            <div>
              <span>Stream</span>
              <strong>{state.student.stream_name || state.student.stream || "-"}</strong>
            </div>
            <div>
              <span>Gender</span>
              <strong>{state.student.gender || "-"}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{state.student.status || state.student.enrollment_status || "-"}</strong>
            </div>
          </div>
        ) : null}
      </section>
    </DashboardLayout>
  );
}

export default StudentDetails;
