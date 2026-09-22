-- Run this in the Supabase SQL Editor after supabase_admin_setup.sql

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

-- Evaluate the role without recursively applying user_roles policies
CREATE OR REPLACE FUNCTION public.has_live_broadcast_admin_role()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_roles.id = auth.uid()
        AND role IN ('superadmin', 'editor')
    );
$$;

REVOKE ALL ON FUNCTION public.has_live_broadcast_admin_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_live_broadcast_admin_role() TO authenticated;

-- Allow public read access
CREATE POLICY "Allow public read access on live_broadcast"
ON live_broadcast FOR SELECT
TO public
USING (true);

-- Only users assigned an admin role can update broadcast settings
CREATE POLICY "Allow admin update on live_broadcast"
ON live_broadcast FOR UPDATE
TO authenticated
USING (
    public.has_live_broadcast_admin_role()
)
WITH CHECK (
    public.has_live_broadcast_admin_role()
);

-- Enable Postgres Changes events for the public live indicators
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_broadcast;
