-- Create visits table for visitor tracking
CREATE TABLE IF NOT EXISTS visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent TEXT,
  session_id TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for visitor tracking)
CREATE POLICY "Allow public inserts to visits" ON visits
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow authenticated users to read visits
CREATE POLICY "Allow authenticated users to read visits" ON visits
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index on timestamp for efficient queries
CREATE INDEX IF NOT EXISTS idx_visits_timestamp ON visits (timestamp);

-- Create index on session_id for unique visitor calculations
CREATE INDEX IF NOT EXISTS idx_visits_session_id ON visits (session_id);
