# RLS Verification Checklist for Applications Table

## Prerequisites
- Migration script `supabase_migration_applications.sql` has been executed
- You have at least one authenticated user in Supabase
- You're running these queries in the Supabase SQL Editor or connected as an authenticated user

---

## 1. ✅ Verify Table Structure

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'applications'
ORDER BY ordinal_position;
```

**Expected columns:**
- id (uuid, NO)
- user_id (uuid, NO)
- company_name (text, NO)
- position_title (text, NO)
- status (application_status, NO)
- application_date (date, NO)
- notes (text, YES)
- created_at (timestamptz, NO)
- updated_at (timestamptz, NO)

---

## 2. ✅ Verify RLS is Enabled

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'applications';
```

**Expected result:**
- rowsecurity: `true`

---

## 3. ✅ Verify All 4 RLS Policies Exist

```sql
SELECT 
  policyname, 
  cmd AS operation,
  permissive,
  qual AS using_expression,
  with_check AS with_check_expression
FROM pg_policies
WHERE tablename = 'applications'
ORDER BY cmd;
```

**Expected policies:**
1. Users can delete their own applications (DELETE)
2. Users can insert their own applications (INSERT)
3. Users can view their own applications (SELECT)
4. Users can update their own applications (UPDATE)

Each should have `auth.uid() = user_id` in the appropriate expression.

---

## 4. ✅ Verify Indexes

```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'applications'
ORDER BY indexname;
```

**Expected indexes:**
- `applications_pkey` (primary key on id)
- `idx_applications_user_id`
- `idx_applications_created_at`
- `idx_applications_user_id_created_at`

---

## 5. ✅ Test RLS Enforcement (Critical Security Test)

### 5a. Insert Test Data for Your User

```sql
INSERT INTO applications (
  user_id, 
  company_name, 
  position_title, 
  status, 
  application_date, 
  notes
)
VALUES (
  auth.uid(), 
  'Test Company', 
  'Software Engineer', 
  'applied', 
  CURRENT_DATE, 
  'This is a test application'
);
```

**Expected:** ✅ Success (1 row inserted)

---

### 5b. Verify You Can Read Your Own Data

```sql
SELECT * FROM applications WHERE user_id = auth.uid();
```

**Expected:** ✅ Returns the application(s) you just inserted

---

### 5c. Attempt to Insert as Another User (Should Fail)

```sql
INSERT INTO applications (
  user_id, 
  company_name, 
  position_title, 
  status, 
  application_date
)
VALUES (
  '00000000-0000-0000-0000-000000000000', 
  'Malicious Company', 
  'Hacker', 
  'applied', 
  CURRENT_DATE
);
```

**Expected:** ❌ Error: "new row violates row-level security policy"

---

### 5d. Verify You Cannot See Other Users' Data

```sql
SELECT * FROM applications WHERE user_id != auth.uid();
```

**Expected:** ✅ Returns empty result set (0 rows)

---

### 5e. Attempt to Update Another User's Application (Should Fail)

First, if you have access to another test user, insert data as them. Then try:

```sql
UPDATE applications 
SET company_name = 'Hacked Company'
WHERE user_id != auth.uid();
```

**Expected:** ✅ Returns "0 rows updated" (RLS prevents seeing/modifying other users' data)

---

### 5f. Attempt to Delete Another User's Application (Should Fail)

```sql
DELETE FROM applications WHERE user_id != auth.uid();
```

**Expected:** ✅ Returns "0 rows deleted" (RLS prevents seeing/deleting other users' data)

---

### 5g. Test Update on Your Own Data

```sql
UPDATE applications 
SET notes = 'Updated notes via RLS test'
WHERE user_id = auth.uid()
LIMIT 1;
```

**Expected:** ✅ Success (1 row updated)

---

### 5h. Test Delete on Your Own Data

```sql
DELETE FROM applications 
WHERE user_id = auth.uid() 
  AND notes = 'Updated notes via RLS test';
```

**Expected:** ✅ Success (1 row deleted)

---

## 6. ✅ Verify Updated_at Trigger Works

```sql
-- Insert a test record
INSERT INTO applications (
  user_id, company_name, position_title, status, application_date
)
VALUES (
  auth.uid(), 'Trigger Test Co', 'Test Role', 'applied', CURRENT_DATE
)
RETURNING id, created_at, updated_at;

-- Note the timestamps (should be equal initially)

-- Wait a moment, then update
SELECT pg_sleep(2);

UPDATE applications 
SET notes = 'Testing trigger'
WHERE company_name = 'Trigger Test Co' AND user_id = auth.uid()
RETURNING created_at, updated_at;

-- Verify updated_at is now greater than created_at
```

**Expected:** ✅ `updated_at` timestamp should be newer than `created_at`

---

## Summary

✅ **All checks passed?** Your RLS is properly configured!

🔒 **Security guarantee:** Users can ONLY access their own applications. The database enforces this at the RLS layer, regardless of what the application code does.

⚠️ **Important:** Never use service role key for CRUD operations in your application code, or RLS will be bypassed!

---

## Cleanup Test Data

```sql
DELETE FROM applications 
WHERE user_id = auth.uid() 
  AND company_name IN ('Test Company', 'Trigger Test Co');
```
