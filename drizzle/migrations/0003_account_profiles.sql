CREATE TABLE public.profiles (
 id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 display_name text NOT NULL DEFAULT '' CHECK (char_length(display_name) <= 100),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (display_name) ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_profile_read ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY own_profile_update ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE FUNCTION public.create_account_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
 INSERT INTO public.profiles(id, display_name) VALUES (NEW.id, left(coalesce(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', ''),100));
 RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.create_account_profile() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER create_account_profile AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.create_account_profile();
INSERT INTO public.profiles(id,display_name) SELECT id,left(coalesce(raw_user_meta_data->>'display_name',raw_user_meta_data->>'full_name',''),100) FROM auth.users ON CONFLICT(id) DO NOTHING;