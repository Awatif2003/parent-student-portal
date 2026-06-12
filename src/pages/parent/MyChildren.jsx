import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getGuardianChildren, getStudentProfile } from "../../services/portalDataService";
import { getCurrentUser } from "../../utils/authStorage";
import { getDisplayName, getGuardianId, getRecordId } from "../../utils/portalIdentity";

function MyChildren() {
  const [searchParams] = useSearchParams();
  const user = getCurrentUser();
  const guardianId = useMemo(() => getGuardianId(user), [user]);
  const selectedStudentId = searchParams.get("studentId");

  const [childrenState, setChildrenState] = useState({ isLoading: true, error: "", children: [] });
  const [selectedStudentState, setSelectedStudentState] = useState({ isLoading: false, error: "", student: null });

  const loadChildren = useCallback(() => {
    if (!guardianId) {
      setChildrenState({ isLoading: false, error: "Unable to determine guardian profile from the current session.", children: [] });
      return Promise.resolve();
    }

    setChildrenState((currentState) => ({ ...currentState, isLoading: true, error: "" }));

    return getGuardianChildren(guardianId)
      .then((data) => {
        setChildrenState({
          isLoading: false,
          error: "",
          children: Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [],
        });
      })
      .catch((fetchError) => {
        setChildrenState({ isLoading: false, error: fetchError.message || "Unable to load children.", children: [] });
      });
  }, [guardianId]);

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
    loadChildren();
  }, [loadChildren]);

  useEffect(() => {
    loadSelectedStudent(selectedStudentId);
  }, [loadSelectedStudent, selectedStudentId]);

  return (
    <DashboardLayout
      title="My Children"
      subtitle="View linked children, basic profile details, and open a child's profile for more information."
      navItems={[
        { label: "Parent Dashboard", href: "/parent" },
        { label: "My Children", href: "/parent/children" },
        { label: "Attendance", href: "/parent/attendance" },
      ]}
    >
      <section className="data-panel">
        <div className="panel-header">
          <div>
            <h3>Linked Students</h3>
            <p>Children associated with the current guardian account.</p>
          </div>
          <button className="panel-action" type="button" onClick={loadChildren} disabled={childrenState.isLoading}>
            {childrenState.isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {childrenState.isLoading ? <p className="panel-note">Loading children...</p> : null}
        {!childrenState.isLoading && childrenState.error ? <p className="panel-note panel-note-error">{childrenState.error}</p> : null}
        {!childrenState.isLoading && !childrenState.error && !childrenState.children.length ? (
          <p className="panel-note">No children were returned for this guardian account.</p>
        ) : null}

        {!childrenState.isLoading && !childrenState.error && childrenState.children.length ? (
          <div className="record-grid">
            {childrenState.children.map((child) => (
              <article className={`record-card ${String(getRecordId(child)) === selectedStudentId ? "record-card-active" : ""}`} key={getRecordId(child) || getDisplayName(child)}>
                <div>
                  <p className="record-label">Student</p>
                  <h4>{getDisplayName(child)}</h4>
                  <p>{child.admission_number || child.admission_no || "Admission number unavailable"}</p>
                </div>
                <div className="record-meta">
                  <span>{child.class_name || child.class || child.stream_name || "Class unavailable"}</span>
                  <span>{child.gender || child.status || "Profile available"}</span>
                </div>
                <Link className="record-link" to={`/parent/children?studentId=${getRecordId(child)}`}>
                  View full profile
                </Link>
                <Link className="record-link" to={`/parent/results/student-result-card?studentId=${getRecordId(child)}`}>
                  View report card
                </Link>
              </article>
            ))}
          </div>
        ) : null}
      </section>

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
    </DashboardLayout>
  );
}

export default MyChildren;
