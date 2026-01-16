# Project Context

> **How to reference this file in prompts:**
> - "Use Project Context §6 Invariants when modifying authentication code"
> - "Follow §8.2 when adding the new /api/contacts endpoint"
> - "Check §5 Key Contracts for the Application type shape"
> - "Per §4.1, ensure user identity comes from server-side auth context"

---

## 1. Overview

JAT (Job Application Tracker) v2 is a Next.js 16 application using Supabase for auth and PostgreSQL with Row Level Security (RLS) as the primary security boundary. All data access is automatically scoped to the authenticated user via RLS—the client cannot manipulate data ownership.

---

## 2. System Architecture

```
Client Browser
  └─ Client Components (auth forms only)
  └─ Uses: @supabase/ssr browser client (auth ops ONLY)
       │
       ▼
Next.js 16 Server
  ├─ Middleware: route protection, session refresh
  ├─ Server Components & API Routes
  │   └─ Uses: @supabase/ssr server client (RLS-enforced)
  │   └─ Data Layer: src/lib/db/*.ts
  └─ Validation: Zod schemas
       │
       ▼
Supabase PostgreSQL
  ├─ auth.users (managed by Supabase Auth)
  └─ applications table (RLS: all ops scoped to auth.uid())
```

### Key Principles
- **RLS is the primary security boundary** — not application code
- **Server-side client** uses cookies → RLS auto-scopes to `auth.uid()`
- **Client-side client** is for auth ops ONLY (login, signup, logout)
- **User identity** is NEVER from client input; always `supabase.auth.getUser()`
- **Service role key** must NOT be used for CRUD (bypasses RLS)

---

## 3. Repository Map

```
src/
├── app/
│   ├── (auth)/                 # Protected routes
│   │   ├── layout.tsx          # Nav, user info, logout
│   │   ├── actions.ts          # Server Actions (logout, createApplicationAction)
│   │   ├── dashboard/          # Main dashboard
│   │   └── applications/new/   # Create form
│   ├── (public)/               # Public routes (login, signup)
│   ├── api/applications/       # REST API
│   │   ├── route.ts            # POST
│   │   └── [id]/route.ts       # PATCH, DELETE
│   └── page.tsx                # Root redirect
├── components/
│   ├── applications/           # ApplicationCard, ApplicationForm, ApplicationList
│   ├── auth/                   # LoginForm, SignupForm, LogoutButton
│   └── ui/                     # Button, Input, Select, Textarea, Label
├── lib/
│   ├── db/
│   │   ├── applications.ts     # CRUD (RLS-enforced)
│   │   └── insights.ts         # Aggregation queries
│   ├── supabase/
│   │   ├── server.ts           # Server client (use for data)
│   │   ├── client.ts           # Browser client (auth only)
│   │   └── middleware.ts       # Session refresh
│   ├── types/index.ts          # TypeScript types
│   └── validations/application.ts  # Zod schemas
└── middleware.ts               # Route protection
```

| Directory | Owns |
|-----------|------|
| `lib/supabase/` | All Supabase client instantiation |
| `lib/db/` | All database queries |
| `lib/validations/` | All Zod schemas |
| `components/ui/` | Generic UI primitives |

---

## 4. Core Data & Control Flows

### 4.1 Auth / Identity

**Login:** `LoginForm` → `supabase.auth.signInWithPassword()` → cookies set → redirect to `/dashboard`

**Logout:** `LogoutButton` → Server Action `logout()` → `supabase.auth.signOut()` → redirect to `/login`

**Session refresh:** `updateSession()` in middleware on every request

**CRITICAL:** User identity from `supabase.auth.getUser()` on server. Never trust client-provided `user_id`.

### 4.2 Primary User Flows

**Create Application:**
```
ApplicationForm (Client) → Zod validate → createApplicationAction (Server Action)
  → Zod validate → getUser() → createApplication() → RLS validates → redirect
```

**View Applications:**
```
DashboardPage (Server) → getApplications() → RLS auto-filters → render list
```

**Update/Delete (API):**
```
PATCH/DELETE /api/applications/[id] → getUser() → Zod validate → data layer → RLS validates
```

### 4.3 Background Flows
- Session refresh: automatic via middleware
- `updated_at` trigger: PostgreSQL auto-updates on modification
- No background jobs currently

---

## 5. Key Contracts

### API Endpoints

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/applications` | `CreateApplicationFormData` | `{ data: Application }` |
| PATCH | `/api/applications/[id]` | `UpdateApplicationFormData` | `{ data: Application }` |
| DELETE | `/api/applications/[id]` | None | `{ success: true, data: { id } }` |

### Core Types

```typescript
type ApplicationStatus = 'applied' | 'interviewing' | 'offer' | 'rejected' | 'withdrawn';

