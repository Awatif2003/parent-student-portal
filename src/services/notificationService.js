import { apiRequest } from "./api";
import { PARENT_STUDENT_ENDPOINTS } from "./parentStudentEndpoints";

export const NOTIFICATION_ENDPOINTS = {
  ...PARENT_STUDENT_ENDPOINTS.notifications,
};

// Fired after a read / read-all mutation so the header bell (and any other
// listener) can refresh its unread badge without prop-drilling or polling.
export const NOTIFICATIONS_CHANGED_EVENT = "notifications:changed";

export function emitNotificationsChanged() {
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
}

// Returns the authenticated user's notifications (newest first) as a
// normalized array, tolerating paginated, wrapped, or bare-array payloads.
export const getNotifications = (params = {}) =>
  apiRequest(withQueryParams(NOTIFICATION_ENDPOINTS.list, params)).then((data) =>
    normalizeNotifications(data).map(normalizeNotification),
  );

// Returns the unread count as a plain number.
export const getUnreadCount = () =>
  apiRequest(NOTIFICATION_ENDPOINTS.unread).then((data) => {
    const count = data?.unread_count ?? data?.count ?? data?.unread ?? 0;
    const numeric = Number(count);

    return Number.isFinite(numeric) ? numeric : 0;
  });

export const markNotificationRead = (id) =>
  apiRequest(NOTIFICATION_ENDPOINTS.markRead(id), { method: "POST" }).then((result) => {
    emitNotificationsChanged();
    return result;
  });

export const markAllNotificationsRead = () =>
  apiRequest(NOTIFICATION_ENDPOINTS.readAll, { method: "POST" }).then((result) => {
    emitNotificationsChanged();
    return result;
  });

export function isNotificationRead(notification) {
  return String(notification?.status || "").toUpperCase() === "READ" || Boolean(notification?.read_at);
}

function normalizeNotification(notification) {
  return {
    ...notification,
    id: notification?.id ?? notification?.pk,
    isRead: isNotificationRead(notification),
  };
}

function normalizeNotifications(data) {
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

  return [];
}

function withQueryParams(endpoint, params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `${endpoint}?${queryString}` : endpoint;
}
