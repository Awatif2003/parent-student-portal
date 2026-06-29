import { Link, useLocation } from "@tanstack/react-router"
import {
  Banknote,
  Bell,
  CalendarCheck,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Home,
  IdCard,
  Receipt,
  Users,
  X,
  type LucideIcon,
} from "lucide-react"

import { BrandLogo } from "@/components/brand/Logo"
import { Button } from "@/components/ui/button"
import { getNavForRole, homeForRole, isNavGroup, type NavIcon, type NavItem } from "@/components/layout/nav"
import { cn } from "@/lib/utils"
import type { Role } from "@/types"

const icons: Record<NavIcon, LucideIcon> = {
  home: Home,
  users: Users,
  calendarCheck: CalendarCheck,
  clipboardCheck: ClipboardCheck,
  fileText: FileText,
  idCard: IdCard,
  receipt: Receipt,
  banknote: Banknote,
  bell: Bell,
  graduationCap: GraduationCap,
}

interface SidebarProps {
  role: Role
  mobileOpen: boolean
  onCloseMobile: () => void
}

function isLeafActive(to: string, pathname: string): boolean {
  if (to === "/parent" || to === "/student") return pathname === to
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function Sidebar({ role, mobileOpen, onCloseMobile }: SidebarProps) {
  const { pathname } = useLocation()
  const items = getNavForRole(role)
  const home = homeForRole(role)

  return (
    <>
      {/* Mobile scrim */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onCloseMobile}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r transition-transform md:static md:z-auto md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between gap-3 border-b px-5">
          <Link to={home} aria-label="ShuleYangu home" onClick={onCloseMobile}>
            <BrandLogo />
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={onCloseMobile}
            aria-label="Close navigation"
          >
            <X />
          </Button>
        </div>

        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Primary">
          {items.map((item) => (
            <SidebarEntry key={item.label} item={item} pathname={pathname} onNavigate={onCloseMobile} />
          ))}
        </nav>

        <div className="border-t px-5 py-4">
          <p className="text-muted-foreground text-[0.7rem] font-medium">
            {role === "student" ? "Student Portal" : "Parent Portal"}
          </p>
        </div>
      </aside>
    </>
  )
}

function SidebarEntry({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem
  pathname: string
  onNavigate: () => void
}) {
  const Icon = icons[item.icon]

  if (isNavGroup(item)) {
    return (
      <div className="pt-2">
        <p className="text-muted-foreground flex items-center gap-2 px-3 pb-1 text-[0.7rem] font-semibold tracking-wide uppercase">
          <Icon className="size-3.5" />
          {item.label}
        </p>
        <div className="space-y-1">
          {item.children.map((child) => {
            const ChildIcon = icons[child.icon]
            const active = isLeafActive(child.to, pathname)
            return (
              <Link
                key={child.to}
                to={child.to}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60",
                )}
              >
                <ChildIcon className="size-4 shrink-0" />
                <span className="truncate">{child.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    )
  }

  const active = isLeafActive(item.to, pathname)
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/60",
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  )
}