interface Application {
  id: string;                    // UUID
  user_id: string;               // UUID, FK to auth.users
  company_name: string;
  position_title: string;
  status: ApplicationStatus;
  application_date: string;      // YYYY-MM-DD
  notes: string | null;
  created_at: string;            // ISO timestamp
  updated_at: string;            // ISO timestamp
}
```

### Database Schema

```sql
applications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  position_title TEXT NOT NULL,
  status application_status NOT NULL DEFAULT 'applied',
  application_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)
-- RLS: SELECT/INSERT/UPDATE/DELETE all enforce auth.uid() = user_id
```

---

## 6. Invariants (Must Not Break)

### Security
1. **RLS always enabled** on `applications` — never disable or create policies without `auth.uid()` check
2. **User identity from server-side auth only** — never accept `user_id` from request body/URL
3. **Service role key never for CRUD** — use anon key + session
4. **Client Supabase for auth only** — never use `client.ts` for data queries

### Data
5. **`user_id` on insert = `auth.uid()`** — enforced by RLS INSERT policy
6. **Dates in YYYY-MM-DD format** — validated by Zod
7. **Status from enum only** — enforced by PostgreSQL + Zod

### Architecture
8. **Protected routes under `(auth)`** — update `protectedPaths` in middleware for new paths
9. **Data functions return `DataResult<T>`** — `{ success, data }` or `{ success, error }`
10. **Validation both client & server** — never trust client-only validation

---

## 7. Decisions & Tradeoffs

| Decision | Why | Rejected |
|----------|-----|----------|
| RLS as security boundary | DB-level enforcement, can't bypass | App-level auth only |
| Server Components for display | No client bundle, faster | Client fetch |
| Server Actions for mutations | Progressive enhancement | API-only |
| `DataResult<T>` returns | Explicit error handling | Thrown exceptions |
| Date as YYYY-MM-DD string | Timezone-safe | JS Date objects |
| Client-side aggregation | Supabase lacks GROUP BY | Raw SQL RPC |

---

## 8. Change Playbooks

### 8.1 Add New Page
1. Choose route group: `(auth)/` for protected, `(public)/` for public
2. Create `src/app/(group)/[feature]/page.tsx`
3. If new protected path prefix, update `protectedPaths` in `src/middleware.ts`
4. Add components to `src/components/[feature]/`

### 8.2 Add New API Endpoint
1. Create `src/app/api/[resource]/route.ts`
2. Every handler must:
   ```typescript
   const supabase = await createClient();
   const { data: { user } } = await supabase.auth.getUser();
   if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   // Validate with Zod, call data layer
   ```

### 8.3 Add New DB Table
1. Create migration SQL with:
   - `user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`
   - `created_at`, `updated_at` timestamps
   - RLS enabled + 4 policies (SELECT/INSERT/UPDATE/DELETE with `auth.uid() = user_id`)
2. Add types to `src/lib/types/index.ts`
3. Add data layer to `src/lib/db/[entity].ts`
4. Add Zod schemas to `src/lib/validations/[entity].ts`

### 8.4 Refactor Shared Module
1. `grep -r "ComponentName" src/` to find usages
2. Update component + all call sites
3. Run `npm run build` to catch type errors

---

## 9. Testing & Validation

```bash
npm run dev      # Dev server (localhost:3000)
npm run build    # Production build (catches type errors)
npm run lint     # ESLint
```

**Manual testing:**
- Auth: signup, login, logout, protected route redirect
- CRUD: create, view, update, delete applications
- RLS: verify only own data visible, can't insert for other users

**Local setup:**
1. `npm install`
2. Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Apply migration to Supabase
4. `npm run dev`

---

## 10. Common Pitfalls

### Security
- **Using client Supabase for data** — use `server.ts` for all data access
- **Forgetting auth check in API** — every handler needs `getUser()`
- **Accepting user_id from client** — RLS handles scoping

### Next.js 16
- **Async params:** `const { id } = await params;` (not `params.id`)
- **Async cookies:** `const cookieStore = await cookies();`

### Supabase
- **Session not refreshing** — ensure middleware calls `updateSession()`
- **RLS not working** — check if querying as authenticated user

### Token-Saving
- Large files: `lib/db/applications.ts` (~400 lines) — search for specific functions
- Avoid: `node_modules/`, `package-lock.json`
- This file supersedes `ARCHITECTURE.md`

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |

---

*Last updated: 2026-01-16*
