-- =============================================================================
-- 45-Day Interview Prep OS - Supabase Database Schema
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =============================================================================

-- 1. Create table for persisting user prep state
CREATE TABLE IF NOT EXISTS public.user_prep_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    state_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    version INTEGER NOT NULL DEFAULT 1,
    client_updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT user_prep_state_user_id_key UNIQUE (user_id)
);

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_prep_state_user_id ON public.user_prep_state(user_id);
CREATE INDEX IF NOT EXISTS idx_user_prep_state_updated_at ON public.user_prep_state(updated_at DESC);

-- 3. Trigger to maintain updated_at column
CREATE OR REPLACE FUNCTION public.handle_prep_state_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_user_prep_state_updated_at ON public.user_prep_state;
CREATE TRIGGER tr_user_prep_state_updated_at
    BEFORE UPDATE ON public.user_prep_state
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_prep_state_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.user_prep_state ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies: Ensure users can ONLY access and modify their own state
DROP POLICY IF EXISTS "Users can read own prep state" ON public.user_prep_state;
CREATE POLICY "Users can read own prep state"
    ON public.user_prep_state
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own prep state" ON public.user_prep_state;
CREATE POLICY "Users can insert own prep state"
    ON public.user_prep_state
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own prep state" ON public.user_prep_state;
CREATE POLICY "Users can update own prep state"
    ON public.user_prep_state
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6. Enable Realtime replication for cross-device sync
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'user_prep_state'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_prep_state;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Gracefully continue if replication publication is managed differently
        RAISE NOTICE 'Notice: Could not automatically attach to supabase_realtime publication: %', SQLERRM;
END $$;

-- 7. Create table for purchase activation passes and 4-digit PINs
CREATE TABLE IF NOT EXISTS public.access_passes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    pin VARCHAR(6) NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    used_at TIMESTAMPTZ,
    CONSTRAINT access_passes_email_pin_key UNIQUE (email, pin)
);

CREATE INDEX IF NOT EXISTS idx_access_passes_email ON public.access_passes(email);
CREATE INDEX IF NOT EXISTS idx_access_passes_pin ON public.access_passes(pin);

ALTER TABLE public.access_passes ENABLE ROW LEVEL SECURITY;

-- Allow anon and authenticated to insert generated PINs and verify their PIN
DROP POLICY IF EXISTS "Anyone can insert access pass" ON public.access_passes;
CREATE POLICY "Anyone can insert access pass"
    ON public.access_passes
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can verify access pass" ON public.access_passes;
CREATE POLICY "Anyone can verify access pass"
    ON public.access_passes
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can update access pass" ON public.access_passes;
CREATE POLICY "Users can update access pass"
    ON public.access_passes
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

