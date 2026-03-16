-- Create the system_logs table
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    action TEXT NOT NULL,
    details TEXT,
    user_email TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to insert logs
DROP POLICY IF EXISTS "Allow authenticated users to insert logs" ON public.system_logs;
CREATE POLICY "Allow authenticated users to insert logs" 
ON public.system_logs 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Policy: Allow authenticated users to view logs
DROP POLICY IF EXISTS "Allow authenticated users to view logs" ON public.system_logs;
CREATE POLICY "Allow authenticated users to view logs" 
ON public.system_logs 
FOR SELECT 
TO authenticated 
USING (true);

-- Grant access to the anon and authenticated roles
GRANT ALL ON public.system_logs TO authenticated;
GRANT ALL ON public.system_logs TO anon;
GRANT ALL ON public.system_logs TO service_role;

-- Storage Setup
-- Note: These might fail if run without enough permissions, but usually work in the SQL editor.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('sales_bills', 'sales_bills', true),
       ('announcements', 'announcements', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for sales_bills bucket
DROP POLICY IF EXISTS "Public Access for sales_bills" ON storage.objects;
CREATE POLICY "Public Access for sales_bills" ON storage.objects FOR SELECT USING (bucket_id = 'sales_bills');

DROP POLICY IF EXISTS "Authenticated users can upload sales bills" ON storage.objects;
CREATE POLICY "Authenticated users can upload sales bills" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'sales_bills');

-- RLS for announcements bucket
DROP POLICY IF EXISTS "Public Access for announcements" ON storage.objects;
CREATE POLICY "Public Access for announcements" ON storage.objects FOR SELECT USING (bucket_id = 'announcements');

DROP POLICY IF EXISTS "Authenticated users can upload announcements" ON storage.objects;
CREATE POLICY "Authenticated users can upload announcements" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'announcements');
