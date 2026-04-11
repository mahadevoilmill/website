#!/bin/bash

# Test Database Connection Script
# Run this after setting up the database in Supabase

echo "🧪 Testing Database Connection..."
echo "================================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    exit 1
fi

echo "✅ .env file found"

# Check Supabase credentials
if grep -q "VITE_SUPABASE_URL" .env && grep -q "VITE_SUPABASE_ANON_KEY" .env; then
    echo "✅ Supabase credentials configured"
else
    echo "❌ Supabase credentials missing in .env"
    exit 1
fi

# Test the website
echo ""
echo "🌐 Starting development server..."
npm run dev > /dev/null 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Check if server is running
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Development server running on http://localhost:5173"
    echo ""
    echo "📋 Manual Testing Steps:"
    echo "1. Open http://localhost:5173 in your browser"
    echo "2. Check if products load in the Products section"
    echo "3. Look for 'Loading products...' then actual products"
    echo "4. Check browser console (F12) for any errors"
    echo ""
    echo "🛑 To stop the server: kill $SERVER_PID"
else
    echo "❌ Development server failed to start"
    echo "💡 Try running 'npm run dev' manually to see error messages"
fi

echo ""
echo "🔍 Expected Results:"
echo "- Products section should show 3 oil products"
echo "- No console errors related to Supabase"
echo "- Smooth loading without 'credentials not found' warnings"