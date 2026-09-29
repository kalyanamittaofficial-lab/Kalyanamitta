-- Migration: Add dynamic content fields to live_broadcast table
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New Query)

-- Add new columns if they don't already exist
ALTER TABLE public.live_broadcast
  ADD COLUMN IF NOT EXISTS sermon_title    TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS speaker_name   TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS description    TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS pdf_url        TEXT DEFAULT '';

-- Verify the columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'live_broadcast'
ORDER BY ordinal_position;
