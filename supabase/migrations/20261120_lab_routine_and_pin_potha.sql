-- ==============================================================================
-- SUTTA LEARNING LAB — DAILY ROUTINE, LIFE CLOCK & PIN POTHA EXTENSIONS
-- All personal routine, life-clock, and Pin Potha records are strictly PRIVATE
-- with Row-Level Security (auth.uid() = user_id).
-- ==============================================================================

-- 1. EXTEND PIN POTHA ENTRIES (Citta type, scheduling, and duration)
ALTER TABLE public.lab_pin_potha_entries
    DROP COLUMN IF EXISTS linked_path_factor,
    DROP COLUMN IF EXISTS citta_type,
    ADD COLUMN IF NOT EXISTS schedule_type TEXT NOT NULL DEFAULT 'once' CHECK (schedule_type IN ('once', 'daily', 'poya', 'range')),
    ADD COLUMN IF NOT EXISTS duration_days INTEGER,
    ADD COLUMN IF NOT EXISTS end_date DATE,
    ADD COLUMN IF NOT EXISTS duration_minutes INTEGER NOT NULL DEFAULT 30;

ALTER TABLE public.lab_pin_potha_entries
    DROP CONSTRAINT IF EXISTS lab_pin_potha_entries_entry_type_check;
ALTER TABLE public.lab_pin_potha_entries
    ADD CONSTRAINT lab_pin_potha_entries_entry_type_check
    CHECK (entry_type IN ('dana', 'sila', 'bhavana', 'habit_shift', 'buddha_vandana', 'sambuddha_puja', 'veyyavacca', 'dhamma_study'));

-- 2. DAILY ROUTINE CATEGORIES (Customizable per user)
CREATE TABLE IF NOT EXISTS public.lab_routine_categories (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#5F6E43',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.lab_routine_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own routine categories" ON public.lab_routine_categories;
CREATE POLICY "Users manage own routine categories"
ON public.lab_routine_categories FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. DAILY ROUTINE HABITS / TASKS (Private)
CREATE TABLE IF NOT EXISTS public.lab_routine_habits (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL DEFAULT 'dhamma',
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    minutes INTEGER NOT NULL DEFAULT 15,
    citta_type TEXT NOT NULL DEFAULT 'kusala' CHECK (citta_type IN ('kusala', 'akusala')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.lab_routine_habits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own routine habits" ON public.lab_routine_habits;
CREATE POLICY "Users manage own routine habits"
ON public.lab_routine_habits FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. DAILY ROUTINE LOGS (Wake time, sleep time, checked habit IDs per day)
CREATE TABLE IF NOT EXISTS public.lab_routine_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    wake_time TEXT DEFAULT '',
    sleep_time TEXT DEFAULT '',
    checked_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE (user_id, log_date)
);

ALTER TABLE public.lab_routine_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own routine logs" ON public.lab_routine_logs;
CREATE POLICY "Users manage own routine logs"
ON public.lab_routine_logs FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. LIFE CLOCK CONFIGURATION (Private)
CREATE TABLE IF NOT EXISTS public.lab_life_clock_config (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    dob DATE NOT NULL DEFAULT '1996-01-01',
    lifespan_years INTEGER NOT NULL DEFAULT 75 CHECK (lifespan_years BETWEEN 30 AND 120),
    clock_mode TEXT NOT NULL DEFAULT 'remaining' CHECK (clock_mode IN ('remaining', 'lived')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.lab_life_clock_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own life clock config" ON public.lab_life_clock_config;
CREATE POLICY "Users manage own life clock config"
ON public.lab_life_clock_config FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
