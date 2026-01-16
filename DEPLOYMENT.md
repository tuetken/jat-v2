# JAT v2 Deployment Guide

## Phase 10: Production Deployment Checklist

### Required Environment Variables

The application requires exactly **2 environment variables**:

| Variable | Required | Description | Security |
|----------|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Supabase project URL | Public (safe to expose) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Supabase anonymous key | Public (RLS-protected) |

#### Getting Your Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **API**
3. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** > **anon/public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Security Notes

- ✅ Both variables are prefixed with `NEXT_PUBLIC_` and are **safe to expose** to the client
- ✅ All security is enforced via **Supabase Row Level Security (RLS)** at the database level
- ❌ **DO NOT** add `SUPABASE_SERVICE_ROLE_KEY` - it bypasses RLS and should never be used for CRUD operations
- ✅ The anon key only allows operations permitted by RLS policies (scoped to authenticated user)

---

## Vercel Deployment

### Prerequisites

- [ ] Supabase project created and configured
- [ ] Database migration applied (`supabase_migration_applications.sql`)
- [ ] RLS policies enabled and verified
- [ ] GitHub repository connected to Vercel

### Deployment Steps

1. **Connect Repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click **Add New** > **Project**
   - Import your GitHub repository

2. **Configure Environment Variables**
   - In Vercel dashboard: **Project Settings** > **Environment Variables**
   - Add both required variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
     ```
   - Apply to all environments: **Production**, **Preview**, **Development**

3. **Deploy**
   - Click **Deploy**
   - Vercel will automatically run `npm run build`
   - Monitor build logs for any errors

4. **Verify Deployment**
   - Visit your deployed URL
   - Test authentication flow (signup/login/logout)
   - Test CRUD operations (create/view/update/delete applications)
   - Verify RLS enforcement (users can only see their own data)

---

## Supabase Production Configuration

### Database Setup

1. **Apply Migration**
   - Go to **SQL Editor** in Supabase dashboard
   - Run the entire `supabase_migration_applications.sql` file
   - Verify tables and policies are created

2. **Verify RLS Policies**
   ```sql
   -- Check RLS is enabled
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE tablename = 'applications';
   -- Should show rowsecurity = true

   -- Check policies exist
   SELECT policyname, cmd
   FROM pg_policies
   WHERE tablename = 'applications';
   -- Should show 4 policies (SELECT, INSERT, UPDATE, DELETE)
   ```

3. **Email Configuration** (if using email auth)
   - Go to **Authentication** > **Email Templates**
   - Customize confirmation and reset password emails
   - Update **Site URL** in **Authentication** > **URL Configuration**

---

## Build Verification

### Local Build Test

```bash
# Install dependencies
npm install

# Run production build
npm run build

# Expected output:
# ✓ Compiled successfully
# ✓ Generating static pages
# Route (app) - all routes should show ƒ (Dynamic) or ○ (Static)
```

### TypeScript Validation

```bash
# Run type checking
npx tsc --noEmit

# Should complete with no errors
```

---

## Security Verification Checklist

- [x] RLS enabled on `applications` table
- [x] All 4 RLS policies created (SELECT, INSERT, UPDATE, DELETE)
- [x] All policies enforce `auth.uid() = user_id`
- [x] No service role key used in application code
- [x] Server-side Supabase client uses cookies (authenticated context)
- [x] Client-side Supabase client only used for auth operations
- [x] User identity always derived from `supabase.auth.getUser()` on server
- [x] Middleware protects all `/dashboard` and `/applications` routes
- [x] No `.env.local` committed to git
- [x] Environment variables properly prefixed with `NEXT_PUBLIC_`

---

## Production Monitoring

### Post-Deployment Checks

1. **Authentication Flow**
   - [ ] Signup creates user in Supabase Auth
   - [ ] Login redirects to dashboard
   - [ ] Logout clears session and redirects to login
   - [ ] Protected routes redirect to login when not authenticated

2. **Application CRUD**
   - [ ] Create application saves to database
   - [ ] Dashboard displays user's applications only
   - [ ] Update application saves changes
   - [ ] Delete application removes from database
   - [ ] Cannot view/modify other users' applications

3. **Error Handling**
   - [ ] Form validation shows error messages
   - [ ] API errors return appropriate status codes
   - [ ] Network errors handled gracefully

### Supabase Dashboard Monitoring

- **Authentication** > **Users**: Monitor user signups
- **Table Editor** > **applications**: Verify data integrity
- **Database** > **Logs**: Check for query errors or RLS violations

---

## Troubleshooting

### Build Failures

**Error:** `Type error: 'RedirectHandler' cannot be used as a JSX component`
- **Fixed in:** `src/app/page.tsx` - Added `return null` after redirect calls

### Environment Variable Issues

**Error:** `Cannot read properties of undefined`
- **Cause:** Missing or incorrect environment variables
- **Fix:** Verify both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel

### RLS Not Working

**Symptoms:** Users can see other users' data
- **Check:** RLS is enabled on `applications` table
- **Check:** All 4 policies exist with correct `auth.uid()` conditions
- **Check:** Server-side client uses cookies (not service role key)

### Authentication Issues

**Error:** Session not persisting
- **Check:** Middleware is calling `updateSession()` on every request
- **Check:** Cookies are being set correctly (check browser DevTools > Application > Cookies)

---

## Rollback Procedure

If deployment has critical issues:

1. **Revert in Vercel**
   - Go to **Deployments** in Vercel dashboard
   - Find last working deployment
   - Click **⋯** > **Promote to Production**

2. **Database Rollback** (if needed)
   - Supabase maintains automatic backups
   - Go to **Database** > **Backups** to restore previous state

---

## Next Steps After Deployment

- [ ] Set up custom domain (optional)
- [ ] Configure monitoring/analytics (optional)
- [ ] Set up error tracking (e.g., Sentry) (optional)
- [ ] Review Supabase usage and quotas
- [ ] Test from multiple devices/browsers
- [ ] Document any production-specific configuration

---

*Last updated: 2026-01-16*
*Project: JAT v2 (Job Application Tracker)*
