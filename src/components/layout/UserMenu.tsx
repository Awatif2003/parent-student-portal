import { LogOut } from "lucide-react"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ROLE_LABELS } from "@/constants/roles"
import { useLogout } from "@/features/auth/hooks/useLogout"
import { useAuthStore } from "@/features/auth/store/authStore"

export function UserMenu() {
  const user = useAuthStore((s) => s.user)
  const { mutate: logout, isPending } = useLogout()
  const name = user?.name ?? "Member"
  const roleLabel = user ? ROLE_LABELS[user.role] : "Session"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 gap-2 px-1.5 sm:px-2" aria-label="Open user menu">
          <Avatar name={name} size="sm" />
          <span className="hidden text-left leading-tight sm:block">
            <span className="block max-w-[10rem] truncate text-sm font-semibold">{name}</span>
            <span className="text-muted-foreground block text-xs">{roleLabel}</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <span className="block truncate text-sm font-semibold">{name}</span>
          {user?.email ? (
            <span className="text-muted-foreground block truncate text-xs font-normal">
              {user.email}
            </span>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" disabled={isPending} onSelect={() => logout()}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
