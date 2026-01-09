# JAT v2 Clean Rebuild Plan

## Phase 1: Foundation & Configuration

**Install dependencies:**

- `@supabase/supabase-js`, `@supabase/ssr` for Supabase integration
- `react-hook-form`, `@hookform/resolvers`, `zod` for forms and validation
- Optional: `date-fns` or `dayjs` for date handling

**Setup Supabase utilities:**

- [`src/lib/supabase/server.ts`](src/lib/supabase/server.ts) - Server-side client using **authenticated user context** (cookies/session) to enforce RLS
- [`src/lib/supabase/client.ts`](src/lib/supabase/client.ts) - Client-side client for auth operations only (login, signup, logout)
- [`src/lib/supabase/middleware.ts`](src/lib/supabase/middleware.ts) - Helper for auth in Next.js middleware

**CRITICAL:** The server-side client must operate in authenticated user context so that Row Level Security policies are enforced by Supabase. Service role key should NOT be used for standard CRUD operations. If included at all, service role access must be isolated for exceptional non-user-scoped operations only (e.g., future admin tasks).

**Configure environment:**

- Create `.env.local` with Supabase URL and anon key (service role key optional, isolated if used)
- Update `.gitignore` to exclude `.env.local`

**Setup middleware:**

- [`src/middleware.ts`](src/middleware.ts) - Protect `(auth)/*` routes, redirect unauthenticated users to `/login`

---

**APPROVAL CHECKPOINT:** Pause after completing Phase 1-4 (Foundation, Database, Data Layer, Auth UI) before proceeding to application features and UI implementation. This ensures the security foundation and authentication flow are verified before building on top.

---

## Phase 2: Database Schema & RLS

**Create Supabase migration:**

- `applications` table with columns: id, user_id (FK to auth.users), company_name, position_title, status (enum), application_date, notes, created_at, updated_at
- Add indexes on `user_id` and `created_at`
- Enable RLS on `applications` table
- Create RLS policies: SELECT, INSERT, UPDATE, DELETE all scoped to `user_id = auth.uid()`

**Create TypeScript types:**

- [`src/lib/types/index.ts`](src/lib/types/index.ts) - Export types for Application, ApplicationStatus, etc., aligned with database schema

## Phase 3: Data Access Layer

**Build data access functions:**

- [`src/lib/db/applications.ts`](src/lib/db/applications.ts) - Functions: `getApplications()`, `getApplicationById(id)`, `createApplication(data)`, `updateApplication(id, data)`, `deleteApplication(id)` - all use authenticated Supabase client with RLS enforcement
- [`src/lib/db/insights.ts`](src/lib/db/insights.ts) - Functions for aggregated queries (deferred, see Phase 7)

**CRITICAL:** User identity must be derived server-side from Supabase auth/session state, never from client input. Data access functions operate within an authenticated execution context where RLS policies automatically scope queries to `auth.uid()`. Even if internal helpers conceptually work with a `userId`, this value must originate from trusted server-side auth context, not client assertions.

**Create validation schemas:**

- [`src/lib/validations/application.ts`](src/lib/validations/application.ts) - Zod schemas for create/update application forms

## Phase 4: Authentication UI

**Public route group:**

- [`src/app/(public)/layout.tsx`](src/app/\\\\\\\\\\(public)/layout.tsx) - Minimal layout for login/signup pages
- [`src/app/(public)/login/page.tsx`](src/app/\\\\\\\\\\(public)/login/page.tsx) - Login form (Client Component)
- [`src/app/(public)/signup/page.tsx`](src/app/\\\\\\\\\\(public)/signup/page.tsx) - Signup form (Client Component)
- [`src/components/auth/LoginForm.tsx`](src/components/auth/LoginForm.tsx) - React Hook Form with email/password
- [`src/components/auth/SignupForm.tsx`](src/components/auth/SignupForm.tsx) - React Hook Form with email/password

**Root page redirect:**

- Update [`src/app/page.tsx`](src/app/page.tsx) - Redirect authenticated users to `/dashboard`, unauthenticated to `/login`

## Phase 5: Core Application UI

**Authenticated route group:**

- [`src/app/(auth)/layout.tsx`](src/app/\\\\\\\\\\(auth)/layout.tsx) - Shared layout with nav, user menu, logout

**Dashboard:**

- [`src/app/(auth)/dashboard/page.tsx`](src/app/\\\\\\\\\\(auth)/dashboard/page.tsx) - Server Component displaying summary cards and recent applications

**Applications list:**

