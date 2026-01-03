# Service Role Key Setup for P2P Room Joining

For P2P file sharing to work properly, users need to be able to join rooms using just the room link, even if they're not already participants. This requires the Service Role Key to bypass Row Level Security (RLS) in API routes.

## How to Get Your Service Role Key

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Click on **Settings** (⚙️) in the left sidebar
   - Click on **API** under Project Settings

2. **Find the Service Role Key**
   - Scroll down to the **"Project API keys"** section
   - Find the **"service_role"** key (NOT the anon key)
   - Click the **👁️ eye icon** to reveal it
   - Click the **📋 copy icon** to copy it
   - ⚠️ **WARNING**: This key bypasses all RLS policies. Keep it secret!

3. **Add to .env.local**
   - Open your `.env.local` file in the project root
   - Add this line:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
   - Replace `your_service_role_key_here` with the actual key you copied
   - Save the file

4. **Restart Your Development Server**
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

## Security Notes

- ✅ **Safe to use in API routes** (server-side only)
- ❌ **NEVER use in client-side code** (browser, React components, etc.)
- ❌ **NEVER commit to git** (already in `.gitignore`)
- ✅ This key is only used in `/api/rooms/[id]` route to allow room lookups for joining

## Why This Is Needed

For P2P file sharing, anyone with a room link should be able to:
1. View the room information (name, password status, etc.)
2. Join the room (even if they're not a participant yet)

The regular RLS policy only allows viewing rooms if you're already a participant or the owner, which creates a "chicken and egg" problem. The service role key bypasses RLS in API routes to enable this functionality while still maintaining security (authentication is still required for joining).

## Troubleshooting

**Error: "SUPABASE_SERVICE_ROLE_KEY is not set"**
- Make sure you added the key to `.env.local`
- Make sure you restarted the dev server after adding it
- Check that there are no quotes around the key value
- Check that there are no extra spaces

**Error: "Invalid API key"**
- Make sure you copied the **service_role** key, not the **anon** key
- Make sure the key is complete (it's a long string)



