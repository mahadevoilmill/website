-- MAHADEV OIL MILL - DATABASE SCHEMA
-- Copy and paste this into your Supabase SQL Editor

-- 1. PRODUCTS TABLE
-- Stores the oil variants available for sale
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  size text NOT NULL,
  price numeric NOT NULL,
  tag text,
  image_url text,
  stock_quantity integer DEFAULT 100,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PROFILES TABLE
-- Extends Supabase Auth to store customer details
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  phone_number text,
  address_line text,
  city text,
  pincode text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 3. ORDERS TABLE
-- Tracks customer purchases
CREATE TABLE IF NOT EXISTS orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid REFERENCES auth.users,
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  payment_id text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORDER ITEMS TABLE
-- Links specific products to orders
CREATE TABLE IF NOT EXISTS order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  price_at_purchase numeric NOT NULL
);

-- 5. INITIAL DATA
-- Insert your starting products
INSERT INTO products (name, size, price, tag) 
VALUES 
('Cold Pressed Peanut Oil', '1 Litre', 210, 'Bestseller'),
('Cold Pressed Peanut Oil', '1 kg', 280, NULL),
('Cold Pressed Peanut Oil', '5 Litre', 980, 'Value Pack'),
('Cold Pressed Peanut Oil', '5 kg', 1400, NULL),
('Cold Pressed Peanut Oil', '15 Litre', 2850, 'Bulk Save'),
('Cold Pressed Peanut Oil', '15 kg', 3400, 'Bulk Save')
ON CONFLICT DO NOTHING;

-- 6. SECURITY (Row Level Security)
-- This ensures the app can read products but not edit them without permission

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Product Policies: Everyone can view products
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);

-- Profile Policies: Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Order Policies: Users can only see their own orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
