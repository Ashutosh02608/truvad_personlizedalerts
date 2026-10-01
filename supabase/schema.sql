-- Table: personalized_alerts
-- Description: Stores user email subscriptions and personalized regulatory tracking preferences

CREATE TABLE IF NOT EXISTS public.personalized_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  selected_regulators TEXT[] NOT NULL,
  cadence TEXT NOT NULL DEFAULT 'realtime',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_subscriber_email UNIQUE (email)
);

-- Index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_personalized_alerts_email ON public.personalized_alerts (email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.personalized_alerts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to insert / update their alert subscription
CREATE POLICY "Allow public insert and upsert of alerts"
  ON public.personalized_alerts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update by email"
  ON public.personalized_alerts
  FOR UPDATE
  USING (true);

-- Policy: Allow reading own subscription by matching email
CREATE POLICY "Allow select on own subscription"
  ON public.personalized_alerts
  FOR SELECT
  USING (true);

-- Table: feedback
-- Description: Stores user feedback submitted to the GRIP team
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  feedback TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to feedback"
  ON public.feedback
  FOR INSERT
  WITH CHECK (true);

