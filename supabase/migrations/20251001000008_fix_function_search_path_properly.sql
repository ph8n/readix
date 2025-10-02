-- Properly fix function search_path security issue
-- Recreate function with SET search_path parameter inline
-- Ref: Supabase lint warning function_search_path_mutable

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;