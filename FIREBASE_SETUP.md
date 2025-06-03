# Firebase Setup Guide for SmartParent Landing Page

This guide will help you set up Firebase Firestore database for your landing page validation data collection.

## Prerequisites

- Google account
- Basic understanding of web development
- Node.js installed (for local development)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `smartparent-landing` (or your preferred name)
4. Choose whether to enable Google Analytics (recommended for tracking)
5. If Analytics enabled, select or create Analytics account
6. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project console, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you'll secure it later)
4. Select a location for your database (choose closest to your users, e.g., `europe-west` for Europe)
5. Click "Done"

## Step 3: Set up Authentication (Optional but Recommended)

1. Go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Anonymous" authentication (for basic spam protection)

## Step 4: Configure Web App

1. In Firebase project overview, click on the "Web" icon (`</>`)
2. Register your app with nickname: `smartparent-web`
3. Check "Also set up Firebase Hosting" if you want to use Firebase hosting instead of Netlify
4. Copy the Firebase configuration object - you'll need these values:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Update Your Code

1. Open `js/firebase-config.js`
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Your actual API key
  authDomain: "smartparent-landing.firebaseapp.com", // Your actual domain
  projectId: "smartparent-landing", // Your actual project ID
  storageBucket: "smartparent-landing.appspot.com", // Your actual storage bucket
  messagingSenderId: "123456789", // Your actual sender ID
  appId: "1:123456789:web:abc123def456" // Your actual app ID
};
```

## Step 6: Set up Firestore Security Rules

1. Go to "Firestore Database" → "Rules" tab
2. Replace the default rules with these (for validation phase):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to email_signups collection
    match /email_signups/{document} {
      allow create: if request.auth == null || request.auth != null;
      allow read: if request.auth != null;
    }
    
    // Allow read/write access to survey_responses collection
    match /survey_responses/{document} {
      allow create: if request.auth == null || request.auth != null;
      allow read: if request.auth != null;
    }
    
    // Allow read/write access to feedback collection
    match /feedback/{document} {
      allow create: if request.auth == null || request.auth != null;
      allow read: if request.auth != null;
    }
  }
}
```

**Note**: These rules are permissive for the validation phase. For production, you should implement proper authentication and more restrictive rules.

## Step 7: Test Your Setup

1. Install dependencies:
```bash
npm install
```

2. Serve your site locally:
```bash
npm run serve
```

3. Open your browser and go to `http://localhost:8000`
4. Try signing up with an email - check your Firestore console to see if the data appears

## Step 8: Deploy to Netlify

### Option A: Using Netlify UI (Recommended)

1. Go to [Netlify](https://www.netlify.com/)
2. Drag and drop your project folder to deploy
3. Go to Site settings → Environment variables
4. Add your Firebase configuration as environment variables:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`

### Option B: Using Git

1. Push your code to GitHub repository
2. Connect your GitHub repo to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy automatically

## Step 9: Set up Google Analytics (Optional)

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for your website
3. Get your Measurement ID (format: G-XXXXXXXXXX)
4. Replace `GA_MEASUREMENT_ID` in your `index.html` with your actual ID
5. Add the Measurement ID as environment variable in Netlify: `GA_MEASUREMENT_ID`

## Step 10: Monitor Your Data

### Firestore Console
- Go to Firebase Console → Firestore Database
- You'll see three collections:
  - `email_signups` - Email addresses from the signup form
  - `survey_responses` - Detailed survey responses with pricing data
  - `feedback` - Messages from the contact form

### Export Data for Analysis
```javascript
// You can query your data using Firebase console or create simple scripts
// Example collections structure:

// email_signups
{
  email: "user@example.com",
  source: "landing-page",
  timestamp: "2024-06-03T10:30:00Z",
  status: "new"
}

// survey_responses
{
  email: "user@example.com",
  priceWillingness: "21-40",
  mostImportantFeature: "ai-assistant",
  currentSolution: "Google search and asking friends",
  feedback: "I love the idea!",
  timestamp: "2024-06-03T10:35:00Z"
}

// feedback
{
  email: "user@example.com",
  feedback: "When will the app be ready?",
  source: "contact-form",
  timestamp: "2024-06-03T11:00:00Z",
  status: "new"
}
```

## Troubleshooting

### Common Issues:

1. **"Permission denied" errors**
   - Check your Firestore security rules
   - Ensure your Firebase configuration is correct

2. **Firebase not loading**
   - Verify all configuration values are correct
   - Check browser console for errors
   - Ensure you're serving over HTTPS in production

3. **Data not appearing in Firestore**
   - Check browser console for JavaScript errors
   - Verify your internet connection
   - Check if you're using the correct project ID

### Getting Help:

- Firebase Documentation: https://firebase.google.com/docs
- Firestore Documentation: https://firebase.google.com/docs/firestore
- Contact: hello@smartparent.pl

## Security Notes

1. **For production**: Implement proper authentication and restrict Firestore rules
2. **API Keys**: Firebase API keys for web apps are safe to expose publicly
3. **Environment Variables**: Use environment variables in Netlify for sensitive configuration
4. **HTTPS**: Always use HTTPS in production (Netlify provides this automatically)

## Cost Considerations

- **Firestore**: Free tier includes 1GB storage and 20,000 document reads/day
- **Firebase Hosting**: Free tier includes 10GB storage and 1GB transfer/month  
- **Netlify**: Free tier includes 100GB bandwidth/month
- **Google Analytics**: Free for standard features

For a validation landing page, you should easily stay within free tiers.

---

## Next Steps After Setup

1. Test all forms on your live site
2. Set up data export routine (weekly/monthly)
3. Create a simple dashboard to monitor signups
4. Plan your validation metrics and goals
5. Start driving traffic to your landing page

Good luck with your validation! 🚀