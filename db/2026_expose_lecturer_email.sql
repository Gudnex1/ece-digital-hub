-- Re-expose email on lecturers for public site so it can display on profile modal.
GRANT SELECT (email) ON public.lecturers TO anon, authenticated;

DROP VIEW IF EXISTS public.public_lecturers;
CREATE VIEW public.public_lecturers
WITH (security_invoker = true) AS
SELECT id, full_name, title, specialization, designation, qualifications,
       office, bio, profile_image_url, category, address, email,
       research_interests, postgraduate_supervision,
       google_scholar_url, researchgate_url, created_at, updated_at
FROM public.lecturers;
GRANT SELECT ON public.public_lecturers TO anon, authenticated;