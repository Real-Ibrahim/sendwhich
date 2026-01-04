# How to Create .env.local File

## ✅ Quick Method (Windows)

### Option 1: Create via Terminal/Command Prompt

Open PowerShell or Command Prompt in your project folder and run:

```powershell
# Create the file
New-Item -Path .env.local -ItemType File -Force

# Then edit it with notepad
notepad .env.local
```

Then paste this content and replace with your values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Option 2: Create via VS Code / Your Editor

1. **Right-click** in your project root folder (where `package.json` is)
2. Select **"New File"**
3. Name it exactly: **`.env.local`** (with the dot at the beginning)
4. Paste this content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

5. **Replace the placeholder values** with your actual Supabase credentials

## 📝 What to Put in the File

After creating `.env.local`, fill it with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQ1NzI5NjAwLCJleHAiOjE5NjEzMDU2MDB9.your-key-here
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2NDU3Mjk2MDAsImV4cCI6MTk2MTMwNTYwMH0.your-service-role-key-here
```

### How to Get Your Credentials:

1. Go to **Supabase Dashboard** → **Settings (⚙️)** → **API**
2. Copy **"Project URL"** → This is your `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **"anon public"** key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy **"service_role"** key (click the eye icon to reveal) → This is your `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ **WARNING**: This key bypasses all security. Keep it secret and never use in client-side code!

## ⚠️ Important Notes

- **NO quotes** around the values
- **NO spaces** around the `=` sign
- File should be named exactly: `.env.local` (with the dot!)
- File should be in the **project root** (same folder as `package.json`)
- **Never commit this file to git** (it's already in `.gitignore`)

## ✅ Verify the File

After creating the file, verify it exists:

```bash
# Check if file exists
dir .env.local
```

Or in VS Code, you should see `.env.local` in the file explorer.

## 🔄 After Creating the File

1. **Fill in your actual Supabase credentials**
2. **Save the file**
3. **Restart your dev server** if it's running:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

## 🆘 Troubleshooting

**File not found?**
- Make sure the file is named exactly `.env.local` (with dot)
- Make sure it's in the project root (same folder as `package.json`)

**"Invalid API key" error?**
- Check you copied the full key (it's very long)
- Make sure no extra spaces or quotes
- Restart your dev server after changing the file

**File is hidden?**
- In VS Code: File → Preferences → Settings → Search "files.exclude" → Make sure `.env.local` is NOT excluded
- In File Explorer: View → Show → Hidden items











