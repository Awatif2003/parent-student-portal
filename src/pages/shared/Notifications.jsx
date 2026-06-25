import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Icon from "../../components/ui/Icon";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../services/notificationService";
import { getCurrentUser, getUserRole } from "../../utils/authStorage";
import { parentNavItems } from "../parent/parentNavItems";
import { studentNavItems } from "../student/studentNavItems";

const TYPE_META = {
  FEE_REMINDER: { label: "Fee Reminder", icon: "finance", tone: "warning" },
  PAYMENT_RECEIPT: { label: "Payment Receipt", icon: "receipt", tone: "success" },
  RESULT_PUBLISHED: { label: "Results Published", icon: "results", tone: "info" },
  EXAM_SCHEDULE: { label: "Exam Schedule", icon: "assessment", tone: "info" },
  ATTENDANCE_ALERT: { label: "Attendance Alert", icon: "attendance", tone: "warning" },
  GENERAL: { label: "Announcement", icon: "megaphone", tone: "neutral" },
  SYSTEM: { label: "System", icon: "bell", tone: "neutral" },
};

function Notifications() {
  const role = getUserRole(getCurrentUser());
  const navItems = role === "student" ? studentNavItems : parentNavItems;
  const [filter, setFilter] = useState("all");
  const [state, setState] = useState({ isLoading: true, error: "", items: [] });
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const loadNotifications = useCallback(() => {
    setState((current) => ({ ...current, isLoading: true, error: "" }));

    return getNotifications()
      .then((items) => {
        setState({ isLoading: false, error: "", items });
      })
      .catch((fetchError) => {
        setState({ isLoading: false, error: fetchError.message || "Unable to load notifications.", items: [] });
      });
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadNotifications);
  }, [loadNotifications]);

  const unreadCount = useMemo(() => state.items.filter((item) => !item.isRead).length, [state.items]);
  const visibleItems = useMemo(
    () => (filter === "unread" ? state.items.filter((item) => !item.isRead) : state.items),
    [state.items, filter],
  );

  const markRead = (id) => {
    setState((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === id ? { ...item, isRead: true, status: "READ" } : item)),
    }));

    markNotificationRead(id).catch(() => {
      // Reload to resync if the server rejected the change.
      void loadNotifications();
    });
  };

  const handleOpen = (item) => {
    if (!item.isRead) {
      markRead(item.id);
    }
  };

  const handleMarkAll = () => {
    if (!unreadCount) {
      return;
    }

    setIsMarkingAll(true);
    setState((current) => ({
      ...current,
      items: current.items.map((item) => ({ ...item, isRead: true, status: "READ" })),
    }));

    markAllNotificationsRead()
      .catch(() => loadNotifications())
      .finally(() => setIsMarkingAll(false));
  };

  return (
    <DashboardLayout title="Notifications" subtitle="School updates, alerts, and announcements." navItems={navItems}>
      <section className="panel notif-panel">
        <div className="panel-bar">
          <div className="panel-bar-titles">
            <h2>Inbox</h2>
            <p>{unreadCount ? `${unreadCount} unread message${unreadCount === 1 ? "" : "s"}` : "You're all caught up."}</p>
          </div>

          <div className="panel-bar-actions">
            <div className="segmented" role="tablist" aria-label="Filter notifications">
              <button
                type="button"
                role="tab"
                aria-selected={filter === "all"}
                className={`segmented-btn${filter === "all" ? " active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === "unread"}
                className={`segmented-btn${filter === "unread" ? " active" : ""}`}
                onClick={() => setFilter("unread")}
              >
                Unread{unreadCount ? ` (${unreadCount})` : ""}
              </button>
            </div>

            <button className="btn-soft" type="button" onClick={handleMarkAll} disabled={!unreadCount || isMarkingAll}>
              <Icon name="check" />
              <span>Mark all read</span>
            </button>
          </div>
        </div>

        {state.isLoading ? <NotifSkeleton /> : null}

        {!state.isLoading && state.error ? (
          <div className="empty-state empty-state-error">
            <Icon name="bell" />
            <p>{state.error}</p>
            <button className="btn-soft" type="button" onClick={loadNotifications}>
              <Icon name="refresh" />
              <span>Try again</span>
            </button>
          </div>
        ) : null}

        {!state.isLoading && !state.error && !visibleItems.length ? (
          <div className="empty-state">
            <Icon name="inbox" />
            <p>{filter === "unread" ? "No unread notifications." : "No notifications yet."}</p>
          </div>
        ) : null}

        {!state.isLoading && !state.error && visibleItems.length ? (
          <ul className="notif-list">
            {visibleItems.map((item) => (
              <NotificationRow key={item.id} item={item} onOpen={handleOpen} />
            ))}
          </ul>
        ) : null}
      </section>
    </DashboardLayout>
  );
}

function NotificationRow({ item, onOpen }) {
  const meta = TYPE_META[item.notification_type] || TYPE_META.SYSTEM;

  return (
    <li>
      <button
        type="button"
        className={`notif-row notif-tone-${meta.tone}${item.isRead ? "" : " is-unread"}`}
        onClick={() => onOpen(item)}
      >
        <span className="notif-icon" aria-hidden="true">
          <Icon name={meta.icon} />
        </span>

        <span className="notif-body">
          <span className="notif-row-top">
            <span className="notif-type">{meta.label}</span>
            <span className="notif-time">{formatTimeAgo(item.created_at)}</span>
          </span>
          {item.subject ? <strong className="notif-subject">{item.subject}</strong> : null}
          {item.body ? <span className="notif-message">{item.body}</span> : null}
        </span>

        {!item.isRead ? <span className="notif-dot" aria-label="Unread" /> : null}
      </button>
    </li>
  );
}

function NotifSkeleton() {
  return (
    <ul className="notif-list" aria-hidden="true">
      {[0, 1, 2, 3].map((key) => (
        <li key={key}>
          <div className="notif-row notif-skeleton">
            <span className="notif-icon skeleton-block" />
            <span className="notif-body">
              <span className="skeleton-line skeleton-line-sm" />
              <span className="skeleton-line" />
              <span className="skeleton-line skeleton-line-lg" />
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function formatTimeAgo(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export default Notifications;
