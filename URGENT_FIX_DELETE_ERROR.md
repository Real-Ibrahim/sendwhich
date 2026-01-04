# 🚨 URGENT: Fix Delete Room Error

## The Problem
You're getting this error when trying to delete a room:
```
new row for relation "rooms" violates check constraint "rooms_status_check"
```

## Root Cause
Your database constraint only allows `'active'` and `'expired'` statuses, but the code tries to set status to `'deleted'` when deleting a room.

## ✅ THE FIX (Do This Now!)

### Step 1: Open Supabase Dashboard
1. Go to https://app.supabase.com
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New query"** button (top right)

### Step 2: Run This SQL
Copy and paste this **ENTIRE** SQL into the editor:

```sql
-- Drop the existing check constraint
ALTER TABLE public.rooms DROP CONSTRAINT IF EXISTS rooms_status_check;

-- Add the new check constraint with 'deleted' status
ALTER TABLE public.rooms ADD CONSTRAINT rooms_status_check 
  CHECK (status IN ('active', 'expired', 'deleted'));
```

### Step 3: Execute
1. Click the **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
2. You should see: **"Success. No rows returned"** ✅

### Step 4: Verify It Worked
Run this query to check:

```sql
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.rooms'::regclass
  AND conname = 'rooms_status_check';
```

You should see `'deleted'` in the constraint_definition. If you do, you're done! ✅

### Step 5: Test
1. Go back to your app
2. Try deleting a room
3. It should work now! 🎉

## Alternative: Use the Script File
You can also use the file `scripts/fix-constraint-now.sql` - it contains the same SQL with verification.

## What This Does
- ✅ Allows rooms to be marked as `'deleted'` (soft delete)
- ✅ Keeps all room records in the database (for history/audit)
- ✅ Expired rooms are also kept in the database
- ✅ Only active rooms show in your dashboard by default

## Why This Happened
The initial database schema only allowed `'active'` and `'expired'` statuses. The code was updated to support `'deleted'`, but the database constraint wasn't updated yet.

---

**After running the SQL, the delete functionality will work immediately!** 🚀

