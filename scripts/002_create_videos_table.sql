-- Create videos table for storing uploaded videos
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_data TEXT NOT NULL, -- base64 encoded video data
  category TEXT DEFAULT 'Semua',
  duration INTEGER, -- duration in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a public gallery)
CREATE POLICY "Allow public read access to videos"
  ON public.videos FOR SELECT
  USING (true);

-- Create policies for insert/update/delete (admin only - we'll handle this in the app)
CREATE POLICY "Allow insert videos"
  ON public.videos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update videos"
  ON public.videos FOR UPDATE
  USING (true);

CREATE POLICY "Allow delete videos"
  ON public.videos FOR DELETE
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
