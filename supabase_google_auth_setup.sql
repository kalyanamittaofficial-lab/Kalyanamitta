-- ==============================================================================
-- SUPABASE GOOGLE AUTHENTICATION & USER PROFILE AUTOMATION
-- Project: Kalyanamitta Mainweb
-- 
-- Run this script in the Supabase SQL Editor:
-- Dashboard -> Your Project -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Ensure the profiles table exists with all required fields
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    mobile_number TEXT,
    country TEXT,
    state_district TEXT,
    native_language TEXT DEFAULT 'Sinhala',
    dob DATE,
    marital_status TEXT,
    family_details TEXT,
    education_profession TEXT,
    spiritual_interest INTEGER DEFAULT 50,
    interest_level INTEGER DEFAULT 50,
    current_dedication INTEGER DEFAULT 50,
    potential_dedication INTEGER DEFAULT 50,
    status TEXT DEFAULT 'pending_onboarding',
    kalyanamitta_id TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Turn on Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies: Allow authenticated users full control over their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- 4. Sequence for auto-generating Kalyanamitta IDs (starts from 1)
CREATE SEQUENCE IF NOT EXISTS kalyanamitta_id_seq START 1;

-- 5. Trigger Function: Automatically create profile when a user signs up (Google OAuth or Email)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        name,
        avatar_url,
        status
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            split_part(NEW.email, '@', 1)
        ),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
        'pending_onboarding'
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
        name = CASE 
            WHEN public.profiles.name IS NULL OR public.profiles.name = '' 
            THEN EXCLUDED.name 
            ELSE public.profiles.name 
        END,
        updated_at = timezone('utc'::text, now());

    RETURN NEW;
END;
$$;

-- 6. Attach Trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 7. Upsert-resilient complete_onboarding RPC function
CREATE OR REPLACE FUNCTION public.complete_onboarding(
    p_name TEXT,
    p_mobile TEXT,
    p_country TEXT,
    p_state TEXT,
    p_language TEXT,
    p_dob DATE,
    p_marital TEXT,
    p_family TEXT,
    p_education TEXT,
    p_interest INTEGER,
    p_current INTEGER,
    p_potential INTEGER
) RETURNS VOID 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_km_id TEXT;
    year_part TEXT;
    seq_part TEXT;
BEGIN
    -- Generate the Unique KM ID (e.g. KM-KALYANAMIT-2026-0001)
    year_part := to_char(CURRENT_DATE, 'YYYY');
    seq_part := lpad(nextval('kalyanamitta_id_seq')::TEXT, 4, '0');
    new_km_id := 'KM-KALYANAMIT-' || year_part || '-' || seq_part;

    -- Upsert the user's profile with generated ID and completed form fields
    INSERT INTO public.profiles (
        id,
        name,
        mobile_number,
        country,
        state_district,
        native_language,
        dob,
        marital_status,
        family_details,
        education_profession,
        spiritual_interest,
        interest_level,
        current_dedication,
        potential_dedication,
        status,
        kalyanamitta_id,
        updated_at
    )
    VALUES (
        auth.uid(),
        p_name,
        p_mobile,
        p_country,
        p_state,
        p_language,
        p_dob,
        p_marital,
        p_family,
        p_education,
        p_interest,
        p_interest,
        p_current,
        p_potential,
        'active',
        new_km_id,
        timezone('utc'::text, now())
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        mobile_number = EXCLUDED.mobile_number,
        country = EXCLUDED.country,
        state_district = EXCLUDED.state_district,
        native_language = EXCLUDED.native_language,
        dob = EXCLUDED.dob,
        marital_status = EXCLUDED.marital_status,
        family_details = EXCLUDED.family_details,
        education_profession = EXCLUDED.education_profession,
        spiritual_interest = EXCLUDED.spiritual_interest,
        interest_level = EXCLUDED.interest_level,
        current_dedication = EXCLUDED.current_dedication,
        potential_dedication = EXCLUDED.potential_dedication,
        status = 'active',
        kalyanamitta_id = COALESCE(public.profiles.kalyanamitta_id, new_km_id),
        updated_at = timezone('utc'::text, now());
END;
$$;
