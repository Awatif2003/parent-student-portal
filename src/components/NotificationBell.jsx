import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./ui/Icon";
import { NOTIFICATIONS_CHANGED_EVENT, getUnreadCount } from "../services/notificationService";

// Header bell with a live unread badge. Pulls the count on mount, refreshes
// when any screen reports a change (mark read / read-all) and on tab focus,
// so the badge stays in sync without polling.
function NotificationBell({ to = "/parent/notifications" }) {
  const [count, setCount] = useState(0);

  const refresh = useCallback(() => {
    getUnreadCount()
      .then(setCount)
      .catch(() => {
        /* A failed badge fetch should never break the shell. */
      });
  }, []);

  useEffect(() => {
    refresh();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, refresh);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, refresh);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [refresh]);

  const hasUnread = count > 0;
  const badgeLabel = count > 99 ? "99+" : String(count);

  return (
    <Link
      className="topbar-bell"
      to={to}
      aria-label={hasUnread ? `Notifications, ${count} unread` : "Notifications"}
    >
      <Icon name="bell" />
      {hasUnread ? (
        <span className="topbar-bell-badge" aria-hidden="true">
          {badgeLabel}
        </span>
      ) : null}
    </Link>
  );
}

export default NotificationBell;
