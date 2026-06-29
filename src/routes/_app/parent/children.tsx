import { createFileRoute } from "@tanstack/react-router"

import { ParentChildrenPage } from "@/features/children/pages/ParentChildrenPage"

export const Route = createFileRoute("/_app/parent/children")({
  component: ParentChildrenPage,
})
