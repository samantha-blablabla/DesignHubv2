#!/bin/bash

# DesignHubV2 Deployment Script
# Auto-build and deploy to Cloudflare Pages

echo "🚀 Starting DesignHubV2 Deployment..."
echo ""

# Step 1: Build the project
echo "📦 Step 1/4: Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors and try again."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Step 2: Check if wrangler is installed
echo "🔍 Step 2/4: Checking Wrangler CLI..."
if ! command -v wrangler &> /dev/null; then
    echo "⚠️  Wrangler not found. Installing..."
    npm install -g wrangler
fi

echo "✅ Wrangler ready!"
echo ""

# Step 3: Deploy to Cloudflare Pages
echo "☁️  Step 3/4: Deploying to Cloudflare Pages..."
echo "Please make sure CLOUDFLARE_API_TOKEN is set in environment."
echo ""

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "⚠️  CLOUDFLARE_API_TOKEN not found!"
    echo "Please set it with: export CLOUDFLARE_API_TOKEN=your-token"
    echo ""
    echo "Or run manually:"
    echo "wrangler pages deployment create --project-name=designhubv2 --branch=main dist"
    exit 1
fi

wrangler pages deployment create --project-name=designhubv2 --branch=main dist

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo "✅ Site is now live at: https://designhubv2.pages.dev"
else
    echo ""
    echo "❌ Deployment failed!"
    echo "Please check your API token permissions."
fi

echo ""
echo "📋 Step 4/4: Done!"
