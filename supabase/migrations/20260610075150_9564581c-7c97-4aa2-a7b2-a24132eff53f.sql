CREATE TABLE public.job_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL UNIQUE,
  base_median NUMERIC NOT NULL,
  demand TEXT NOT NULL,
  openings INTEGER NOT NULL DEFAULT 0,
  top_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  salary_by_location JSONB NOT NULL DEFAULT '{}'::jsonb,
  salary_by_experience JSONB NOT NULL DEFAULT '{}'::jsonb,
  trend JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.job_roles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_roles TO authenticated;
GRANT ALL ON public.job_roles TO service_role;

ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read job roles"
ON public.job_roles FOR SELECT
USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_job_roles_updated_at
BEFORE UPDATE ON public.job_roles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();