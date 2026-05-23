-- Table for full chatbot message history
CREATE TABLE IF NOT EXISTS chatbot_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    sender TEXT NOT NULL, -- 'user' or 'bot'
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster retrieval by session
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_session ON chatbot_messages(session_id);

-- Enable RLS
ALTER TABLE chatbot_messages ENABLE ROW LEVEL SECURITY;

-- Allow public to insert messages (to log guest chats)
CREATE POLICY "Allow public insert chatbot_messages"
ON chatbot_messages FOR INSERT
TO public
WITH CHECK (true);

-- Allow admin to read messages
CREATE POLICY "Allow admin read chatbot_messages"
ON chatbot_messages FOR SELECT
TO authenticated
USING (true);

-- Update chatbot_leads to include session_id for linking
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chatbot_leads' AND column_name='session_id') THEN
        ALTER TABLE chatbot_leads ADD COLUMN session_id TEXT;
    END IF;
END $$;
