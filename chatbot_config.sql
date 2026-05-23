-- Table for chatbot configuration
CREATE TABLE IF NOT EXISTS chatbot_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE chatbot_config ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access to chatbot_config"
ON chatbot_config FOR SELECT
TO public
USING (true);

-- Admin only write access (Replace with actual admin email or role if needed)
-- For now, we allow authenticated users to update if they are admins (logic handled in app, but schema can be stricter)
CREATE POLICY "Allow admin to update chatbot_config"
ON chatbot_config FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert initial values
INSERT INTO chatbot_config (key, value, description) VALUES
('welcome_message', 'Namaste! 🙏 Welcome to Mahadev Oil Mill. How can I help you today?', 'Message shown when chat opens'),
('bot_name', 'Mill Assistant', 'Name shown in the chat header'),
('response_price', 'Our Cold Pressed Groundnut Oil starts at ₹210 per litre. We also have 5L, 15L and bulk packs available. You can see all prices in the ''Shop'' section!', 'Response for pricing inquiries'),
('response_delivery', 'We provide fast delivery across India. Shipping is FREE for most orders! You can track your order using the ''Track Order'' link in the menu.', 'Response for delivery inquiries'),
('response_purity', 'At Mahadev Oil Mill, we use traditional cold pressing. No heat, no chemicals, no preservatives. 100% pure goodness! 🌿', 'Response for quality/purity inquiries'),
('response_contact', 'You can reach us at +91 98799 44395. Or click the green WhatsApp button to chat with Rakesh directly!', 'Response for contact inquiries'),
('response_location', 'We are located in Vasad, Gujarat. Our address is 902, Nagardas ni Khadki, Near Ramji Mandir, Vasad 388306.', 'Response for location inquiries'),
('response_fallback', 'I''m not sure I understand that. Would you like to check our products, delivery info, or talk to a human on WhatsApp?', 'Response when no keywords match')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
