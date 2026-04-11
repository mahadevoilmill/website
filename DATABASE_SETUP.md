# 🗄️ Database Setup Guide for Mahadev Oil Mill

## ✅ Current Status
- **Supabase Project**: Already configured ✅
- **Environment Variables**: Set up in `.env` ✅
- **Database Schema**: Ready in `mahadev.sql` ✅

## 🚀 Next Steps: Set Up Database

### Step 1: Access Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Open your project: `rmyzuqhiotueivvkokvd`

### Step 2: Run Database Schema
1. In Supabase Dashboard, go to **SQL Editor**
2. Copy the entire contents of `mahadev.sql`
3. Paste it into the SQL Editor
4. Click **Run** (or press Ctrl+Enter)

### Step 3: Verify Setup
After running the SQL, you should see:
- ✅ Tables created: `products`, `profiles`, `orders`, `order_items`
- ✅ Initial data inserted (3 oil products)
- ✅ Row Level Security enabled

---

## 📊 Database Structure

### Products Table
```sql
- id (uuid, primary key)
- name (text) - e.g., "Cold Pressed Groundnut Oil"
- size (text) - e.g., "1 Litre", "5 Litre"
- price (numeric) - e.g., 210, 980
- tag (text) - e.g., "Bestseller", "Value Pack"
- image_url (text) - optional
- stock_quantity (integer) - default 100
- created_at (timestamp)
```

### Initial Products
1. **Cold Pressed Groundnut Oil** - 1 Litre - ₹210 - "Bestseller"
2. **Cold Pressed Groundnut Oil** - 5 Litre - ₹980 - "Value Pack"
3. **Cold Pressed Groundnut Oil** - 15 kg - ₹2850 - "Bulk Save"

### Security Features
- **Row Level Security (RLS)** enabled on all tables
- **Public read access** to products (anyone can view)
- **User-specific access** to profiles and orders
- **Secure authentication** through Supabase Auth

---

## 🔧 Testing Database Connection

After setting up the database, test it by running:

```bash
npm run dev
```

The website should now:
- ✅ Load products from database
- ✅ Display them in the Products section
- ✅ Show "Loading products..." then actual products

---

## 📱 Database Features

### For Customers
- **View Products**: Browse all available oils
- **User Profiles**: Store delivery addresses
- **Order History**: Track past purchases
- **Secure Checkout**: Protected payment flow

### For Admin (Future)
- **Product Management**: Add/edit/delete products
- **Order Management**: View and update orders
- **Inventory Tracking**: Monitor stock levels
- **Analytics**: Sales reports and insights

---

## 🛠️ Troubleshooting

### Problem: "Supabase credentials not found"
**Solution**: Check `.env` file has correct values

### Problem: Products not loading
**Solution**: 
1. Verify SQL was executed in Supabase
2. Check browser console for errors
3. Ensure RLS policies are active

### Problem: Cannot access Supabase Dashboard
**Solution**: 
1. Make sure you're signed in
2. Check project URL: `rmyzuqhiotueivvkokvd`
3. Contact support if access issues

---

## 📋 SQL Commands Summary

The `mahadev.sql` file contains:
- ✅ Table creation (4 tables)
- ✅ Initial product data (3 products)
- ✅ Row Level Security policies
- ✅ Foreign key relationships

**Total execution time**: ~2-3 seconds in Supabase SQL Editor

---

## 🎯 Next Steps After Database Setup

1. **Test the website** - Products should load from database
2. **Add more products** - Use Supabase Table Editor
3. **Set up authentication** - For user registration/login
4. **Implement cart functionality** - Add to cart, checkout
5. **Add payment integration** - Razorpay/Stripe

---

## 💡 Pro Tips

- **Backup regularly**: Export your database schema
- **Monitor usage**: Check Supabase dashboard for analytics
- **Optimize queries**: Use Supabase's built-in caching
- **Scale as needed**: Supabase handles growth automatically

---

**Ready to set up the database?** Just run the SQL in your Supabase dashboard! 🚀
