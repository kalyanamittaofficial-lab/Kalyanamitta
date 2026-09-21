-- 1. Create User Roles Table
-- This table links directly to Supabase's auth.users table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('superadmin', 'editor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. Create Notices Table
-- This will store the data for the Notice Board
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('live', 'upcoming', 'past', 'special')),
    title TEXT NOT NULL,
    speaker TEXT NOT NULL,
    platform TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    duration TEXT,
    thumbnail TEXT,
    has_notes BOOLEAN DEFAULT false,
    link_url TEXT,
    link_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id)
);

-- Turn on Row Level Security
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- 3. Security Policies (The "Wall")

-- Notices: Anyone can READ notices
CREATE POLICY "Allow public read access on notices" 
ON public.notices FOR SELECT 
USING (true);

-- Notices: Only Admins (superadmin or editor) can INSERT, UPDATE, DELETE
CREATE POLICY "Allow admin full access on notices" 
ON public.notices FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.id = auth.uid() 
    AND role IN ('superadmin', 'editor')
  )
);

-- User Roles: Users can read their own role
CREATE POLICY "Allow users to read their own role" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = id);

-- User Roles: Only superadmins can read all roles, insert, update, or delete roles
CREATE POLICY "Allow superadmin full access on user_roles" 
ON public.user_roles FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.id = auth.uid() 
    AND role = 'superadmin'
  )
);

-- 4. Create Initial Super Admin (IMPORTANT)
-- Run this AFTER you have logged in to the website with your email once.
-- Replace 'YOUR_USER_ID_HERE' with your actual User ID from the Supabase Auth page.
/*
INSERT INTO public.user_roles (id, role) 
VALUES ('YOUR_USER_ID_HERE', 'superadmin');
*/
