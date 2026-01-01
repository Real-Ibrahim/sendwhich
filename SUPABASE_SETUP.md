# Supabase Setup Guide for SendWhich

This guide will walk you through setting up Supabase for your SendWhich project from scratch.

## Step 1: Create a Supabase Account and Project

1. **Go to Supabase**: Visit [https://supabase.com](https://supabase.com)

2. **Sign Up/Log In**:
   - Click "Start your project" or "Sign In"
   - Sign up with GitHub, GitLab, or email

3. **Create a New Project**:
   - Click "New Project" in your dashboard
   - Fill in the project details:
     - **Name**: `sendwhich` (or any name you prefer)
     - **Database Password**: Create a strong password (save this securely - you'll need it)
     - **Region**: Choose the region closest to you
     - **Pricing Plan**: Select "Free" (perfect for development)
   - Click "Create new project"
   - Wait 2-3 minutes for the project to initialize

## Step 2: Get Your Project Credentials

1. **Navigate to Project Settings**:
   - In your Supabase dashboard, click on the "Settings" icon (⚙️) in the left sidebar
   - Click "API" under Project Settings

2. **Copy Your Credentials**:
   You'll need these two values:
   - **Project URL**: Found under "Project URL" (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public key**: Found under "Project API keys" → "anon public" (a long string starting with `eyJ...`)

3. **Save these credentials** - you'll need them in the next step

## Step 3: Set Up Environment Variables

1. **Create `.env.local` file** in your project root (same directory as `package.json`)

2. **Add your credentials**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   Replace the values with your actual Project URL and anon key from Step 2.

3. **Save the file**

## Step 4: Run the Database Migration

1. **Open SQL Editor** in Supabase:
   - In your Supabase dashboard, click "SQL Editor" in the left sidebar
   - Click "New query"

2. **Copy the Migration SQL**:
   - Open the file `supabase/migrations/001_initial_schema.sql` in your project
   - Copy ALL the contents of that file

3. **Paste and Run**:
   - Paste the SQL code into the SQL Editor in Supabase
   - Click "Run" (or press `Ctrl+Enter`)
   - You should see a success message: "Success. No rows returned"

4. **Verify Tables Were Created**:
   - Click "Table Editor" in the left sidebar
   - You should see these tables:
     - `users`
     - `rooms`
     - `room_participants`
     - `messages`
     - `file_logs`

## Step 5: Configure Authentication

1. **Enable Email Authentication** (usually enabled by default):
   - Go to "Authentication" → "Providers" in the left sidebar
   - Make sure "Email" is enabled (toggle should be ON)
   - Click "Email" to configure if needed

2. **Configure Email Settings** (optional, for production):
   - For development, you can use Supabase's built-in email service
   - Go to "Authentication" → "Email Templates" to customize emails
   - For production, configure SMTP in "Project Settings" → "Auth" → "SMTP Settings"

3. **Set Up Email Redirect URLs**:
   - Go to "Authentication" → "URL Configuration"
   - Under "Redirect URLs", add:
     - `http://localhost:3000/**` (for development)
     - `http://localhost:3000/dashboard` (after login)
     - Add your production URL when you deploy

## Step 6: Enable Realtime (for Chat)

1. **Enable Realtime**:
   - Go to "Database" → "Replication" in the left sidebar
   - For each table you want real-time updates, toggle the switch:
     - ✅ `messages` (required for chat)
     - ✅ `file_logs` (optional, for file updates)
     - ✅ `room_participants` (optional, for participant updates)
   - Click "Enable" on each

   **Alternative**: The migration SQL should enable Realtime, but verify it's enabled.

2. **Verify Realtime is Working**:
   - Go to "Database" → "Replication"
   - You should see your tables listed with replication enabled

## Step 7: Configure Row Level Security (RLS)

The migration SQL should have already set up RLS policies, but let's verify:

1. **Check RLS Status**:
   - Go to "Table Editor" → Click on any table (e.g., `rooms`)
   - Click on the "🔒" icon or "Policies" tab
   - You should see policies listed for each table

2. **Verify Policies Exist**:
   - Each table should have policies like:
     - `users`: "Users can view their own profile", "Users can update their own profile"
     - `rooms`: "Anyone can view active rooms they are in", "Users can create rooms"
     - `messages`: "Users can view messages in their rooms", "Users can send messages"
     - etc.

   If policies are missing, re-run the migration SQL.

## Step 8: Test the Setup

1. **Start Your Development Server**:
   ```bash
   npm run dev
   ```

2. **Test Authentication**:
   - Open [http://localhost:3000](http://localhost:3000)
   - Click "Sign up"
   - Create a test account with email and password
   - You should be redirected to the dashboard

3. **Verify Database Entry**:
   - Go to Supabase Dashboard → "Table Editor" → `users`
   - You should see your newly created user entry
   - Check that the user has an `id`, `email`, and `created_at` timestamp

4. **Test Room Creation**:
   - In your app, click "Create New Room"
   - Fill in the form and create a room
   - Go to Supabase Dashboard → "Table Editor" → `rooms`
   - You should see your newly created room

## Step 9: (Optional) Set Up OAuth Providers

If you want to add Google/GitHub login later:

1. **Go to Authentication → Providers**
2. **Enable desired provider** (e.g., Google, GitHub)
3. **Configure OAuth credentials**:
   - For Google: Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - For GitHub: Create OAuth App in GitHub Settings → Developer settings
4. **Add redirect URLs** as shown in Step 5

## Troubleshooting

### Issue: "Invalid API key" error
**Solution**: 
- Double-check your `.env.local` file has the correct credentials
- Make sure there are no extra spaces or quotes around the values
- Restart your development server after changing `.env.local`

### Issue: "relation does not exist" error
**Solution**:
- Make sure you ran the migration SQL completely
- Check in "Table Editor" that all tables exist
- Try running the migration SQL again

### Issue: "RLS policy violation" error
**Solution**:
- Verify RLS policies were created (check in Table Editor → Policies)
- Make sure you're authenticated (check browser console for auth errors)
- Re-run the migration SQL to recreate policies

### Issue: Real-time updates not working
**Solution**:
- Verify Realtime is enabled in Database → Replication
- Check browser console for WebSocket connection errors
- Make sure your Supabase URL is correct in `.env.local`

### Issue: "Email already registered" during signup
**Solution**:
- This is normal if you've already created an account
- Try logging in instead, or use a different email
- You can delete test users in Supabase Dashboard → Authentication → Users

## Quick Reference: Important URLs in Supabase

- **Dashboard**: https://app.supabase.com
- **Project Settings → API**: Where you find your URL and keys
- **SQL Editor**: Where you run migrations
- **Table Editor**: View/edit your data
- **Authentication → Users**: Manage user accounts
- **Database → Replication**: Enable/disable Realtime
- **Authentication → Policies**: View/manage RLS policies

## Security Checklist

✅ **Environment Variables**: Never commit `.env.local` to git (it's already in `.gitignore`)
✅ **RLS Policies**: All tables have Row Level Security enabled
✅ **API Keys**: Using `anon` key is safe for client-side (RLS protects your data)
✅ **Service Role Key**: Keep this secret! Never use it in client-side code
✅ **CORS**: Supabase handles CORS automatically for your project URL

## Next Steps

Once Supabase is set up:

1. ✅ Test creating a user account
2. ✅ Test creating a room
3. ✅ Test sending messages in a room
4. ✅ Verify real-time updates work (open room in two browsers)

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Project Issues**: Check your project's GitHub issues

---

**Your Supabase setup is complete!** 🎉

You can now use all the features of SendWhich with secure authentication, database storage, and real-time updates.

