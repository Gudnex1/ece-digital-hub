
-- 1) Private schema + new has_role
CREATE SCHEMA IF NOT EXISTS private;
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 2) Drop ALL policies that reference public.has_role so we can drop it
DROP POLICY IF EXISTS "Admins can manage all lecturer profiles" ON public.lecturers;
DROP POLICY IF EXISTS "Admins can insert lecturer profiles" ON public.lecturers;
DROP POLICY IF EXISTS "Admins can update lecturer profiles" ON public.lecturers;
DROP POLICY IF EXISTS "Admins can delete lecturer profiles" ON public.lecturers;
DROP POLICY IF EXISTS "Everyone can view lecturers" ON public.lecturers;

DROP POLICY IF EXISTS "Admins can manage research areas" ON public.research_areas;

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Admins can upload lecturer profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update lecturer profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete lecturer profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Public can view lecturer profile pictures" ON storage.objects;

-- 3) Drop old function
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- 4) Recreate policies using private.has_role, scoped to authenticated
CREATE POLICY "Admins can view lecturers" ON public.lecturers FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert lecturers" ON public.lecturers FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update lecturers" ON public.lecturers FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete lecturers" ON public.lecturers FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert research areas" ON public.research_areas FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update research areas" ON public.research_areas FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete research areas" ON public.research_areas FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can list lecturer profile pictures" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'lecturer-profiles' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can upload lecturer profile pictures" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'lecturer-profiles' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update lecturer profile pictures" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'lecturer-profiles' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete lecturer profile pictures" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'lecturer-profiles' AND private.has_role(auth.uid(), 'admin'));

-- 5) Public directory view exposing only safe columns (no email/phone)
CREATE OR REPLACE VIEW public.public_lecturers
WITH (security_invoker = false) AS
SELECT id, full_name, title, specialization, designation, qualifications,
       office, bio, profile_image_url, created_at, updated_at
FROM public.lecturers;
GRANT SELECT ON public.public_lecturers TO anon, authenticated;

-- 6) Revoke anon discoverability
REVOKE SELECT ON public.profiles FROM anon;
REVOKE SELECT ON public.user_roles FROM anon;
REVOKE SELECT ON public.lecturers FROM anon;
