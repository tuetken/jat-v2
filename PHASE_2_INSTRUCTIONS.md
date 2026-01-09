# Phase 2: Database Schema & RLS - Instructions

## ✅ Completed

Phase 2 has been successfully executed with the following deliverables:

### 📄 Files Created

1. **`supabase_migration_applications.sql`** - Complete SQL migration script
2. **`RLS_VERIFICATION_CHECKLIST.md`** - Step-by-step RLS verification guide
3. **`src/lib/types/index.ts`** - TypeScript types aligned with database schema

---

## 🚀 How to Apply the Migration

### Option 1: Supabase Dashboard (Recommended for Development)

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** (in the left sidebar)
3. Click **New query**
4. Copy the entire contents of `supabase_migration_applications.sql`
5. Paste into the SQL editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Verify success message appears

### Option 2: Supabase CLI (Recommended for Production/Team)

```bash
# If using Supabase CLI with migrations
supabase migration new create_applications_table

# Copy the SQL content into the generated migration file
# Then apply with:
supabase db push
```

### Option 3: Direct Database Connection

```bash
# If you have direct psql access
psql "your-supabase-connection-string" < supabase_migration_applications.sql
```

---

## ✅ Verify RLS Configuration

After applying the migration, follow the **complete verification checklist** in:

📋 **`RLS_VERIFICATION_CHECKLIST.md`**

### Quick Verification (Essential)

At minimum, run these queries in Supabase SQL Editor:

```sql
-- 1. Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'applications';
-- Expected: rowsecurity = true

-- 2. Check all 4 policies exist
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'applications';
-- Expected: 4 rows (SELECT, INSERT, UPDATE, DELETE)

-- 3. Test insert (must be authenticated user)
INSERT INTO applications (
  user_id, company_name, position_title, 
  status, application_date
)
VALUES (
  auth.uid(), 'Test Corp', 'Engineer', 
  'applied', CURRENT_DATE
);
-- Expected: Success (or error if not authenticated)

-- 4. Cleanup
DELETE FROM applications WHERE company_name = 'Test Corp' AND user_id = auth.uid();
```

---

## 📦 What Was Created

### Database Objects

- ✅ `application_status` enum type (applied, interviewing, offer, rejected, withdrawn)
- ✅ `applications` table with 9 columns
- ✅ 3 indexes for query optimization
- ✅ `updated_at` trigger (auto-updates timestamp on modifications)
- ✅ 4 RLS policies (SELECT, INSERT, UPDATE, DELETE)

### Indexes Created

1. `idx_applications_user_id` - Fast lookups by user
2. `idx_applications_created_at` - Fast sorting by creation date
3. `idx_applications_user_id_created_at` - Composite index for user's applications sorted by date

### RLS Policies

All policies enforce `auth.uid() = user_id`:

1. **SELECT** - Users can only view their own applications
2. **INSERT** - Users can only create applications for themselves
3. **UPDATE** - Users can only modify their own applications
4. **DELETE** - Users can only delete their own applications

---

## 🔒 Security Notes

### ✅ What's Protected

- ✅ Users **cannot** read other users' applications
- ✅ Users **cannot** create applications for other users
- ✅ Users **cannot** modify other users' applications
- ✅ Users **cannot** delete other users' applications
- ✅ All operations are enforced at the **database level** (cannot be bypassed by application code)

### ⚠️ Critical Reminders

- **DO NOT** use service role key for CRUD operations (bypasses RLS)
- **ALWAYS** use authenticated Supabase client in server-side code
- **NEVER** trust client-provided user_id values
- User identity **must** be derived from `auth.uid()` via Supabase session

---

## 📝 TypeScript Types

The `src/lib/types/index.ts` file provides:

- `Application` - Full database record type
- `ApplicationStatus` - Status enum type
- `CreateApplicationInput` - Type for creating new applications
- `UpdateApplicationInput` - Type for updating applications
- `ApplicationFormData` - Type for form data (excludes user_id)

These types match the database schema exactly and will be used in Phase 3.

---

## ➡️ Next Steps (When Ready for Phase 3)

Phase 3 will create:
- Data access layer (`src/lib/db/applications.ts`)
- Validation schemas (`src/lib/validations/application.ts`)

**DO NOT proceed to Phase 3 until:**
1. ✅ Migration is applied successfully
2. ✅ RLS verification checklist is completed
3. ✅ You've confirmed RLS policies work as expected

---

## 🆘 Troubleshooting

### Error: "relation 'applications' already exists"
- The table was already created. Drop it first: `DROP TABLE IF EXISTS applications CASCADE;`
- Or create a new migration with a different approach

### Error: "type 'application_status' already exists"
- The enum was already created. Drop it first: `DROP TYPE IF EXISTS application_status CASCADE;`

### RLS Policies Not Working
- Ensure you're querying as an authenticated user (not service role)
- Check `auth.uid()` returns a valid UUID: `SELECT auth.uid();`
- Verify RLS is enabled: See verification checklist step 2

### Cannot Insert Data
- Ensure you're authenticated: `SELECT auth.uid();` should return your user ID
- Ensure `user_id` in INSERT matches `auth.uid()`
- Check RLS INSERT policy exists: See verification checklist step 3

---

**Phase 2 Status:** ✅ Complete - Ready for verification and testing

**Pause here** as requested. Do not proceed to Phase 3 until approved.
