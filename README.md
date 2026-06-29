# ShuleYangu — Family Portal

The parent/guardian & student portal for ShuleYangu. Families follow attendance,
results, and fees; students see their own records. Built to share the stack,
conventions, and visual language of the ShuleYangu in-school workspace.

## Stack

- **React 19** + **TypeScript** (strict) + **Vite 7**
- **TanStack Router** — file-based routing with type-safe links and route guards
- **TanStack Query** — server-state caching; **TanStack Table** for data tables
- **axios** — one client with normalized `ApiError`, `{ success, data }` envelope
  unwrapping, and coalesced refresh-and-retry on 401
- **Zustand** — persisted auth store, readable from non-React code (interceptors)
- **react-hook-form** + **zod** — forms and validation
- **Tailwind CSS v4** + **shadcn-style** primitives (radix-ui, lucide, sonner)
- Teal-forward design tokens, Manrope type, light + dark themes

## Getting started

```bash
bun install
cp .env.example .env   # set VITE_API_URL to your /api/v1 base
bun run dev            # http://localhost:3000
```

Scripts: `bun run dev` · `bun run build` · `bun run preview` · `bun run typecheck`

## Architecture

Feature-sliced. Each domain owns its data and UI; shared building blocks live in
`components/` and `lib/`.

```
src/
  lib/
    api/client.ts      # axios instance + ApiError + interceptors (X-Portal: family)
    api/endpoints.ts    # all API paths (trailing slashes are mandatory)
    queryClient.ts      # React Query defaults
    identity.ts         # payload-shape normalizers (dynamic API shapes)
    config.ts date.ts format.ts utils.ts
  components/
    ui/                 # shadcn primitives (button, card, table, …)
    layout/             # AppLayout, Sidebar, Topbar, nav config
    DataTable.tsx       # generic sortable table over TanStack Table
  features/
    auth/               # login, Zustand store, role resolution, guards, rehydrate
    dashboard/          # parent & student landing
    attendance/         # parent children attendance + student own attendance
    notifications/      # bell + list
  routes/               # file-based routes (__root, _auth, _app, …)
```

Each feature follows the same shape: `api.ts` (or `api/`), `queries.ts`,
`hooks.ts`, `components/`, `pages/`, `types.ts`.

### Auth & scope

This is the **family** portal. The axios client stamps `X-Portal: family` so the
backend resolves a user's parent/guardian/student role even when they also hold a
staff role. `features/auth/utils/role.ts` mirrors that: it always prefers the
family `role_assignment`. A login with no family role is out of scope and is sent
to `/forbidden`.

Tokens are persisted; the user profile is **not** — it's rebuilt from
`GET /auth/me` on boot (`ensureUserRehydrated`) so refreshes and role changes are
always honored.

## Migration status

The portal is being migrated to this stack incrementally. **Live** today:
authentication, the app shell, dashboards, attendance, and notifications. Other
sections (children profiles, results, finance) are wired into the navigation and
render a "Coming soon" placeholder until they're ported.
