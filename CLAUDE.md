# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build (catches type errors)
npm run lint     # Run ESLint
npm run start    # Start production server
```

No test framework is currently configured.

## Architecture Overview

JAT (Job Application Tracker) v2 is a Next.js 16 App Router application using Supabase for authentication and PostgreSQL with Row Level Security (RLS).

### Security Model

**RLS is the primary security boundary** - database-level enforcement, not application code.

- **Server-side Supabase client** (`lib/supabase/server.ts`): Uses cookies, auto-scopes queries to `auth.uid()` via RLS. Use for ALL data access.
- **Client-side Supabase client** (`lib/supabase/client.ts`): For auth operations ONLY (login, signup, logout). Never use for data queries.
- **User identity**: Always from `supabase.auth.getUser()` on server. Never accept `user_id` from client input.

### Key Data Patterns

All data functions in `lib/db/` return `DataResult<T>`: `{ success: true, data }` or `{ success: false, error }`.

Validation happens both client and server side using Zod schemas in `lib/validations/`.

### Route Structure

- `app/(auth)/` - Protected routes (dashboard, applications). Middleware enforces auth.
- `app/(public)/` - Public routes (login, signup).
- `app/api/applications/` - REST API for CRUD operations.

When adding new protected routes, update `protectedPaths` in `src/middleware.ts`.

### Component Organization

- `components/ui/` - Reusable primitives (Button, Input, Select, etc.)
- `components/applications/` - Application-specific components
- `components/auth/` - Auth forms and logout button

## Critical Invariants

1. Never disable RLS or create policies without `auth.uid()` check
2. Never use service role key for CRUD operations (bypasses RLS)
3. API handlers must call `supabase.auth.getUser()` and return 401 if no user
4. Dates stored as YYYY-MM-DD strings (timezone-safe)

## Next.js 16 Specifics

Async patterns required:
```typescript
// Route params
const { id } = await params;  // NOT params.id

// Cookies
const cookieStore = await cookies();
```

## Adding New Features

**New API endpoint pattern:**
```typescript
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// Validate with Zod, call data layer
```

**New database table requirements:**
- Include `user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`
- Enable RLS with policies checking `auth.uid() = user_id`
- Add types to `lib/types/index.ts`, data layer to `lib/db/`, schemas to `lib/validations/`

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
