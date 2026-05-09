-- Update Orders Table to support Guest Checkout
ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_phone TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_city TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_pincode TEXT;

-- Update status constraint if needed (optional, depends on your existing setup)
-- ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
-- ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('pending', 'paid', 'pending_payment', 'shipped', 'delivered', 'cancelled'));

-- Update Policies to allow Guest Inserts
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
CREATE POLICY "Allow public and authenticated inserts" ON orders FOR INSERT WITH CHECK (true);
