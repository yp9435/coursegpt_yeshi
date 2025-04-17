import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Configuration object for initializing a Firebase application.
 * 
 * This object contains the necessary environment variables to connect
 * to a Firebase project. The values are sourced from environment variables
 * to ensure sensitive information is not hardcoded.
 * 
 * @property {string | undefined} apiKey - The API key for the Firebase project.
 * @property {string | undefined} authDomain - The authentication domain for the Firebase project.
 * @property {string | undefined} projectId - The unique identifier for the Firebase project.
 * @property {string | undefined} storageBucket - The storage bucket URL for the Firebase project.
 * @property {string | undefined} messagingSenderId - The sender ID for Firebase Cloud Messaging.
 * @property {string | undefined} appId - The unique identifier for the Firebase application.
 * @property {string | undefined} measurementId - The measurement ID for Firebase Analytics (optional).
 */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };