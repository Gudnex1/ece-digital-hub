-- Run in Supabase SQL editor.
ALTER TABLE public.lecturers
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS research_interests text,
  ADD COLUMN IF NOT EXISTS postgraduate_supervision text,
  ADD COLUMN IF NOT EXISTS google_scholar_url text,
  ADD COLUMN IF NOT EXISTS researchgate_url text;

DROP VIEW IF EXISTS public.public_lecturers;
CREATE VIEW public.public_lecturers
WITH (security_invoker = true) AS
SELECT id, full_name, title, specialization, designation, qualifications,
       office, bio, profile_image_url, category, address,
       research_interests, postgraduate_supervision,
       google_scholar_url, researchgate_url, created_at, updated_at
FROM public.lecturers;
GRANT SELECT ON public.public_lecturers TO anon, authenticated;

GRANT SELECT (id, full_name, title, specialization, designation, qualifications,
              office, bio, profile_image_url, category, address,
              research_interests, postgraduate_supervision,
              google_scholar_url, researchgate_url, created_at, updated_at)
  ON public.lecturers TO anon, authenticated;
