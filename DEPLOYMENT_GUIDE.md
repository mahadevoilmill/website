# 🚀 Production Deployment & Payment Guide

This guide outlines the necessary steps to take your Mahadev Oil Mill website live.

## 1. Razorpay Configuration (Payments)
To accept real payments, you must replace the test keys with live ones.

### A. Get Your API Keys
1.  Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2.  Go to **Settings** > **API Keys**.
3.  **Test Mode**: Use the "Test Key ID" for development (no real money).
4.  **Live Mode**: Once your account is verified, switch to "Live Mode" and generate a "Live Key ID".

### B. Update the Code
In `src/App.tsx`, find the `handleCheckout` function and replace the placeholder:
```tsx
const options = {
  key: 'rzp_live_XXXXXXXXXXXXXX', // Replace with your actual Live Key ID
  amount: total * 100, 
  currency: 'INR',
  // ... rest of settings
};
```

---

## 2. Supabase Setup (Database)
Ensure your production database is ready to handle orders.

1.  **Run Schema**: Copy the contents of `mahadev.sql` and run it in the **Supabase SQL Editor** to create the `products`, `orders`, and `order_items` tables.
2.  **Product Images**: Update the `image_url` in the `products` table to point to your hosted images.
3.  **Row Level Security (RLS)**:
    *   `products`: Ensure "Allow public read access" policy is active.
    *   `orders`: Ensure "Allow public insert" policy is active for guest checkouts.

---

## 3. Deployment Steps (Vercel)
Vercel is highly recommended for Vite + React projects.

1.  **Push to GitHub**: Push your code to a GitHub repository.
2.  **Connect to Vercel**: Import your repository in Vercel.
3.  **Environment Variables**: In Vercel settings, add:
    *   `VITE_SUPABASE_URL`
    *   `VITE_SUPABASE_ANON_KEY`
4.  **Deploy**: Click Deploy to get your live URL.

---

## 4. Final Checklist Before Launch

- [ ] **Custom Domain**: Connect your domain (e.g., mahadevoilmill.com) in Vercel settings.
- [ ] **SSL**: Verify that the site is served over HTTPS (automatic on Vercel).
- [ ] **SEO**: Update the `<title>` and `<meta>` tags in `index.html`.
- [ ] **Favicon**: Replace `public/favicon.svg` with your brand icon.
- [ ] **Test Transaction**: Perform one full checkout in "Test Mode" to verify Supabase order logging.

---
*Created on: April 18, 2026*
