
-- Recreate view as security invoker
DROP VIEW IF EXISTS public.public_lecturers;
CREATE VIEW public.public_lecturers
WITH (security_invoker = true) AS
SELECT id, full_name, title, specialization, designation, qualifications,
       office, bio, profile_image_url, created_at, updated_at
FROM public.lecturers;
GRANT SELECT ON public.public_lecturers TO anon, authenticated;

-- Column-level grants: anon/authenticated can only read safe columns from lecturers
GRANT SELECT (id, full_name, title, specialization, designation, qualifications,
              office, bio, profile_image_url, created_at, updated_at)
  ON public.lecturers TO anon, authenticated;

-- Permissive SELECT policy (column privileges enforce which columns are readable)
CREATE POLICY "Public can read lecturer directory" ON public.lecturers
  FOR SELECT TO anon, authenticated USING (true);
