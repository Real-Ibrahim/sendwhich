-- ============================================
-- Enable Realtime for SendWhich Tables
-- Copy and paste this into Supabase SQL Editor and run it
-- ============================================

-- Enable Realtime for messages table (REQUIRED - for real-time chat)
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable Realtime for file_logs table (OPTIONAL - for real-time file updates)
ALTER PUBLICATION supabase_realtime ADD TABLE file_logs;

-- Enable Realtime for room_participants table (OPTIONAL - for real-time participant updates)
ALTER PUBLICATION supabase_realtime ADD TABLE room_participants;

-- ============================================
-- Verify it worked (optional check)
-- ============================================
-- Run this query to see which tables have Realtime enabled:
-- SELECT tablename FROM pg_publication_tables WHERE pubname = 'supabase_realtime';











