# Quick Start: Supabase Setup (5 Minutes)

## 🚀 Fast Setup Steps

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Click "New Project"
- Name: `sendwhich`, choose region, create password
- Wait 2 minutes for setup

### 2. Get Your Keys
- Settings (⚙️) → API
- Copy **Project URL** and **anon public key**

### 3. Add to `.env.local`
Create file in project root:
```env
NEXT_PUBLIC_SUPABASE_URL=paste_your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

### 4. Run Database Migration
- In Supabase: SQL Editor → New Query
- Open `supabase/migrations/001_initial_schema.sql`
- Copy ALL code, paste in SQL Editor
- Click "Run"

### 5. Enable Realtime
- Database → Replication
- Enable replication for: `messages`, `file_logs`, `room_participants`

### 6. Test It!
```bash
npm run dev
```
- Go to http://localhost:3000
- Sign up with an email
- Create a room

## ✅ Verify Setup

Check these in Supabase Dashboard:
- [ ] Tables exist: `users`, `rooms`, `messages`, `file_logs`, `room_participants`
- [ ] Can create a user account in the app
- [ ] Can create a room in the app
- [ ] User appears in Authentication → Users
- [ ] Room appears in Table Editor → rooms

## 🆘 Problems?

**"Invalid API key"** → Check `.env.local` has correct keys, restart dev server

**"Table does not exist"** → Re-run the migration SQL

**"RLS policy violation"** → Check policies exist in Table Editor → Policies

See `SUPABASE_SETUP.md` for detailed instructions.

