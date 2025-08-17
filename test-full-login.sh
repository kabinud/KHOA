#!/bin/bash

echo "=== Testing Complete Login Flow ==="

# Step 1: Login
echo "1. Performing login..."
LOGIN_RESPONSE=$(curl -s -X POST "https://3000-i9t4opu503bw4101dskwh-6532622b.e2b.dev/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin.garden@kenyahoa.com","password":"demo123"}')

echo "Login successful: $(echo "$LOGIN_RESPONSE" | grep -o '"success":true' | wc -l)"

# Step 2: Check dashboard access
echo ""
echo "2. Accessing dashboard..."
DASHBOARD_RESPONSE=$(curl -s "https://3000-i9t4opu503bw4101dskwh-6532622b.e2b.dev/dashboard")

echo "Dashboard HTML length: $(echo "$DASHBOARD_RESPONSE" | wc -c)"

# Check if it's a 404 or proper HTML
if echo "$DASHBOARD_RESPONSE" | grep -q "Page Not Found\|404"; then
  echo "❌ Dashboard shows 404 error"
  echo "Dashboard response: $(echo "$DASHBOARD_RESPONSE" | head -5)"
else
  echo "✅ Dashboard loads properly"
  echo "Title: $(echo "$DASHBOARD_RESPONSE" | grep -o '<title>[^<]*</title>')"
fi

# Step 3: Check for any redirects or errors in browser context
echo ""
echo "3. Testing browser behavior..."