- [`src/app/(auth)/applications/page.tsx`](src/app/\\\\\\\\\\(auth)/applications/page.tsx) - Server Component fetching and displaying all applications
- [`src/components/applications/ApplicationList.tsx`](src/components/applications/ApplicationList.tsx) - Server Component rendering list
- [`src/components/applications/ApplicationCard.tsx`](src/components/applications/ApplicationCard.tsx) - Server Component for individual application

**Create application:**

- [`src/app/(auth)/applications/new/page.tsx`](src/app/\\\\\\\\\\(auth)/applications/new/page.tsx) - Page with ApplicationForm
- [`src/components/applications/ApplicationForm.tsx`](src/components/applications/ApplicationForm.tsx) - Client Component with React Hook Form + Zod

**Application detail/edit:**

- [`src/app/(auth)/applications/[id]/page.tsx`](src/app/(auth)/applications/[id]/page.tsx) - Server Component fetching single application, rendering edit form

## Phase 6: API Routes for Mutations

**Applications API:**

- [`src/app/api/applications/route.ts`](src/app/api/applications/route.ts) - POST handler for creating applications (auth + validation + data layer call)
- [`src/app/api/applications/[id]/route.ts`](src/app/api/applications/[id]/route.ts) - PATCH for updates, DELETE for deletion

Each handler:

1. Verify authentication (user derived from server-side session)
2. Validate request body with Zod
3. Call data layer function (RLS automatically scopes to authenticated user)
4. Return JSON response
5. Handle errors with appropriate status codes

## Phase 7: Insights/Analytics (Optional/Deferred)

**SCOPE NOTE:** Analytics and insights are extensible **capabilities**, not MVP blockers. The architecture supports aggregated queries and future visualization, but charts, timelines, and advanced insights may be implemented incrementally or deferred without impacting core application integrity.

**When implemented:**

- [`src/app/(auth)/insights/page.tsx`](src/app/\(auth)/insights/page.tsx) - Server Component fetching aggregated data via `lib/db/insights.ts`
- [`src/components/insights/StatusChart.tsx`](src/components/insights/StatusChart.tsx) - Client Component rendering chart (charting library TBD)
- [`src/components/insights/TimelineChart.tsx`](src/components/insights/TimelineChart.tsx) - Client Component for applications over time

**Initial MVP:** Focus on core CRUD functionality first. Analytics can be added once foundation is solid.

## Phase 8: UI Component Library

**Reusable primitives:**

- [`src/components/ui/Button.tsx`](src/components/ui/Button.tsx), [`src/components/ui/Input.tsx`](src/components/ui/Input.tsx), [`src/components/ui/Select.tsx`](src/components/ui/Select.tsx), etc.
- Style with Tailwind CSS, keep components simple and composable
- Optional: Use Radix UI primitives for accessibility

## Phase 9: Testing & Polish

**Manual testing:**

- Auth flows (signup, login, logout, protected routes)
- CRUD operations on applications
- RLS enforcement (attempt to access another user's data should fail at DB level)
- Form validations (client and server)

**Polish:**

- Loading states for async operations
- Error messages for failed requests
- Empty states for lists with no data
- Responsive design tweaks

## Phase 10: Deployment

**Vercel deployment:**

- Connect GitHub repo to Vercel
- Add environment variables in Vercel dashboard
- Deploy and verify production build

**Supabase production:**

- Ensure RLS policies are enabled
- Review security settings
- Monitor initial usage

---

## Key Files Summary

**Server-side security enforcement:**

- [`src/middleware.ts`](src/middleware.ts) - Route protection
- [`src/lib/supabase/server.ts`](src/lib/supabase/server.ts) - Authenticated server client (RLS-enforced)
- [`src/lib/db/applications.ts`](src/lib/db/applications.ts) - Data access with RLS policies

**Client-side interactivity:**

- [`src/components/applications/ApplicationForm.tsx`](src/components/applications/ApplicationForm.tsx) - Form handling
- [`src/components/auth/LoginForm.tsx`](src/components/auth/LoginForm.tsx) - Auth forms
- [`src/lib/supabase/client.ts`](src/lib/supabase/client.ts) - Client auth only

**Data validation:**

- [`src/lib/validations/application.ts`](src/lib/validations/application.ts) - Shared Zod schemas

---

## Security Model Summary

**RLS is the primary security boundary:**

- All data access uses authenticated Supabase client (user context via cookies/session)
- Database RLS policies enforce `user_id = auth.uid()` on all operations
- User identity derived server-side from auth state, never from client input
- Service role key (if present) isolated and never used for standard CRUD
- Client cannot assert, manipulate, or control data ownership

This plan prioritizes security-first architecture with RLS as the enforcement mechanism, clear server/client boundaries, and maintainable separation of concerns.