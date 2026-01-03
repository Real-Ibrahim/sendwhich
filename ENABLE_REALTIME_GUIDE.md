# How to Enable Realtime for SendWhich (Step-by-Step)

## ⚠️ Important: You're on the Wrong Page!

The "Replication" page you're seeing is for **external data replication** (sending data to BigQuery, etc.). 

**We need to enable "Realtime"** for your tables so that chat messages update in real-time.

## ✅ Correct Way: Enable Realtime for Tables

### Step 1: Navigate to the Correct Location

1. In your Supabase dashboard, look at the **left sidebar**
2. Click on **"Database"** (under Database section)
3. You should see a submenu. Look for one of these:
   - **"Replication"** (this is different from the external replication page)
   - OR **"Publications"** 
   - OR the tables might show replication toggles directly

### Step 2: Enable Realtime (New Supabase UI)

If you're using the newer Supabase interface, follow these steps:

1. Go to **"Database"** → **"Publications"** in the left sidebar
2. You should see a publication called `supabase_realtime` (or similar)
3. Click on it to edit

OR

1. Go to **"Database"** → **"Tables"** in the left sidebar
2. Click on the **`messages`** table
3. Look for a **"Replication"** or **"Realtime"** toggle/setting
4. Enable it

### Step 3: Enable via SQL (Recommended Method)

If you can't find the UI option, you can enable it via SQL:

1. Go to **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Paste this SQL:

```sql
-- Enable Realtime for messages table (for chat)
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable Realtime for file_logs table (optional, for file updates)
ALTER PUBLICATION supabase_realtime ADD TABLE file_logs;

-- Enable Realtime for room_participants table (optional, for participant updates)
ALTER PUBLICATION supabase_realtime ADD TABLE room_participants;
```

4. Click **"Run"**

This enables real-time subscriptions for these tables.

## 🔍 Alternative: Check Current Supabase Interface

Supabase has updated their UI, so the location might be different. Try these:

### Option A: Via Table Editor
1. Go to **"Table Editor"** → Click on **`messages`** table
2. Look for a **settings icon** or **"Replication"** tab
3. Enable replication/realtime

### Option B: Via Database Settings
1. Go to **"Database"** → **"Settings"** or **"Configuration"**
2. Look for **"Realtime"** or **"Publications"** settings
3. Enable for the tables you need

### Option C: Via SQL (Always Works!)

The SQL method above will always work regardless of UI changes.

## ✅ Verify Realtime is Enabled

After running the SQL, verify it worked:

1. Run this query in SQL Editor:

```sql
SELECT tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

2. You should see `messages`, `file_logs`, and `room_participants` in the results

## 🎯 What You Actually Need

For SendWhich to work, you need Realtime enabled for:
- ✅ **`messages`** - Required (for real-time chat)
- ⚪ **`file_logs`** - Optional (for real-time file updates)
- ⚪ **`room_participants`** - Optional (for real-time participant updates)

At minimum, enable it for `messages` table.

## 🆘 If You're Still Stuck

**Just use the SQL method!** It's the most reliable:

1. SQL Editor → New Query
2. Paste the SQL from Step 3 above
3. Run it
4. Done! ✅

The external replication page (where you are now) is NOT what we need. Close that and use the SQL method instead.

## 📝 Quick SQL to Copy-Paste

Here's the exact SQL you need:

```sql
-- Enable Realtime for chat (REQUIRED)
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable Realtime for file updates (OPTIONAL)
ALTER PUBLICATION supabase_realtime ADD TABLE file_logs;

-- Enable Realtime for participant updates (OPTIONAL)  
ALTER PUBLICATION supabase_realtime ADD TABLE room_participants;
```

Copy this, paste in SQL Editor, click Run. That's it! 🎉










