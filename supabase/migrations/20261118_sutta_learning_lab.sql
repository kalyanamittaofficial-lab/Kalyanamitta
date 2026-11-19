-- ==============================================================================
-- SUTTA LEARNING LAB — COMPLETE DATABASE SCHEMA & RLS POLICIES
-- Principles:
--   1. Every personal note, highlight, and Pin Potha record is PRIVATE by default.
--   2. Canonical Dhamma texts, translations, and personal interpretations are
--      strictly separated (is_canon = false enforced on annotations).
--   3. Nibbāna is never scored or calculated; Path Compass & Pin Potha are
--      qualitative practice & reflection records.
--   4. Public/shared maps preserve canonical sources and authorship.
-- ==============================================================================

-- 1. LAB HIGHLIGHTS (Private by default)
CREATE TABLE IF NOT EXISTS public.lab_highlights (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sutta_key TEXT NOT NULL,
    sutta_title TEXT,
    segment_id TEXT NOT NULL,
    pali TEXT DEFAULT '',
    sinh TEXT DEFAULT '',
    color TEXT NOT NULL DEFAULT 'amber' CHECK (color IN ('amber', 'mint', 'sky', 'rose')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE (user_id, segment_id)
);

ALTER TABLE public.lab_highlights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own highlights" ON public.lab_highlights;
CREATE POLICY "Users manage own highlights"
ON public.lab_highlights FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. LAB ANNOTATIONS (W3C Stand-off Annotations, Private by default, Non-Canonical)
CREATE TABLE IF NOT EXISTS public.lab_annotations (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sutta_key TEXT NOT NULL,
    sutta_title_pali TEXT,
    sutta_title_sinhala TEXT,
    canonical_ref TEXT,
    segment_id TEXT NOT NULL,
    canonical_quote TEXT DEFAULT '',
    translation_quote TEXT DEFAULT '',
    category TEXT NOT NULL DEFAULT 'reflection',
    action_tag TEXT DEFAULT 'Study Note',
    title TEXT DEFAULT '',
    body_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'shared_map', 'public')),
    review_status TEXT NOT NULL DEFAULT 'unreviewed',
    is_canon BOOLEAN NOT NULL DEFAULT false CHECK (is_canon = false),
    disclaimer TEXT NOT NULL DEFAULT 'Personal study reflection (non-canonical).',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE (user_id, segment_id)
);

ALTER TABLE public.lab_annotations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own annotations" ON public.lab_annotations;
CREATE POLICY "Users manage own annotations"
ON public.lab_annotations FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can read public annotations" ON public.lab_annotations;
CREATE POLICY "Anyone can read public annotations"
ON public.lab_annotations FOR SELECT
TO anon, authenticated
USING (visibility = 'public');

-- 3. LAB READING PROGRESS & BOOKMARKS (Private)
CREATE TABLE IF NOT EXISTS public.lab_reading_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sutta_key TEXT NOT NULL,
    sutta_title_pali TEXT,
    sutta_title_sinhala TEXT,
    last_segment_id TEXT,
    is_bookmarked BOOLEAN NOT NULL DEFAULT false,
    last_read_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE (user_id, sutta_key)
);

ALTER TABLE public.lab_reading_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own reading progress" ON public.lab_reading_progress;
CREATE POLICY "Users manage own reading progress"
ON public.lab_reading_progress FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. PERSONAL KNOWLEDGE MAPS (Private by default, opt-in public sharing)
CREATE TABLE IF NOT EXISTS public.lab_knowledge_maps (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    author_name TEXT DEFAULT 'Kalyanamitta Seeker',
    visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'public')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.lab_knowledge_maps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own knowledge maps" ON public.lab_knowledge_maps;
CREATE POLICY "Users manage own knowledge maps"
ON public.lab_knowledge_maps FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can read public knowledge maps" ON public.lab_knowledge_maps;
CREATE POLICY "Anyone can read public knowledge maps"
ON public.lab_knowledge_maps FOR SELECT
TO anon, authenticated
USING (visibility = 'public');

