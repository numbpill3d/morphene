// js/firebase-init.js
// Firebase configuration for Void Avatar Lounge

import { FIREBASE_URLS } from "../config/firebase.js";

// You'll need to replace these with your actual Firebase config values
// from your Firebase project settings
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Dynamically import Firebase modules
const firebaseApp = await import(FIREBASE_URLS.app);
const firebaseAuth = await import(FIREBASE_URLS.auth);
const firebaseFirestore = await import(FIREBASE_URLS.firestore);
const firebaseStorage = await import(FIREBASE_URLS.storage);

// Initialize Firebase services
const app = firebaseApp.initializeApp(firebaseConfig);
const auth = firebaseAuth.getAuth(app);
const db = firebaseFirestore.getFirestore(app);
const storage = firebaseStorage.getStorage(app);

// Export Firebase services
export { auth, db, storage };

// Export Firebase functions
export const {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = firebaseAuth;

export const {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  runTransaction,
  query,
  where,
} = firebaseFirestore;

// Export default app instance
export default app;