#!/bin/bash

echo "=== Testing Manual Login Flow ==="
echo "1. Testing Garden Admin Login..."

# Login and capture response
RESPONSE=$(curl -s -X POST "https://3000-i9t4opu503bw4101dskwh-6532622b.e2b.dev/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin.garden@kenyahoa.com","password":"demo123"}')

echo "Login Response:"
echo "$RESPONSE" | head -5

# Extract token (if successful)
TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo ""
  echo "2. Token extracted successfully: ${TOKEN:0:50}..."
  
  echo ""  
  echo "3. Testing dashboard access with token..."
  
  # Test dashboard with token
  DASHBOARD_RESPONSE=$(curl -s "https://3000-i9t4opu503bw4101dskwh-6532622b.e2b.dev/dashboard")
  
  echo "Dashboard HTML length: $(echo "$DASHBOARD_RESPONSE" | wc -c) characters"
  echo "Dashboard title: $(echo "$DASHBOARD_RESPONSE" | grep -o '<title>[^<]*</title>')"
  
else
  echo "❌ Login failed - no token found"
fi
