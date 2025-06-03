// Firebase configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export functions for use in main.js
window.firebaseDB = {
  // Function to save email signup to Firestore
  saveEmailSignup: async (email, source = 'landing-page') => {
    try {
      const docRef = await addDoc(collection(db, 'email_signups'), {
        email: email,
        source: source,
        timestamp: serverTimestamp(),
        status: 'new'
      });
      console.log('Email saved with ID: ', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving email: ', error);
      return { success: false, error: error.message };
    }
  },

  // Function to save survey response to Firestore
  saveSurveyResponse: async (surveyData) => {
    try {
      const docRef = await addDoc(collection(db, 'survey_responses'), {
        ...surveyData,
        timestamp: serverTimestamp()
      });
      console.log('Survey response saved with ID: ', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving survey response: ', error);
      return { success: false, error: error.message };
    }
  },

  // Function to save feedback/comments to Firestore
  saveFeedback: async (email, feedback, source = 'contact-form') => {
    try {
      const docRef = await addDoc(collection(db, 'feedback'), {
        email: email,
        feedback: feedback,
        source: source,
        timestamp: serverTimestamp(),
        status: 'new'
      });
      console.log('Feedback saved with ID: ', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving feedback: ', error);
      return { success: false, error: error.message };
    }
  }
};

export { db, analytics };