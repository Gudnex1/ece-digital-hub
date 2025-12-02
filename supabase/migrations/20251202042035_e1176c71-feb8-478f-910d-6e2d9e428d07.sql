-- Allow multiple lecturers per admin and avoid duplicate user_id constraint
ALTER TABLE public.lecturers
  ALTER COLUMN user_id SET DEFAULT gen_random_uuid();

ALTER TABLE public.lecturers
  DROP CONSTRAINT IF EXISTS lecturers_user_id_key;