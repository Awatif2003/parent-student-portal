import type { Dict } from "@/types"

export interface NotificationItem extends Dict {
  id: string | number
  title?: string
  message?: string
  body?: string
  status?: string
  read_at?: string | null
  created_at?: string
  /** Derived client-side from `status`/`read_at`. */
  isRead: boolean
}
