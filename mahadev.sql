-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  size TEXT NOT NULL,
  price NUMERIC NOT NULL,
  tag TEXT,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 100,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES auth.users(id),
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  guest_name TEXT,
  guest_phone TEXT,
  guest_address TEXT,
  guest_city TEXT,
  guest_pincode TEXT,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- POLICIES
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = customer_id OR customer_id IS NULL);
CREATE POLICY "Allow public and authenticated inserts" ON orders FOR INSERT WITH CHECK (true);