CREATE TABLE IF NOT EXISTS public.lab_map_nodes (
    id TEXT PRIMARY KEY,
    map_id TEXT NOT NULL REFERENCES public.lab_knowledge_maps(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    node_type TEXT NOT NULL CHECK (node_type IN ('concept', 'sutta', 'annotation', 'practice', 'insight')),
    label TEXT NOT NULL,
    summary TEXT DEFAULT '',
    source_ref TEXT DEFAULT '',
    sutta_key TEXT,
    segment_id TEXT,
    annotation_id TEXT,
    pos_x DOUBLE PRECISION NOT NULL DEFAULT 120,
    pos_y DOUBLE PRECISION NOT NULL DEFAULT 120,
    color TEXT DEFAULT '#4F46E5',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.lab_map_nodes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own map nodes" ON public.lab_map_nodes;
CREATE POLICY "Users manage own map nodes"
ON public.lab_map_nodes FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can read nodes of public maps" ON public.lab_map_nodes;
CREATE POLICY "Anyone can read nodes of public maps"
ON public.lab_map_nodes FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.lab_knowledge_maps m
        WHERE m.id = map_id AND m.visibility = 'public'
    )
);

CREATE TABLE IF NOT EXISTS public.lab_map_edges (
    id TEXT PRIMARY KEY,
    map_id TEXT NOT NULL REFERENCES public.lab_knowledge_maps(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source_node_id TEXT NOT NULL REFERENCES public.lab_map_nodes(id) ON DELETE CASCADE,
    target_node_id TEXT NOT NULL REFERENCES public.lab_map_nodes(id) ON DELETE CASCADE,
    relation_label TEXT NOT NULL DEFAULT 'relates to',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.lab_map_edges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own map edges" ON public.lab_map_edges;
CREATE POLICY "Users manage own map edges"
ON public.lab_map_edges FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can read edges of public maps" ON public.lab_map_edges;
CREATE POLICY "Anyone can read edges of public maps"
ON public.lab_map_edges FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.lab_knowledge_maps m
        WHERE m.id = map_id AND m.visibility = 'public'
    )
);

-- 5. PATH COMPASS REFLECTIONS (Qualitative, Non-Scoring, Private)
CREATE TABLE IF NOT EXISTS public.lab_path_reflections (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    path_factor TEXT NOT NULL,
    intention TEXT NOT NULL,
    observation TEXT DEFAULT '',
    linked_sutta_key TEXT,
    linked_segment_id TEXT,
    linked_annotation_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.lab_path_reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own path reflections" ON public.lab_path_reflections;
CREATE POLICY "Users manage own path reflections"
ON public.lab_path_reflections FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. PIN POTHA (Wholesome Actions, Habit Shifts, Generosity — STRICTLY PRIVATE)
CREATE TABLE IF NOT EXISTS public.lab_pin_potha_entries (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    entry_type TEXT NOT NULL CHECK (entry_type IN ('dana', 'sila', 'bhavana', 'habit_shift', 'veyyavacca', 'dhamma_study')),
    title TEXT NOT NULL,
    reflection TEXT DEFAULT '',
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    linked_sutta_key TEXT,
    linked_path_factor TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.lab_pin_potha_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own pin potha" ON public.lab_pin_potha_entries;
CREATE POLICY "Users manage own pin potha"
ON public.lab_pin_potha_entries FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 7. DEDICATION & CONTRIBUTION (Pattidana & Community Offerings)
CREATE TABLE IF NOT EXISTS public.lab_dedications (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    dedication_type TEXT NOT NULL CHECK (dedication_type IN ('pattidana', 'dhamma_dana', 'community_service', 'study_offering')),
    title TEXT NOT NULL,
    dedication_text TEXT NOT NULL,
    linked_pin_potha_id TEXT,
    visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'public')),
    author_name TEXT DEFAULT 'Kalyanamitta Seeker',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.lab_dedications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own dedications" ON public.lab_dedications;
CREATE POLICY "Users manage own dedications"
ON public.lab_dedications FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can read public dedications" ON public.lab_dedications;
CREATE POLICY "Anyone can read public dedications"
ON public.lab_dedications FOR SELECT
TO anon, authenticated
USING (visibility = 'public');

-- 8. PUBLIC SCHOLAR/SEEKER PROFILES (Opt-in only)
CREATE TABLE IF NOT EXISTS public.lab_public_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    bio TEXT DEFAULT '',
    study_focus TEXT DEFAULT '',
    is_public BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.lab_public_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own public profile" ON public.lab_public_profiles;
CREATE POLICY "Users manage own public profile"
ON public.lab_public_profiles FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can read opted-in public profiles" ON public.lab_public_profiles;
CREATE POLICY "Anyone can read opted-in public profiles"
ON public.lab_public_profiles FOR SELECT
TO anon, authenticated
USING (is_public = true);
