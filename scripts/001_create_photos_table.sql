-- Create photos table for storing uploaded photos
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_data TEXT NOT NULL, -- base64 encoded image data
  category TEXT DEFAULT 'Semua',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a public gallery)
CREATE POLICY "Allow public read access to photos" 
  ON public.photos FOR SELECT 
  USING (true);

-- Create policies for insert/update/delete (admin only - we'll handle this in the app)
CREATE POLICY "Allow insert photos" 
  ON public.photos FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow update photos" 
  ON public.photos FOR UPDATE 
  USING (true);

CREATE POLICY "Allow delete photos" 
  ON public.photos FOR DELETE 
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_photos_updated_at 
  BEFORE UPDATE ON public.photos 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
