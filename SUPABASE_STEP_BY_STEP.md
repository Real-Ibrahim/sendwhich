# Supabase Setup: Step-by-Step Visual Guide

## 📋 Complete Checklist

Follow these steps in order:

- [ ] Step 1: Create Supabase Account & Project
- [ ] Step 2: Get Project Credentials
- [ ] Step 3: Create `.env.local` file
- [ ] Step 4: Run Database Migration
- [ ] Step 5: Enable Realtime
- [ ] Step 6: Verify Tables Created
- [ ] Step 7: Test Authentication
- [ ] Step 8: Test Room Creation

---

## Step 1: Create Supabase Account & Project

### 1.1 Go to Supabase Website
- Visit: **https://supabase.com**
- Click **"Start your project"** or **"Sign In"**

### 1.2 Sign Up (if new)
- Sign up with **GitHub**, **GitLab**, or **Email**
- Verify your email if required

### 1.3 Create New Project
1. Click **"New Project"** button (green button in top right)
2. Fill in the form:
   ```
   Organization: Select or create one
   Name: sendwhich
   Database Password: [Create a strong password - SAVE THIS!]
   Region: Choose closest to you (e.g., "Southeast Asia (Singapore)")
   Pricing Plan: Free
   ```
3. Check the box to agree to terms
4. Click **"Create new project"**
5. **Wait 2-3 minutes** for project initialization (you'll see a loading screen)

---

## Step 2: Get Your Project Credentials

### 2.1 Navigate to API Settings
1. In your Supabase dashboard, look at the **left sidebar**
2. Click the **⚙️ Settings icon** (bottom of sidebar)
3. Click **"API"** under Project Settings

### 2.2 Copy Your Credentials
You'll see a page with several sections. Find these two values:

#### **Project URL**
- Look for **"Project URL"** section
- Copy the URL (looks like: `https://abcdefghijklmnop.supabase.co`)
- This is your `NEXT_PUBLIC_SUPABASE_URL`

#### **API Keys**
- Look for **"Project API keys"** section
- Find **"anon public"** key
- Click the **👁️ eye icon** to reveal it
- Click **📋 copy icon** to copy
- This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**💡 Tip**: Save these in a text file temporarily - you'll need them in the next step!

---

## Step 3: Create `.env.local` File

### 3.1 Create the File
1. In your project root folder (where `package.json` is), create a new file
2. Name it exactly: **`.env.local`** (including the dot at the beginning)

### 3.2 Add Your Credentials
Open `.env.local` in a text editor and paste:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQ1NzI5NjAwLCJleHAiOjE5NjEzMDU2MDB9.your-key-here
```

**⚠️ Important**: 
- Replace `your-project-id` with your actual Project URL
- Replace the `eyJ...` key with your actual anon key
- **NO spaces** around the `=` sign
- **NO quotes** around the values
- Make sure there are no extra spaces at the end of lines

### 3.3 Save the File
- Save and close the file
- Verify the file is in your project root (same folder as `package.json`)

**🔒 Security Note**: This file is already in `.gitignore`, so it won't be committed to git.

---

## Step 4: Run Database Migration

### 4.1 Open SQL Editor
1. In Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"** button (top right)

### 4.2 Get the Migration SQL
1. In your project, open the file: **`supabase/migrations/001_initial_schema.sql`**
2. **Select ALL** the code (Ctrl+A / Cmd+A)
3. **Copy** it (Ctrl+C / Cmd+C)

### 4.3 Paste and Run
1. In Supabase SQL Editor, **paste** the code
2. Click the **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
3. Wait a few seconds
4. You should see: **"Success. No rows returned"** ✅

**If you see errors:**
- Make sure you copied the ENTIRE file
- Check for any syntax errors in the error message
- Try running it again

---

## Step 5: Enable Realtime (for Chat)

### 5.1 Navigate to Replication
1. In Supabase dashboard, click **"Database"** in left sidebar
2. Click **"Replication"** (under Database)

### 5.2 Enable Realtime for Tables
You'll see a list of tables. Enable replication for these:

1. **`messages`** - Click the toggle switch ✅
   - This enables real-time chat

2. **`file_logs`** - Click the toggle switch ✅ (optional)
   - This enables real-time file updates

3. **`room_participants`** - Click the toggle switch ✅ (optional)
   - This enables real-time participant updates

**Note**: If you don't see these tables, go back to Step 4 and make sure the migration ran successfully.

---

## Step 6: Verify Tables Were Created

### 6.1 Check Table Editor
1. In Supabase dashboard, click **"Table Editor"** in left sidebar
2. You should see these tables:
   - ✅ `users`
   - ✅ `rooms`
   - ✅ `room_participants`
   - ✅ `messages`
   - ✅ `file_logs`

### 6.2 Verify RLS Policies
1. Click on any table (e.g., `rooms`)
2. Click the **"🔒" icon** or **"Policies"** tab
3. You should see policies listed (e.g., "Anyone can view active rooms they are in")

**If tables are missing:**
- Go back to Step 4 and re-run the migration SQL

---

## Step 7: Test Authentication

### 7.1 Start Your Development Server
In your terminal, make sure you're in the project directory:

```bash
npm run dev
```

Wait for: `- ready started server on 0.0.0.0:3000`

### 7.2 Open Your App
1. Open browser: **http://localhost:3000**
2. You should see the landing page

### 7.3 Sign Up
1. Click **"Sign up"** button (top right)
2. Fill in the form:
   - **Username**: Your name
   - **Email**: Your email address
   - **Password**: At least 8 chars, 1 uppercase, 1 number
   - **Confirm Password**: Same as above
   - Check **"I agree to terms"**
3. Click **"Create Account"**
4. You should be redirected to `/dashboard`

### 7.4 Verify User Was Created
1. Go back to Supabase dashboard
2. Click **"Authentication"** → **"Users"** in left sidebar
3. You should see your new user with the email you signed up with ✅

### 7.5 Verify User Profile
1. In Supabase, click **"Table Editor"** → **"users"**
2. You should see your user entry with:
   - `id`: UUID
   - `email`: Your email
   - `username`: Your username (or null)
   - `created_at`: Timestamp

---

## Step 8: Test Room Creation

### 8.1 Create a Room
1. In your app (http://localhost:3000/dashboard), click **"Create New Room"**
2. Fill in:
   - **Room Name**: "Test Room"
   - **Max Participants**: 10
   - (Optional) Add password or expiry date
3. Click **"Create Room"**
4. You should be redirected to the room page

### 8.2 Verify Room in Database
1. Go to Supabase dashboard
2. Click **"Table Editor"** → **"rooms"**
3. You should see your room with:
   - `id`: UUID
   - `owner_id`: Your user ID
   - `name`: "Test Room"
   - `status`: "active"
   - etc.

### 8.3 Test Chat (Optional)
1. In your room page, type a message in the chat box
2. Click send
3. Go to Supabase → **"Table Editor"** → **"messages"**
4. You should see your message ✅

---

## ✅ Setup Complete!

If all steps above worked, your Supabase setup is complete! 🎉

### What You've Set Up:
- ✅ Database with all required tables
- ✅ Row Level Security (RLS) policies
- ✅ Authentication system
- ✅ Realtime subscriptions
- ✅ Automatic user profile creation

### Next Steps:
- Start building features!
- Test creating multiple rooms
- Test joining rooms
- Test chat functionality

---

## 🆘 Troubleshooting

### "Invalid API key" Error
**Problem**: App shows authentication errors

**Solutions**:
1. Check `.env.local` file exists and has correct values
2. Make sure no quotes around values: `NEXT_PUBLIC_SUPABASE_URL=https://...` (correct)
3. NOT: `NEXT_PUBLIC_SUPABASE_URL="https://..."` (wrong - no quotes!)
4. Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

### "Table does not exist" Error
**Problem**: Migration didn't run properly

**Solutions**:
1. Go to Supabase → SQL Editor
2. Re-run the migration SQL from Step 4
3. Check Table Editor to verify tables exist

### "RLS policy violation" Error
**Problem**: Can't access data

**Solutions**:
1. Make sure you're logged in (check if user appears in Authentication → Users)
2. Verify RLS policies exist (Table Editor → Click table → Policies tab)
3. Re-run migration SQL if policies are missing

### "Real-time not working"
**Problem**: Chat doesn't update in real-time

**Solutions**:
1. Check Realtime is enabled: Database → Replication → `messages` should be ON
2. Check browser console for WebSocket errors
3. Verify Supabase URL is correct in `.env.local`

### Can't Sign Up
**Problem**: Sign up button doesn't work or shows error

**Solutions**:
1. Check browser console for errors (F12 → Console tab)
2. Verify email is valid format
3. Password must be: 8+ chars, 1 uppercase, 1 number
4. Check Supabase → Authentication → Providers → Email is enabled

---

## 📞 Need Help?

1. Check the detailed guide: `SUPABASE_SETUP.md`
2. Check Supabase docs: https://supabase.com/docs
3. Check browser console for error messages
4. Verify all environment variables are set correctly

---

**Happy coding! 🚀**

