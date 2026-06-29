import { queryOptions } from "@tanstack/react-query"

import { fetchNotifications, fetchUnreadCount } from "./api"

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  unread: () => [...notificationKeys.all, "unread"] as const,
}

export function notificationsQueryOptions() {
  return queryOptions({
    queryKey: notificationKeys.list(),
    queryFn: () => fetchNotifications(),
    staleTime: 30_000,
  })
}

export function unreadCountQueryOptions() {
  return queryOptions({
    queryKey: notificationKeys.unread(),
    queryFn: fetchUnreadCount,
    staleTime: 30_000,
    // Keep the header badge fresh without manual refetch wiring.
    refetchInterval: 60_000,
  })
}
