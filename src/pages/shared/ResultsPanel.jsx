import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { downloadReportCard, getAnnualResults, getExamReportCards, getMyStudentDetail, getStudentProfile, getTermResults } from "../../services/portalDataService";
import { getCurrentUser, getUserRole, isParentRole } from "../../utils/authStorage";
import {
  getDisplayName,
  getPreferredTermId,
  getRecordId,
  getStudentEnrollmentId,
} from "../../utils/portalIdentity";

function ResultsPanel({ variant = "term-results" }) {
  const [searchParams] = useSearchParams();
  const user = getCurrentUser();
  const [studentState, setStudentState] = useState({ isLoading: true, error: "", student: null });
  const [collectionState, setCollectionState] = useState({ isLoading: true, error: "", items: [] });

  // Parents pick a child via ?studentId=; students resolve their OWN record
  // from the backend-scoped list (the token has no Student id to guess from).
  const isParent = useMemo(() => isParentRole(getUserRole(user)), [user]);
  const childStudentId = useMemo(
    () => (isParent ? searchParams.get("studentId") : null),
    [isParent, searchParams],
  );
  const enrollmentId = useMemo(() => getStudentEnrollmentId(studentState.student), [studentState.student]);
  const termId = useMemo(() => getPreferredTermId(studentState.student), [studentState.student]);

  const loadStudent = useCallback(() => {
    setStudentState({ isLoading: true, error: "", student: null });

    if (isParent && !childStudentId) {
      setStudentState({ isLoading: false, error: "Select a child to view their results.", student: null });
      return Promise.resolve();
    }

    const request = isParent ? getStudentProfile(childStudentId) : getMyStudentDetail();

    return request
      .then((student) => {
        setStudentState({ isLoading: false, error: "", student });
      })
      .catch((fetchError) => {
        setStudentState({ isLoading: false, error: fetchError.message || "Unable to load student profile.", student: null });
      });
  }, [isParent, childStudentId]);

  const loadCollection = useCallback(() => {
    setCollectionState({ isLoading: true, error: "", items: [] });

    const loader = getResultsLoader(variant);

    return loader()
      .then((data) => {
        const items = normalizeResultCollection(data);

        setCollectionState({ isLoading: false, error: "", items });
      })
      .catch((fetchError) => {
        setCollectionState({ isLoading: false, error: fetchError.message || "Unable to load results.", items: [] });
      });
  }, [variant]);

  useEffect(() => {
    void Promise.resolve().then(loadStudent);
  }, [loadStudent]);

  useEffect(() => {
    void Promise.resolve().then(loadCollection);
  }, [loadCollection, variant]);

  const visibleCollectionItems = useMemo(() => {
    // A student's result endpoints are already scoped to them by the backend, so
    // show everything returned. A parent narrows the (multi-child) results down
    // to the selected child.
    if (isParent && childStudentId) {
      return collectionState.items.filter((item) =>
        recordBelongsToStudent(item, childStudentId, studentState.student),
      );
    }

    return collectionState.items;
  }, [collectionState.items, isParent, childStudentId, studentState.student]);

  // The PDF download needs an enrollment + term. The student profile carries no
  // term, so we take them from the loaded report card (a term-result row, which
  // has both). Fall back to the profile's enrollment if no card is loaded yet.
  const downloadEnrollmentId = visibleCollectionItems[0]?.enrollment || enrollmentId;
  const downloadTermId = visibleCollectionItems[0]?.term || termId;

  const handleDownloadReportCard = async () => {
    if (!downloadEnrollmentId || !downloadTermId) {
      return;
    }

    await downloadReportCard(
      downloadEnrollmentId,
      downloadTermId,
      `report-card-${downloadEnrollmentId}-${downloadTermId}.pdf`,
    );
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
              <strong>{downloadEnrollmentId || "-"}</strong>
            </div>
            <div>
              <span>Term</span>
              <strong>{downloadTermId || "-"}</strong>
            </div>
          </div>
        ) : null}

        <div className="action-row">
          <button className="primary-button" type="button" onClick={handleDownloadReportCard} disabled={!downloadEnrollmentId || !downloadTermId}>
            Download report card
          </button>
          {!downloadEnrollmentId || !downloadTermId ? <p className="panel-note">A report card requires both enrollment and term identifiers.</p> : null}
        </div>

        <div className="data-panel data-panel-spaced">
          <div className="panel-header">
            <div>
              <h3>Published Result Cards</h3>
              <p>Report card data returned by the API, including subject grades and term summary.</p>
            </div>
            <button className="panel-action" type="button" onClick={loadCollection} disabled={collectionState.isLoading}>
              {collectionState.isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {collectionState.isLoading ? <p className="panel-note">Loading result cards...</p> : null}
          {!collectionState.isLoading && collectionState.error ? <p className="panel-note panel-note-error">{collectionState.error}</p> : null}
          {!collectionState.isLoading && !collectionState.error && !visibleCollectionItems.length ? (
            <p className="panel-note">No result cards were returned by the API.</p>
          ) : null}
          {!collectionState.isLoading && visibleCollectionItems.length ? <ReportCardsView cards={visibleCollectionItems} /> : null}
        </div>
      </section>
    );
  }

  return (
    <section className="data-panel data-panel-spaced">
      <div className="panel-header">
        <div>
          <h3>{getResultsTitle(variant)}</h3>
          <p>{getResultsDescription(variant)}</p>
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

      {!collectionState.isLoading && visibleCollectionItems.length && variant === "annual-results" ? (
        <AnnualResultsView results={visibleCollectionItems} />
      ) : null}

      {!collectionState.isLoading && visibleCollectionItems.length && variant !== "annual-results" ? (
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

function ReportCardsView({ cards }) {
  return (
    <div className="record-grid">
      {cards.slice(0, 6).map((card) => {
        const termResult = card.term_result || {};
        const subjectGrades = card.subject_grades || termResult.subject_grades || [];

        return (
          <article className="record-card result-card" key={termResult.id || card.id || `${getReportStudentName(card)}-${getReportTermName(card)}`}>
            <div>
              <p className="record-label">{getReportTermName(card)}</p>
              <h4>{getReportStudentName(card)}</h4>
              <p>{termResult.student_admission || card.student?.admission_number || "Admission number unavailable"}</p>
            </div>

            <div className="metric-grid">
              <div className="metric-card">
                <strong>{formatDecimal(termResult.average_marks)}</strong>
                <span>Average marks</span>
              </div>
              <div className="metric-card">
                <strong>{termResult.division || "-"}</strong>
                <span>Division</span>
              </div>
              <div className="metric-card">
                <strong>{formatRank(termResult.stream_rank)}</strong>
                <span>Stream rank</span>
              </div>
              <div className="metric-card">
                <strong>{formatNumber(termResult.subjects_passed)}</strong>
                <span>Subjects passed</span>
              </div>
            </div>

            {subjectGrades.length ? (
              <div className="table-wrap">
                <table className="data-table result-subject-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Marks</th>
                      <th>Grade</th>
                      <th>Points</th>
                      <th>Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectGrades.map((grade) => (
                      <tr key={grade.id || `${grade.subject_name}-${grade.subject_rank}`}>
                        <td>{grade.subject_name || grade.subject || "-"}</td>
                        <td>{formatDecimal(grade.average_marks || grade.total_marks)}</td>
                        <td>{grade.grade || "-"}</td>
                        <td>{formatDecimal(grade.points)}</td>
                        <td>{formatRank(grade.subject_rank)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            <div className="record-meta">
              <span>{termResult.class_teacher_comment || termResult.remarks || "No class teacher comment."}</span>
              <span>{termResult.head_teacher_comment || "No head teacher comment."}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function AnnualResultsView({ results }) {
  const [pageSize, setPageSize] = useState(25);
  const visibleResults = results.slice(0, pageSize);

  return (
    <div className="table-panel">
      <div className="table-controls">
        <label className="table-length">
          <span>Show</span>
          <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>entries</span>
        </label>
      </div>

      <div className="table-wrap">
        <table className="data-table student-detail-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Academic Year</th>
              <th>Stream</th>
              <th>Subjects</th>
              <th>Average</th>
              <th>Points</th>
              <th>Division</th>
              <th>Stream Rank</th>
              <th>Grade Rank</th>
              <th>Promotion</th>
              <th>Promoted To</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {visibleResults.map((result) => (
              <tr key={result.id || result.enrollment || `${result.student_name}-${result.academic_year}`}>
                <td>
                  <strong>{result.student_name || "-"}</strong>
                  <span>{result.student_admission || result.admission_number || "-"}</span>
                </td>
                <td>{result.academic_year_name || result.academic_year || "-"}</td>
                <td>{result.stream_name || "-"}</td>
                <td>{formatNumber(result.total_subjects)}</td>
                <td>{formatDecimal(result.annual_average)}</td>
                <td>{formatDecimal(result.annual_points)}</td>
                <td>{result.final_division || "-"}</td>
                <td>{formatRank(result.stream_rank)}</td>
                <td>{formatRank(result.grade_rank)}</td>
                <td>
                  <span className={`status-pill status-${String(result.promotion_status || "unknown").toLowerCase()}`}>
                    {formatLabel(result.promotion_status)}
                  </span>
                </td>
                <td>{result.promoted_to_name || "-"}</td>
                <td>{result.remarks || result.head_teacher_comment || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <p>
          Showing {visibleResults.length ? 1 : 0} to {visibleResults.length} of {results.length} entries
        </p>
      </div>
    </div>
  );
}

function getResultsLoader(variant) {
  if (variant === "annual-results") {
    return getAnnualResults;
  }

  return variant === "term-results" ? getTermResults : getExamReportCards;
}

function getResultsTitle(variant) {
  if (variant === "annual-results") {
    return "Annual Results";
  }

  return variant === "term-results" ? "Term Results" : "Report Cards";
}

function getResultsDescription(variant) {
  if (variant === "annual-results") {
    return "Published annual result records from the API.";
  }

  return variant === "term-results" ? "Published term result records from the API." : "Available exam report cards from the API.";
}

function normalizeResultCollection(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  if (Array.isArray(data?.data?.results)) {
    return data.data.results;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  // The report-card `generate` action returns { success, data: <object> } — a
  // single report card rather than a list. Wrap it so the grid can render it.
  if (data?.data && typeof data.data === "object") {
    return [data.data];
  }

  return data?.id ? [data] : [];
}

function formatDecimal(value) {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return value;
  }

  return numberValue.toFixed(2).replace(/\.00$/, "");
}

function formatNumber(value) {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  return Number.isNaN(Number(value)) ? value : Number(value).toLocaleString();
}

function formatRank(value) {
  return value ? `#${value}` : "-";
}

function formatLabel(value) {
  if (!value) {
    return "-";
  }

  return String(value)
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getReportStudentName(card) {
  return firstAvailable(
    card?.term_result?.student_name,
    card?.student?.full_name,
    card?.student?.name,
    card?.student?.student_name,
    getDisplayName(card),
  );
}

function getReportTermName(card) {
  return firstAvailable(card?.term_result?.term_name, card?.term?.name, card?.term?.term_name, card?.term_name, "Term");
}

function firstAvailable(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "") || "-";
}

function recordBelongsToStudent(record, selectedStudentId, selectedStudent) {
  const possibleIds = [
    record?.student_id,
    record?.student?.id,
    record?.student,
    record?.term_result?.student_id,
    record?.enrollment?.student_id,
    record?.enrollment?.student?.id,
    getRecordId(selectedStudent),
    getStudentEnrollmentId(selectedStudent) && record?.term_result?.enrollment,
    getStudentEnrollmentId(selectedStudent) && record?.enrollment,
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
