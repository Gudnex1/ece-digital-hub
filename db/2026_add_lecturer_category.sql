-- Run this in the Supabase SQL editor (Dashboard → SQL) once.
-- Adds a category column so admins can classify each lecturer/staff member.

ALTER TABLE public.lecturers
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'permanent'
  CHECK (category IN ('permanent', 'adjunct', 'admin', 'technical'));

-- Recreate the public view to expose the new column
DROP VIEW IF EXISTS public.public_lecturers;
CREATE VIEW public.public_lecturers
WITH (security_invoker = true) AS
SELECT id, full_name, title, specialization, designation, qualifications,
       office, bio, profile_image_url, category, created_at, updated_at
FROM public.lecturers;
GRANT SELECT ON public.public_lecturers TO anon, authenticated;

-- Extend column-level grants so anon/authenticated can read category
GRANT SELECT (id, full_name, title, specialization, designation, qualifications,
              office, bio, profile_image_url, category, created_at, updated_at)
  ON public.lecturers TO anon, authenticated;