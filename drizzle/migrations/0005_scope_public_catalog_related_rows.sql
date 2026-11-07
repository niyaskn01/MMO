ALTER POLICY public_reservation_dates ON public.listing_reservations
USING (
  (kind = 'stay' AND EXISTS (
    SELECT 1 FROM public.stays s
    WHERE s.id = listing_reservations.listing_id AND s.active = true
  ))
  OR (kind = 'companion' AND EXISTS (
    SELECT 1 FROM public.companions c
    WHERE c.id = listing_reservations.listing_id AND c.verification = 'Verified' AND c.age >= 18
  ))
);

ALTER POLICY public_reviews ON public.reviews
USING (
  EXISTS (
    SELECT 1 FROM public.stays s
    WHERE s.id = reviews.stay_id AND s.active = true
  )
  OR EXISTS (
    SELECT 1 FROM public.companions c
    WHERE c.id = reviews.companion_id AND c.verification = 'Verified' AND c.age >= 18
  )
);

ALTER POLICY public_destinations ON public.destinations
USING (
  EXISTS (
    SELECT 1 FROM public.stays s
    WHERE s.city = destinations.id AND s.active = true
  )
  OR EXISTS (
    SELECT 1 FROM public.companions c
    WHERE c.city = destinations.id AND c.verification = 'Verified' AND c.age >= 18
  )
);