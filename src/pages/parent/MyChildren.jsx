import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getStudentProfile } from "../../services/portalDataService";
import { getDisplayName } from "../../utils/portalIdentity";
import ParentStudentTable from "./ParentStudentTable";
import { parentNavItems } from "./parentNavItems";

function MyChildren() {
  const [searchParams] = useSearchParams();
  const selectedStudentId = searchParams.get("studentId");
  const [selectedStudentState, setSelectedStudentState] = useState({ isLoading: false, error: "", student: null });

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
    loadSelectedStudent(selectedStudentId);
  }, [loadSelectedStudent, selectedStudentId]);

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
    </DashboardLayout>
  );
}

export default MyChildren;
