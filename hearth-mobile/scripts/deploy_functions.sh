#!/bin/bash

# Deploy the 'push' function
echo "Deploying 'push' function to Supabase..."
npx supabase functions deploy push --no-verify-jwt

echo "Deployment complete! Make sure you have run 'npx supabase login' first if this failed."
