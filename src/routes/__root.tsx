/**
 * Root route — wraps the app with providers.
 *
 * QueryClientProvider lives here (not main.tsx) so it's inside RouterProvider
 * and route loaders can reach the same client via the router context.
 */
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query"

import { AppToaster } from "@/components/ui/toast"
import { queryClient } from "@/lib/queryClient"
import "@/styles.css"

export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <AppToaster />
    </QueryClientProvider>
  )
}
