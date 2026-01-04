-- Migration: Add 'deleted' status to rooms table
-- This allows rooms to be soft-deleted (marked as deleted but kept in database)
-- Run this in Supabase SQL Editor after running 001_initial_schema.sql

-- Drop the existing check constraint
ALTER TABLE public.rooms DROP CONSTRAINT IF EXISTS rooms_status_check;

-- Add the new check constraint with 'deleted' status
ALTER TABLE public.rooms ADD CONSTRAINT rooms_status_check 
  CHECK (status IN ('active', 'expired', 'deleted'));

