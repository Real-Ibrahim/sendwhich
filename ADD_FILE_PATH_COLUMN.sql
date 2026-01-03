-- Migration to add file_path column to file_logs table
-- Run this in Supabase SQL Editor

ALTER TABLE public.file_logs 
ADD COLUMN IF NOT EXISTS file_path TEXT;

-- This column will store the path to the file in Supabase Storage
-- Format: rooms/{room_id}/{filename}

