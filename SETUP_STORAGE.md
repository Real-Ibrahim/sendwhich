# Supabase Storage Setup for File Uploads/Downloads

**⚠️ IMPORTANT: You MUST complete this setup for file uploads/downloads to work!**

To enable file uploads and downloads, you need to set up Supabase Storage.

**Quick Setup**: See `QUICK_STORAGE_SETUP.md` for a faster guide.

## Step 1: Create Storage Bucket

1. Go to your **Supabase Dashboard**
2. Click on **Storage** in the left sidebar
3. Click **"New bucket"**
4. Configure the bucket:
   - **Name**: `files`
   - **Public bucket**: ❌ **Uncheck** (Keep it private for security)
   - Click **"Create bucket"**

## Step 2: Set Up Storage Policies

1. After creating the bucket, click on it
2. Go to the **"Policies"** tab
3. Click **"New policy"**

### Policy 1: Allow Authenticated Users to Upload Files

- **Policy name**: `Users can upload files`
- **Allowed operation**: `INSERT`
- **Policy definition**: 
  ```sql
  (bucket_id = 'files'::text) AND (auth.role() = 'authenticated'::text)
  ```
- Click **"Review"** then **"Save policy"**

### Policy 2: Allow Authenticated Users to Read Files

- **Policy name**: `Users can read files`
- **Allowed operation**: `SELECT`
- **Policy definition**:
  ```sql
  (bucket_id = 'files'::text) AND (auth.role() = 'authenticated'::text)
  ```
- Click **"Review"** then **"Save policy"**

### Policy 3: Allow Authenticated Users to Delete Files (Optional - for cleanup)

- **Policy name**: `Users can delete their files`
- **Allowed operation**: `DELETE`
- **Policy definition**:
  ```sql
  (bucket_id = 'files'::text) AND (auth.role() = 'authenticated'::text)
  ```
- Click **"Review"** then **"Save policy"**

## Step 3: Add file_path Column to Database

Run the migration SQL file `ADD_FILE_PATH_COLUMN.sql` in the Supabase SQL Editor:

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **"New query"**
3. Copy the contents of `ADD_FILE_PATH_COLUMN.sql`
4. Paste and click **"Run"**

## Step 4: Verify Setup

1. ✅ Storage bucket `files` exists
2. ✅ Storage policies are set up
3. ✅ `file_path` column exists in `file_logs` table
4. ✅ Try uploading a file in a room - it should work!

## Troubleshooting

**Error: "Bucket not found"**
- Make sure the bucket is named exactly `files`
- Check that the bucket exists in Storage

**Error: "new row violates row-level security policy"**
- Make sure the storage policies are set up correctly
- Verify you're authenticated

**Error: "column file_path does not exist"**
- Run the migration SQL from `ADD_FILE_PATH_COLUMN.sql`

