#!/bin/bash

# SmartParent Landing Page Setup Script
# This script helps you set up your landing page for local development

echo "🤖 SmartParent Landing Page Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Check if Firebase configuration exists
if grep -q "your-api-key-here" js/firebase-config.js; then
    echo "⚠️  Firebase configuration needs to be updated!"
    echo ""
    echo "Next steps:"
    echo "1. Read FIREBASE_SETUP.md for detailed instructions"
    echo "2. Create a Firebase project at https://console.firebase.google.com/"
    echo "3. Update js/firebase-config.js with your Firebase credentials"
    echo "4. Set up Firestore database"
    echo "5. Configure Firestore security rules"
    echo ""
else
    echo "✅ Firebase configuration appears to be set up"
fi

# Check if analytics ID is configured
if grep -q "GA_MEASUREMENT_ID" index.html; then
    echo "⚠️  Google Analytics ID needs to be configured!"
    echo "   Replace 'GA_MEASUREMENT_ID' in index.html with your actual GA4 Measurement ID"
    echo ""
fi

echo "🌐 Starting local development server..."
echo ""

# Try different methods to serve the site
if command -v python3 &> /dev/null; then
    echo "Using Python 3 HTTP server..."
    echo "🚀 Your site will be available at: http://localhost:8000"
    echo "📝 Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "Using Python HTTP server..."
    echo "🚀 Your site will be available at: http://localhost:8000"
    echo "📝 Press Ctrl+C to stop the server"
    echo ""
    python -m http.server 8000
elif command -v npx &> /dev/null; then
    echo "Using npx serve..."
    echo "🚀 Your site will be available at the URL shown below"
    echo "📝 Press Ctrl+C to stop the server"
    echo ""
    npx serve .
else
    echo "❌ No suitable HTTP server found."
    echo "Please install Python or use 'npx serve .' to start a local server"
    echo ""
    echo "Alternative: Open index.html directly in your browser"
    echo "Note: Some features may not work without a proper HTTP server"
fi

echo ""
echo "📚 Documentation:"
echo "   - README.md - General overview and setup"
echo "   - FIREBASE_SETUP.md - Detailed Firebase configuration"
echo ""
echo "🔧 Next steps after configuration:"
echo "   1. Test all forms on your local site"
echo "   2. Deploy to Netlify or Firebase Hosting"
echo "   3. Set up environment variables for production"
echo "   4. Start driving traffic to validate your idea!"
echo ""
echo "💬 Need help? Contact: hello@smartparent.pl"