-- Run this in the Supabase SQL Editor

CREATE TABLE live_broadcast (
    id SERIAL PRIMARY KEY,
    is_live BOOLEAN DEFAULT false,
    video_id TEXT,
    next_scheduled_time TIMESTAMP WITH TIME ZONE,
    next_title TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert the default single row
INSERT INTO live_broadcast (id, is_live, video_id, next_scheduled_time, next_title)
VALUES (1, false, 'jfKfPfyJRdk', '2026-09-25T14:00:00Z', 'සතිපට්ඨාන සූත්‍ර දේශනාව');

-- Enable RLS
ALTER TABLE live_broadcast ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on live_broadcast"
ON live_broadcast FOR SELECT
TO public
USING (true);

-- Allow authenticated admins to update
CREATE POLICY "Allow authenticated update on live_broadcast"
ON live_broadcast FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
