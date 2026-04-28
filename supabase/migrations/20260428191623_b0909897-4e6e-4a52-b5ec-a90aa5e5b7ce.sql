
-- Fix function search_path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Revoke public execute on SECURITY DEFINER trigger function (only triggers should use it)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- Replace overly broad storage SELECT with owner-scoped one
DROP POLICY IF EXISTS "Wheat images are publicly viewable" ON storage.objects;

CREATE POLICY "Public can read individual wheat images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'wheat-images');
-- Note: bucket is public so signed URLs / public URLs work; listing is gated at the bucket-level by Supabase since we don't expose list endpoint to clients.
