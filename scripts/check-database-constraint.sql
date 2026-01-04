-- ============================================
-- Diagnostic Script: Check Rooms Constraint
-- ============================================
-- Run this in Supabase SQL Editor to check if the constraint is correct
-- ============================================

-- Check the current constraint definition
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.rooms'::regclass
  AND conname = 'rooms_status_check';

-- Expected output should show:
-- constraint_definition: CHECK (status = ANY (ARRAY['active'::text, 'expired'::text, 'deleted'::text]))
-- OR
-- constraint_definition: CHECK ((status = ANY (ARRAY['active'::text, 'expired'::text, 'deleted'::text])))

-- If it only shows 'active' and 'expired', you need to run the migration!

