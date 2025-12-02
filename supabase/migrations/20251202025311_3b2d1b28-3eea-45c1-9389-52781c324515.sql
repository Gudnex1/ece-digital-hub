-- Update lecturers table with new fields
ALTER TABLE public.lecturers 
ADD COLUMN IF NOT EXISTS designation text,
ADD COLUMN IF NOT EXISTS qualifications text;

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('lecturer-profiles', 'lecturer-profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for lecturer profile pictures
CREATE POLICY "Public can view lecturer profile pictures"
ON storage.objects FOR SELECT
USING (bucket_id = 'lecturer-profiles');

CREATE POLICY "Admins can upload lecturer profile pictures"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'lecturer-profiles' 
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update lecturer profile pictures"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'lecturer-profiles' 
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete lecturer profile pictures"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'lecturer-profiles' 
  AND has_role(auth.uid(), 'admin')
);

-- Update lecturers RLS policies to be admin-controlled
DROP POLICY IF EXISTS "Lecturers can insert their own profile" ON public.lecturers;
DROP POLICY IF EXISTS "Lecturers can update their own profile" ON public.lecturers;

CREATE POLICY "Admins can insert lecturer profiles"
ON public.lecturers FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update lecturer profiles"
ON public.lecturers FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lecturer profiles"
ON public.lecturers FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Create research_areas table
CREATE TABLE IF NOT EXISTS public.research_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text,
  projects text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.research_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view research areas"
ON public.research_areas FOR SELECT
USING (true);

CREATE POLICY "Admins can manage research areas"
ON public.research_areas FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_research_areas_updated_at
BEFORE UPDATE ON public.research_areas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();