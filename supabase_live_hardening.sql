-- Apply this once to an existing Supabase project.
-- It preserves the current live_broadcast data and admin workflow.

DROP POLICY IF EXISTS "Allow authenticated update on live_broadcast"
ON public.live_broadcast;

DROP POLICY IF EXISTS "Allow admin update on live_broadcast"
ON public.live_broadcast;

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

CREATE POLICY "Allow admin update on live_broadcast"
ON public.live_broadcast FOR UPDATE
TO authenticated
USING (
    public.has_live_broadcast_admin_role()
)
WITH CHECK (
    public.has_live_broadcast_admin_role()
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
          AND schemaname = 'public'
          AND tablename = 'live_broadcast'
    ) THEN
        EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.live_broadcast';
    END IF;
END
$$;
