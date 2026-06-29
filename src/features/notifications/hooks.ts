import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { markAllNotificationsRead, markNotificationRead } from "./api"
import { notificationKeys, notificationsQueryOptions, unreadCountQueryOptions } from "./queries"

export function useNotifications() {
  return useQuery(notificationsQueryOptions())
}

export function useUnreadCount() {
  return useQuery(unreadCountQueryOptions())
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}
