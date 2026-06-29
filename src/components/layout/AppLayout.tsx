import { useState, type ReactNode } from "react"

import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"
import type { Role } from "@/types"

export function AppLayout({ role, children }: { role: Role; children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="bg-background text-foreground flex h-screen overflow-hidden">
      <Sidebar role={role} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar role={role} onOpenMobile={() => setMobileOpen(true)} />
        <main className="page-backdrop min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
