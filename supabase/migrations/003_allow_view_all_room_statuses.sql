-- Migration: Allow users to view all room statuses (active, expired, deleted) for activity history
-- This enables viewing activity history for all rooms regardless of status
-- Run this in Supabase SQL Editor

-- Drop the existing restrictive policy
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
-- - Room owners to view their rooms (active, expired, deleted)
-- - Participants to view rooms they joined (active, expired, deleted)
-- - Activity history to show all room activities regardless of status

