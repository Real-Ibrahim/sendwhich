# Fix: Delete Room Error

## Problem
When trying to delete a room, you get this error:
```
new row for relation "rooms" violates check constraint "rooms_status_check"
```

## Solution
The database constraint needs to be updated to allow the `'deleted'` status. Follow these steps:

### Step 1: Open Supabase SQL Editor
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New query"** button (top right)

### Step 2: Run the Migration
1. Open the file `ADD_DELETED_STATUS.sql` in your project
2. **Copy ALL the SQL code** from that file
3. **Paste it** into the Supabase SQL Editor
4. Click **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
5. You should see: **"Success. No rows returned"** ✅

### Step 3: Verify It Works
1. Go back to your app
2. Try deleting a room again
3. It should work now! 🎉

## What This Does
- Updates the database constraint to allow `'deleted'` status
- Rooms marked as `'deleted'` will be kept in the database (soft delete)
- Expired rooms are also kept in the database
- Only active rooms are shown in your dashboard by default

## Alternative: Use Migration File
You can also use the migration file in `supabase/migrations/002_add_deleted_status.sql` - it contains the same SQL.

