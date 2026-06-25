import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getParentChildren } from "../../services/attendanceService";
import { getStudentProfile } from "../../services/portalDataService";
import { getDisplayName, getRecordId } from "../../utils/portalIdentity";
import { parentNavItems } from "./parentNavItems";

function MyChildren() {
  const [searchParams] = useSearchParams();
  const selectedStudentId = searchParams.get("studentId");
  const [childrenState, setChildrenState] = useState({ isLoading: true, error: "", children: [] });
  const [selectedStudentState, setSelectedStudentState] = useState({ isLoading: false, error: "", student: null });

  const loadChildren = useCallback(() => {
    setChildrenState((currentState) => ({ ...currentState, isLoading: true, error: "" }));

    return getParentChildren()
      .then((data) => {
        setChildrenState({
          isLoading: false,
          error: "",
          children: normalizeChildren(data),
        });
      })
      .catch((fetchError) => {
        setChildrenState({
          isLoading: false,
          error: fetchError.message || "Unable to load your children.",
          children: [],
        });
      });
  }, []);

  const loadSelectedStudent = useCallback((studentId) => {
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
        setSelectedStudentState({
          isLoading: false,
          error: fetchError.message || "Unable to load student details.",
          student: null,
        });
      });
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadChildren);
  }, [loadChildren]);

  useEffect(() => {
    void Promise.resolve().then(() => loadSelectedStudent(selectedStudentId));
  }, [loadSelectedStudent, selectedStudentId]);

  const children = useMemo(() => childrenState.children.map(enrichChild), [childrenState.children]);
  const selectedChild = useMemo(
    () => children.find((child) => String(child.recordId || "") === String(selectedStudentId || "")) || null,
    [children, selectedStudentId],
  );
  const activeChild = selectedStudentState.student || selectedChild;

  return (
    <DashboardLayout
      title="My Children"
      subtitle="View your children's information."
      navItems={parentNavItems}
      contentClassName="parent-dashboard-content my-children-content"
      pageClassName="parent-dashboard-page"
    >
      <div className="parent-dashboard-shell my-children-shell">
        <section className="parent-children-hero">
          <div>
            <p className="parent-dashboard-kicker">Shule Yangu</p>
            <h2>My Children</h2>
            <p>Simple child cards for parents who want quick access to school, class, relationship, and attendance status.</p>
          </div>

          <div className="parent-children-hero-meta" aria-label="Children summary">
            <span className="parent-children-chip">{children.length} linked children</span>
            <span className="parent-children-chip">One card per child</span>
          </div>
        </section>

        {selectedStudentId ? (
          <section className="parent-card-section parent-profile-card" id="child-profile">
            <div className="parent-section-heading">
              <div>
                <p className="parent-dashboard-kicker">Selected child</p>
                <h2>{activeChild ? getDisplayName(activeChild) : "Child profile"}</h2>
                <p>{activeChild ? "Quick summary and links to detailed student pages." : "Choose a child below to open the profile summary."}</p>
              </div>

              <Link className="parent-text-action" to="/parent/children">
                Clear selection
              </Link>
            </div>

            {selectedStudentState.isLoading ? <p className="parent-empty-state">Loading child profile...</p> : null}
            {!selectedStudentState.isLoading && selectedStudentState.error ? (
              <p className="parent-empty-state parent-empty-error">{selectedStudentState.error}</p>
            ) : null}
            {!selectedStudentState.isLoading && activeChild ? (
              <div className="parent-profile-summary">
                <div className="parent-profile-summary-main">
                  <div className="parent-profile-avatar" aria-hidden="true">
                    {getInitials(getDisplayName(activeChild))}
                  </div>
                  <div>
                    <h3>{getDisplayName(activeChild)}</h3>
                    <p>{getChildSchoolLine(activeChild)}</p>
                  </div>
                </div>

                <div className="parent-profile-meta">
                  <div>
                    <span>Admission Number</span>
                    <strong>{activeChild.admission_number || activeChild.admission_no || "-"}</strong>
                  </div>
                  <div>
                    <span>Relationship</span>
                    <strong>{getChildRelationship(activeChild)}</strong>
                  </div>
                  <div>
                    <span>Attendance</span>
                    <strong>{getChildAttendanceStatus(activeChild).label}</strong>
                  </div>
                </div>

                <div className="parent-profile-actions">
                  <Link className="parent-profile-action" to={`/parent/attendance?studentId=${selectedStudentId}`}>
                    Attendance
                  </Link>
                  <Link className="parent-profile-action" to={`/parent/results/term-results?studentId=${selectedStudentId}`}>
                    Results
                  </Link>
                  <Link className="parent-profile-action" to={`/parent/results/continuous-assessments?studentId=${selectedStudentId}`}>
                    Assessments
                  </Link>
                  <Link className="parent-profile-action" to={`/parent/finance/invoice?studentId=${selectedStudentId}`}>
                    Fees
                  </Link>
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="parent-card-section parent-children-section">
          <div className="parent-section-heading">
            <div>
              <p className="parent-dashboard-kicker">Children cards</p>
              <h2>Children</h2>
              <p>Each child is displayed as a clean card with the most important details first.</p>
            </div>

            <button className="parent-text-action parent-refresh-action" type="button" onClick={loadChildren} disabled={childrenState.isLoading}>
              {childrenState.isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {childrenState.isLoading ? <p className="parent-empty-state">Loading children...</p> : null}
          {!childrenState.isLoading && childrenState.error ? <p className="parent-empty-state parent-empty-error">{childrenState.error}</p> : null}
          {!childrenState.isLoading && !childrenState.error && !children.length ? (
            <p className="parent-empty-state">No children were returned for this guardian account.</p>
          ) : null}

          {!childrenState.isLoading && !childrenState.error && children.length ? (
            <div className="parent-children-grid">
              {children.map((child) => {
                const childId = child.recordId || getRecordId(child) || "";
                const attendance = getChildAttendanceStatus(child);
                const isSelected = String(childId) === String(selectedStudentId || "");

                return (
                  <article className={`parent-child-card parent-child-card-modern${isSelected ? " is-selected" : ""}`} key={childId || getDisplayName(child)}>
                    <div className="parent-child-card-top">
                      <div className="parent-child-avatar" aria-hidden="true">
                        {getInitials(getDisplayName(child))}
                      </div>

                      <span className={`parent-status-pill parent-status-${attendance.tone}`}>
                        <AttendanceStatusIcon tone={attendance.tone} />
                        {attendance.label}
                      </span>
                    </div>

                    <div className="parent-child-body">
                      <h3>{getDisplayName(child)}</h3>

                      <div className="parent-child-info-list">
                        <div className="parent-child-info-item">
                          <span>Admission Number</span>
                          <strong>{child.admission_number || child.admission_no || "-"}</strong>
                        </div>

                        <div className="parent-child-info-item parent-child-icon-row">
                          <MetaIcon type="school" />
                          <span>{getChildSchoolName(child)}</span>
                        </div>

                        <div className="parent-child-info-item parent-child-icon-row">
                          <MetaIcon type="class" />
                          <span>{getChildClassName(child)}</span>
                        </div>

                        <div className="parent-child-info-item parent-child-icon-row">
                          <MetaIcon type="relationship" />
                          <span>{getChildRelationship(child)}</span>
                        </div>
                      </div>
                    </div>

                    <Link className="parent-child-link parent-child-link-wide" to={`/parent/children?studentId=${childId}#child-profile`}>
                      View Profile
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : null}
        </section>
      </div>
    </DashboardLayout>
  );
}

function normalizeChildren(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.children)) {
    return data.children;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
}

function enrichChild(child) {
  return {
    ...child,
    recordId: getRecordId(child) || child?.student_id || child?.id || child?.admission_number || child?.admission_no || "",
  };
}

function getChildAttendanceStatus(child) {
  const records = Array.isArray(child?.attendance) ? child.attendance : [];
  const latestRecord = records[0] || {};
  const rawStatus = String(
    latestRecord.status_display || latestRecord.status || child?.attendance_status || child?.today_attendance_status || child?.status || "",
  ).toLowerCase();

  if (rawStatus.includes("present")) {
    return { label: "Present", tone: "success" };
  }

  if (rawStatus.includes("absent") || rawStatus.includes("late")) {
    return { label: "Absent", tone: "warning" };
  }

  return { label: "No update", tone: "neutral" };
}

function getChildSchoolName(child) {
  return child?.school_name || child?.school?.name || child?.tenant?.school_name || "School unavailable";
}

function getChildClassName(child) {
  return child?.class_name || child?.class || child?.current_class || "Class unavailable";
}

function getChildSchoolLine(child) {
  return [getChildClassName(child), getChildSchoolName(child)].filter(Boolean).join(" / ") || "Class and school unavailable";
}

function getChildRelationship(child) {
  return child?.relationship || child?.guardian_relationship || "Parent/Guardian";
}

function getInitials(name) {
  const initials = String(name || "Child")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "C";
}

function AttendanceStatusIcon({ tone }) {
  const isPresent = tone === "success";

  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 18 18">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9">
        {isPresent ? <path d="M4 9.5 7.3 12.5 14 4.8" /> : <path d="M5.5 5.5 12.5 12.5M12.5 5.5 5.5 12.5" />}
      </g>
    </svg>
  );
}

function MetaIcon({ type }) {
  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 20 20">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">
        {type === "school" ? (
          <>
            <path d="M3 9 10 5l7 4-7 4-7-4Z" />
            <path d="M6 10v4c0 1.1 1.8 2 4 2s4-.9 4-2v-4" />
          </>
        ) : null}
        {type === "class" ? (
          <>
            <path d="M4 6h12v8H4z" />
            <path d="M6.5 9h7M6.5 11.5h4.5" />
          </>
        ) : null}
        {type === "relationship" ? (
          <>
            <path d="M10 11.5c1.9 0 3.5-1.6 3.5-3.5S11.9 4.5 10 4.5 6.5 6.1 6.5 8s1.6 3.5 3.5 3.5Z" />
            <path d="M4.5 16c.7-2.7 2.4-4 5.5-4s4.8 1.3 5.5 4" />
          </>
        ) : null}
      </g>
    </svg>
  );
}

export default MyChildren;
