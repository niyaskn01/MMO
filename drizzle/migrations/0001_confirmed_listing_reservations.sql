ALTER TABLE public.booking_requests ADD COLUMN duration_unit text NOT NULL DEFAULT 'days';
ALTER TABLE public.booking_requests ADD CONSTRAINT booking_duration_unit CHECK (duration_unit IN ('days','hours'));
CREATE TABLE public.listing_reservations (
 request_id uuid PRIMARY KEY REFERENCES public.booking_requests(id) ON DELETE CASCADE,
 kind text NOT NULL CHECK (kind IN ('stay','companion')),
 listing_id text NOT NULL,
 start_date date NOT NULL,
 end_date date NOT NULL,
 CHECK (end_date > start_date)
);
GRANT SELECT (kind,listing_id,start_date,end_date) ON public.listing_reservations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listing_reservations TO authenticated;
GRANT ALL ON public.listing_reservations TO service_role;
ALTER TABLE public.listing_reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY public_reservation_dates ON public.listing_reservations FOR SELECT TO anon,authenticated USING (true);
CREATE POLICY admin_reservations ON public.listing_reservations FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE INDEX listing_reservations_dates ON public.listing_reservations(kind,listing_id,start_date,end_date);
CREATE OR REPLACE FUNCTION public.sync_listing_reservation() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE finish date;
BEGIN
 IF NEW.kind IN ('stay','companion') AND NEW.status IN ('Confirmed','Completed') THEN
  IF NEW.listing_id IS NULL OR NEW.travel_date IS NULL OR NEW.duration < 1 THEN RAISE EXCEPTION 'Choose a listing and travel dates before confirming.'; END IF;
  finish := NEW.travel_date + CASE WHEN NEW.duration_unit = 'hours' AND NEW.kind = 'companion' THEN greatest(1,ceil(NEW.duration::numeric / 24)::integer) ELSE NEW.duration END;
  PERFORM pg_advisory_xact_lock(hashtextextended(NEW.kind || ':' || NEW.listing_id,0));
  IF EXISTS (SELECT 1 FROM public.listing_reservations r WHERE r.kind=NEW.kind AND r.listing_id=NEW.listing_id AND r.request_id<>NEW.id AND r.start_date<finish AND r.end_date>NEW.travel_date) THEN
   RAISE EXCEPTION 'This listing is already assigned for the selected dates. Choose another listing or dates.';
  END IF;
  INSERT INTO public.listing_reservations(request_id,kind,listing_id,start_date,end_date) VALUES(NEW.id,NEW.kind,NEW.listing_id,NEW.travel_date,finish)
  ON CONFLICT(request_id) DO UPDATE SET kind=excluded.kind,listing_id=excluded.listing_id,start_date=excluded.start_date,end_date=excluded.end_date;
 ELSE
  DELETE FROM public.listing_reservations WHERE request_id=NEW.id;
 END IF;
 RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.sync_listing_reservation() FROM PUBLIC;
CREATE TRIGGER sync_booking_reservation AFTER INSERT OR UPDATE OF status,listing_id,kind,travel_date,duration,duration_unit ON public.booking_requests FOR EACH ROW EXECUTE FUNCTION public.sync_listing_reservation();
INSERT INTO public.listing_reservations(request_id,kind,listing_id,start_date,end_date)
SELECT id,kind,listing_id,travel_date,travel_date+duration FROM public.booking_requests WHERE kind IN ('stay','companion') AND status IN ('Confirmed','Completed') AND listing_id IS NOT NULL AND travel_date IS NOT NULL;
