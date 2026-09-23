#!/bin/bash

# PDFNova Firebase Deployment Script
# Run this script to deploy your site to Firebase

echo "🚀 PDFNova Firebase Deployment"
echo "================================"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
    echo "✅ Firebase CLI installed"
else
    echo "✅ Firebase CLI found"
fi

# Check if logged in
echo ""
echo "Checking Firebase login status..."
firebase login:list > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "🔐 Please login to Firebase..."
    firebase login
fi

# Build the project
echo ""
echo "📦 Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi
echo "✅ Build successful"

# Deploy
echo ""
echo "🚀 Deploying to Firebase..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "Your site is live at:"
    echo "  - https://your-project-id.web.app"
    echo "  - https://your-project-id.firebaseapp.com"
    echo ""
    echo "Replace 'your-project-id' with your actual Firebase project ID"
else
    echo ""
    echo "❌ Deployment failed. Check the error messages above."
    exit 1
fi
