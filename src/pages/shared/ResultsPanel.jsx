import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { downloadReportCard, getExamReportCards, getStudentProfile, getTermResults } from "../../services/portalDataService";
import { getCurrentUser, getUserRole, isParentRole } from "../../utils/authStorage";
import {
  getDisplayName,
  getPreferredTermId,
  getRecordId,
  getStudentEnrollmentId,
  getStudentId,
} from "../../utils/portalIdentity";

function ResultsPanel({ variant = "term-results" }) {
  const [searchParams] = useSearchParams();
  const user = getCurrentUser();
  const [studentState, setStudentState] = useState({ isLoading: true, error: "", student: null });
  const [collectionState, setCollectionState] = useState({ isLoading: true, error: "", items: [] });

  const selectedStudentId = useMemo(() => {
    const queryStudentId = searchParams.get("studentId");

    if (queryStudentId) {
      return queryStudentId;
    }

    return isParentRole(getUserRole(user)) ? null : getStudentId(user);
  }, [searchParams, user]);
  const enrollmentId = useMemo(() => getStudentEnrollmentId(studentState.student), [studentState.student]);
  const termId = useMemo(() => getPreferredTermId(studentState.student), [studentState.student]);

  const loadStudent = useCallback(() => {
    if (!selectedStudentId) {
      setStudentState({ isLoading: false, error: "Unable to determine the current student profile.", student: null });
      return Promise.resolve();
    }

    setStudentState({ isLoading: true, error: "", student: null });

    return getStudentProfile(selectedStudentId)
      .then((student) => {
        setStudentState({ isLoading: false, error: "", student });
      })
      .catch((fetchError) => {
        setStudentState({ isLoading: false, error: fetchError.message || "Unable to load student profile.", student: null });
      });
  }, [selectedStudentId]);

  const loadCollection = useCallback(() => {
    setCollectionState({ isLoading: true, error: "", items: [] });

    const loader = variant === "term-results" ? getTermResults() : getExamReportCards();

    return loader
      .then((data) => {
        const items = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];

        setCollectionState({ isLoading: false, error: "", items });
      })
      .catch((fetchError) => {
        setCollectionState({ isLoading: false, error: fetchError.message || "Unable to load results.", items: [] });
      });
  }, [variant]);

  useEffect(() => {
    loadStudent();
  }, [loadStudent]);

  useEffect(() => {
    if (variant !== "report-card") {
      loadCollection();
    }
  }, [loadCollection, variant]);

  const visibleCollectionItems = useMemo(() => {
    if (!selectedStudentId) {
      return collectionState.items;
    }

    return collectionState.items.filter((item) => recordBelongsToStudent(item, selectedStudentId, studentState.student));
  }, [collectionState.items, selectedStudentId, studentState.student]);

  const handleDownloadReportCard = async () => {
    if (!enrollmentId || !termId) {
      return;
    }

    await downloadReportCard(enrollmentId, termId, `report-card-${enrollmentId}-${termId}.pdf`);
  };

  if (variant === "report-card") {
    return (
      <section className="data-panel data-panel-spaced">
        <div className="panel-header">
          <div>
            <h3>Report Card</h3>
            <p>Download the selected student's report card from the API.</p>
          </div>
          <button className="panel-action" type="button" onClick={loadStudent} disabled={studentState.isLoading}>
            {studentState.isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {studentState.isLoading ? <p className="panel-note">Loading student profile...</p> : null}
        {!studentState.isLoading && studentState.error ? <p className="panel-note panel-note-error">{studentState.error}</p> : null}

        {!studentState.isLoading && studentState.student ? (
          <div className="detail-grid">
            <div>
              <span>Student</span>
              <strong>{getDisplayName(studentState.student)}</strong>
            </div>
            <div>
              <span>Enrollment</span>
              <strong>{enrollmentId || "-"}</strong>
            </div>
            <div>
              <span>Term</span>
              <strong>{termId || "-"}</strong>
            </div>
          </div>
        ) : null}

        <div className="action-row">
          <button className="primary-button" type="button" onClick={handleDownloadReportCard} disabled={!enrollmentId || !termId}>
            Download report card
          </button>
          {!enrollmentId || !termId ? <p className="panel-note">A report card requires both enrollment and term identifiers.</p> : null}
        </div>
      </section>
    );
  }

  return (
    <section className="data-panel data-panel-spaced">
      <div className="panel-header">
        <div>
          <h3>{variant === "term-results" ? "Term Results" : "Report Cards"}</h3>
          <p>{variant === "term-results" ? "Published term result records from the API." : "Available exam report cards from the API."}</p>
        </div>
        <button className="panel-action" type="button" onClick={loadCollection} disabled={collectionState.isLoading}>
          {collectionState.isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {collectionState.isLoading ? <p className="panel-note">Loading results...</p> : null}
      {!collectionState.isLoading && collectionState.error ? <p className="panel-note panel-note-error">{collectionState.error}</p> : null}
      {!collectionState.isLoading && !collectionState.error && !visibleCollectionItems.length ? (
        <p className="panel-note">No result records were returned by the API.</p>
      ) : null}

      {!collectionState.isLoading && visibleCollectionItems.length ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Term</th>
                <th>Class</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleCollectionItems.slice(0, 8).map((item) => (
                <tr key={getRecordId(item) || getDisplayName(item)}>
                  <td>
                    <strong>{getDisplayName(item)}</strong>
                    <span>{item.admission_number || item.student_admission_number || item.exam_name || item.title || "-"}</span>
                  </td>
                  <td>{item.term_name || item.term || item.term_display || item.academic_term || "-"}</td>
                  <td>{item.class_name || item.stream_name || item.class || item.stream || "-"}</td>
                  <td>{item.average || item.score || item.total || item.percentage || "-"}</td>
                  <td>{item.grade || item.letter_grade || item.overall_grade || "-"}</td>
                  <td>{item.status_display || item.status || item.result_status || item.publish_status || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

function recordBelongsToStudent(record, selectedStudentId, selectedStudent) {
  const possibleIds = [
    record?.student_id,
    record?.student?.id,
    record?.student,
    record?.enrollment?.student_id,
    record?.enrollment?.student?.id,
    getRecordId(selectedStudent),
  ]
    .filter(Boolean)
    .map(String);

  if (possibleIds.includes(String(selectedStudentId))) {
    return true;
  }

  const selectedName = getDisplayName(selectedStudent);

  return Boolean(selectedName && selectedName !== "Unknown" && getDisplayName(record) === selectedName);
}

export default ResultsPanel;
