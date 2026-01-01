-- ============================================
-- SendWhich Database Setup SQL
-- Copy and paste this entire file into Supabase SQL Editor
-- ============================================

-- Enable UUID extension (required for UUID generation)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CREATE TABLES
-- ============================================

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT,
  is_locked BOOLEAN DEFAULT FALSE,
  password_hash TEXT,
  max_participants INTEGER DEFAULT 10,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired'))
);

-- Create room_participants table
CREATE TABLE IF NOT EXISTS public.room_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'member'))
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'system')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create file_logs table
CREATE TABLE IF NOT EXISTS public.file_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CREATE INDEXES (for better performance)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_rooms_owner_id ON public.rooms(owner_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON public.rooms(status);
CREATE INDEX IF NOT EXISTS idx_room_participants_room_id ON public.room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_user_id ON public.room_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON public.messages(room_id);
CREATE INDEX IF NOT EXISTS idx_file_logs_room_id ON public.file_logs(room_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES
-- ============================================

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Rooms policies
CREATE POLICY "Anyone can view active rooms they are in"
  ON public.rooms FOR SELECT
  USING (
    status = 'active' AND (
      owner_id = auth.uid() OR
      id IN (SELECT room_id FROM public.room_participants WHERE user_id = auth.uid() AND left_at IS NULL)
    )
  );

CREATE POLICY "Users can create rooms"
  ON public.rooms FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Room owners can update their rooms"
  ON public.rooms FOR UPDATE
  USING (auth.uid() = owner_id);

-- Room participants policies
CREATE POLICY "Users can view participants in their rooms"
  ON public.room_participants FOR SELECT
  USING (
    room_id IN (
      SELECT id FROM public.rooms WHERE 
        owner_id = auth.uid() OR
        id IN (SELECT room_id FROM public.room_participants WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can join rooms as participants"
  ON public.room_participants FOR INSERT
  WITH CHECK (true); -- Can be restricted further if needed

CREATE POLICY "Users can update their own participation"
  ON public.room_participants FOR UPDATE
  USING (user_id = auth.uid() OR room_id IN (SELECT id FROM public.rooms WHERE owner_id = auth.uid()));

-- Messages policies
CREATE POLICY "Users can view messages in their rooms"
  ON public.messages FOR SELECT
  USING (
    room_id IN (
      SELECT id FROM public.rooms WHERE 
        owner_id = auth.uid() OR
        id IN (SELECT room_id FROM public.room_participants WHERE user_id = auth.uid() AND left_at IS NULL)
    )
  );

CREATE POLICY "Users can send messages in their rooms"
  ON public.messages FOR INSERT
  WITH CHECK (
    room_id IN (
      SELECT id FROM public.rooms WHERE 
        owner_id = auth.uid() OR
        id IN (SELECT room_id FROM public.room_participants WHERE user_id = auth.uid() AND left_at IS NULL)
    )
  );

-- File logs policies
CREATE POLICY "Users can view file logs in their rooms"
  ON public.file_logs FOR SELECT
  USING (
    room_id IN (
      SELECT id FROM public.rooms WHERE 
        owner_id = auth.uid() OR
        id IN (SELECT room_id FROM public.room_participants WHERE user_id = auth.uid() AND left_at IS NULL)
    )
  );

CREATE POLICY "Users can log files in their rooms"
  ON public.file_logs FOR INSERT
  WITH CHECK (
    room_id IN (
      SELECT id FROM public.rooms WHERE 
        owner_id = auth.uid() OR
        id IN (SELECT room_id FROM public.room_participants WHERE user_id = auth.uid() AND left_at IS NULL)
    )
  );

-- ============================================
-- CREATE TRIGGER FUNCTION
-- (Automatically creates user profile when user signs up)
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (NEW.id, NEW.email, NULL);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- CREATE TRIGGER
-- (Triggers when new user signs up)
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- DONE! ✅
-- ============================================
-- 
-- Next steps:
-- 1. Go to Database → Replication
-- 2. Enable Realtime for: messages, file_logs, room_participants
-- 3. Test your application!
-- ============================================

