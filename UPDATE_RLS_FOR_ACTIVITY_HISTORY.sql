-- ============================================
-- Migration: Allow Viewing All Room Statuses for Activity History
-- ============================================
-- This migration allows users to view all their rooms (active, expired, deleted)
-- in the activity history, not just active rooms.
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

-- Drop the existing restrictive policy (only allows viewing active rooms)
DROP POLICY IF EXISTS "Anyone can view active rooms they are in" ON public.rooms;

-- Create a new policy that allows viewing all statuses for owners and participants
CREATE POLICY "Users can view all their rooms (all statuses)"
  ON public.rooms FOR SELECT
  USING (
    owner_id = auth.uid() OR
    id IN (
      SELECT room_id FROM public.room_participants 
      WHERE user_id = auth.uid()
    )
  );

-- This policy allows:
-- ✅ Room owners to view their rooms (active, expired, deleted)
-- ✅ Participants to view rooms they joined (active, expired, deleted)
-- ✅ Activity history to show all room activities regardless of status

