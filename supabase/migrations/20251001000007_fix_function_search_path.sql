-- Ensure update_updated_at_column function uses a fixed search_path for security
-- Ref: Supabase lint warning function_search_path_mutable

ALTER FUNCTION public.update_updated_at_column()
SET search_path = public, pg_temp;
