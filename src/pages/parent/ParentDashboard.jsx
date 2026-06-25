import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getDashboardExams, getDashboardFinance } from "../../services/dashboardService";
import { getGuardianChildren } from "../../services/portalDataService";
import { getCurrentUser } from "../../utils/authStorage";
import { getDisplayName, getRecordId } from "../../utils/portalIdentity";
import { parentNavItems } from "./parentNavItems";

const quickActions = [
  {
    label: "View Results",
    href: "/parent/results/term-results",
    icon: "results",
  },
  {
    label: "View Attendance",
    href: "/parent/attendance",
    icon: "attendance",
  },
  {
    label: "View Fees",
    href: "/parent/finance/invoice",
    icon: "fees",
  },
  {
    label: "View Assessments",
    href: "/parent/results/continuous-assessments",
    icon: "assessment",
  },
];

function ParentDashboard() {
  const user = getCurrentUser();
  const parentName = getParentName(user);
  const today = useMemo(() => new Date(), []);
  const todayQueryDate = useMemo(() => formatQueryDate(today), [today]);
  const [childrenState, setChildrenState] = useState({ isLoading: true, error: "", children: [] });
  const [financeState, setFinanceState] = useState({ isLoading: true, error: "", summary: null });
  const [examState, setExamState] = useState({ isLoading: true, error: "", summary: null });

  const loadChildren = useCallback(() => {
    setChildrenState((currentState) => ({ ...currentState, isLoading: true, error: "" }));

    return getGuardianChildren({ date: todayQueryDate })
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
  }, [todayQueryDate]);

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

  const loadExamSummary = useCallback(() => {
    setExamState((currentState) => ({ ...currentState, isLoading: true, error: "" }));

    return getDashboardExams()
      .then((summary) => {
        setExamState({ isLoading: false, error: "", summary });
      })
      .catch((fetchError) => {
        setExamState({ isLoading: false, error: fetchError.message || "Unable to load results summary.", summary: null });
      });
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => Promise.all([loadChildren(), loadFinanceSummary(), loadExamSummary()]));
  }, [loadChildren, loadFinanceSummary, loadExamSummary]);

  const attendanceSummary = getAttendanceSummary(childrenState.children);
  const kpiCards = getKpiCards({
    childrenCount: childrenState.children.length,
    attendanceSummary,
    financeSummary: financeState.summary,
    examSummary: examState.summary,
    isLoadingChildren: childrenState.isLoading,
    isLoadingFinance: financeState.isLoading,
    isLoadingExams: examState.isLoading,
  });

  return (
    <DashboardLayout
      title="Parent Dashboard"
      subtitle="A simple daily overview for children, attendance, fees, and results."
      navItems={parentNavItems}
      contentClassName="parent-dashboard-content"
      pageClassName="parent-dashboard-page"
    >
      <div className="parent-dashboard-shell">
        <section className="parent-welcome-panel">
          <div>
            <p className="parent-dashboard-kicker">Today</p>
            <h2>Welcome back, {parentName}</h2>
            <p>Here is your children's overview today</p>
          </div>
        </section>

        <section className="parent-kpi-section" aria-labelledby="parent-kpi-heading">
          <div className="parent-section-heading">
            <div>
              <p className="parent-dashboard-kicker">Quick Status</p>
              <h2 id="parent-kpi-heading">Family overview</h2>
            </div>
          </div>

          <div className="parent-kpi-grid">
            {kpiCards.map((card) => (
              <article className={`parent-kpi-card parent-kpi-${card.tone}`} key={card.label}>
                <div className="parent-kpi-icon" aria-hidden="true">
                  <DashboardIcon name={card.icon} />
                </div>
                <div>
                  <strong>{card.value}</strong>
                  <span>{card.label}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="parent-dashboard-grid">
          <section className="parent-card-section" aria-labelledby="parent-children-heading">
            <div className="parent-section-heading">
              <div>
                <p className="parent-dashboard-kicker">My Children</p>
                <h2 id="parent-children-heading">Today's child status</h2>
              </div>
              <Link className="parent-text-action" to="/parent/children">
                View all
              </Link>
            </div>

            {childrenState.isLoading ? <p className="parent-empty-state">Loading children...</p> : null}
            {!childrenState.isLoading && childrenState.error ? (
              <p className="parent-empty-state parent-empty-error">{childrenState.error}</p>
            ) : null}
            {!childrenState.isLoading && !childrenState.error && !childrenState.children.length ? (
              <p className="parent-empty-state">No children were returned for this guardian account.</p>
            ) : null}

            {!childrenState.isLoading && !childrenState.error && childrenState.children.length ? (
              <div className="parent-child-list">
                {childrenState.children.slice(0, 4).map((child) => {
                  const attendance = getChildAttendanceStatus(child);
                  const childId = getRecordId(child);

                  return (
                    <article className="parent-child-card" key={childId || getDisplayName(child)}>
                      <div className="parent-child-main">
                        <div>
                          <h3>{getDisplayName(child)}</h3>
                          <p>{getChildSchoolLine(child)}</p>
                        </div>
                        <span className={`parent-status-pill parent-status-${attendance.tone}`}>
                          <span aria-hidden="true" />
                          {attendance.label}
                        </span>
                      </div>
                      <Link className="parent-child-link" to={`/parent/children?studentId=${childId || ""}`}>
                        View Profile
                      </Link>
                    </article>
                  );
                })}
              </div>
            ) : null}
          </section>

          <section className="parent-card-section parent-quick-section" aria-labelledby="parent-quick-heading">
            <div className="parent-section-heading">
              <div>
                <p className="parent-dashboard-kicker">Shortcuts</p>
                <h2 id="parent-quick-heading">Quick actions</h2>
              </div>
            </div>

            <div className="parent-quick-grid">
              {quickActions.map((action) => (
                <Link className="parent-quick-action" to={action.href} key={action.label}>
                  <DashboardIcon name={action.icon} />
                  <span>{action.label}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

function DashboardIcon({ name }) {
  const iconPaths = {
    children: (
      <>
        <path d="M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M16 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        <path d="M3.5 19c.6-3.6 2.1-5.4 4.5-5.4s3.9 1.8 4.5 5.4" />
        <path d="M13.5 18.8c.4-2.5 1.3-3.8 2.8-3.8 1.6 0 2.5 1.3 2.9 3.8" />
      </>
    ),
    attendance: (
      <>
        <path d="M7 12.5 10 15l6-7" />
        <path d="M5 3h14v18H5z" />
        <path d="M8 3v3M16 3v3" />
      </>
    ),
    absent: (
      <>
        <path d="m8 8 8 8M16 8l-8 8" />
        <path d="M5 3h14v18H5z" />
        <path d="M8 3v3M16 3v3" />
      </>
    ),
    fees: (
      <>
        <path d="M4 7h16v11H4z" />
        <path d="M8 11h.01M16 14h.01" />
        <path d="M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
      </>
    ),
    balance: (
      <>
        <path d="M12 3v18" />
        <path d="M7 7h7.5a2.5 2.5 0 0 1 0 5H9.5a2.5 2.5 0 0 0 0 5H17" />
      </>
    ),
    results: (
      <>
        <path d="M5 19V5h14v14z" />
        <path d="M8 9h8M8 13h5M8 16h7" />
      </>
    ),
    assessment: (
      <>
        <path d="M6 4h12v16H6z" />
        <path d="m9 12 2 2 4-5" />
        <path d="M9 17h6" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 24 24">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
        {iconPaths[name] || iconPaths.results}
      </g>
    </svg>
  );
}

function getKpiCards({
  childrenCount,
  attendanceSummary,
  financeSummary,
  examSummary,
  isLoadingChildren,
  isLoadingFinance,
  isLoadingExams,
}) {
  return [
    {
      label: "Total Children",
      value: isLoadingChildren ? "..." : childrenCount,
      icon: "children",
      tone: "info",
    },
    {
      label: "Present Today",
      value: isLoadingChildren ? "..." : attendanceSummary.present,
      icon: "attendance",
      tone: "success",
    },
    {
      label: "Absent Today",
      value: isLoadingChildren ? "..." : attendanceSummary.absent,
      icon: "absent",
      tone: attendanceSummary.absent > 0 ? "warning" : "neutral",
    },
    {
      label: "Total Fees Paid",
      value: isLoadingFinance ? "..." : formatMoney(getFirstNumber(financeSummary, ["total_paid", "paid", "amount_paid", "payments_total"])),
      icon: "fees",
      tone: "success",
    },
    {
      label: "Remaining Fees",
      value: isLoadingFinance
        ? "..."
        : formatMoney(getFirstNumber(financeSummary, ["outstanding_balance", "remaining_fees", "total_balance", "balance", "overdue_amount"])),
      icon: "balance",
      tone: "warning",
    },
    {
      label: "Latest Results",
      value: isLoadingExams ? "..." : formatResultsAvailable(examSummary),
      icon: "results",
      tone: "info",
    },
  ];
}

function getAttendanceSummary(children) {
  return children.reduce(
    (summary, child) => {
      const attendance = getChildAttendanceStatus(child);

      if (attendance.tone === "success") {
        return { ...summary, present: summary.present + 1 };
      }

      if (attendance.tone === "warning") {
        return { ...summary, absent: summary.absent + 1 };
      }

      return summary;
    },
    { present: 0, absent: 0 },
  );
}

function getChildAttendanceStatus(child) {
  const records = Array.isArray(child?.attendance) ? child.attendance : [];
  const latestRecord = records[0] || {};
  const rawStatus = String(
    latestRecord.status_display ||
      latestRecord.status ||
      child?.attendance_status ||
      child?.today_attendance_status ||
      child?.status ||
      "",
  ).toLowerCase();

  if (rawStatus.includes("present")) {
    return { label: "Present", tone: "success" };
  }

  if (rawStatus.includes("absent")) {
    return { label: "Absent", tone: "warning" };
  }

  if (rawStatus.includes("late")) {
    return { label: "Late", tone: "warning" };
  }

  return { label: "No update", tone: "neutral" };
}

function getChildSchoolLine(child) {
  return [child?.class_name || child?.class || child?.stream_name, child?.school_name || child?.school?.name]
    .filter(Boolean)
    .join(" / ") || "Class and school unavailable";
}

function getParentName(user) {
  return (
    user?.full_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.username ||
    user?.email ||
    "Parent"
  );
}

function formatQueryDate(date) {
  return date.toISOString().slice(0, 10);
}

function getFirstNumber(source, keys) {
  if (!source || typeof source !== "object") {
    return null;
  }

  for (const key of keys) {
    const value = source[key];
    const numberValue = Number(value);

    if (value !== undefined && value !== null && value !== "" && Number.isFinite(numberValue)) {
      return numberValue;
    }
  }

  return null;
}

function formatMoney(value) {
  if (value === null || value === undefined) {
    return "-";
  }

  return value.toLocaleString();
}

function formatResultsAvailable(summary) {
  const count = getFirstNumber(summary, ["latest_results_available", "published_results", "result_count", "results_count", "total_results"]);

  if (count === null) {
    return "-";
  }

  return count;
}

export default ParentDashboard;
