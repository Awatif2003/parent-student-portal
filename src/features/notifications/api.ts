import { apiClient } from "@/lib/api/client"
import { NOTIFICATIONS } from "@/lib/api/endpoints"
import { normalizeCollection } from "@/lib/identity"
import type { Dict } from "@/types"
import type { NotificationItem } from "./types"

export function isNotificationRead(n: Dict): boolean {
  return String(n?.status ?? "").toUpperCase() === "READ" || Boolean(n?.read_at)
}

function normalize(n: Dict): NotificationItem {
  return { ...n, id: n.id ?? n.pk, isRead: isNotificationRead(n) }
}

export async function fetchNotifications(
  params: Record<string, string | number> = {},
): Promise<NotificationItem[]> {
  const { data } = await apiClient.get<Dict>(NOTIFICATIONS.LIST, { params })
  return normalizeCollection<Dict>(data).map(normalize)
}

export async function fetchUnreadCount(): Promise<number> {
  const { data } = await apiClient.get<Dict>(NOTIFICATIONS.UNREAD)
  const count = data?.unread_count ?? data?.count ?? data?.unread ?? 0
  const numeric = Number(count)
  return Number.isFinite(numeric) ? numeric : 0
}

export async function markNotificationRead(id: string | number): Promise<void> {
  await apiClient.post(NOTIFICATIONS.MARK_READ(id))
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.post(NOTIFICATIONS.READ_ALL)
}
