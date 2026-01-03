# Quick Storage Setup (5 Minutes)

Your app needs Supabase Storage to be set up for file uploads/downloads. Follow these steps:

## Step 1: Create Storage Bucket

1. **Go to Supabase Dashboard**
   - Open your project
   - Click **"Storage"** in the left sidebar

2. **Create New Bucket**
   - Click **"New bucket"** button
   - **Name**: `files` (must be exactly "files")
   - **Public bucket**: ❌ **Leave UNCHECKED** (private is more secure)
   - Click **"Create bucket"**

## Step 2: Set Up Storage Policies

After creating the bucket:

1. Click on the **"files"** bucket
2. Go to the **"Policies"** tab
3. Click **"New policy"**

### Policy 1: Allow Uploads

- Click **"For full customization"**
- **Policy name**: `Users can upload files`
- **Allowed operation**: `INSERT`
- **Policy definition** (paste this):
  ```sql
  (bucket_id = 'files'::text) AND (auth.role() = 'authenticated'::text)
  ```
- Click **"Review"** then **"Save policy"**

### Policy 2: Allow Downloads

- Click **"New policy"** again
- Click **"For full customization"**
- **Policy name**: `Users can read files`
- **Allowed operation**: `SELECT`
- **Policy definition** (paste this):
  ```sql
  (bucket_id = 'files'::text) AND (auth.role() = 'authenticated'::text)
  ```
- Click **"Review"** then **"Save policy"**

## Step 3: Add file_path Column to Database

1. **Go to SQL Editor** in Supabase Dashboard
2. Click **"New query"**
3. Copy and paste this SQL:

```sql
ALTER TABLE public.file_logs 
ADD COLUMN IF NOT EXISTS file_path TEXT;
```

4. Click **"Run"** (or press F5)

## Step 4: Verify Setup

✅ Check that:
- [ ] Storage bucket named "files" exists
- [ ] Two policies are created (upload and read)
- [ ] SQL migration ran successfully
- [ ] Try uploading a file - it should work!

## Troubleshooting

**Error: "Bucket not found"**
- Make sure the bucket is named exactly `files` (lowercase)
- Check that it exists in Storage → Buckets

**Error: "new row violates row-level security policy"**
- Make sure you created both storage policies
- Check that policies are enabled (green toggle)

**Error: "column file_path does not exist"**
- Run the ALTER TABLE SQL query from Step 3
- Check in Table Editor → file_logs that file_path column exists

**Files upload but downloads fail**
- Make sure the "Users can read files" policy exists
- Check that the policy allows SELECT operation

That's it! Your file upload/download system should now work. 🎉

