ALTER TABLE public.batches
  ADD COLUMN IF NOT EXISTS grade TEXT,
  ADD COLUMN IF NOT EXISTS teacher_names TEXT[] NOT NULL DEFAULT '{}'::text[];

UPDATE public.batches
SET grade = 'Grade ' || substring(name FROM '(?:Grade|Batch)[[:space:]]*([0-9]{1,2})')
WHERE grade IS NULL
  AND substring(name FROM '(?:Grade|Batch)[[:space:]]*([0-9]{1,2})') IS NOT NULL;
