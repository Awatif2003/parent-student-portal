import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import AttendancePreview from "../shared/AttendancePreview";
import { getDashboardFinance } from "../../services/dashboardService";
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
    id: "annual-results",
    title: "Annual Results",
    icon: "Y",
    description: "Review yearly averages, rankings, divisions, promotion status, and teacher comments.",
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
        label: "Annual Results",
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
  const [financeState, setFinanceState] = useState({ isLoading: true, error: "", summary: null });

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
    void Promise.resolve().then(loadChildren);
  }, [loadChildren]);

  const loadFinanceSummary = useCallback(() => {
    setFinanceState((currentState) => ({ ...currentState, isLoading: true, error: "" }));

    return getDashboardFinance()
      .then((summary) => {
        setFinanceState({ isLoading: false, error: "", summary });
      })
      .catch((fetchError) => {
        setFinanceState({ isLoading: false, error: fetchError.message || "Unable to load finance summary.", summary: null });
      });
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadFinanceSummary);
  }, [loadFinanceSummary]);

  return (
    <DashboardLayout
      title="Parent Dashboard"
      subtitle="A clear view of each child's school progress, attendance, annual results, academic records, and payments."
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

        <div className="data-panel">
          <AttendancePreview />

          <FinanceSummary state={financeState} onRefresh={loadFinanceSummary} />

          <section className="simple-page">
            <p className="eyebrow-dark">New API Area</p>
            <h2>Annual Results</h2>
            <p>
              Ready to connect to /exams/annual-results/ for yearly averages, ranks, divisions, promotion status, and comments.
            </p>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

function FinanceSummary({ state, onRefresh }) {
  const metrics = getFinanceMetrics(state.summary);

  return (
    <section className="simple-page">
      <div className="panel-header">
        <div>
          <p className="eyebrow-dark">Dashboard Finance</p>
          <h2>Finance Summary</h2>
        </div>
        <button className="panel-action" type="button" onClick={onRefresh} disabled={state.isLoading}>
          {state.isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {state.isLoading ? <p className="panel-note">Loading finance summary...</p> : null}
      {!state.isLoading && state.error ? <p className="panel-note panel-note-error">{state.error}</p> : null}
      {!state.isLoading && !state.error && !metrics.length ? (
        <p className="panel-note">No finance summary values were returned by the API.</p>
      ) : null}

      {!state.isLoading && !state.error && metrics.length ? (
        <div className="metric-grid">
          {metrics.map((metric) => (
            <div className="metric-card" key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function getFinanceMetrics(summary) {
  if (!summary || typeof summary !== "object") {
    return [];
  }

  const preferredMetrics = [
    ["total_balance", "Total Balance"],
    ["outstanding_balance", "Outstanding Balance"],
    ["total_invoiced", "Total Invoiced"],
    ["total_paid", "Total Paid"],
    ["payments_today", "Payments Today"],
    ["overdue_amount", "Overdue Amount"],
    ["invoice_count", "Invoices"],
    ["payment_count", "Payments"],
  ];

  const preferred = preferredMetrics
    .filter(([key]) => summary[key] !== undefined && summary[key] !== null && summary[key] !== "")
    .map(([key, label]) => ({ label, value: formatFinanceValue(summary[key]) }));

  if (preferred.length) {
    return preferred;
  }

  return Object.entries(summary)
    .filter(([, value]) => ["string", "number", "boolean"].includes(typeof value))
    .slice(0, 6)
    .map(([key, value]) => ({ label: formatFinanceLabel(key), value: formatFinanceValue(value) }));
}

function formatFinanceLabel(key) {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatFinanceValue(value) {
  if (typeof value === "number") {
    return value.toLocaleString();
  }

  return String(value);
}

export default ParentDashboard;
