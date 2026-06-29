import { Link } from "@tanstack/react-router"
import type { LucideIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import type { AppPath } from "@/components/layout/nav"

export interface QuickAction {
  label: string
  to: AppPath
  icon: LucideIcon
  description?: string
}

export function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map(({ label, to, icon: Icon, description }) => (
        <Link key={to} to={to} className="outline-none">
          <Card variant="interactive" padding="none" className="h-full p-4">
            <div className="flex items-start gap-3">
              <span className="bg-primary/10 text-primary ring-primary/15 flex size-9 shrink-0 items-center justify-center rounded-md ring-1 ring-inset">
                <Icon className="size-[1.1rem]" />
              </span>
              <div className="min-w-0">
                <p className="text-foreground text-sm font-semibold">{label}</p>
                {description ? (
                  <p className="text-muted-foreground mt-0.5 text-xs leading-5">{description}</p>
                ) : null}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
