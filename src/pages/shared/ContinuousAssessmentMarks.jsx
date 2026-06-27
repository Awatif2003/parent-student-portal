import { useCallback, useEffect, useState } from "react";
import { getContinuousAssessmentForStudent, getMyContinuousAssessment } from "../../services/portalDataService";

// Live continuous-assessment marks table, shared by the student and parent
// portals. Pass `self` for the logged-in student (id resolved internally), or a
// `studentId` (e.g. a parent's selected child). Both are backend-authorized.
function ContinuousAssessmentMarks({ studentId = null, self = false }) {
  const [state, setState] = useState({ isLoading: false, error: "", marks: [], loaded: false });

  const loadMarks = useCallback(() => {
    if (!self && !studentId) {
      setState({ isLoading: false, error: "", marks: [], loaded: false });
      return Promise.resolve();
    }

    setState({ isLoading: true, error: "", marks: [], loaded: false });

    const request = self ? getMyContinuousAssessment() : getContinuousAssessmentForStudent(studentId);

    return request
      .then((marks) => setState({ isLoading: false, error: "", marks, loaded: true }))
      .catch((fetchError) =>
        setState({ isLoading: false, error: fetchError.message || "Unable to load assessment marks.", marks: [], loaded: true }),
      );
  }, [self, studentId]);

  useEffect(() => {
    void Promise.resolve().then(loadMarks);
  }, [loadMarks]);

  const { isLoading, error, marks, loaded } = state;
  const needsSelection = !self && !studentId;

  return (
    <section className="data-panel data-panel-spaced">
      <div className="panel-header">
        <div>
          <h3>Assessment Marks</h3>
          <p>Marks as entered by teachers — visible before results are published.</p>
        </div>
        <button className="panel-action" type="button" onClick={loadMarks} disabled={isLoading || needsSelection}>
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {needsSelection ? <p className="panel-note">Select a student to view continuous assessment records.</p> : null}
      {isLoading ? <p className="panel-note">Loading assessment marks...</p> : null}
      {!isLoading && error ? <p className="panel-note panel-note-error">{error}</p> : null}
      {!isLoading && !error && loaded && !marks.length ? (
        <p className="panel-note">No assessment marks have been recorded yet.</p>
      ) : null}

      {!isLoading && marks.length ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Assessment</th>
                <th>Marks</th>
                <th>Out of</th>
                <th>%</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((mark) => (
                <tr key={mark.id}>
                  <td>
                    <strong>{mark.subject_name || "-"}</strong>
                  </td>
                  <td>{mark.exam_name || "-"}</td>
                  <td>{mark.is_absent ? "Absent" : formatNumber(mark.marks_obtained)}</td>
                  <td>{formatNumber(mark.max_marks)}</td>
                  <td>{mark.is_absent ? "-" : formatPercentage(mark.percentage)}</td>
                  <td>{mark.grade || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

function formatNumber(value) {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? value : numberValue.toString();
}

function formatPercentage(value) {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? value : `${numberValue.toFixed(1).replace(/\.0$/, "")}%`;
}

export default ContinuousAssessmentMarks;
