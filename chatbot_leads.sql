-- Table for chatbot leads
CREATE TABLE IF NOT EXISTS chatbot_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    email TEXT,
    mobile TEXT,
    last_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE chatbot_leads ENABLE ROW LEVEL SECURITY;

-- Allow public to insert leads (to collect from guest users)
CREATE POLICY "Allow public insert chatbot_leads"
ON chatbot_leads FOR INSERT
TO public
WITH CHECK (true);

-- Allow admin to read leads
CREATE POLICY "Allow admin read chatbot_leads"
ON chatbot_leads FOR SELECT
TO authenticated
USING (true);
