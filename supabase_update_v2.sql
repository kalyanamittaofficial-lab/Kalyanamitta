-- 1. Create a Sequence to auto-generate numbers (starts from 1)
CREATE SEQUENCE IF NOT EXISTS kalyanamitta_id_seq START 1;

-- 2. Update or Create the complete_onboarding RPC
-- This function is called by the React frontend when a user finishes the form
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
) RETURNS VOID AS $$
DECLARE
    new_km_id TEXT;
    year_part TEXT;
    seq_part TEXT;
BEGIN
    -- Generate the Unique KM ID (e.g., KM-KALYANAMIT-2026-0001)
    year_part := to_char(CURRENT_DATE, 'YYYY');
    seq_part := lpad(nextval('kalyanamitta_id_seq')::TEXT, 4, '0');
    new_km_id := 'KM-KALYANAMIT-' || year_part || '-' || seq_part;

    -- Update the user's profile with the new ID and all form data
    UPDATE public.profiles
    SET 
        name = p_name,
        mobile_number = p_mobile,
        country = p_country,
        state_district = p_state,
        native_language = p_language,
        dob = p_dob,
        marital_status = p_marital,
        family_details = p_family,
        education_profession = p_education,
        interest_level = p_interest,
        current_dedication = p_current,
        potential_dedication = p_potential,
        status = 'active', -- Changes status from 'pending_onboarding'
        kalyanamitta_id = new_km_id
    WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Create a Secure Function for Superadmins to Assign Roles
-- This avoids the Infinite Recursion RLS issue!
CREATE OR REPLACE FUNCTION public.assign_admin_role(p_user_id UUID, p_role TEXT)
RETURNS VOID AS $$
DECLARE
    is_super BOOLEAN;
BEGIN
    -- Check if the current logged-in user is a superadmin
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE id = auth.uid() AND role = 'superadmin'
    ) INTO is_super;

    IF NOT is_super THEN
        RAISE EXCEPTION 'Unauthorized: Only superadmins can assign roles';
    END IF;

    -- Insert or Update the target user's role
    INSERT INTO public.user_roles (id, role)
    VALUES (p_user_id, p_role)
    ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
