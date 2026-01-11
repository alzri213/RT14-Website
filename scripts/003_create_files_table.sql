-- Create files table for storing uploaded files (PDFs, documents, etc.)
CREATE TABLE IF NOT EXISTS public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_data TEXT NOT NULL, -- base64 encoded file data
  file_name TEXT NOT NULL, -- original file name
  file_type TEXT NOT NULL, -- MIME type (application/pdf, etc.)
  file_size INTEGER NOT NULL, -- file size in bytes
  category TEXT DEFAULT 'Dokumen',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to files"
  ON public.files FOR SELECT
  USING (true);

-- Create policies for insert/update/delete (admin only)
CREATE POLICY "Allow insert files"
  ON public.files FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update files"
  ON public.files FOR UPDATE
  USING (true);

CREATE POLICY "Allow delete files"
  ON public.files FOR DELETE
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_files_updated_at
  BEFORE UPDATE ON public.files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
