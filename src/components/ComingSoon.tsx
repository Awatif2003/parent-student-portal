import { Hammer } from "lucide-react"

import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/ui/page-header"

/**
 * Placeholder for routes that exist in the nav but haven't been migrated to the
 * new stack yet. Keeps navigation whole (no 404s) during the incremental
 * rollout.
 */
export function ComingSoon({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={eyebrow ?? "Family Portal"}
        title={title}
        description="This section is being rebuilt on the new experience."
      />
      <EmptyState
        icon={Hammer}
        variant="dashed"
        kicker="In progress"
        title="Coming soon"
        description="We're migrating this page to the new design. Check back shortly."
      />
    </div>
  )
}
