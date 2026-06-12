import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import AttendancePreview from "../shared/AttendancePreview";
import { getGuardianChildren } from "../../services/portalDataService";
import { getCurrentUser } from "../../utils/authStorage";
import { getGuardianId, getRecordId, getDisplayName } from "../../utils/portalIdentity";

const parentSections = [
  {
    id: "my-children",
    title: "My Children",
    icon: "C",
    description: "View enrolled children, classes, admission numbers, and current academic status.",
  },
  {
    id: "attendance",
    title: "Attendance",
    icon: "A",
    description: "Track daily attendance, absences, and late arrivals for each child.",
    content: <AttendancePreview />,
  },
  {
    id: "results",
    title: "Results",
    icon: "R",
    description: "Open continuous assessments, term results, and student result cards.",
  },
  {
    id: "finance",
    title: "Finance",
    icon: "F",
    description: "Check invoices, receipts, balances, due dates, and payment status.",
  },
];

const parentNavItems = [
  {
    label: "My Children",
    href: "/parent/children",
  },
  {
    label: "Attendance",
    href: "/parent/attendance",
  },
  {
    label: "Results",
    children: [
      {
        label: "Continuous Assessment",
        href: "/parent/results/continuous-assessments",
      },
      {
        label: "Term Results",
        href: "/parent/results/term-results",
      },
      {
        label: "Student Result Card",
        href: "/parent/results/student-result-card",
      },
    ],
  },
  {
    label: "Finance",
    children: [
      {
        label: "Invoice",
        href: "/parent/finance/invoice",
      },
      {
        label: "Receipt",
        href: "/parent/finance/receipts",
      },
    ],
  },
];

function ParentDashboard() {
  const user = getCurrentUser();
  const guardianId = useMemo(() => getGuardianId(user), [user]);
  const [childrenState, setChildrenState] = useState({ isLoading: true, error: "", children: [] });

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

  useEffect(() => {
    loadChildren();
  }, [loadChildren]);

  return (
    <DashboardLayout
      title="Parent Dashboard"
      subtitle="A clear view of each child's school progress, attendance, academic records, and payments."
      sections={parentSections}
      navItems={parentNavItems}
    >
      <div className="dashboard-overview-stack">
        <section className="data-panel">
          <div className="panel-header">
            <div>
              <h3>My Children</h3>
              <p>Students linked to the current guardian account.</p>
            </div>
            <Link className="panel-action" to="/parent/children">
              Open full list
            </Link>
          </div>

          {childrenState.isLoading ? <p className="panel-note">Loading children...</p> : null}
          {!childrenState.isLoading && childrenState.error ? <p className="panel-note panel-note-error">{childrenState.error}</p> : null}
          {!childrenState.isLoading && !childrenState.error && !childrenState.children.length ? (
            <p className="panel-note">No children were returned for this guardian account.</p>
          ) : null}

          {!childrenState.isLoading && !childrenState.error && childrenState.children.length ? (
            <div className="record-grid">
              {childrenState.children.slice(0, 4).map((child) => (
                <article className="record-card" key={getRecordId(child) || getDisplayName(child)}>
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
                    View details
                  </Link>
                </article>
              ))}
            </div>
          ) : null}
        </section>

        <AttendancePreview />
      </div>
    </DashboardLayout>
  );
}

export default ParentDashboard;
