import { Link, createFileRoute } from "@tanstack/react-router"
import { ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/forbidden")({
  component: ForbiddenPage,
})

function ForbiddenPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="bg-destructive/10 text-destructive ring-destructive/20 flex size-14 items-center justify-center rounded-md ring-1 ring-inset">
        <ShieldAlert className="size-7" />
      </span>
      <h1 className="text-foreground mt-6 text-2xl font-semibold tracking-tight">
        This portal is for families
      </h1>
      <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
        Your account doesn&apos;t have a parent, guardian, or student role here.
        If you&apos;re a staff member, please use the school workspace instead.
      </p>
      <Button asChild variant="outline" className="mt-6">
        <Link to="/login">Back to sign in</Link>
      </Button>
    </div>
  )
}
