-- Migration: Create live_chat_messages table for real-time live video chat
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New Query)

CREATE TABLE IF NOT EXISTS public.live_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id INT DEFAULT 1,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.live_chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read messages from the live broadcast
CREATE POLICY "Allow public read access to live chat"
  ON public.live_chat_messages
  FOR SELECT
  USING (true);

-- Allow anyone (guests & members) to post messages to the live chat
CREATE POLICY "Allow public insert access to live chat"
  ON public.live_chat_messages
  FOR INSERT
  WITH CHECK (true);

-- Allow admins or message owners to delete messages if needed
CREATE POLICY "Allow authenticated users or admins to delete chat"
  ON public.live_chat_messages
  FOR DELETE
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- Enable Realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_chat_messages;
