-- ============================================
-- Migration: Add 'deleted' status to rooms table
-- ============================================
-- This migration allows rooms to be soft-deleted (marked as deleted but kept in database)
-- 
-- INSTRUCTIONS:
-- 1. Go to your Supabase Dashboard
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New query"
-- 4. Copy and paste the SQL below
-- 5. Click "Run" (or press Ctrl+Enter)
-- 6. You should see "Success. No rows returned"
--
-- ============================================

-- Drop the existing check constraint
ALTER TABLE public.rooms DROP CONSTRAINT IF EXISTS rooms_status_check;

-- Add the new check constraint with 'deleted' status
ALTER TABLE public.rooms ADD CONSTRAINT rooms_status_check 
  CHECK (status IN ('active', 'expired', 'deleted'));
