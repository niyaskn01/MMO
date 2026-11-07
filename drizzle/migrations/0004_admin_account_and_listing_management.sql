CREATE OR REPLACE FUNCTION public.admin_account_directory()
RETURNS TABLE(id uuid, display_name text, email text, admin boolean)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
 IF NOT public.is_admin() THEN RAISE EXCEPTION 'Administrator access required'; END IF;
 RETURN QUERY SELECT u.id, coalesce(p.display_name,''), u.email::text, EXISTS(SELECT 1 FROM public.user_roles r WHERE r.user_id=u.id AND r.role='admin') FROM auth.users u LEFT JOIN public.profiles p ON p.id=u.id ORDER BY u.created_at;
END; $$;
REVOKE ALL ON FUNCTION public.admin_account_directory() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_account_directory() TO authenticated;
CREATE OR REPLACE FUNCTION public.admin_set_account_role(target_user uuid, make_admin boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
 PERFORM pg_advisory_xact_lock(hashtextextended('administrator-role-management',0));
 IF NOT public.is_admin() THEN RAISE EXCEPTION 'Administrator access required'; END IF;
 IF NOT EXISTS(SELECT 1 FROM auth.users WHERE id=target_user) THEN RAISE EXCEPTION 'Account not found'; END IF;
 IF make_admin THEN
  IF NOT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=target_user AND role='admin') THEN INSERT INTO public.user_roles(user_id,role) VALUES(target_user,'admin'); END IF;
 ELSE
  IF target_user=auth.uid() THEN RAISE EXCEPTION 'You cannot remove your own administrator access'; END IF;
  IF (SELECT count(DISTINCT user_id) FROM public.user_roles WHERE role='admin')<=1 AND EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=target_user AND role='admin') THEN RAISE EXCEPTION 'At least one administrator must remain'; END IF;
  DELETE FROM public.user_roles WHERE user_id=target_user AND role='admin';
 END IF;
END; $$;
REVOKE ALL ON FUNCTION public.admin_set_account_role(uuid,boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_account_role(uuid,boolean) TO authenticated;
CREATE OR REPLACE FUNCTION public.admin_delete_listing(listing_kind text, target_id text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
 IF NOT public.is_admin() THEN RAISE EXCEPTION 'Administrator access required'; END IF;
 IF listing_kind NOT IN ('stay','companion') THEN RAISE EXCEPTION 'Invalid listing type'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(listing_kind || ':' || target_id,0));
 IF EXISTS(SELECT 1 FROM public.listing_reservations WHERE kind=listing_kind AND listing_id=target_id AND end_date>CURRENT_DATE) THEN RAISE EXCEPTION 'Cancel current or upcoming assignments before deleting this listing, or mark it inactive'; END IF;
 DELETE FROM public.listing_reservations WHERE kind=listing_kind AND listing_id=target_id;
 IF listing_kind='stay' THEN
  UPDATE public.reviews SET stay_id=NULL WHERE stay_id=target_id;
  DELETE FROM public.stays WHERE id=target_id;
 ELSE
  UPDATE public.reviews SET companion_id=NULL WHERE companion_id=target_id;
  DELETE FROM public.companions WHERE id=target_id;
 END IF;
END; $$;
REVOKE ALL ON FUNCTION public.admin_delete_listing(text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_listing(text,text) TO authenticated;