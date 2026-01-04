-- ============================================
-- QUICK FIX: Update Rooms Constraint
-- ============================================
-- Copy and paste this ENTIRE file into Supabase SQL Editor and run it
-- This will fix the delete room error immediately
-- ============================================

-- Step 1: Drop the old constraint
ALTER TABLE public.rooms DROP CONSTRAINT IF EXISTS rooms_status_check;

-- Step 2: Add the new constraint with 'deleted' status
ALTER TABLE public.rooms ADD CONSTRAINT rooms_status_check 
  CHECK (status IN ('active', 'expired', 'deleted'));

-- Step 3: Verify it worked (should return the new constraint)
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.rooms'::regclass
  AND conname = 'rooms_status_check';

-- If you see 'deleted' in the constraint_definition, you're good to go! ✅

